# SABSA Policy Workflow JSON Schemas

This directory contains JSON Schema definitions (Draft 07) for validating SABSA policy workflow artifacts.

## Schema Files

### 1. sections.schema.json

**Purpose:** Validates SABSA layer section artifacts including content, rationale, and error tracking.

**File Location:** `policies/{policy-id}/{layer}/sections.json`

**Key Validations:**
- Policy ID format: `POL-YYYY-NNN`
- Layer enumeration (6 SABSA layers)
- Section ID pattern: `[1-6]-[1-6]`
- Generation status: `complete` or `partial`
- Required rationale fields (why suggested, condition satisfied)
- Error tracking for partial results
- Conditional validation: partial status requires errors array with ≥1 item

**Statistics:**
- **Properties:** 6 required top-level properties
- **Constraints:**
  - Policy ID regex pattern validation
  - Layer enum (6 values)
  - Section pattern properties for dynamic validation
  - Conditional schema for error handling
  - Date-time format validation
- **Nested Objects:** Section objects with 4 properties each
- **Error Types:** 4 predefined error categories

**Example Validation:**
```bash
node scripts/validate-artifacts.js POL-2025-001 --layer logical
```

---

### 2. traceability.schema.json

**Purpose:** Validates traceability relationships between SABSA sections across layers.

**File Location:** `policies/{policy-id}/{layer}/traceability.json`

**Key Validations:**
- Source reference format: `POL-YYYY-NNN.layer.section`
- Relationship vocabulary: 5 predefined relationship types
- Cross-layer reference integrity
- Optional human-readable descriptions

**Statistics:**
- **Properties:** 5 required top-level properties
- **Constraints:**
  - Source pattern: Fully qualified section references
  - Relationship enum (5 values: implements, derives_from, constrained_by, refines, validates)
  - Section ID pattern matching
  - Date-time format validation
- **Relationship Types:** Must match `config/relationship-vocabulary.json`

**Valid Relationship Types:**
1. `implements` - Directly realizes upstream requirement
2. `derives_from` - Logically follows from upstream element
3. `constrained_by` - Bounded by upstream constraint
4. `refines` - Adds implementation detail
5. `validates` - Provides verification/proof

**Example Validation:**
```bash
node scripts/validate-artifacts.js POL-2025-001 --layer conceptual
```

---

### 3. metadata.schema.json

**Purpose:** Validates policy workflow metadata including lifecycle status and layer tracking.

**File Location:** `policies/{policy-id}/metadata.json`

**Key Validations:**
- Policy lifecycle status tracking
- Layer-by-layer progress with PR numbers
- Conditional requirements based on status
- Release tag format validation
- GitHub issue reference validation

**Statistics:**
- **Properties:** 8 required top-level properties
- **Constraints:**
  - Status enum (3 values: in-progress, completed, archived)
  - Layer status objects (6 entries, one per SABSA layer)
  - Conditional validation: completed status requires completedAt and releaseTag
  - Nested conditional validation: layer status requirements depend on approval state
  - Release tag pattern validation
- **Layer Statuses:** 3 states (not-started, pending-review, approved)
- **Conditional Fields:** PR number and timestamps required based on layer status

**Status Transition Rules (enforced by conditional schemas):**
- `not-started`: Only status field required
- `pending-review`: Requires prNumber and createdAt
- `approved`: Requires prNumber, createdAt, and mergedAt

**Example Validation:**
```bash
node scripts/validate-artifacts.js POL-2025-001
```

---

## Validation Script

### Installation

```bash
npm install
```

This installs the required dependencies:
- `ajv` (v8.12.0) - JSON Schema validator
- `ajv-formats` (v2.1.1) - Format validators (date-time, uri, etc.)

### Usage

**Validate all artifacts for a policy:**
```bash
node scripts/validate-artifacts.js POL-2025-001
```

**Validate specific layer:**
```bash
node scripts/validate-artifacts.js POL-2025-001 --layer logical
```

**Verbose output:**
```bash
node scripts/validate-artifacts.js POL-2025-001 --verbose
```

**Show help:**
```bash
node scripts/validate-artifacts.js --help
```

### Exit Codes

- `0` - All artifacts valid
- `1` - Validation errors found
- `2` - Missing dependencies or invalid arguments

### Validation Features

The script performs:

1. **Schema Validation**
   - JSON structure compliance
   - Required field presence
   - Pattern matching (policy ID, section IDs, references)
   - Enum value validation
   - Conditional field requirements

2. **Consistency Checks**
   - Section IDs match expected layer prefix (e.g., Layer 3 = `3-x`)
   - Null content warnings in "complete" status
   - Cross-policy reference detection
   - Generation status vs. errors array consistency

3. **Output**
   - Color-coded terminal output
   - Detailed error messages with paths
   - Warning for inconsistencies
   - Summary statistics

---

## Integration with CI/CD

### GitHub Actions Example

Add to `.github/workflows/validate-artifacts.yml`:

```yaml
name: Validate SABSA Artifacts

on:
  pull_request:
    paths:
      - 'policies/**/*.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Extract policy ID from branch
        id: policy
        run: |
          BRANCH="${{ github.head_ref }}"
          POLICY_ID=$(echo "$BRANCH" | grep -oP 'POL-\d{4}-\d{3}')
          echo "id=$POLICY_ID" >> $GITHUB_OUTPUT

      - name: Validate artifacts
        run: |
          node scripts/validate-artifacts.js ${{ steps.policy.outputs.id }}
```

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Extract policy ID from staged files
POLICY_ID=$(git diff --cached --name-only | grep -oP 'policies/POL-\d{4}-\d{3}' | head -1 | grep -oP 'POL-\d{4}-\d{3}')

if [ -n "$POLICY_ID" ]; then
  echo "Validating artifacts for $POLICY_ID..."
  node scripts/validate-artifacts.js "$POLICY_ID"

  if [ $? -ne 0 ]; then
    echo "Validation failed. Commit aborted."
    exit 1
  fi
fi
```

---

## Schema Design Principles

1. **Strict Validation**
   - `additionalProperties: false` on all objects
   - Explicit pattern matching for IDs and references
   - Controlled vocabularies via enums

2. **Conditional Validation**
   - Status-dependent field requirements
   - Error array enforcement for partial results
   - Release metadata required only when completed

3. **Comprehensive Constraints**
   - Format validation (date-time, patterns)
   - Minimum/maximum value constraints
   - String length restrictions
   - Array item count validation

4. **Production-Ready**
   - Clear error messages via descriptions
   - Example values in schema
   - Full JSON Schema Draft 07 compliance
   - Compatible with standard validators

---

## Error Message Examples

### Invalid Policy ID
```
Error 1:
  Path: /policyId
  Message: must match pattern "^POL-\\d{4}-\\d{3}$"
  Details: {
    "pattern": "^POL-\\d{4}-\\d{3}$"
  }
```

### Missing Required Field
```
Error 1:
  Path: (root)
  Message: must have required property 'generationStatus'
```

### Invalid Relationship Type
```
Error 1:
  Path: /references/3-1/0/relationship
  Message: must be equal to one of the allowed values
  Details: {
    "allowedValues": [
      "implements",
      "derives_from",
      "constrained_by",
      "refines",
      "validates"
    ]
  }
```

### Conditional Validation Failure
```
Error 1:
  Path: /layerStatus/logical
  Message: must have required property 'mergedAt'
  (when status is 'approved')
```

---

## Development

### Adding New Validation Rules

1. Edit relevant schema file in `schemas/`
2. Test with sample data
3. Update this README with changes
4. Run validation against existing artifacts

### Testing Schema Changes

```bash
# Validate against test policy
node scripts/validate-artifacts.js POL-2025-001 --verbose

# Test specific schema
node -e "
  const Ajv = require('ajv');
  const schema = require('./schemas/sections.schema.json');
  const data = require('./policies/POL-2025-001/logical/sections.json');
  const ajv = new Ajv();
  const valid = ajv.validate(schema, data);
  console.log(valid ? 'Valid' : ajv.errors);
"
```

---

## References

- **JSON Schema Draft 07:** https://json-schema.org/draft-07/schema
- **Ajv Documentation:** https://ajv.js.org/
- **PRD Reference:** `SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md` Section 6 (Data Model)
- **Relationship Vocabulary:** `config/relationship-vocabulary.json`
- **Layer Dependencies:** `config/layer-dependencies.json`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-27 | Initial schema definitions (sections, traceability, metadata) |

---

*Generated as part of SABSA Agentic Policy Workflow v1.0*
