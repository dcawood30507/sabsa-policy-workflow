#!/usr/bin/env node

/**
 * SABSA Policy Artifact Validator
 *
 * Validates JSON artifacts against schemas for a specific policy
 *
 * Usage:
 *   node scripts/validate-artifacts.js POL-2025-001
 *   node scripts/validate-artifacts.js POL-2025-001 --layer logical
 *   node scripts/validate-artifacts.js POL-2025-001 --verbose
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ArtifactValidator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.ajv = new Ajv({
      allErrors: true,
      verbose: this.verbose,
      strict: true
    });
    addFormats(this.ajv);

    this.schemas = {};
    this.stats = {
      filesValidated: 0,
      filesValid: 0,
      filesInvalid: 0,
      totalErrors: 0
    };
  }

  /**
   * Load JSON schema from file
   */
  loadSchema(schemaName) {
    const schemaPath = path.join(__dirname, '..', 'schemas', `${schemaName}.schema.json`);

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema not found: ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    this.schemas[schemaName] = this.ajv.compile(schema);

    if (this.verbose) {
      console.log(`${colors.cyan}Loaded schema:${colors.reset} ${schemaName}`);
    }
  }

  /**
   * Load all schemas
   */
  loadAllSchemas() {
    ['sections', 'traceability', 'metadata'].forEach(name => {
      this.loadSchema(name);
    });
  }

  /**
   * Validate a single JSON file against a schema
   */
  validateFile(filePath, schemaName) {
    if (!fs.existsSync(filePath)) {
      return {
        valid: false,
        errors: [{
          message: `File not found: ${filePath}`,
          instancePath: '',
          schemaPath: ''
        }]
      };
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (parseError) {
      return {
        valid: false,
        errors: [{
          message: `JSON parse error: ${parseError.message}`,
          instancePath: '',
          schemaPath: ''
        }]
      };
    }

    const validate = this.schemas[schemaName];
    const valid = validate(data);

    return {
      valid,
      errors: valid ? [] : validate.errors
    };
  }

  /**
   * Validate metadata.json for a policy
   */
  validateMetadata(policyId) {
    const metadataPath = path.join(__dirname, '..', 'policies', policyId, 'metadata.json');

    console.log(`\n${colors.bright}Validating metadata.json${colors.reset}`);
    console.log(`  File: ${metadataPath}`);

    const result = this.validateFile(metadataPath, 'metadata');
    this.stats.filesValidated++;

    if (result.valid) {
      this.stats.filesValid++;
      console.log(`  ${colors.green}✓ Valid${colors.reset}`);
    } else {
      this.stats.filesInvalid++;
      this.stats.totalErrors += result.errors.length;
      console.log(`  ${colors.red}✗ Invalid (${result.errors.length} errors)${colors.reset}`);
      this.printErrors(result.errors);
    }

    return result.valid;
  }

  /**
   * Validate sections.json for a specific layer
   */
  validateLayerSections(policyId, layer) {
    const sectionsPath = path.join(__dirname, '..', 'policies', policyId, layer, 'sections.json');

    console.log(`\n${colors.bright}Validating ${layer}/sections.json${colors.reset}`);
    console.log(`  File: ${sectionsPath}`);

    const result = this.validateFile(sectionsPath, 'sections');
    this.stats.filesValidated++;

    if (result.valid) {
      this.stats.filesValid++;
      console.log(`  ${colors.green}✓ Valid${colors.reset}`);

      // Additional validation: check section consistency
      const data = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));
      this.validateSectionConsistency(data, layer);
    } else {
      this.stats.filesInvalid++;
      this.stats.totalErrors += result.errors.length;
      console.log(`  ${colors.red}✗ Invalid (${result.errors.length} errors)${colors.reset}`);
      this.printErrors(result.errors);
    }

    return result.valid;
  }

  /**
   * Validate traceability.json for a specific layer
   */
  validateLayerTraceability(policyId, layer) {
    const traceabilityPath = path.join(__dirname, '..', 'policies', policyId, layer, 'traceability.json');

    console.log(`\n${colors.bright}Validating ${layer}/traceability.json${colors.reset}`);
    console.log(`  File: ${traceabilityPath}`);

    const result = this.validateFile(traceabilityPath, 'traceability');
    this.stats.filesValidated++;

    if (result.valid) {
      this.stats.filesValid++;
      console.log(`  ${colors.green}✓ Valid${colors.reset}`);

      // Additional validation: check reference consistency
      const data = JSON.parse(fs.readFileSync(traceabilityPath, 'utf8'));
      this.validateTraceabilityConsistency(data, policyId);
    } else {
      this.stats.filesInvalid++;
      this.stats.totalErrors += result.errors.length;
      console.log(`  ${colors.red}✗ Invalid (${result.errors.length} errors)${colors.reset}`);
      this.printErrors(result.errors);
    }

    return result.valid;
  }

  /**
   * Additional validation: Check section IDs match expected pattern for layer
   */
  validateSectionConsistency(data, layer) {
    const layerNumbers = {
      'contextual': 1,
      'conceptual': 2,
      'logical': 3,
      'physical': 4,
      'component': 5,
      'operational': 6
    };

    const expectedPrefix = layerNumbers[layer];
    const sectionIds = Object.keys(data.sections);

    const invalidSections = sectionIds.filter(id => !id.startsWith(`${expectedPrefix}-`));

    if (invalidSections.length > 0) {
      console.log(`  ${colors.yellow}⚠ Warning: Section IDs don't match layer${colors.reset}`);
      console.log(`    Expected prefix: ${expectedPrefix}-x`);
      console.log(`    Invalid sections: ${invalidSections.join(', ')}`);
    }

    // Check for null content in complete status
    if (data.generationStatus === 'complete') {
      const nullContent = sectionIds.filter(id =>
        data.sections[id].content === null ||
        data.sections[id].rationale_why === null ||
        data.sections[id].rationale_condition === null
      );

      if (nullContent.length > 0) {
        console.log(`  ${colors.yellow}⚠ Warning: Complete status but null content in sections${colors.reset}`);
        console.log(`    Sections with null content: ${nullContent.join(', ')}`);
      }
    }
  }

  /**
   * Additional validation: Check traceability references use valid policy ID
   */
  validateTraceabilityConsistency(data, policyId) {
    const references = Object.values(data.references).flat();

    const invalidRefs = references.filter(ref => !ref.source.startsWith(policyId));

    if (invalidRefs.length > 0) {
      console.log(`  ${colors.yellow}⚠ Warning: References to different policy IDs${colors.reset}`);
      invalidRefs.forEach(ref => {
        console.log(`    ${ref.source} (expected to start with ${policyId})`);
      });
    }
  }

  /**
   * Print validation errors in readable format
   */
  printErrors(errors) {
    errors.forEach((error, index) => {
      console.log(`\n  ${colors.red}Error ${index + 1}:${colors.reset}`);
      console.log(`    Path: ${error.instancePath || '(root)'}`);
      console.log(`    Message: ${error.message}`);

      if (error.params && Object.keys(error.params).length > 0) {
        console.log(`    Details: ${JSON.stringify(error.params, null, 2).replace(/\n/g, '\n    ')}`);
      }

      if (this.verbose && error.schemaPath) {
        console.log(`    Schema: ${error.schemaPath}`);
      }
    });
  }

  /**
   * Validate all artifacts for a policy
   */
  validatePolicy(policyId, options = {}) {
    const policyDir = path.join(__dirname, '..', 'policies', policyId);

    if (!fs.existsSync(policyDir)) {
      console.error(`${colors.red}Error: Policy directory not found: ${policyDir}${colors.reset}`);
      return false;
    }

    console.log(`\n${colors.bright}${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}SABSA Artifact Validation${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}========================================${colors.reset}`);
    console.log(`Policy ID: ${colors.cyan}${policyId}${colors.reset}`);
    console.log(`Directory: ${policyDir}`);

    // Load schemas
    this.loadAllSchemas();

    // Validate metadata
    this.validateMetadata(policyId);

    // Determine which layers to validate
    const layers = options.layer
      ? [options.layer]
      : ['contextual', 'conceptual', 'logical', 'physical', 'component', 'operational'];

    // Validate each layer
    layers.forEach(layer => {
      const layerDir = path.join(policyDir, layer);

      if (fs.existsSync(layerDir)) {
        this.validateLayerSections(policyId, layer);
        this.validateLayerTraceability(policyId, layer);
      } else if (!options.layer) {
        console.log(`\n${colors.yellow}Skipping ${layer} (directory not found)${colors.reset}`);
      } else {
        console.error(`\n${colors.red}Error: Layer directory not found: ${layerDir}${colors.reset}`);
      }
    });

    // Print summary
    this.printSummary();

    return this.stats.filesInvalid === 0;
  }

  /**
   * Print validation summary
   */
  printSummary() {
    console.log(`\n${colors.bright}${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}Validation Summary${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}========================================${colors.reset}`);
    console.log(`Files validated: ${this.stats.filesValidated}`);
    console.log(`${colors.green}Valid: ${this.stats.filesValid}${colors.reset}`);

    if (this.stats.filesInvalid > 0) {
      console.log(`${colors.red}Invalid: ${this.stats.filesInvalid}${colors.reset}`);
      console.log(`${colors.red}Total errors: ${this.stats.totalErrors}${colors.reset}`);
    }

    console.log();

    if (this.stats.filesInvalid === 0) {
      console.log(`${colors.green}${colors.bright}✓ All artifacts valid!${colors.reset}\n`);
    } else {
      console.log(`${colors.red}${colors.bright}✗ Validation failed${colors.reset}\n`);
    }
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}SABSA Policy Artifact Validator${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/validate-artifacts.js <policy-id> [options]

${colors.bright}Arguments:${colors.reset}
  policy-id          Policy identifier (e.g., POL-2025-001)

${colors.bright}Options:${colors.reset}
  --layer <name>     Validate only specific layer (contextual, conceptual, logical, physical, component, operational)
  --verbose          Show detailed validation information
  --help, -h         Show this help message

${colors.bright}Examples:${colors.reset}
  node scripts/validate-artifacts.js POL-2025-001
  node scripts/validate-artifacts.js POL-2025-001 --layer logical
  node scripts/validate-artifacts.js POL-2025-001 --verbose

${colors.bright}Exit Codes:${colors.reset}
  0 - All artifacts valid
  1 - Validation errors found
  2 - Missing dependencies or invalid arguments
`);
    process.exit(0);
  }

  // Check for Ajv dependency
  try {
    require.resolve('ajv');
    require.resolve('ajv-formats');
  } catch (e) {
    console.error(`${colors.red}Error: Required dependencies not found${colors.reset}`);
    console.error(`Please install dependencies: npm install ajv ajv-formats`);
    process.exit(2);
  }

  const policyId = args[0];
  const options = {};

  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--layer' && args[i + 1]) {
      options.layer = args[i + 1];
      i++;
    } else if (args[i] === '--verbose') {
      options.verbose = true;
    }
  }

  // Validate policy ID format
  const policyIdPattern = /^POL-\d{4}-\d{3}$/;
  if (!policyIdPattern.test(policyId)) {
    console.error(`${colors.red}Error: Invalid policy ID format${colors.reset}`);
    console.error(`Expected format: POL-YYYY-NNN (e.g., POL-2025-001)`);
    console.error(`Received: ${policyId}`);
    process.exit(2);
  }

  // Run validation
  const validator = new ArtifactValidator(options);
  const success = validator.validatePolicy(policyId, options);

  process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = ArtifactValidator;
