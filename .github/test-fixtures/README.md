# SABSA Workflow Test Fixtures

This directory contains all test fixtures for the SABSA Agentic Policy Workflow system, including sample policies, expected outputs (golden files), and test event payloads.

## Directory Contents

```
test-fixtures/
├── README.md                              # This file
├── TEST_COVERAGE_PLAN.md                  # Comprehensive test coverage plan
├── sample-policy-encryption.md            # Sample input policy
├── expected-summary.md                    # Expected policy summary output
├── expected-contextual-sections.json      # Expected Layer 1 sections output
└── expected-traceability.json             # Expected Layer 1 traceability output
```

## Quick Start

### Run All Tests

```bash
# From repository root
./scripts/run-local-test.sh all
```

### Validate Test Fixtures

```bash
# Verify all fixtures exist
ls -lh .github/test-fixtures/*.{md,json}

# Validate JSON structure
jq . .github/test-fixtures/expected-contextual-sections.json
jq . .github/test-fixtures/expected-traceability.json
```

---

## Fixture Descriptions

### 1. Sample Policy: Customer PII Encryption

**File:** `sample-policy-encryption.md`

**Purpose:** Primary test input for all workflow testing

**Content:**
- **Policy Statement:** AES-256 encryption at rest, TLS 1.2+ in transit, HSM key storage, 90-day rotation, MFA access
- **Business Context:** SOC 2 Type II, GDPR Article 32, Q3 2024 penetration test remediation
- **Compliance Frameworks:** NIST SP 800-53, ISO 27001:2022, PCI DSS 4.0, CIS Controls v8
- **Priority:** High
- **Scope:** Customer databases, APIs, backups, analytics systems

**Usage:**
```bash
# Use as input for initialize workflow
cat .github/test-fixtures/sample-policy-encryption.md

# Or via test event
act issues --eventpath .github/test-events/new-policy-event.json
```

**Characteristics:**
- Word count: ~600 words
- Complexity: High (6 compliance frameworks referenced)
- Requirements: Very specific (encryption algorithms, key lengths, rotation periods)
- Success criteria: Measurable (100% coverage, 90-day rotation, zero downtime)

---

### 2. Expected Summary

**File:** `expected-summary.md`

**Purpose:** Golden file for policy summary validation

**Format:** Plain text markdown

**Content:** 147-word summary capturing:
- Core policy intent (comprehensive encryption for customer PII)
- Key technical requirements (AES-256, TLS 1.2+, HSM, 90-day rotation, MFA)
- Compliance drivers (SOC 2 Type II, GDPR Article 32)
- Business context (penetration test findings)

**Validation:**
```bash
# Compare generated summary
diff -u \
  .github/test-fixtures/expected-summary.md \
  policies/POL-2025-001/summary.md

# Check word count (should be ≤150)
wc -w .github/test-fixtures/expected-summary.md
# Output: 147
```

**Quality Criteria:**
- ✓ ≤150 words (meets requirement)
- ✓ Third person, present tense
- ✓ Includes all key requirements
- ✓ Mentions compliance frameworks
- ✓ No implementation details (high-level only)

---

### 3. Expected Contextual Sections

**File:** `expected-contextual-sections.json`

**Purpose:** Golden file for Layer 1 (Contextual) generation validation

**Format:** JSON (sections.json schema)

**Structure:**
```json
{
  "policyId": "POL-2025-001",
  "layer": "contextual",
  "version": 1,
  "generatedAt": "ISO 8601 timestamp",
  "generationStatus": "complete",
  "sections": {
    "1-1": { "title": "...", "content": "...", "rationale_why": "...", "rationale_condition": "..." },
    "1-2": { ... },
    "1-3": { ... },
    "1-4": { ... },
    "1-5": { ... }
  },
  "errors": []
}
```

**Sections Included:**

| Section ID | Title | Word Count | Framework References |
|------------|-------|------------|---------------------|
| 1-1 | Business Process Overview | ~450 | NIST Privacy Framework, ISO 27001, SABSA |
| 1-2 | Business Drivers | ~650 | ISO 27001, NIST CSF, GDPR, SOC 2, PCI DSS |
| 1-3 | Risk Context | ~900 | NIST SP 800-30, ISO 27001, Verizon DBIR |
| 1-4 | Success Criteria | ~1,400 | NIST SP 800-55, ISO 27001, SOC 2 |
| 1-5 | Constraints & Assumptions | ~1,200 | NIST SP 800-175B, FIPS 140-2 |

**Total Content:** ~4,600 words across 5 sections

**Validation:**
```bash
# Structural validation
jq '.sections | keys | length' expected-contextual-sections.json
# Expected: 5

# Check all sections have required fields
jq '.sections | to_entries[] | select(.value.content == null or .value.rationale_why == null)' \
  expected-contextual-sections.json
# Expected: empty (no null fields)

# Verify framework references present
jq -r '.sections[].rationale_why' expected-contextual-sections.json | \
  grep -E "(NIST|ISO|SABSA|GDPR|SOC 2|PCI DSS)"
# Expected: multiple matches
```

**Quality Indicators:**

Each section includes:
- ✓ Detailed content (>400 words per section)
- ✓ Specific framework citations (NIST SP 800-53, ISO 27001:2022, etc.)
- ✓ Rationale explaining "why" (framework alignment)
- ✓ Rationale explaining "condition satisfied" (upstream requirement fulfillment)
- ✓ Proper markdown formatting (headings, lists, tables)
- ✓ Specific to encryption policy (not generic boilerplate)

**Content Quality Examples:**

**Section 1-2 (Business Drivers):**
- Lists specific SOC 2 criteria (CC6.1, CC6.7)
- Quotes GDPR Article 32 requirement
- References PCI DSS 4.0 Requirement 3.5
- Includes business impact ($12M enterprise contracts)
- Mentions Q3 2024 penetration test with remediation deadline

**Section 1-4 (Success Criteria):**
- Quantified metrics (100% encryption coverage, 90-day rotation)
- Measurement methods (automated scanning, weekly reports, quarterly audits)
- Success thresholds with timelines (Day 90, Day 120, ongoing)
- Validation evidence (database reports, certificate inventory, SIEM logs)

---

### 4. Expected Traceability

**File:** `expected-traceability.json`

**Purpose:** Golden file for traceability reference validation

**Format:** JSON (traceability.json schema)

**Structure:**
```json
{
  "policyId": "POL-2025-001",
  "layer": "contextual",
  "version": 1,
  "generatedAt": "ISO 8601 timestamp",
  "references": {
    "1-1": [ { "source": "...", "relationship": "...", "description": "..." } ],
    "1-2": [ ... ],
    "1-3": [ ... ],
    "1-4": [ ... ],
    "1-5": [ ... ]
  }
}
```

**Relationship Distribution:**

| Section | Relationships | Source Types |
|---------|---------------|--------------|
| 1-1 | 1 reference | summary |
| 1-2 | 2 references | summary, policy input |
| 1-3 | 2 references | summary, policy input |
| 1-4 | 3 references | summary, 1-2, 1-3 (cross-section) |
| 1-5 | 3 references | summary, 1-2, 1-4 (cross-section) |

**Total:** 11 traceability references

**Relationship Types Used:**
- `implements` (6 uses) - Direct requirement realization
- `derives_from` (2 uses) - Logical derivation
- `validates` (1 use) - Verification relationship
- `constrained_by` (2 uses) - Boundary constraints

**Validation:**
```bash
# Check all sections have references
jq '.references | keys | length' expected-traceability.json
# Expected: 5

# Verify valid relationships only
jq -r '.references[][].relationship' expected-traceability.json | sort -u
# Expected: constrained_by, derives_from, implements, validates

# Check source format (POL-ID.layer.section or POL-ID.summary)
jq -r '.references[][].source' expected-traceability.json | \
  grep -E "^POL-[0-9]{4}-[0-9]{3}\.(summary|input\.policy-statement|contextual\.[1-5]-[1-5])$"
# Expected: all sources match pattern
```

**Quality Indicators:**
- ✓ Every section has at least 1 reference
- ✓ Only valid relationships used (from vocabulary)
- ✓ Source references point to existing elements
- ✓ Descriptions explain the relationship semantics
- ✓ Cross-section references present (1-4 → 1-2, 1-5 → 1-2)

---

## Test Event Payloads

Located in `.github/test-events/`:

### new-policy-event.json
- **GitHub Event:** `issues.opened`
- **Labels:** `new-policy`
- **Content:** Sample encryption policy in issue body
- **Usage:** Test initialize workflow

### pr-approved-event.json
- **GitHub Event:** `pull_request_review.submitted`
- **Review State:** `approved`
- **Content:** Approval of Layer 1 PR
- **Usage:** Test cascade workflow (Layer 1 → Layer 2)

### pr-changes-requested-event.json
- **GitHub Event:** `pull_request_review.submitted`
- **Review State:** `changes_requested`
- **Content:** Review feedback for Layer 2 with specific section comments
- **Usage:** Test revision workflow, feedback extraction

### pr-merged-event.json
- **GitHub Event:** `pull_request.closed`
- **Merged:** `true`
- **Content:** Layer 1 PR merged to main
- **Usage:** Test cascade workflow detection and next layer trigger

---

## Using Fixtures for Testing

### Structural Validation

**Validate JSON Schema:**
```bash
# Install ajv-cli if needed
npm install -g ajv-cli

# Validate sections.json
ajv validate \
  -s config/schemas/sections-schema.json \
  -d .github/test-fixtures/expected-contextual-sections.json

# Validate traceability.json
ajv validate \
  -s config/schemas/traceability-schema.json \
  -d .github/test-fixtures/expected-traceability.json
```

### Content Validation

**Framework Reference Check:**
```bash
# Extract all framework references
jq -r '.sections[].rationale_why' \
  .github/test-fixtures/expected-contextual-sections.json | \
  grep -oE "(NIST SP [0-9-]+|ISO [0-9]+|GDPR Article [0-9]+|SOC 2|PCI DSS [0-9.]+)" | \
  sort -u

# Expected output:
# GDPR Article 32
# ISO 27001
# NIST CSF
# NIST SP 800-30
# NIST SP 800-53
# NIST SP 800-55
# PCI DSS 4.0
# SOC 2
```

**Traceability Completeness:**
```bash
# Check for sections without references (should be none)
jq '.references | to_entries | .[] | select(.value == []) | .key' \
  .github/test-fixtures/expected-traceability.json

# Verify cross-layer references (e.g., 1-4 references 1-2)
jq '.references["1-4"][] | select(.source | contains("1-2"))' \
  .github/test-fixtures/expected-traceability.json
```

### Regression Testing

**Compare Generated Output:**
```bash
# After running workflow, compare against golden files
diff -u \
  .github/test-fixtures/expected-summary.md \
  policies/POL-2025-001/summary.md

# For JSON, ignore timestamp differences
jq 'del(.generatedAt)' .github/test-fixtures/expected-contextual-sections.json > /tmp/expected.json
jq 'del(.generatedAt)' policies/POL-2025-001/contextual/sections.json > /tmp/actual.json
diff -u /tmp/expected.json /tmp/actual.json
```

---

## Updating Fixtures

### When to Update

**Update fixtures when:**
- Prompts improved, producing better output
- SABSA framework interpretation refined
- Framework references updated (e.g., new NIST SP versions)
- Section structure changes (new subsections added)

**Do NOT update for:**
- Minor wording differences (unless quality improves)
- Timestamp changes
- Trivial formatting changes

### How to Update

**1. Generate New Output:**
```bash
# Run workflow with current implementation
./scripts/run-local-test.sh new-policy

# Review generated output
cat policies/POL-2025-001/summary.md
jq . policies/POL-2025-001/contextual/sections.json
```

**2. Validate Quality:**
```bash
# Check improvements over current fixtures
diff -u \
  .github/test-fixtures/expected-contextual-sections.json \
  policies/POL-2025-001/contextual/sections.json

# Verify framework references enhanced
jq -r '.sections[].rationale_why' \
  policies/POL-2025-001/contextual/sections.json | \
  grep -E "(NIST|ISO|CIS)"
```

**3. Update Fixtures:**
```bash
# If quality improved, update golden files
cp policies/POL-2025-001/summary.md \
   .github/test-fixtures/expected-summary.md

cp policies/POL-2025-001/contextual/sections.json \
   .github/test-fixtures/expected-contextual-sections.json

cp policies/POL-2025-001/contextual/traceability.json \
   .github/test-fixtures/expected-traceability.json
```

**4. Document Changes:**
```bash
# Commit with detailed message
git add .github/test-fixtures/
git commit -m "test: Update expected fixtures after prompt improvements

- Enhanced framework citations in rationale_why
- Added specific NIST SP references
- Improved traceability descriptions

Golden files now reflect higher quality output from refined prompts."
```

---

## Fixture Maintenance Checklist

### Monthly
- [ ] Review framework references for outdated versions
- [ ] Check if new compliance frameworks should be added
- [ ] Verify sample policy still reflects realistic scenario

### Quarterly
- [ ] Run full regression test suite
- [ ] Compare golden files against latest output
- [ ] Update if significant quality improvements detected

### Annually
- [ ] Review sample policy for compliance framework updates
- [ ] Update framework version references (NIST, ISO, PCI DSS)
- [ ] Add new test policies for different scenarios

---

## Troubleshooting

### Fixture Validation Errors

**JSON Parse Errors:**
```bash
# Validate JSON syntax
jq . .github/test-fixtures/expected-contextual-sections.json
jq . .github/test-fixtures/expected-traceability.json

# Common issues:
# - Missing commas
# - Trailing commas in arrays/objects
# - Unescaped quotes in strings
```

**Schema Validation Failures:**
```bash
# Check required fields
jq '.policyId, .layer, .version, .generatedAt, .generationStatus' \
  .github/test-fixtures/expected-contextual-sections.json

# Verify section structure
jq '.sections | to_entries[0].value | keys' \
  .github/test-fixtures/expected-contextual-sections.json
# Expected: ["content", "rationale_condition", "rationale_why", "title"]
```

### Test Failures

**Output Doesn't Match Expected:**

1. **Check if prompt changed:**
   ```bash
   git log -p prompts/contextual-prompt.md
   ```

2. **Verify input policy unchanged:**
   ```bash
   git log -p .github/test-fixtures/sample-policy-encryption.md
   ```

3. **Compare differences:**
   ```bash
   diff -u expected.json actual.json | less
   ```

4. **Decision:**
   - If output improved: Update fixtures
   - If output regressed: Fix prompts/workflows
   - If output similar: Review if fixture expectations too strict

---

## Contact & Support

For questions about test fixtures:

1. **Documentation:** See `.github/TESTING.md` for comprehensive testing guide
2. **Coverage Plan:** See `TEST_COVERAGE_PLAN.md` for detailed test strategy
3. **Issues:** Report fixture issues in GitHub Issues with label `testing`

---

*Test Fixtures Version: 1.0*
*Last Updated: 2025-01-15*
*Maintained by: SABSA Workflow Team*
