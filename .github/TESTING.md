# SABSA Workflow Testing Guide

This document provides comprehensive testing guidance for the SABSA Agentic Policy Workflow system.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Local Testing with Act](#local-testing-with-act)
3. [Test Fixtures Overview](#test-fixtures-overview)
4. [Manual Testing Procedures](#manual-testing-procedures)
5. [CI/CD Testing Strategy](#cicd-testing-strategy)
6. [Validation Procedures](#validation-procedures)
7. [Test Coverage Expectations](#test-coverage-expectations)
8. [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

The SABSA workflow system follows these testing principles:

1. **Test Artifacts as Code:** All test inputs and expected outputs are version-controlled
2. **Golden File Testing:** Expected outputs serve as "golden files" for regression testing
3. **Local-First Testing:** Developers can test workflows locally before pushing to CI
4. **Incremental Validation:** Each layer tested independently before end-to-end testing
5. **Human-in-Loop Testing:** Manual review validation is part of the test suite

---

## Local Testing with Act

### Prerequisites

**Required Tools:**
- [act](https://github.com/nektos/act) - Run GitHub Actions locally
- Docker Desktop - Container runtime for act
- Git - Version control

**Installation:**

```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Windows (via Chocolatey)
choco install act-cli
```

**Configuration:**

Create `.actrc` in repository root (optional):

```bash
# Use medium-sized runner image
-P ubuntu-latest=catthehacker/ubuntu:act-latest

# Set default secrets file
--secret-file .secrets
```

Create `.secrets` file (DO NOT commit):

```bash
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### Running Local Tests

**Quick Start:**

```bash
# Run all tests
./scripts/run-local-test.sh

# Run specific test
./scripts/run-local-test.sh new-policy
./scripts/run-local-test.sh pr-approved
./scripts/run-local-test.sh pr-changes
./scripts/run-local-test.sh pr-merged
```

**Manual Act Commands:**

```bash
# Test policy initialization
act issues \
  --eventpath .github/test-events/new-policy-event.json \
  --workflows .github/workflows/initialize-policy.yml \
  --secret ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"

# Test PR approval cascade
act pull_request_review \
  --eventpath .github/test-events/pr-approved-event.json \
  --workflows .github/workflows/cascade-next-layer.yml

# Test revision workflow
act pull_request_review \
  --eventpath .github/test-events/pr-changes-requested-event.json \
  --workflows .github/workflows/handle-revision.yml

# Test PR merge cascade
act pull_request \
  --eventpath .github/test-events/pr-merged-event.json \
  --workflows .github/workflows/cascade-next-layer.yml
```

**Dry Run Mode:**

```bash
# List workflows that would run (no execution)
act issues \
  --eventpath .github/test-events/new-policy-event.json \
  --list

# Show workflow details without running
act issues \
  --eventpath .github/test-events/new-policy-event.json \
  --dryrun
```

**Debugging Options:**

```bash
# Verbose output
act issues \
  --eventpath .github/test-events/new-policy-event.json \
  --verbose

# Very verbose with full debug
act issues \
  --eventpath .github/test-events/new-policy-event.json \
  --verbose \
  --env ACT=true \
  --env ACTIONS_STEP_DEBUG=true

# Use specific Docker image
act issues \
  --eventpath .github/test-events/new-policy-event.json \
  -P ubuntu-latest=catthehacker/ubuntu:full-latest
```

---

## Test Fixtures Overview

### Directory Structure

```
.github/
├── test-fixtures/               # Golden files and test inputs
│   ├── sample-policy-encryption.md
│   ├── expected-summary.md
│   ├── expected-contextual-sections.json
│   └── expected-traceability.json
├── test-events/                 # GitHub webhook payloads
│   ├── new-policy-event.json
│   ├── pr-approved-event.json
│   ├── pr-changes-requested-event.json
│   └── pr-merged-event.json
└── test-output/                 # Generated during tests (gitignored)
    ├── *.log
    └── artifacts/
```

### Sample Policy

**File:** `.github/test-fixtures/sample-policy-encryption.md`

**Purpose:** Realistic policy statement used for testing all layers

**Content:** Customer PII Encryption Policy with:
- Complete policy statement (AES-256, TLS 1.2+, HSM, 90-day rotation, MFA)
- Business context (SOC 2, GDPR, penetration test findings)
- Compliance requirements (NIST, ISO, CIS references)
- Priority and scope definitions

**Usage:**
- Initialize workflow reads this as input
- Expected outputs based on this policy
- Regression testing uses same input for consistency

### Expected Outputs (Golden Files)

**1. Expected Summary**
- **File:** `expected-summary.md`
- **Purpose:** Validate policy summary generation
- **Format:** Plain text (≤150 words)
- **Usage:** Compare generated summary against this file

**2. Expected Contextual Sections**
- **File:** `expected-contextual-sections.json`
- **Purpose:** Validate Layer 1 (Contextual) generation
- **Format:** Complete sections.json with all 5 sections
- **Content:**
  - Business Process Overview (1-1)
  - Business Drivers (1-2)
  - Risk Context (1-3)
  - Success Criteria (1-4)
  - Constraints & Assumptions (1-5)
- **Usage:** Structural validation, content sampling

**3. Expected Traceability**
- **File:** `expected-traceability.json`
- **Purpose:** Validate traceability reference structure
- **Format:** Complete traceability.json for Layer 1
- **Content:** References from each section back to summary/input
- **Usage:** Validate relationship vocabulary and structure

### Test Event Files

GitHub webhook payloads for workflow triggers:

**1. new-policy-event.json**
- **Trigger:** `issues.opened` event
- **Payload:** GitHub issue with `new-policy` label
- **Content:** Sample encryption policy in issue body
- **Tests:** Policy initialization workflow

**2. pr-approved-event.json**
- **Trigger:** `pull_request_review.submitted` event (state: approved)
- **Payload:** Review approval on Layer 1 PR
- **Content:** Positive review with approval
- **Tests:** Cascade workflow triggering Layer 2

**3. pr-changes-requested-event.json**
- **Trigger:** `pull_request_review.submitted` event (state: changes_requested)
- **Payload:** Review requesting changes with feedback
- **Content:** Specific feedback for sections 2-3 and 2-4
- **Tests:** Revision workflow, feedback extraction

**4. pr-merged-event.json**
- **Trigger:** `pull_request.closed` event (merged: true)
- **Payload:** Merged PR for Layer 1
- **Content:** Merged contextual layer
- **Tests:** Cascade workflow detecting merge and triggering next layer

---

## Manual Testing Procedures

### End-to-End Testing (Recommended Approach)

**Phase 1: Policy Submission**

1. Create GitHub issue using `new-policy` template
2. Fill in policy statement from `test-fixtures/sample-policy-encryption.md`
3. Set priority to "High"
4. Submit issue

**Expected Results:**
- Initialize workflow triggers within 30 seconds
- Policy ID generated (format: `POL-YYYY-NNN`)
- Folder structure created in `policies/{policy-id}/`
- Summary generated in `summary.md`
- Layer 1 PR created automatically

**Validation:**
- Check Actions tab for workflow run
- Verify policy folder exists on main branch
- Confirm summary.md contains ≤150 words
- Validate Layer 1 PR opened with correct branch name

---

**Phase 2: Layer 1 Review (Contextual)**

1. Navigate to Layer 1 PR
2. Review generated `sections.json` in Files Changed
3. Verify all 5 sections present (1-1 through 1-5)
4. Check `traceability.json` for proper references
5. Add inline comment on section 1-2: "Include reference to NIST SP 800-53"
6. Submit review: "Request Changes"

**Expected Results:**
- Revision workflow triggers
- Feedback extracted from review comments
- Layer regenerated with NIST reference added
- PR updated with new commit

**Validation:**
- Check Actions tab for revision workflow run
- Verify section 1-2 now includes NIST SP 800-53 reference
- Confirm PR shows updated commit

---

**Phase 3: Layer 1 Approval**

1. Re-review updated Layer 1 PR
2. Verify feedback incorporated
3. Submit review: "Approve"
4. Merge PR to main

**Expected Results:**
- Cascade workflow triggers on merge
- Metadata updated: Layer 1 status → approved
- Layer 2 generation begins
- New PR opened for Layer 2 (Conceptual)

**Validation:**
- Verify Layer 1 branch merged to main
- Check metadata.json shows Layer 1 approved with PR number
- Confirm Layer 2 PR created with upstream context from Layer 1

---

**Phase 4: Layers 2-6 (Repeat Process)**

Repeat review → revise → approve → merge cycle for each layer:

1. **Layer 2 (Conceptual):** Receives sections 1-2, 1-3, 1-4 as context
2. **Layer 3 (Logical):** Receives sections 2-1, 2-2, 2-3 as context
3. **Layer 4 (Physical):** Receives sections 3-1, 3-2, 3-3, 2-4 as context
4. **Layer 5 (Component):** Receives sections 4-1, 4-2, 4-3 as context
6. **Layer 6 (Operational):** Receives sections 5-1, 5-3, 5-4, 4-5 as context

**Context Validation:**
- Before approving each layer, verify PR description lists correct upstream sections
- Spot-check that generated content references upstream elements
- Validate traceability.json shows appropriate relationships

---

**Phase 5: Finalization**

1. Merge Layer 6 (Operational) PR
2. Wait for finalize workflow

**Expected Results:**
- Metadata updated: status → completed
- Release created: `policy/{policy-id}/v1.0`
- Original issue closed with completion comment
- (Optional) Consolidated artifact generated

**Validation:**
- Check Releases page for new release
- Verify release includes links to all 6 layer PRs
- Confirm original issue closed
- Review metadata.json shows all layers approved with timestamps

---

### Testing Individual Workflows

**Test Initialize Workflow Only:**

```bash
# Trigger manually via workflow_dispatch
gh workflow run initialize-policy.yml \
  -f policy-title="Test Encryption Policy" \
  -f policy-text="$(cat .github/test-fixtures/sample-policy-encryption.md)"
```

**Test Generate Layer Workflow Only:**

```bash
# Trigger specific layer generation
gh workflow run generate-layer.yml \
  -f policy-id="POL-2025-001" \
  -f layer="conceptual"
```

**Test Revision Workflow:**

1. Create test PR manually
2. Submit review with changes requested
3. Verify revision workflow triggers

---

## CI/CD Testing Strategy

### GitHub Actions Testing (In Production)

**Branch Protection Testing:**

```yaml
# Test on feature branch before main
on:
  pull_request:
    branches: [main]
```

**Matrix Testing (Future Enhancement):**

```yaml
strategy:
  matrix:
    layer: [contextual, conceptual, logical, physical, component, operational]
    test-policy:
      - sample-policy-encryption.md
      - sample-policy-access-control.md
      - sample-policy-incident-response.md
```

**Smoke Tests (Pre-deployment):**

```yaml
jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - name: Validate config files
        run: |
          # Validate JSON schemas
          jq . config/layer-dependencies.json
          jq . config/relationship-vocabulary.json

      - name: Test Claude action (mock)
        uses: ./.github/actions/call-claude
        with:
          prompt: "Test prompt"
          anthropic-api-key: "test-key"
          expected-sections: '["test"]'
```

### Continuous Testing

**Scheduled Regression Tests:**

```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday 2am

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - name: Run full policy workflow test
        run: ./scripts/run-local-test.sh all
```

**Post-Deployment Validation:**

After each workflow deployment:

1. Run smoke test with sample policy
2. Verify at least Layer 1 generates correctly
3. Check traceability structure matches schema
4. Validate PR creation and formatting

---

## Validation Procedures

### Structural Validation

**sections.json Schema Validation:**

```bash
# Using ajv-cli for JSON Schema validation
ajv validate \
  -s config/schemas/sections-schema.json \
  -d policies/POL-2025-001/contextual/sections.json
```

**Expected Structure:**

```json
{
  "policyId": "string (POL-YYYY-NNN)",
  "layer": "enum",
  "version": "integer >= 1",
  "generatedAt": "ISO 8601 timestamp",
  "generationStatus": "complete | partial",
  "sections": {
    "{section-id}": {
      "title": "string",
      "content": "string (markdown) | null",
      "rationale_why": "string | null",
      "rationale_condition": "string | null"
    }
  },
  "errors": "array"
}
```

**traceability.json Schema Validation:**

```bash
ajv validate \
  -s config/schemas/traceability-schema.json \
  -d policies/POL-2025-001/contextual/traceability.json
```

**Expected Structure:**

```json
{
  "policyId": "string",
  "layer": "enum",
  "version": "integer",
  "generatedAt": "ISO 8601",
  "references": {
    "{section-id}": [
      {
        "source": "string (POL-ID.layer.section)",
        "relationship": "enum (implements | derives_from | etc)",
        "description": "string (optional)"
      }
    ]
  }
}
```

### Content Validation

**Policy Summary Quality Checks:**

```bash
# Word count (should be ≤150 words)
wc -w policies/POL-2025-001/summary.md

# Contains key requirements
grep -q "AES-256" policies/POL-2025-001/summary.md
grep -q "TLS 1.2" policies/POL-2025-001/summary.md
grep -q "90-day" policies/POL-2025-001/summary.md
```

**Framework Reference Validation:**

```bash
# Each section should reference at least one framework
for section in policies/POL-2025-001/contextual/sections.json; do
  jq -r '.sections[].rationale_why' "$section" | \
    grep -E "(NIST|ISO|CIS|SABSA|GDPR|SOC 2|PCI DSS)"
done
```

**Traceability Completeness:**

```bash
# Every section should have at least one traceability reference
jq '.references | to_entries | .[] | select(.value == [])' \
  policies/POL-2025-001/contextual/traceability.json

# Should return empty (no sections without references)
```

### Relationship Validation

**Valid Relationship Vocabulary:**

```bash
# Extract all relationships used
jq -r '.references[][].relationship' \
  policies/POL-2025-001/*/traceability.json | sort -u

# Compare against vocabulary
jq -r '.relationships[].id' config/relationship-vocabulary.json
```

**Valid Relationships:**
- `implements`
- `derives_from`
- `constrained_by`
- `refines`
- `validates`

**Upstream Reference Validation:**

```bash
# All source references should point to existing sections
python3 scripts/validate-traceability.py \
  --policy-id POL-2025-001 \
  --layer contextual
```

### Diff-Based Validation (Regression Testing)

**Compare Against Golden Files:**

```bash
# Summary comparison
diff -u \
  .github/test-fixtures/expected-summary.md \
  policies/POL-2025-001/summary.md

# Structural comparison (ignore generated timestamps)
jq 'del(.generatedAt)' \
  .github/test-fixtures/expected-contextual-sections.json > /tmp/expected.json
jq 'del(.generatedAt)' \
  policies/POL-2025-001/contextual/sections.json > /tmp/actual.json
diff -u /tmp/expected.json /tmp/actual.json
```

---

## Test Coverage Expectations

### Workflow Coverage

| Workflow | Test Type | Coverage Target |
|----------|-----------|-----------------|
| **initialize-policy.yml** | Unit (act), E2E (manual) | 100% paths |
| **generate-layer.yml** | Unit (act), E2E (manual) | 100% layers |
| **handle-revision.yml** | Unit (act), E2E (manual) | 100% feedback types |
| **cascade-next-layer.yml** | Unit (act), E2E (manual) | 100% layer transitions |
| **finalize-policy.yml** | E2E (manual) | 100% success path |

### Layer Coverage

| Layer | Test Cases Required |
|-------|---------------------|
| **Contextual** | Complete generation, partial failure, validation errors |
| **Conceptual** | With upstream context, revision cycle, traceability |
| **Logical** | Multiple upstream layers, complex traceability |
| **Physical** | Cross-layer references (e.g., to 2-4 Trust Model) |
| **Component** | Technical detail validation, script generation |
| **Operational** | Final layer, all upstream available |

### Error Handling Coverage

| Error Scenario | Test Required |
|----------------|---------------|
| **API Failure** | Rate limit, timeout, 5xx error |
| **Parse Failure** | Malformed JSON, incomplete response |
| **Validation Failure** | Missing sections, invalid traceability |
| **Partial Results** | Some sections generated, some failed |
| **Retry Logic** | Exponential backoff, max retry limit |

### Edge Cases

- Policy ID counter wraparound (e.g., POL-2025-999 → POL-2026-001)
- Multiple policies in flight simultaneously
- Revision limit reached (3 revisions max)
- Conflicting branch updates
- Large policy statements (>10,000 words)
- Minimal policy statements (<100 words)

---

## Troubleshooting

### Common Issues

#### Act Fails to Run

**Symptom:** `act` command not found

**Solution:**
```bash
# Install act
brew install act  # macOS
# OR
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

---

**Symptom:** Docker daemon not running

**Solution:**
```bash
# Start Docker Desktop manually
# OR verify Docker is running:
docker ps
```

---

**Symptom:** Permission denied on test script

**Solution:**
```bash
chmod +x scripts/run-local-test.sh
```

---

#### Workflow Validation Errors

**Symptom:** JSON schema validation fails

**Solution:**
```bash
# Validate JSON manually
jq . policies/POL-2025-001/contextual/sections.json

# Fix JSON syntax errors
# Re-run generation workflow
```

---

**Symptom:** Missing expected sections in output

**Solution:**
1. Check workflow logs for generation errors
2. Verify Claude action received complete prompt
3. Check for partial result handling in sections.json
4. Review errors array in sections.json

---

**Symptom:** Traceability references invalid

**Solution:**
```bash
# Run traceability validation script
python3 scripts/validate-traceability.py \
  --policy-id POL-2025-001 \
  --layer contextual

# Fix invalid references
# Source format: {policy-id}.{layer}.{section}
```

---

#### Claude API Issues

**Symptom:** Rate limit errors

**Solution:**
- Reduce test frequency
- Implement exponential backoff (already in action)
- Check API key usage limits

---

**Symptom:** Empty or nonsensical responses

**Solution:**
1. Verify API key is correct
2. Check prompt assembly in workflow logs
3. Validate system prompt and layer prompts are loaded
4. Review Claude action inputs in workflow run

---

#### Test Output Validation

**Symptom:** Generated output differs significantly from expected

**Solution:**
1. Review policy input for changes
2. Check if expected fixtures are outdated
3. Validate upstream context assembly
4. Review layer dependencies configuration

---

**Symptom:** Cannot find test output logs

**Solution:**
```bash
# Logs are in .github/test-output/
ls -lh .github/test-output/*.log

# View specific test log
cat .github/test-output/new-policy-test.log
```

---

### Debug Workflow Runs

**Enable Debug Logging:**

```bash
# Set GitHub Actions debug secrets
gh secret set ACTIONS_STEP_DEBUG --body true
gh secret set ACTIONS_RUNNER_DEBUG --body true
```

**Download Workflow Logs:**

```bash
# List recent workflow runs
gh run list --workflow initialize-policy.yml

# Download logs for specific run
gh run download <run-id>
```

**View Real-Time Logs:**

```bash
# Follow workflow run in terminal
gh run watch <run-id>

# View specific job logs
gh run view <run-id> --log --job <job-id>
```

---

### Reporting Issues

When reporting testing issues, include:

1. **Test command used**
   ```bash
   ./scripts/run-local-test.sh new-policy
   ```

2. **Error output**
   ```
   Copy full error message and stack trace
   ```

3. **Environment details**
   - OS and version
   - act version (`act --version`)
   - Docker version (`docker --version`)
   - Node.js version (`node --version`)

4. **Workflow logs** (attach or link)
   - `.github/test-output/*.log`
   - GitHub Actions run logs

5. **Input artifacts**
   - Policy statement used
   - Event payload (if modified)
   - Configuration changes (if any)

---

## Advanced Testing

### Performance Testing

**Measure Layer Generation Time:**

```bash
time act issues \
  --eventpath .github/test-events/new-policy-event.json \
  --workflows .github/workflows/initialize-policy.yml
```

**Token Usage Tracking:**

```javascript
// In call-claude action, log token usage
console.log(`Input tokens: ${response.usage.input_tokens}`);
console.log(`Output tokens: ${response.usage.output_tokens}`);
```

**Expected Performance:**
- Summary generation: <30 seconds
- Layer 1-6 generation: <2 minutes each
- Revision regeneration: <2 minutes
- End-to-end (6 layers): <15 minutes (excluding human review time)

---

### Load Testing (Future)

**Multiple Concurrent Policies:**

```bash
# Trigger 5 policies simultaneously
for i in {1..5}; do
  gh workflow run initialize-policy.yml \
    -f policy-title="Test Policy $i" \
    -f policy-text="$(cat .github/test-fixtures/sample-policy-encryption.md)" &
done
```

**Rate Limit Testing:**

- Monitor Claude API rate limits
- Test retry logic with rate limit errors
- Verify graceful degradation

---

### Integration Testing

**Webhook Testing:**

Use [webhook.site](https://webhook.site) to inspect actual GitHub webhook payloads:

1. Create webhook in repository settings
2. Trigger workflow actions (open issue, approve PR)
3. Capture real payloads
4. Update test-events/*.json with real structures

**End-to-End with Real GitHub:**

1. Create test repository
2. Run full policy workflow
3. Verify all 6 layers complete
4. Validate release creation
5. Check issue closure

---

## Continuous Improvement

### Expanding Test Coverage

**New Test Policies:**

Create additional sample policies in `test-fixtures/`:
- `sample-policy-access-control.md`
- `sample-policy-incident-response.md`
- `sample-policy-vendor-risk.md`

**New Edge Cases:**

- Very short policy (50 words)
- Very long policy (5,000 words)
- Policy with no compliance references
- Policy with unusual formatting

**Golden File Updates:**

When changing prompts or improving generation:

1. Run test workflow
2. Review generated output
3. If output improved, update golden files
4. Document why change was made
5. Commit updated fixtures

---

## Test Maintenance

**Regular Maintenance Tasks:**

- [ ] Weekly: Run `./scripts/run-local-test.sh all`
- [ ] Monthly: Review and update golden files if prompts changed
- [ ] Quarterly: Add new test cases for edge cases discovered
- [ ] Yearly: Review test policy for compliance framework updates

**Fixture Versioning:**

```
.github/test-fixtures/
├── v1.0/                    # Initial POC fixtures
│   ├── expected-summary.md
│   └── expected-contextual-sections.json
└── v2.0/                    # Updated after prompt improvements
    ├── expected-summary.md
    └── expected-contextual-sections.json
```

---

## Summary

This testing guide provides:

✅ **Local testing** with `act` for rapid iteration
✅ **Test fixtures** for golden file validation
✅ **Manual procedures** for end-to-end testing
✅ **CI/CD strategy** for automated testing
✅ **Validation procedures** for quality assurance
✅ **Troubleshooting** for common issues

**Key Testing Commands:**

```bash
# Quick test all workflows
./scripts/run-local-test.sh all

# Test specific workflow
./scripts/run-local-test.sh new-policy

# Validate JSON structure
jq . policies/POL-2025-001/contextual/sections.json

# Compare against golden files
diff -u .github/test-fixtures/expected-summary.md policies/POL-2025-001/summary.md
```

**Next Steps:**

1. Install `act` and Docker
2. Run `./scripts/run-local-test.sh all`
3. Review test output in `.github/test-output/`
4. Proceed to manual end-to-end testing
5. Report any issues or edge cases discovered

---

*Last Updated: 2025-01-15*
*Maintained by: SABSA Workflow Team*
