# SABSA Workflow Test Coverage Plan

## Overview

This document outlines the comprehensive test coverage strategy for the SABSA Agentic Policy Workflow system, detailing test fixtures, expected coverage percentages, and validation criteria.

---

## Test Fixtures Summary

### Input Fixtures

| Fixture | Purpose | Size | Coverage |
|---------|---------|------|----------|
| **sample-policy-encryption.md** | Primary test policy for all workflows | 2.5 KB | All layers (1-6) |
| **new-policy-event.json** | Issue creation webhook payload | 2.1 KB | Initialize workflow |
| **pr-approved-event.json** | PR approval webhook payload | 3.4 KB | Cascade workflow |
| **pr-changes-requested-event.json** | PR changes requested webhook payload | 3.2 KB | Revision workflow |
| **pr-merged-event.json** | PR merge webhook payload | 2.8 KB | Cascade workflow |

### Expected Output Fixtures (Golden Files)

| Fixture | Purpose | Validates | Size |
|---------|---------|-----------|------|
| **expected-summary.md** | Policy summary baseline | Summary generation quality | 0.5 KB |
| **expected-contextual-sections.json** | Layer 1 complete output | Contextual layer structure and content | 24 KB |
| **expected-traceability.json** | Layer 1 traceability | Relationship vocabulary and structure | 1.8 KB |

---

## Test Coverage by Component

### 1. Workflows (GitHub Actions)

#### Initialize Policy Workflow
- **File:** `.github/workflows/initialize-policy.yml`
- **Coverage Target:** 100%
- **Test Cases:**

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid issue with policy | `new-policy-event.json` | Policy folder created, summary generated, Layer 1 PR created | ✓ Fixture ready |
| Manual workflow_dispatch | Manual trigger with policy text | Same as above | ⏳ Future |
| Invalid policy text (empty) | Empty policy body | Error handling, graceful failure | ⏳ Future |
| Very long policy (>10,000 words) | Large policy text | Summary truncation, performance check | ⏳ Future |

---

#### Generate Layer Workflow
- **File:** `.github/workflows/generate-layer.yml`
- **Coverage Target:** 100% (all 6 layers)
- **Test Cases:**

| Layer | Upstream Context | Expected Sections | Test Status |
|-------|------------------|-------------------|-------------|
| **Contextual** | summary.md only | 1-1, 1-2, 1-3, 1-4, 1-5 | ✓ Golden file ready |
| **Conceptual** | 1-2, 1-3, 1-4 | 2-1, 2-2, 2-3, 2-4, 2-5 | ⏳ Manual testing |
| **Logical** | 2-1, 2-2, 2-3 | 3-1, 3-2, 3-3, 3-4, 3-5 | ⏳ Manual testing |
| **Physical** | 3-1, 3-2, 3-3, 2-4 | 4-1, 4-2, 4-3, 4-4, 4-5 | ⏳ Manual testing |
| **Component** | 4-1, 4-2, 4-3 | 5-1, 5-2, 5-3, 5-4, 5-5 | ⏳ Manual testing |
| **Operational** | 5-1, 5-3, 5-4, 4-5 | 6-1, 6-2, 6-3, 6-4, 6-5, 6-6 | ⏳ Manual testing |

**Additional Test Cases:**
- [ ] Partial generation failure (some sections succeed, some fail)
- [ ] JSON parse error handling
- [ ] Missing expected sections validation
- [ ] Context assembly with missing upstream sections

---

#### Handle Revision Workflow
- **File:** `.github/workflows/handle-revision.yml`
- **Coverage Target:** 100%
- **Test Cases:**

| Test Case | Feedback Type | Expected Behavior | Status |
|-----------|---------------|-------------------|--------|
| Changes requested with general feedback | General review comment | Feedback extracted, regeneration triggered | ✓ Fixture ready |
| Changes with inline comments | Section-specific comments | Feedback mapped to sections, targeted regeneration | ✓ Fixture ready |
| Changes with multiple revisions | 2nd revision request | Revision counter incremented, limit checking | ⏳ Future |
| Revision limit reached | 4th revision request | Workflow halts, manual intervention required | ⏳ Future |

---

#### Cascade Next Layer Workflow
- **File:** `.github/workflows/cascade-next-layer.yml`
- **Coverage Target:** 100%
- **Test Cases:**

| Test Case | Trigger | Expected Output | Status |
|-----------|---------|-----------------|--------|
| Layer 1 merged | PR merge event | Layer 2 generation triggered | ✓ Fixture ready |
| Layer 2 merged | PR merge event | Layer 3 generation triggered | ⏳ Manual testing |
| Layer 6 merged | PR merge event | Finalize workflow triggered (not Layer 7) | ⏳ Manual testing |
| Non-policy PR merged | Unrelated PR | Workflow skipped | ⏳ Future |

---

#### Finalize Policy Workflow
- **File:** `.github/workflows/finalize-policy.yml`
- **Coverage Target:** 100%
- **Test Cases:**

| Test Case | Trigger | Expected Output | Status |
|-----------|---------|-----------------|--------|
| All 6 layers approved | Layer 6 merge | Metadata updated, release created, issue closed | ⏳ Manual testing |
| Consolidated artifact generation | Finalize complete | Single markdown document with all layers | ⏳ Future enhancement |

---

### 2. Custom Actions

#### Call Claude Action
- **File:** `.github/actions/call-claude/index.js`
- **Coverage Target:** 100%
- **Test Cases:**

| Test Case | Scenario | Expected Behavior | Status |
|-----------|----------|-------------------|--------|
| Successful API call | Valid prompt, API key | JSON response parsed, all sections extracted | ⏳ Unit test needed |
| Rate limit error | 429 response | Exponential backoff, retry up to 3 times | ⏳ Unit test needed |
| Timeout error | Slow API response | Retry logic, eventual failure handling | ⏳ Unit test needed |
| Malformed JSON response | Invalid JSON | Partial content extraction, error logged | ⏳ Unit test needed |
| Missing sections | Incomplete response | Validation error, partial result saved | ⏳ Unit test needed |

**Retry Logic Test Matrix:**

| Attempt | Delay | Max Delay | Expected Behavior |
|---------|-------|-----------|-------------------|
| 1 | 1s | - | First attempt |
| 2 | 2s | - | Exponential backoff |
| 3 | 4s | 30s | Final retry |
| 4 | - | - | Fail with error |

---

### 3. Configuration Files

#### Layer Dependencies
- **File:** `config/layer-dependencies.json`
- **Coverage:** 100% (all layer configurations validated)
- **Validation Tests:**

| Layer | Dependency Check | Expected Upstream Sections | Status |
|-------|------------------|---------------------------|--------|
| Contextual | No dependencies | summary.md only | ✓ Config ready |
| Conceptual | 3 sections from Layer 1 | 1-2, 1-3, 1-4 | ✓ Config ready |
| Logical | 3 sections from Layer 2 | 2-1, 2-2, 2-3 | ✓ Config ready |
| Physical | 4 sections (cross-layer) | 3-1, 3-2, 3-3, 2-4 | ✓ Config ready |
| Component | 3 sections from Layer 4 | 4-1, 4-2, 4-3 | ✓ Config ready |
| Operational | 4 sections (cross-layer) | 5-1, 5-3, 5-4, 4-5 | ✓ Config ready |

**Validation Script:**
```bash
# Validate all upstream references exist
python3 scripts/validate-layer-dependencies.py
```

---

#### Relationship Vocabulary
- **File:** `config/relationship-vocabulary.json`
- **Coverage:** 100% (all 5 relationships used in tests)
- **Validation Tests:**

| Relationship | Usage in Test Fixtures | Semantic Correctness | Status |
|--------------|------------------------|----------------------|--------|
| `implements` | Layer 1 → summary | Direct realization | ✓ Used in expected-traceability.json |
| `derives_from` | Layer 1 → policy input | Logical derivation | ✓ Used in expected-traceability.json |
| `constrained_by` | Layer 1 → business constraints | Boundary setting | ✓ Used in expected-traceability.json |
| `refines` | Layer N → Layer N-1 | Detail addition | ⏳ Future layers |
| `validates` | Success criteria → requirements | Verification | ✓ Used in expected-traceability.json |

---

### 4. Prompts

#### System Prompt
- **File:** `prompts/system-prompt.md`
- **Coverage:** Used in all Claude API calls
- **Validation:**
  - [ ] Includes SABSA role definition
  - [ ] Specifies output format (JSON)
  - [ ] Lists relationship vocabulary
  - [ ] Defines quality criteria (traceable, framework-aligned, actionable)

---

#### Layer-Specific Prompts
- **Files:** `prompts/{layer}-prompt.md`
- **Coverage Target:** 100% (all 6 layers)

| Prompt | Layer Questions | Framework References | Status |
|--------|----------------|----------------------|--------|
| `contextual-prompt.md` | "What does the business need?" | NIST Privacy, ISO 27001 | ⏳ To be created |
| `conceptual-prompt.md` | "What security capabilities?" | NIST CSF, ISO 27001 | ⏳ To be created |
| `logical-prompt.md` | "What are the security rules?" | NIST SP 800-53, CIS | ⏳ To be created |
| `physical-prompt.md` | "How will it be implemented?" | Cloud provider docs | ⏳ To be created |
| `component-prompt.md` | "What specific tools/configs?" | Tool documentation | ⏳ To be created |
| `operational-prompt.md` | "How will it be maintained?" | ITIL, SRE practices | ⏳ To be created |

---

## End-to-End Test Scenarios

### Scenario 1: Happy Path (All Layers Approved First Try)

**Steps:**
1. Submit policy via issue
2. Approve Layer 1 immediately
3. Approve Layer 2 immediately
4. ... Approve all layers
5. Verify release created

**Expected Duration:** ~30 minutes (6 layers × 5 min each, excluding human review time)

**Validation Points:**
- [ ] All 6 PRs created
- [ ] All 6 PRs merged to main
- [ ] Metadata shows all layers approved
- [ ] Release tag created: `policy/{policy-id}/v1.0`
- [ ] Original issue closed

**Status:** ⏳ Manual testing required

---

### Scenario 2: Revision Path (Multiple Revisions)

**Steps:**
1. Submit policy via issue
2. Request changes on Layer 1
3. Review and approve revised Layer 1
4. Request changes on Layer 3
5. Review and approve revised Layer 3
6. Approve remaining layers

**Expected Duration:** ~45 minutes (including revision cycles)

**Validation Points:**
- [ ] Revision workflow triggered correctly
- [ ] Feedback incorporated in regenerated content
- [ ] Revision counter incremented in metadata
- [ ] Final artifacts reflect all revisions

**Status:** ⏳ Manual testing required

---

### Scenario 3: Edge Case - Partial Generation Failure

**Steps:**
1. Submit policy via issue
2. Simulate API failure during Layer 2 generation (section 2-3 fails)
3. Review PR with partial results
4. Manually complete missing section
5. Continue workflow

**Expected Behavior:**
- [ ] sections.json shows generationStatus: "partial"
- [ ] Missing section has content: null
- [ ] errors array populated with failure details
- [ ] PR labeled with "needs-manual-review"

**Status:** ⏳ Future testing (requires mock API failures)

---

### Scenario 4: Edge Case - Revision Limit Reached

**Steps:**
1. Submit policy via issue
2. Request changes on Layer 1 (revision 1)
3. Request changes on Layer 1 again (revision 2)
4. Request changes on Layer 1 again (revision 3)
5. Request changes on Layer 1 again (should fail)

**Expected Behavior:**
- [ ] Revision workflow halts after 3rd revision
- [ ] PR labeled with "revision-limit-reached"
- [ ] Comment added to PR explaining limit
- [ ] Manual intervention required

**Status:** ⏳ Future testing

---

## Performance Benchmarks

### Token Usage Estimates

| Layer | Input Tokens | Output Tokens | Total Cost (Claude Sonnet) |
|-------|--------------|---------------|----------------------------|
| **Summary** | ~800 | ~200 | $0.003 |
| **Contextual** | ~1,400 | ~4,000 | $0.016 |
| **Conceptual** | ~2,900 | ~4,000 | $0.024 |
| **Logical** | ~2,900 | ~4,000 | $0.024 |
| **Physical** | ~3,400 | ~4,000 | $0.026 |
| **Component** | ~2,900 | ~4,000 | $0.024 |
| **Operational** | ~3,400 | ~4,000 | $0.026 |
| **Total per policy** | ~17,700 | ~24,200 | **~$0.143** |

**Pricing Assumptions:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- Model: claude-sonnet-4-20250514

---

### Timing Benchmarks

| Operation | Target Time | Measured Time | Status |
|-----------|-------------|---------------|--------|
| Policy ID generation | <5s | TBD | ⏳ |
| Summary generation | <30s | TBD | ⏳ |
| Layer 1 generation | <2 min | TBD | ⏳ |
| Layer 2 generation | <2 min | TBD | ⏳ |
| Revision regeneration | <2 min | TBD | ⏳ |
| PR creation | <10s | TBD | ⏳ |
| Full policy (6 layers) | <15 min | TBD | ⏳ |

**Note:** Excludes human review time, which varies based on reviewer availability.

---

## Test Data Quality

### Sample Policy Characteristics

**Customer PII Encryption Policy** (`sample-policy-encryption.md`):
- **Word Count:** ~600 words
- **Complexity:** High (multiple compliance frameworks)
- **Scope:** Well-defined (customer PII)
- **Requirements:** Specific (AES-256, TLS 1.2+, 90-day rotation, MFA)
- **Compliance References:** 6 frameworks (SOC 2, GDPR, PCI DSS, NIST, ISO, CIS)

**Coverage Characteristics:**
- ✓ Technical requirements (encryption algorithms, key management)
- ✓ Process requirements (key rotation, access controls)
- ✓ Compliance requirements (regulatory drivers)
- ✓ Business context (penetration test findings, audit timeline)
- ✓ Success criteria (measurable outcomes)

---

### Golden File Quality

**Expected Contextual Sections** (`expected-contextual-sections.json`):
- **Sections:** 5 complete sections (1-1 through 1-5)
- **Content Quality:**
  - ✓ Each section >500 words (detailed, comprehensive)
  - ✓ Framework references in rationale_why (NIST, ISO, SABSA)
  - ✓ Clear condition satisfaction in rationale_condition
  - ✓ Markdown formatting (headings, lists, tables)
  - ✓ Specific content (not generic boilerplate)

**Expected Traceability** (`expected-traceability.json`):
- **References:** All 5 sections have traceability
- **Relationship Diversity:**
  - ✓ implements (3 uses)
  - ✓ derives_from (2 uses)
  - ✓ validates (1 use)
  - ✓ constrained_by (3 uses)
- **Source Variety:**
  - ✓ References to summary
  - ✓ References to policy input
  - ✓ Cross-section references within layer

---

## Test Automation Coverage

### Automated Tests (via act)

| Test | Automation Level | Coverage |
|------|------------------|----------|
| Initialize workflow | ✓ Fully automated | 100% |
| Generate Layer 1 | ✓ Fully automated | 100% |
| PR approval cascade | ✓ Fully automated | 100% |
| Revision workflow | ✓ Fully automated | 100% |
| Generate Layers 2-6 | ⏳ Manual trigger | 0% (future) |
| Finalize workflow | ⏳ Manual trigger | 0% (future) |

---

### Manual Tests (Human-in-Loop)

| Test | Manual Steps Required | Coverage |
|------|----------------------|----------|
| End-to-end workflow | Full human review cycle | Critical path |
| Content quality review | Reviewer judgment on accuracy | Quality assurance |
| Traceability validation | Verify logical relationships | Semantic correctness |
| Framework reference accuracy | Validate citations (NIST, ISO) | Compliance alignment |

---

## Validation Scripts

### Structural Validation
```bash
# JSON schema validation
./scripts/validate-json-schema.sh policies/POL-2025-001

# Traceability reference validation
python3 scripts/validate-traceability.py --policy-id POL-2025-001

# Layer dependency validation
python3 scripts/validate-layer-dependencies.py
```

### Content Validation
```bash
# Framework reference check
./scripts/check-framework-references.sh policies/POL-2025-001

# Word count validation (summary ≤150 words)
./scripts/validate-summary-length.sh policies/POL-2025-001/summary.md

# Relationship vocabulary validation
./scripts/validate-relationships.sh policies/POL-2025-001
```

### Regression Testing
```bash
# Compare against golden files
./scripts/compare-to-golden.sh \
  --policy-id POL-2025-001 \
  --layer contextual \
  --fixture expected-contextual-sections.json
```

---

## Coverage Metrics

### Current Coverage Status

| Category | Total Cases | Implemented | Coverage % |
|----------|-------------|-------------|------------|
| **Workflows** | 5 workflows | 0 | 0% |
| **Test Events** | 4 events | 4 | **100%** ✓ |
| **Golden Files** | 3 files | 3 | **100%** ✓ |
| **Sample Policies** | 1 policy | 1 | **100%** ✓ |
| **Layer Tests** | 6 layers | 1 (Layer 1 expected) | 17% |
| **Error Scenarios** | 8 scenarios | 0 | 0% |
| **Edge Cases** | 6 cases | 0 | 0% |

### Target Coverage (Post-POC)

| Category | Target % | Priority |
|----------|----------|----------|
| **Workflows** | 100% | High |
| **Layer Generation** | 100% (all 6 layers) | Critical |
| **Error Handling** | 80% | Medium |
| **Edge Cases** | 60% | Low |
| **Performance Benchmarks** | 100% | Medium |

---

## Next Steps

### Phase 1: POC Testing (Week 1-2)
- [ ] Implement initialize, generate, cascade workflows
- [x] Create test fixtures and golden files
- [ ] Test Layer 1 generation with act
- [ ] Validate output against expected-contextual-sections.json
- [ ] Document any deviations from expected output

### Phase 2: Integration Testing (Week 3)
- [ ] Manual end-to-end test (issue → Layer 3)
- [ ] Test revision workflow with real PR review
- [ ] Validate cascade workflow triggers correctly
- [ ] Test cross-layer traceability (Layer 3 referencing Layer 2 and Layer 1)

### Phase 3: Full Coverage (Week 4)
- [ ] Complete all 6 layers end-to-end
- [ ] Test finalize workflow
- [ ] Measure performance benchmarks
- [ ] Create golden files for Layers 2-6
- [ ] Document edge cases discovered

### Phase 4: Regression Suite (Post-POC)
- [ ] Automate all workflow tests with act
- [ ] Create validation scripts for all checks
- [ ] Set up scheduled regression testing
- [ ] Establish performance baselines

---

## Test Maintenance

### When to Update Fixtures

**Update Golden Files When:**
- Prompt improvements produce better output
- Layer structure changes (new sections added)
- Relationship vocabulary expands
- Framework references updated (e.g., new NIST versions)

**Update Test Events When:**
- GitHub webhook payload structure changes
- New event types added to workflows
- Additional metadata required in events

**Update Sample Policy When:**
- New compliance frameworks to test
- Different policy types needed (access control, incident response)
- Edge case scenarios discovered (very short/long policies)

---

## Success Criteria

### POC Testing Success
- ✅ All test fixtures created and validated
- ⏳ Initialize workflow completes successfully with sample policy
- ⏳ Layer 1 generation matches expected-contextual-sections.json structure
- ⏳ Traceability matches expected-traceability.json structure
- ⏳ Summary generation ≤150 words

### Full System Testing Success
- ⏳ All 6 layers generate successfully
- ⏳ End-to-end workflow completes (issue → release)
- ⏳ Revision workflow incorporates feedback correctly
- ⏳ Performance benchmarks met (≤15 min total generation time)
- ⏳ Token usage within budget (~$0.15 per policy)

---

*Test Coverage Plan Version: 1.0*
*Last Updated: 2025-01-15*
*Status: POC Phase - Test Fixtures Complete, Workflow Implementation Pending*
