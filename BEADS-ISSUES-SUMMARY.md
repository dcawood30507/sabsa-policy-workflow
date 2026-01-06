# BEADS Issues for SABSA Policy Workflow - Complete Summary

**Created:** 2026-01-05
**Policy:** POL-2025-004 (Customer PII Encryption Policy)
**Total Issues:** 7 (6 layer issues + 1 finalization issue)

---

## Issue Locations

### sabsa-git Repository Issues
**Location:** `/Users/test/aiwork/sabsa-git/.beads/`
**Prefix:** `sabsa-git-`
**View with:** `cd /Users/test/aiwork/sabsa-git && bd list -l sabsa-git`

| Issue ID | Title | Priority | Status | Layer |
|----------|-------|----------|--------|-------|
| **sabsa-git-9b2** | Complete SABSA Layer 1: Contextual for POL-2025-004 | P0 | Open | Layer 1 |
| **sabsa-git-u5a** | Complete SABSA Layer 2: Conceptual for POL-2025-004 | P0 | Open | Layer 2 |
| **sabsa-git-dku** | Complete SABSA Layer 3: Logical for POL-2025-004 | P2 | Open | Layer 3 |
| **sabsa-git-or1** | Complete SABSA Layer 4: Physical for POL-2025-004 | P2 | Open | Layer 4 |
| **sabsa-git-pz9** | Complete SABSA Layer 5: Component for POL-2025-004 | P2 | Open | Layer 5 |
| **sabsa-git-6yb** | Complete SABSA Layer 6: Operational for POL-2025-004 | P3 | Open | Layer 6 |

### aiwork Repository Issues
**Location:** `/Users/test/aiwork/.beads/`
**Prefix:** `aiwork-`
**View with:** `cd /Users/test/aiwork && bd list -l sabsa-git`

| Issue ID | Title | Priority | Status | Purpose |
|----------|-------|----------|--------|---------|
| **aiwork-cwh** | Finalize POL-2025-004: Create Release and Close Workflow | P3 | Open | Finalization |

---

## How to View All Issues

### View sabsa-git Layer Issues
```bash
cd /Users/test/aiwork/sabsa-git
bd list -l sabsa-git --pretty
```

### View Finalization Issue
```bash
cd /Users/test/aiwork
bd list --title "Finalize POL-2025-004"
```

### View All Issues (Both Repositories)
```bash
# From sabsa-git directory
cd /Users/test/aiwork/sabsa-git
bd list -l sabsa-git

# From aiwork directory
cd /Users/test/aiwork
bd list -l sabsa-git
```

---

## Issue Details

### Layer 1: Contextual (sabsa-git-9b2) - P0

**Purpose:** Establish business context and requirements

**Sections:**
- 1-1: Business Process Overview
- 1-2: Business Drivers
- 1-3: Risk Context
- 1-4: Success Criteria
- 1-5: Constraints & Assumptions

**Current State:** Layer 1 PR #14 merged to main

**Definition of Complete:**
- All 5 sections generated with rationale
- Traceability to policy statement
- PR approved and merged ✓
- Cascade to Layer 2 triggered ✓

---

### Layer 2: Conceptual (sabsa-git-u5a) - P0

**Purpose:** Define security architecture and design principles

**Sections:**
- 2-1: Security Objectives
- 2-2: Security Services
- 2-3: Security Principles
- 2-4: Trust Model
- 2-5: Security Architecture Overview

**Dependencies:** Upstream from Layer 1 (sections 1-2, 1-3, 1-4)

**Current State:** Layer 2 PR #15 open for review

**Definition of Complete:**
- All 5 sections with security rationale
- Traceability to Layer 1
- PR approved and merged
- Cascade to Layer 3 triggered

---

### Layer 3: Logical (sabsa-git-dku) - P2

**Purpose:** Transform objectives into formal policies and standards

**Sections:**
- 3-1: Security Policies
- 3-2: Security Standards
- 3-3: Control Specifications
- 3-4: Data Classification
- 3-5: Access Control Requirements

**Dependencies:** Layer 2 completion (sections 2-1, 2-2, 2-3)

**Blocks:** Layer 4 (sabsa-git-or1)

**Framework Mapping:** NIST CSF, ISO 27001, CIS Controls

---

### Layer 4: Physical (sabsa-git-or1) - P2

**Purpose:** Translate policies into implementation specifications

**Sections:**
- 4-1: Implementation Specifications (AWS KMS, HSM)
- 4-2: Procedures (key rotation, incident response)
- 4-3: Technical Standards (TLS cipher suites)
- 4-4: Integration Requirements (API security)
- 4-5: Exception Handling

**Dependencies:** Layer 3 completion (sabsa-git-dku)

**Technology Stack:** AWS KMS, CloudHSM, TLS 1.2+, CloudTrail

---

### Layer 5: Component (sabsa-git-pz9) - P2 ⭐ CRITICAL

**Purpose:** Create tool configurations and validation tests

**Sections:**
- 5-1: Tool Configurations
- 5-2: Infrastructure-as-Code Templates
- 5-3: Validation Tests
- 5-4: Deployment Checklist
- 5-5: **Compliance Validation Specifications** (NEW v1.1 FEATURE)

**Critical Feature:** Hybrid compliance validation
- **Automated Checks:** 3+ Wiz policies with WizQL queries, 2+ AWS Config rules
- **Manual Checks:** JIRA ticket templates with 8+ fields

**Example WizQL Query:**
```
cloudResource where type='AWS RDS Instance' and encryptionEnabled=false
```

**Dependencies:** Layer 4 completion (sections 4-1, 4-2, 4-3)

---

### Layer 6: Operational (sabsa-git-6yb) - P3

**Purpose:** Define day-to-day management and incident response

**Sections:**
- 6-1: Runbooks (key rotation, encryption failure)
- 6-2: Monitoring & Alerting (CloudWatch alarms)
- 6-3: Incident Response Playbooks
- 6-4: Maintenance Procedures
- 6-5: Continuous Improvement

**Dependencies:** Layer 5 completion (sections 5-1, 5-3, 5-4)

**Final Layer:** Triggers finalize workflow on merge

**Success Criteria:**
- 2+ runbooks with 10+ steps
- 5+ CloudWatch alarms with thresholds
- 2+ incident scenarios
- Quarterly maintenance schedule

---

### Finalization (aiwork-cwh) - P3

**Purpose:** Create release artifact and close workflow

**Triggered By:** Layer 6 PR merge to main

**Actions:**
1. Create Git release tag: `release/POL-2025-004-v1.0`
2. Generate consolidated artifacts:
   - Complete policy document (all 6 layers)
   - Traceability matrix
   - Compliance validation summary
   - Implementation checklist
3. Update metadata.json with completion timestamp
4. Close GitHub issue #13
5. Generate release notes

**Success Criteria:**
- Release tag created
- All 6 layers linked in traceability
- Source issue closed
- Artifact validated by schemas

---

## Workflow Execution Order

```
1. Layer 1 (Contextual) - sabsa-git-9b2 [P0] ✓ MERGED
   ↓
2. Layer 2 (Conceptual) - sabsa-git-u5a [P0] → PR #15 open for review
   ↓
3. Layer 3 (Logical) - sabsa-git-dku [P2] → Pending Layer 2 merge
   ↓
4. Layer 4 (Physical) - sabsa-git-or1 [P2] → Blocked by Layer 3
   ↓
5. Layer 5 (Component) - sabsa-git-pz9 [P2] → Includes compliance validation
   ↓
6. Layer 6 (Operational) - sabsa-git-6yb [P3] → Final layer
   ↓
7. Finalize - aiwork-cwh [P3] → Release tag & issue closure
```

---

## Key Features

### Comprehensive Documentation
- Each issue includes 8-12 sections of guidance
- Purpose, background, current state, expected sections
- Clear dependencies and blocking relationships
- Specific acceptance criteria (measurable)
- Technical notes on SABSA concepts and frameworks

### Traceability Design
- Defined relationship types: `implements`, `derives_from`, `constrained_by`, `refines`, `validates`
- Upstream/downstream dependencies explicitly mapped
- Framework integration (NIST CSF, ISO 27001, CIS Controls)

### Workflow Integration
- Current state reflects actual PR status (#14 merged, #15 open)
- Definition of complete includes PR approval and cascade triggers
- Branch naming: `policy/POL-2025-004/layer-{n}-{layer-name}`

### Compliance Validation (v1.1)
- Layer 5 includes automated checks (Wiz, AWS Config, GCP SCC)
- Manual evidence collection (JIRA templates)
- Real WizQL query examples
- Integration with security tools

---

## Commands Reference

### View All sabsa-git Issues
```bash
cd /Users/test/aiwork/sabsa-git
bd list -l sabsa-git
```

### View Specific Layer
```bash
bd show sabsa-git-9b2  # Layer 1
bd show sabsa-git-u5a  # Layer 2
bd show sabsa-git-dku  # Layer 3
bd show sabsa-git-or1  # Layer 4
bd show sabsa-git-pz9  # Layer 5
bd show sabsa-git-6yb  # Layer 6
```

### View Finalization Issue
```bash
cd /Users/test/aiwork
bd show aiwork-cwh
```

### Track Progress
```bash
# Mark Layer 2 as in-progress when starting work
bd update sabsa-git-u5a --status in_progress

# Mark Layer 2 complete when PR merged
bd update sabsa-git-u5a --status closed
```

---

## Next Steps

1. **Review & Approve Layer 2 PR (#15)** → Triggers Layer 3 generation
2. **Sequential Execution** → Each layer merge triggers next layer
3. **Monitor Progress** → Track via BEADS issues and GitHub PRs
4. **Finalization** → Layer 6 merge triggers release creation

**Total Estimated Time:** 2-3 hours of active work (excluding review time)

---

## Files Generated

**BEADS Databases:**
- `/Users/test/aiwork/sabsa-git/.beads/beads.db` (6 layer issues)
- `/Users/test/aiwork/.beads/beads.db` (finalization issue)

**JSONL Sync Files:**
- `/Users/test/aiwork/sabsa-git/.beads/issues.jsonl`
- `/Users/test/aiwork/.beads/issues.jsonl`

All issues are version-controlled and synced to Git for persistent tracking across Claude Code sessions.
