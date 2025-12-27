/**
 * Claude API Integration Action for SABSA Policy Workflow
 *
 * This GitHub Action calls the Anthropic Claude API to generate SABSA framework
 * artifacts with comprehensive error handling, retry logic, and partial result recovery.
 *
 * Key Features:
 * - Exponential backoff retry for transient errors
 * - Partial content extraction from malformed responses
 * - Section validation against expected output
 * - Detailed error reporting for workflow debugging
 *
 * @see SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md Section 8.1
 */

const core = require('@actions/core');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

/**
 * Configuration for API retry behavior
 * Implements exponential backoff with maximum delay cap
 */
const RETRY_CONFIG = {
  maxAttempts: 3,                    // Total attempts (initial + 2 retries)
  baseDelayMs: 1000,                 // Initial delay: 1 second
  maxDelayMs: 30000,                 // Cap delay at 30 seconds
  retryableErrors: [                 // Error types that should be retried
    'rate_limit_error',              // API rate limit exceeded
    'overloaded_error',              // Service temporarily overloaded
    'timeout_error'                  // Request timeout
  ]
};

/**
 * Sleep utility for implementing retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay for retry attempts
 * Formula: baseDelay * 2^attempt, capped at maxDelay
 *
 * Example progression (baseDelay=1000ms):
 * - Attempt 0: 1000ms (1s)
 * - Attempt 1: 2000ms (2s)
 * - Attempt 2: 4000ms (4s)
 * - Attempt 3: 8000ms (8s)
 *
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
function calculateBackoff(attempt) {
  const delay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelayMs);
}

/**
 * Determine if an error should trigger a retry
 *
 * Retryable errors:
 * - Rate limit errors (429 status)
 * - Server errors (5xx status)
 * - Overloaded errors
 * - Timeout errors
 *
 * Non-retryable errors:
 * - Authentication errors (401, 403)
 * - Bad request errors (400)
 * - Content policy violations
 *
 * @param {Error} error - Error object from API call
 * @returns {boolean} True if error should be retried
 */
function isRetryableError(error) {
  if (!error) return false;

  // Extract error type from Anthropic SDK error structure
  const errorType = error.type || error.error?.type || '';

  // Check for rate limit (HTTP 429 or explicit error type)
  if (errorType === 'rate_limit_error' || error.status === 429) return true;

  // Server errors (5xx) are typically transient
  if (error.status >= 500 && error.status < 600) return true;

  // Service overloaded - retry with backoff
  if (errorType === 'overloaded_error') return true;

  // Connection or request timeouts
  if (errorType.includes('timeout')) return true;

  // All other errors are non-retryable
  return false;
}

/**
 * Call Anthropic Claude API with automatic retry logic
 *
 * Implements exponential backoff for transient errors (rate limits, server errors).
 * Non-retryable errors (auth, bad request) fail immediately.
 *
 * API Configuration:
 * - Model: claude-sonnet-4-20250514 (Claude Sonnet 4.5)
 * - Max Tokens: 8000 (~6000 words output capacity)
 * - Message Format: Simple user message with assembled prompt
 *
 * @param {string} prompt - Assembled prompt text (system + context + instructions)
 * @param {string} apiKey - Anthropic API key from GitHub Secrets
 * @param {number} maxRetries - Maximum retry attempts (default: 2)
 * @returns {Promise<Object>} Anthropic API response object
 * @throws {Error} On non-retryable errors or retry exhaustion
 */
async function callAnthropicWithRetry(prompt, apiKey, maxRetries) {
  // Initialize Anthropic SDK client
  const client = new Anthropic({ apiKey: apiKey });
  let lastError = null;

  // Retry loop: attempt 0 (initial) + attempts 1..maxRetries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      core.info('API call attempt ' + (attempt + 1) + ' of ' + (maxRetries + 1));

      // Call Claude API with SABSA generation configuration
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",  // Claude Sonnet 4.5 (December 2024)
        max_tokens: 8000,                    // Sufficient for 5 sections + rationale
        messages: [{ role: "user", content: prompt }]
      });

      core.info('API call successful');
      return response;

    } catch (error) {
      lastError = error;
      core.warning('API call failed: ' + error.message);

      // Determine retry strategy based on error type
      if (isRetryableError(error)) {
        if (attempt < maxRetries) {
          // Calculate exponential backoff delay
          const delay = calculateBackoff(attempt);
          core.info('Retrying after ' + delay + 'ms...');
          await sleep(delay);
          continue; // Retry
        } else {
          core.error('Max retry attempts reached');
          // Fall through to throw lastError
        }
      } else {
        // Non-retryable error - fail immediately
        core.error('Non-retryable error: ' + (error.type || error.message));
        throw error;
      }
    }
  }

  // All retries exhausted - throw the last error encountered
  throw lastError;
}

/**
 * Extract partial content from malformed JSON response
 *
 * When Claude's response is truncated or malformed JSON, this function attempts
 * to salvage valid section data using regex pattern matching. This enables
 * human reviewers to manually complete partial results rather than losing all work.
 *
 * Extraction Strategy:
 * 1. Use regex to find section objects even if overall JSON is invalid
 * 2. Extract: section ID, title, content (rationale fields set to null)
 * 3. Return structured partial object with error details
 *
 * @param {string} rawContent - Raw text response from Claude API
 * @returns {Object} Partial parsed content with error details
 * @returns {Object} return.sections - Successfully extracted sections
 * @returns {Array} return.errors - Error details
 * @returns {string} return.rawContent - Original response for manual review
 */
function extractPartialContent(rawContent) {
  const partial = { sections: {}, errors: [], rawContent: rawContent };

  try {
    // Regex pattern to match section objects within malformed JSON
    // Matches: "1-2": { "title": "...", "content": "..." }
    const sectionPattern = /"(\d+-\d+)":\s*\{[^}]*"title":\s*"([^"]+)"[^}]*"content":\s*"((?:[^"\\\\]|\\\\.)*)"/g;
    let match;

    // Extract all matching sections from the response
    while ((match = sectionPattern.exec(rawContent)) !== null) {
      const sectionId = match[1];      // e.g., "1-2"
      const title = match[2];           // e.g., "Business Drivers"
      const content = match[3];         // Section content (escaped)

      // Build partial section object
      partial.sections[sectionId] = {
        title: title,
        content: content.replace(/\\\\n/g, '\n').replace(/\\\\"/g, '"'),  // Unescape
        rationale_why: null,            // Not extractable via regex
        rationale_condition: null       // Not extractable via regex
      };

      core.info('Extracted partial section: ' + sectionId);
    }

    // Record extraction results
    if (Object.keys(partial.sections).length > 0) {
      partial.errors.push({
        section: 'general',
        errorType: 'partial_parse',
        message: 'Extracted ' + Object.keys(partial.sections).length + ' section(s) from malformed JSON'
      });
    } else {
      partial.errors.push({
        section: 'general',
        errorType: 'parse_failure',
        message: 'Could not extract any valid sections from response'
      });
    }

  } catch (extractError) {
    core.error('Partial extraction failed: ' + extractError.message);
    partial.errors.push({
      section: 'general',
      errorType: 'extraction_failure',
      message: extractError.message
    });
  }

  return partial;
}

/**
 * Validate that all expected sections are present and complete
 *
 * Performs two-level validation:
 * 1. Section existence check - Is the section ID present?
 * 2. Content completeness check - Does the section have non-empty content?
 *
 * Missing or incomplete sections indicate partial generation requiring
 * human review before the PR can be merged.
 *
 * @param {Object} parsed - Parsed JSON response from Claude
 * @param {Array<string>} expectedSections - Array of section IDs that should exist
 * @returns {Array<string>} Array of missing/incomplete section IDs (empty if all valid)
 */
function validateSections(parsed, expectedSections) {
  const missingSections = [];

  // Validate top-level structure
  if (!parsed.sections || typeof parsed.sections !== 'object') {
    core.error('Response missing "sections" object');
    return expectedSections; // All sections are missing
  }

  // Validate each expected section
  for (const sectionId of expectedSections) {
    const section = parsed.sections[sectionId];

    // Check 1: Does section exist?
    if (!section) {
      missingSections.push(sectionId);
      continue;
    }

    // Check 2: Does section have content?
    // Null, undefined, or empty content indicates incomplete generation
    if (section.content === null || section.content === undefined || section.content.trim() === '') {
      core.warning('Section ' + sectionId + ' has null/empty content');
      missingSections.push(sectionId);
    }
  }

  // Log validation results
  if (missingSections.length > 0) {
    core.warning('Missing or incomplete sections: ' + missingSections.join(', '));
  } else {
    core.info('All expected sections present and valid');
  }

  return missingSections;
}

/**
 * Main action execution function
 *
 * Workflow:
 * 1. Parse and validate inputs from GitHub Actions
 * 2. Call Claude API with retry logic
 * 3. Parse JSON response
 * 4. Validate all expected sections present
 * 5. Set outputs (result, success, error-message, partial-result)
 *
 * Exit Scenarios:
 * - Full success: success='true', result=complete JSON
 * - Partial success: success='false', partial-result=salvaged content
 * - API failure: success='false', error-message=API error details
 * - Parse failure: success='false', partial-result=extracted sections
 */
async function run() {
  try {
    // ========================================================================
    // STEP 1: Get and validate inputs
    // ========================================================================

    const prompt = core.getInput('prompt', { required: true });
    const apiKey = core.getInput('anthropic-api-key', { required: true });
    const maxRetries = parseInt(core.getInput('max-retries') || '2', 10);
    const expectedSectionsInput = core.getInput('expected-sections', { required: true });

    // Parse expected sections JSON
    let expectedSections;
    try {
      expectedSections = JSON.parse(expectedSectionsInput);
      if (!Array.isArray(expectedSections)) {
        throw new Error('expected-sections must be a JSON array');
      }
    } catch (parseError) {
      core.setFailed('Invalid expected-sections input: ' + parseError.message);
      return;
    }

    core.info('Generating SABSA artifacts with ' + expectedSections.length + ' expected section(s)');
    core.info('Expected sections: ' + expectedSections.join(', '));
    core.info('Prompt length: ' + prompt.length + ' characters');

    // ========================================================================
    // STEP 2: Call Claude API with retry logic
    // ========================================================================
    let response;
    try {
      response = await callAnthropicWithRetry(prompt, apiKey, maxRetries);
    } catch (apiError) {
      // API call failed after all retries - fatal error
      core.setFailed('API call failed: ' + apiError.message);
      core.setOutput('success', 'false');
      core.setOutput('error-message', 'API Error: ' + apiError.message);
      return;
    }

    // Extract text content from Claude response
    const rawContent = response.content[0]?.text || '';

    if (!rawContent) {
      core.setFailed('API returned empty response');
      core.setOutput('success', 'false');
      core.setOutput('error-message', 'Empty API response');
      return;
    }

    core.info('Received response: ' + rawContent.length + ' characters');

    // ========================================================================
    // STEP 3: Parse JSON response
    // ========================================================================

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      // JSON parsing failed - attempt partial content extraction
      core.error('JSON parse error: ' + parseError.message);

      const partial = extractPartialContent(rawContent);

      // Write partial result to file (avoid output variable size limits)
      const partialJson = JSON.stringify(partial, null, 2);
      fs.writeFileSync('/tmp/claude-output.json', partialJson);

      // Set outputs for partial result handling
      core.setOutput('success', 'false');
      core.setOutput('output-file', '/tmp/claude-output.json');
      core.setOutput('error-message', 'JSON parse failed: ' + parseError.message);

      // Don't fail the action - let workflow handle partial results
      core.warning('Generation produced partial results - review required');
      return;
    }

    // ========================================================================
    // STEP 4: Validate all expected sections are present
    // ========================================================================

    const missingSections = validateSections(parsed, expectedSections);

    if (missingSections.length > 0) {
      // Partial success - some sections missing or incomplete
      const completedCount = expectedSections.length - missingSections.length;

      // Write partial result to file
      const partialJson = JSON.stringify(parsed, null, 2);
      fs.writeFileSync('/tmp/claude-output.json', partialJson);

      core.setOutput('success', 'false');
      core.setOutput('output-file', '/tmp/claude-output.json');
      core.setOutput('error-message', 'Missing sections: ' + missingSections.join(', '));

      core.warning('Partial generation - ' + completedCount + ' of ' + expectedSections.length + ' sections complete');
      return;
    }

    // ========================================================================
    // STEP 5: Full success - all sections generated
    // ========================================================================

    // Write result to file (avoid output variable size limits)
    const resultJson = JSON.stringify(parsed, null, 2);
    fs.writeFileSync('/tmp/claude-output.json', resultJson);

    core.setOutput('success', 'true');
    core.setOutput('output-file', '/tmp/claude-output.json');
    core.setOutput('error-message', '');

    core.info('Successfully generated all ' + expectedSections.length + ' sections');

  } catch (error) {
    // Catch-all for unexpected errors
    core.setFailed('Unexpected error: ' + error.message);
    core.setOutput('success', 'false');
    core.setOutput('error-message', 'Unexpected error: ' + error.message);
  }
}

// Execute the action
run();

// Note: Large JSON results are written to /tmp/claude-output.json to avoid GitHub Actions output size limits
