# Call Claude API Action

GitHub Action for calling the Anthropic Claude API to generate SABSA framework artifacts with comprehensive error handling and retry logic.

## Overview

This action is part of the SABSA Agentic Policy Workflow system. It handles:

- **API Integration**: Calls Claude Sonnet 4 (claude-sonnet-4-20250514) model
- **Retry Logic**: Exponential backoff for rate limits and transient errors (max 3 attempts)
- **Partial Results**: Salvages valid sections from incomplete API responses
- **Section Validation**: Ensures all expected sections are present and complete
- **Error Handling**: Comprehensive error categorization and reporting

## Inputs

### `prompt` (required)

The assembled prompt text containing:
- System prompt
- Policy summary
- Upstream context sections
- Layer-specific instructions
- Output schema definition

**Type**: String

### `anthropic-api-key` (required)

Anthropic API key for authentication. Should be stored as a GitHub Secret.

**Type**: String
**Example**: `${{ secrets.ANTHROPIC_API_KEY }}`

### `max-retries` (optional)

Maximum number of retry attempts on retryable errors (rate limits, server errors).

**Type**: String (parsed as integer)
**Default**: `'2'`
**Range**: 0-5 recommended

### `expected-sections` (required)

JSON array of expected section IDs that should be present in the response.

**Type**: String (JSON array)
**Example**: `'["1-1", "1-2", "1-3", "1-4", "1-5"]'`

## Outputs

### `result`

Successfully parsed and validated JSON response from Claude. Only populated on full success.

**Type**: String (JSON)
**Populated When**: All expected sections are present and valid

### `success`

Boolean string indicating whether generation fully succeeded.

**Type**: String (`'true'` or `'false'`)
**Values**:
- `'true'`: All expected sections generated successfully
- `'false'`: Partial generation, API failure, or validation failure

### `error-message`

Human-readable error details if generation failed or produced partial results.

**Type**: String
**Examples**:
- `"API Error: rate_limit_error - Too many requests"`
- `"JSON parse failed: unexpected end of input"`
- `"Missing or incomplete sections: 3-2, 3-4"`

### `partial-result`

Partial JSON content extracted from incomplete or malformed responses. Only populated on partial success.

**Type**: String (JSON)
**Populated When**: Some sections were successfully generated but not all

## Usage Example

### Basic Usage

```yaml
- name: Generate Layer Artifacts
  id: claude
  uses: ./.github/actions/call-claude
  with:
    prompt: ${{ steps.build-prompt.outputs.prompt }}
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
    expected-sections: '["2-1", "2-2", "2-3", "2-4", "2-5"]'

- name: Check Generation Status
  run: |
    if [ "${{ steps.claude.outputs.success }}" = "true" ]; then
      echo "✓ All sections generated successfully"
      echo "${{ steps.claude.outputs.result }}" > sections.json
    else
      echo "⚠ Partial generation - manual review required"
      echo "${{ steps.claude.outputs.error-message }}"
      echo "${{ steps.claude.outputs.partial-result }}" > sections-partial.json
    fi
```

### With Custom Retry Configuration

```yaml
- name: Generate with More Retries
  uses: ./.github/actions/call-claude
  with:
    prompt: ${{ steps.build-prompt.outputs.prompt }}
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
    max-retries: '5'  # Allow more retries for unreliable networks
    expected-sections: '["4-1", "4-2", "4-3", "4-4", "4-5"]'
```

### Handling Partial Results

```yaml
- name: Process Generation Results
  run: |
    SUCCESS="${{ steps.claude.outputs.success }}"

    if [ "$SUCCESS" = "true" ]; then
      echo "Full generation successful"
      echo "${{ steps.claude.outputs.result }}" > output.json

    elif [ -n "${{ steps.claude.outputs.partial-result }}" ]; then
      echo "Partial generation - saving for manual completion"
      echo "${{ steps.claude.outputs.partial-result }}" > output-partial.json

      # Add label to PR for manual review
      gh pr edit $PR_NUMBER --add-label "needs-manual-review"

      # Comment on PR with error details
      gh pr comment $PR_NUMBER --body "⚠️ Generation Issues\n\n${{ steps.claude.outputs.error-message }}"

    else
      echo "Generation failed completely"
      exit 1
    fi
```

## Error Handling

### Retryable Errors

The action automatically retries these error types with exponential backoff:

- **Rate Limit Errors** (`429` status, `rate_limit_error`)
- **Server Errors** (5xx status codes)
- **Overloaded Errors** (`overloaded_error`)
- **Timeout Errors** (connection timeouts)

**Retry Schedule**:
- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 second delay
- Attempt 4: 4 second delay (if max-retries increased)

**Max Delay**: 30 seconds

### Non-Retryable Errors

These errors fail immediately without retry:

- **Authentication Errors** (`401`, `403`)
- **Invalid Request Errors** (`400`)
- **Content Policy Violations**
- **Token Limit Exceeded**

### Partial Result Extraction

When JSON parsing fails, the action attempts to extract valid sections using regex patterns:

```javascript
// Pattern matches section objects even in malformed JSON
/"(\d+-\d+)":\s*\{[^}]*"title":\s*"([^"]+)"[^}]*"content":\s*"(...)"/g
```

**Extracted Data**:
- Section ID
- Section title
- Section content (if available)
- Rationale fields set to `null`

## API Configuration

### Model Parameters

```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 8000,
  messages: [
    { role: "user", content: prompt }
  ]
}
```

### Token Budget

- **Max Output**: 8,000 tokens (~6,000 words)
- **Typical Usage**:
  - Input: 2,000-3,500 tokens (prompt + context)
  - Output: 3,000-5,000 tokens (5 sections with rationale)
  - Total: 5,000-8,500 tokens per call

### Cost Estimation

Based on Claude Sonnet pricing (as of December 2024):

- **Input**: $3.00 per million tokens
- **Output**: $15.00 per million tokens
- **Per Layer**: ~$0.05-0.10 USD
- **Full Policy** (6 layers): ~$0.30-0.60 USD

## Dependencies

Required npm packages (see `package.json`):

- `@actions/core`: ^1.10.1 - GitHub Actions toolkit
- `@actions/github`: ^6.0.0 - GitHub API integration
- `@anthropic-ai/sdk`: ^0.32.1 - Official Anthropic SDK

## Development

### Local Testing

```bash
# Install dependencies
cd .github/actions/call-claude
npm install

# Set environment variables
export INPUT_PROMPT="$(cat test-prompt.txt)"
export INPUT_ANTHROPIC-API-KEY="sk-ant-..."
export INPUT_MAX-RETRIES="2"
export INPUT_EXPECTED-SECTIONS='["1-1", "1-2"]'

# Run action
node index.js
```

### Debugging

Enable debug logging in GitHub Actions:

```yaml
steps:
  - name: Enable Debug Logging
    run: echo "ACTIONS_STEP_DEBUG=true" >> $GITHUB_ENV

  - uses: ./.github/actions/call-claude
    # ... action will now output detailed debug logs
```

## Security Considerations

### API Key Protection

- **Never** hardcode API keys in workflows
- **Always** use GitHub Secrets: `${{ secrets.ANTHROPIC_API_KEY }}`
- **Rotate** keys periodically
- **Monitor** API usage for anomalies

### Prompt Injection Prevention

The action does not execute user-provided code. However:

- Validate policy input before passing to Claude
- Sanitize any external data included in prompts
- Review generated content before merging to main

### Data Privacy

- Policy statements may contain sensitive business information
- Claude API processes data according to [Anthropic's data policy](https://www.anthropic.com/legal/privacy)
- For highly sensitive policies, consider:
  - Using on-premises Claude deployment
  - Implementing additional encryption
  - Reviewing compliance requirements

## Troubleshooting

### "Invalid expected-sections input"

**Cause**: `expected-sections` is not valid JSON or not an array

**Fix**:
```yaml
# Correct
expected-sections: '["1-1", "1-2", "1-3"]'

# Wrong
expected-sections: ["1-1", "1-2"]  # Missing quotes
expected-sections: '1-1, 1-2'      # Not JSON array
```

### "API call failed: rate_limit_error"

**Cause**: Exceeded Anthropic API rate limits

**Fix**:
1. Increase `max-retries` to allow more retry attempts
2. Add delay between workflow runs
3. Check Anthropic dashboard for rate limit status
4. Upgrade API plan if hitting limits frequently

### "JSON parse failed: unexpected end of input"

**Cause**: Claude response was truncated (likely hit max_tokens)

**Fix**:
1. Check `partial-result` output for salvageable content
2. Simplify prompt to reduce output length
3. Increase `max_tokens` in `index.js` if appropriate
4. Split generation into smaller chunks

### "Missing or incomplete sections"

**Cause**: Claude didn't generate all expected sections

**Fix**:
1. Review `partial-result` to see which sections were generated
2. Check if prompt clearly specifies all required sections
3. Verify upstream context provides enough information
4. Manually complete missing sections in PR

## References

- [SABSA Framework](https://sabsa.org/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PRD Section 8.1](../../SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md#81-claude-composite-action)

## License

MIT

## Support

For issues or questions:
1. Check workflow logs for detailed error messages
2. Review this README and PRD Section 8.1
3. Open GitHub issue with error details and prompt length
