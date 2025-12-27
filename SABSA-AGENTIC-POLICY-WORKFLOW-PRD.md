# SABSA Agentic Policy Workflow — Product Requirements Document

**Version:** 1.0  
**Date:** December 27, 2024  
**Author:** Don Wood  
**Status:** Draft for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [SABSA Framework Context](#4-sabsa-framework-context)
5. [Architectural Decisions](#5-architectural-decisions)
6. [Data Model Specification](#6-data-model-specification)
7. [Workflow Process](#7-workflow-process)
8. [Component Specifications](#8-component-specifications)
9. [Context Assembly & Token Optimization](#9-context-assembly--token-optimization)
10. [Error Handling Strategy](#10-error-handling-strategy)
11. [Implementation Phases](#11-implementation-phases)
12. [Conceptual Walkthrough](#12-conceptual-walkthrough)
13. [Configuration Reference](#13-configuration-reference)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This document specifies the requirements for an automated SABSA (Sherwood Applied Business Security Architecture) policy workflow system. The system accepts security policy statements as input and generates complete, traceable security architecture artifacts across all six SABSA layers, with human review gates at each layer.

### 1.2 Key Outcomes

| Metric | Current State | Target State |
|--------|---------------|--------------|
| Policy-to-runbook cycle time | 3-6 months | < 2 weeks |
| Artifact consistency | Variable | 100% template compliance |
| Traceability coverage | Partial/manual | Complete automated lineage |
| Audit trail completeness | Fragmented | Single source of truth |

### 1.3 Approach Summary

- **Platform:** GitHub Actions with native Pull Request review mechanics
- **AI Engine:** Anthropic Claude (claude-sonnet-4-20250514)
- **Pattern:** GitOps — policy artifacts managed as code
- **Review Model:** One PR per SABSA layer with cascading approval triggers

---

## 2. Problem Statement

### 2.1 Current Challenges

Organizations implementing SABSA frameworks encounter significant friction:

**Manual Artifact Generation**
- Security architects manually create artifacts for each layer
- Inconsistent formatting and depth across artifacts
- Knowledge transfer gaps when architects change roles

**Traceability Gaps**
- Business requirements disconnected from technical controls
- Audit findings require manual reconstruction of decision chains
- No systematic method to prove control coverage

**Process Inefficiency**
- Sequential handoffs between business, architecture, and operations teams
- Review cycles measured in weeks per layer
- Revision loops lack structured feedback mechanisms

**Compliance Burden**
- Auditors request evidence that doesn't exist in structured form
- Framework mapping (NIST, ISO, etc.) done ad-hoc per engagement
- Version control of policy artifacts inconsistent

### 2.2 Business Impact

- Delayed security control implementation
- Increased audit preparation costs
- Risk of control gaps due to incomplete traceability
- Reduced agility in responding to new threats or regulations

---

## 3. Solution Overview

### 3.1 Core Concept

An automated workflow system that:

1. Accepts a security policy statement as input
2. Generates Claude-powered artifacts for each SABSA layer
3. Presents artifacts via GitHub Pull Requests for human review
4. Cascades approved artifacts to downstream layers
5. Maintains complete traceability from business requirement to operational runbook

### 3.2 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Artifacts as Code** | All outputs stored in Git with full version history |
| **Human in the Loop** | Every layer requires explicit PR approval before proceeding |
| **Minimal Context** | Each layer receives only the upstream sections it needs |
| **Structured Traceability** | JSON documents capture all relationships; markdown for content |
| **Graceful Degradation** | Partial results surfaced for human intervention on failures |
| **Familiar UX** | Standard GitHub PR workflow—no custom interfaces |

### 3.3 Scope

**In Scope (POC):**
- SABSA Process Domain (all six layers)
- Single policy workflow execution
- GitHub.com deployment
- Claude Sonnet model

**Out of Scope (Future):**
- SABSA Information, Application, and Infrastructure domains
- Parallel policy processing
- GitHub Enterprise integration
- Multi-model support

---

## 4. SABSA Framework Context

### 4.1 The Six Layers (Process Domain)

| Layer | Prefix | View | Core Question | Primary Output |
|-------|--------|------|---------------|----------------|
| **Contextual** | 1-x | Business | What does the business need? | Business context, risks, success criteria |
| **Conceptual** | 2-x | Architect | What security capabilities? | Security objectives, services, principles, trust model |
| **Logical** | 3-x | Designer | What are the security rules? | Policies, standards, control specifications |
| **Physical** | 4-x | Builder | How will it be implemented? | Procedures, technical standards, integration specs |
| **Component** | 5-x | Tradesman | What specific tools/configs? | Tool configs, IaC templates, validation tests |
| **Operational** | 6-x | Operations | How will it be maintained? | Runbooks, monitoring, incident response playbooks |

### 4.2 Section Definitions by Layer

**Layer 1: Contextual**
| Section | Title | Purpose |
|---------|-------|---------|
| 1-1 | Business Process Overview | Describes the business process this policy protects |
| 1-2 | Business Drivers | Strategic and operational drivers requiring this policy |
| 1-3 | Risk Context | Threats, vulnerabilities, and risk appetite |
| 1-4 | Success Criteria | Measurable outcomes defining policy success |
| 1-5 | Constraints & Assumptions | Boundaries and dependencies |

**Layer 2: Conceptual**
| Section | Title | Purpose |
|---------|-------|---------|
| 2-1 | Security Objectives | What security must achieve |
| 2-2 | Security Services | Capabilities required (e.g., confidentiality, integrity) |
| 2-3 | Security Principles | Guiding tenets for design decisions |
| 2-4 | Trust Model | Trust boundaries and relationships |
| 2-5 | Security Domains | Logical groupings of protected assets |

**Layer 3: Logical**
| Section | Title | Purpose |
|---------|-------|---------|
| 3-1 | Security Policies | Formal policy statements |
| 3-2 | Security Standards | Mandatory requirements |
| 3-3 | Logical Control Specifications | Control requirements without implementation detail |
| 3-4 | Information Classification | Data categorization scheme |
| 3-5 | Logical Access Model | Who can access what under which conditions |

**Layer 4: Physical**
| Section | Title | Purpose |
|---------|-------|---------|
| 4-1 | Control Implementation Specifications | How controls will be technically implemented |
| 4-2 | Security Procedures | Step-by-step operational procedures |
| 4-3 | Technical Standards | Technology-specific requirements |
| 4-4 | Integration Architecture | How components connect |
| 4-5 | Exception Handling | Process for managing policy exceptions |

**Layer 5: Component**
| Section | Title | Purpose |
|---------|-------|---------|
| 5-1 | Tool Configuration Specifications | Specific tool settings and parameters |
| 5-2 | Implementation Scripts | IaC, automation scripts |
| 5-3 | Validation Tests | Test cases proving correct implementation |
| 5-4 | Deployment Checklist | Pre/post deployment verification |
| 5-5 | Rollback Procedures | How to revert if implementation fails |

**Layer 6: Operational**
| Section | Title | Purpose |
|---------|-------|---------|
| 6-1 | Monitoring & Alerting | What to monitor, alert thresholds |
| 6-2 | Operational Runbooks | Day-to-day operational procedures |
| 6-3 | Incident Response Playbooks | How to respond to security events |
| 6-4 | Maintenance Procedures | Scheduled maintenance tasks |
| 6-5 | Metrics & Reporting | KPIs and reporting requirements |
| 6-6 | Continuous Improvement | Feedback loops and improvement process |

### 4.3 Traceability Requirements

Every generated section must include:

1. **Content** — The artifact itself in markdown format
2. **Rationale: Why Suggested** — Reasoning with framework references (NIST, ISO, CIS, etc.)
3. **Rationale: Condition Satisfied** — Explicit statement of which upstream requirement this fulfills
4. **Traceability References** — Structured links to source elements (stored in JSON)

---

## 5. Architectural Decisions

### 5.1 Platform Selection

**Decision:** GitHub Actions with native PR review

**Alternatives Considered:**
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| AWS Step Functions + Lambda | Powerful orchestration, native AWS | Custom review UI required, complex infrastructure | Rejected |
| Azure Logic Apps | Enterprise integration | Vendor lock-in, less familiar to team | Rejected |
| GitHub Actions | Native PR review, familiar workflow, Git audit trail | Less orchestration power | **Selected** |

**Rationale:**
- Treating artifacts as code aligns with GitOps practices
- PR review interface eliminates need for custom approval forms
- Git history provides complete audit trail
- Reduced infrastructure complexity accelerates delivery

### 5.2 AI Model Selection

**Decision:** Claude Sonnet (claude-sonnet-4-20250514)

**Rationale:**
- Optimal balance of capability and cost for structured document generation
- Strong performance on framework-aligned content
- Reliable JSON output with appropriate prompting
- Sufficient context window for layer generation

### 5.3 Content vs. Relationship Separation

**Decision:** Markdown for content, JSON for traceability

**Rationale:**
- Markdown renders natively in GitHub PR diffs
- JSON enables programmatic relationship traversal
- Separation allows independent evolution of content and structure
- Audit tools can query relationships without parsing prose

### 5.4 Context Optimization

**Decision:** Trimmed policy summary + selective upstream sections per layer

**Rationale:**
- Full upstream context exceeds practical token limits by Layer 5-6
- Each layer only needs specific predecessor sections to generate accurate output
- Policy summary (≤150 words) provides consistent anchor without bloat
- Dependency matrix enables predictable token consumption

### 5.5 Action Implementation

**Decision:** JavaScript composite action for Claude integration

**Rationale:**
- Faster execution than Docker-based actions
- Native GitHub Actions toolkit support
- Simpler debugging in CI environment
- Sufficient for API calls and JSON processing

### 5.6 Error Handling Philosophy

**Decision:** Capture partial results and surface in PR for human intervention

**Rationale:**
- Fail-fast loses potentially valid generated content
- Human reviewers can salvage partial outputs
- Error context in PR enables informed manual completion
- Maintains workflow progress visibility

---

## 6. Data Model Specification

### 6.1 Naming Convention

**Pattern:** `{policy-id}.{layer}.{section}`

**Examples:**
- `POL-2025-001.contextual.1-2` — Contextual layer, Business Drivers section
- `POL-2025-001.logical.3-1` — Logical layer, Security Policies section
- `POL-2025-001.summary` — Policy summary document

**Policy ID Format:** `POL-{YYYY}-{NNN}`
- `YYYY` — Four-digit year
- `NNN` — Sequential number, zero-padded

### 6.2 Repository Structure

```
sabsa-policy-workflow/
├── .github/
│   ├── workflows/
│   │   ├── initialize-policy.yml
│   │   ├── generate-layer.yml
│   │   ├── handle-revision.yml
│   │   ├── cascade-next-layer.yml
│   │   └── finalize-policy.yml
│   ├── actions/
│   │   └── call-claude/
│   │       ├── action.yml
│   │       ├── index.js
│   │       └── package.json
│   ├── ISSUE_TEMPLATE/
│   │   └── new-policy.yml
│   └── templates/
│       └── pr-description.md
├── config/
│   ├── layer-dependencies.json
│   ├── layer-sections.json
│   └── relationship-vocabulary.json
├── prompts/
│   ├── system-prompt.md
│   ├── summary-prompt.md
│   ├── contextual-prompt.md
│   ├── conceptual-prompt.md
│   ├── logical-prompt.md
│   ├── physical-prompt.md
│   ├── component-prompt.md
│   └── operational-prompt.md
├── policies/
│   └── {policy-id}/
│       ├── metadata.json
│       ├── summary.md
│       ├── input/
│       │   └── policy-statement.md
│       ├── contextual/
│       │   ├── sections.json
│       │   └── traceability.json
│       ├── conceptual/
│       │   ├── sections.json
│       │   └── traceability.json
│       ├── logical/
│       │   ├── sections.json
│       │   └── traceability.json
│       ├── physical/
│       │   ├── sections.json
│       │   └── traceability.json
│       ├── component/
│       │   ├── sections.json
│       │   └── traceability.json
│       └── operational/
│           ├── sections.json
│           └── traceability.json
└── archive/
    └── {rejected-policy-id}/
```

### 6.3 Metadata Schema

**File:** `policies/{policy-id}/metadata.json`

```json
{
  "policyId": "POL-2025-001",
  "title": "Customer PII Encryption Policy",
  "createdAt": "2025-01-15T10:30:00Z",
  "createdBy": "github-username",
  "sourceIssue": 42,
  "status": "in-progress",
  "currentLayer": "logical",
  "layerStatus": {
    "contextual": {"status": "approved", "prNumber": 101, "mergedAt": "2025-01-15T14:00:00Z"},
    "conceptual": {"status": "approved", "prNumber": 102, "mergedAt": "2025-01-16T09:30:00Z"},
    "logical": {"status": "pending-review", "prNumber": 103, "createdAt": "2025-01-16T10:00:00Z"},
    "physical": {"status": "not-started"},
    "component": {"status": "not-started"},
    "operational": {"status": "not-started"}
  },
  "completedAt": null,
  "releaseTag": null
}
```

### 6.4 Sections Schema

**File:** `policies/{policy-id}/{layer}/sections.json`

```json
{
  "policyId": "POL-2025-001",
  "layer": "logical",
  "version": 1,
  "generatedAt": "2025-01-16T10:00:00Z",
  "generationStatus": "complete",
  "sections": {
    "3-1": {
      "title": "Security Policies",
      "content": "## 3.1 Security Policies\n\n### 3.1.1 Data Encryption Policy\n\nAll customer personally identifiable information (PII) shall be encrypted...",
      "rationale_why": "NIST SP 800-53 SC-28 (Protection of Information at Rest) mandates encryption for sensitive data. ISO 27001 A.10.1.1 requires cryptographic controls policy.",
      "rationale_condition": "Satisfies Security Objective 2-1 requirement for data confidentiality and Security Service 2-2 encryption capability."
    },
    "3-2": {
      "title": "Security Standards",
      "content": "## 3.2 Security Standards\n\n### 3.2.1 Encryption Standards\n\n**Algorithm Requirements:**\n- Symmetric: AES-256-GCM...",
      "rationale_why": "NIST SP 800-175B recommends AES-256 for data at rest. PCI DSS 4.0 Requirement 3.5.1 specifies strong cryptography standards.",
      "rationale_condition": "Implements Security Principle 2-3 (Defense in Depth) through layered cryptographic controls."
    }
  },
  "errors": []
}
```

**Partial Result Example (on generation failure):**

```json
{
  "policyId": "POL-2025-001",
  "layer": "logical",
  "version": 1,
  "generatedAt": "2025-01-16T10:00:00Z",
  "generationStatus": "partial",
  "sections": {
    "3-1": {
      "title": "Security Policies",
      "content": "## 3.1 Security Policies\n\n...",
      "rationale_why": "...",
      "rationale_condition": "..."
    },
    "3-2": {
      "title": "Security Standards",
      "content": null,
      "rationale_why": null,
      "rationale_condition": null
    }
  },
  "errors": [
    {
      "section": "3-2",
      "errorType": "parse_failure",
      "message": "JSON parse error at position 4521: unexpected end of input",
      "rawContent": "## 3.2 Security Standards\n\n### 3.2.1 Encryption Stand..."
    }
  ]
}
```

### 6.5 Traceability Schema

**File:** `policies/{policy-id}/{layer}/traceability.json`

```json
{
  "policyId": "POL-2025-001",
  "layer": "logical",
  "version": 1,
  "generatedAt": "2025-01-16T10:00:00Z",
  "references": {
    "3-1": [
      {
        "source": "POL-2025-001.conceptual.2-1",
        "relationship": "implements",
        "description": "Implements confidentiality objective for customer PII"
      },
      {
        "source": "POL-2025-001.conceptual.2-2",
        "relationship": "derives_from",
        "description": "Derives encryption requirements from cryptographic services capability"
      }
    ],
    "3-2": [
      {
        "source": "POL-2025-001.conceptual.2-3",
        "relationship": "constrained_by",
        "description": "Standards constrained by defense-in-depth principle"
      }
    ],
    "3-3": [
      {
        "source": "POL-2025-001.conceptual.2-1",
        "relationship": "implements"
      },
      {
        "source": "POL-2025-001.conceptual.2-4",
        "relationship": "constrained_by",
        "description": "Control specifications bounded by trust model boundaries"
      }
    ]
  }
}
```

### 6.6 Relationship Vocabulary

**File:** `config/relationship-vocabulary.json`

```json
{
  "relationships": [
    {
      "id": "implements",
      "label": "Implements",
      "definition": "Directly realizes or fulfills an upstream requirement",
      "typicalDirection": "downstream → upstream",
      "examples": ["Logical control implements Conceptual objective", "Component config implements Physical specification"]
    },
    {
      "id": "derives_from",
      "label": "Derives From",
      "definition": "Logically follows from or is based on upstream element",
      "typicalDirection": "any downstream → any upstream",
      "examples": ["Physical procedure derives from Logical standard", "Operational runbook derives from Component deployment"]
    },
    {
      "id": "constrained_by",
      "label": "Constrained By",
      "definition": "Bounded or limited by upstream constraint or boundary",
      "typicalDirection": "downstream → upstream",
      "examples": ["Physical implementation constrained by Logical policy", "Component config constrained by trust boundary"]
    },
    {
      "id": "refines",
      "label": "Refines",
      "definition": "Adds implementation detail to upstream element",
      "typicalDirection": "downstream → immediate upstream",
      "examples": ["Component script refines Physical procedure", "Physical spec refines Logical control"]
    },
    {
      "id": "validates",
      "label": "Validates",
      "definition": "Provides verification or proof of upstream element",
      "typicalDirection": "downstream → upstream",
      "examples": ["Component test validates Physical specification", "Operational metric validates Control effectiveness"]
    }
  ]
}
```

---

## 7. Workflow Process

### 7.1 End-to-End Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SABSA POLICY WORKFLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │  GitHub Issue │
     │  (new-policy) │
     └──────┬───────┘
            │
            ▼
┌───────────────────────┐
│  INITIALIZE WORKFLOW  │
│  ─────────────────────│
│  • Generate policy ID │
│  • Create folder tree │
│  • Store policy text  │
│  • Generate summary   │
│  • Commit to main     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐      ┌─────────────────────┐
│  GENERATE WORKFLOW    │      │   REVISION WORKFLOW │
│  (Layer 1: Contextual)│◄─────│   ─────────────────│
│  ─────────────────────│      │   • Parse PR review │
│  • Load dependencies  │      │   • Extract feedback│
│  • Assemble prompt    │      │   • Regenerate layer│
│  • Call Claude API    │      │   • Update PR branch│
│  • Parse response     │      └─────────────────────┘
│  • Write sections.json│                ▲
│  • Write trace.json   │                │
│  • Create PR branch   │                │ changes_requested
│  • Open Pull Request  │                │
└───────────┬───────────┘                │
            │                            │
            ▼                            │
     ┌──────────────┐                    │
     │  HUMAN       │────────────────────┘
     │  REVIEW      │
     │  (GitHub PR) │
     └──────┬───────┘
            │ approved + merged
            ▼
┌───────────────────────┐
│  CASCADE WORKFLOW     │
│  ─────────────────────│
│  • Detect merged PR   │
│  • Identify next layer│
│  • Trigger generate   │
└───────────┬───────────┘
            │
            │ (repeat for layers 2-6)
            ▼
┌───────────────────────┐
│  FINALIZE WORKFLOW    │
│  ─────────────────────│
│  • All layers merged  │
│  • Update metadata    │
│  • Create release tag │
│  • Close source issue │
└───────────────────────┘
```

### 7.2 Initialize Workflow

**Trigger:** 
- Issue opened with `new-policy` label
- Manual `workflow_dispatch` with `policy-text` input

**Inputs:**
| Input | Source | Required |
|-------|--------|----------|
| Policy title | Issue title or dispatch input | Yes |
| Policy statement | Issue body or dispatch input | Yes |
| Requested reviewer | Issue form field | No |

**Process:**

1. **Generate Policy ID**
   - Query existing policies for highest sequence number
   - Increment and format: `POL-{YYYY}-{NNN}`

2. **Create Folder Structure**
   ```
   policies/{policy-id}/
   ├── metadata.json
   ├── input/
   │   └── policy-statement.md
   ├── contextual/
   ├── conceptual/
   ├── logical/
   ├── physical/
   ├── component/
   └── operational/
   ```

3. **Store Policy Statement**
   - Write original text to `input/policy-statement.md`
   - Initialize `metadata.json` with status `in-progress`

4. **Generate Summary**
   - Call Claude with summary generation prompt
   - Target: ≤150 words capturing policy intent and key requirements
   - Write to `summary.md`

5. **Commit to Main**
   - Single commit with message: `[{policy-id}] Initialize policy: {title}`

6. **Trigger Layer 1**
   - Call `generate-layer.yml` with `layer=contextual`

**Outputs:**
- Policy folder structure on main branch
- `metadata.json` initialized
- `summary.md` generated
- Layer 1 generation triggered

### 7.3 Generate Workflow

**Trigger:**
- `workflow_call` from initialize, cascade, or revision workflows
- Manual `workflow_dispatch` with `policy-id` and `layer` inputs

**Inputs:**
| Input | Type | Required |
|-------|------|----------|
| policy-id | string | Yes |
| layer | enum (contextual, conceptual, logical, physical, component, operational) | Yes |
| revision-context | string (JSON) | No — only from revision workflow |

**Process:**

1. **Load Configuration**
   - Read `config/layer-dependencies.json` for required upstream sections
   - Read `config/layer-sections.json` for expected output structure

2. **Assemble Context**
   - Load `policies/{policy-id}/summary.md`
   - For each required upstream section:
     - Load from `policies/{policy-id}/{upstream-layer}/sections.json`
     - Extract specified section content
   - Load layer-specific prompt from `prompts/{layer}-prompt.md`

3. **Build Prompt**
   ```
   [System Prompt]
   [Policy Summary]
   [Upstream Context - Selected Sections Only]
   [Layer-Specific Instructions]
   [Output Schema Definition]
   [Revision Feedback - if applicable]
   ```

4. **Call Claude Action**
   - Invoke `.github/actions/call-claude`
   - Pass assembled prompt
   - Receive structured JSON response

5. **Process Response**
   - Parse JSON into sections
   - Validate all expected sections present
   - Extract traceability references
   - Handle partial results if validation fails

6. **Write Artifacts**
   - Write `policies/{policy-id}/{layer}/sections.json`
   - Write `policies/{policy-id}/{layer}/traceability.json`
   - Update `metadata.json` layer status

7. **Create Branch**
   - Branch name: `policy/{policy-id}/layer-{n}-{layer-name}`
   - Example: `policy/POL-2025-001/layer-3-logical`

8. **Open Pull Request**
   - Target: `main`
   - Title: `[{policy-id}] Layer {n}: {layer-name}`
   - Body: Rendered from `.github/templates/pr-description.md`
   - Labels: `sabsa-artifact`, `layer-{n}`, optionally `needs-manual-review` if partial
   - Assignee: Requested reviewer from metadata (if specified)

**Outputs:**
- Branch with layer artifacts
- Pull Request for review
- Updated metadata

### 7.4 Human Review (Native GitHub PR)

**Review Interface:**

Reviewers use standard GitHub PR features:
- **Files Changed:** Side-by-side diff of `sections.json` and `traceability.json`
- **Inline Comments:** Comment on specific lines of generated content
- **General Comments:** Provide overall feedback
- **Review Decision:**
  - **Approve:** Signal acceptance
  - **Request Changes:** Trigger revision workflow
  - **Comment:** Provide feedback without blocking

**Review Checklist (in PR description):**

```markdown
### Review Checklist

- [ ] All sections are complete and coherent
- [ ] Rationale references appropriate frameworks (NIST, ISO, etc.)
- [ ] Traceability links to correct upstream elements
- [ ] Content aligns with organizational context
- [ ] No sensitive information exposed
- [ ] Technical accuracy verified
```

**Decision Outcomes:**

| Decision | Trigger | Result |
|----------|---------|--------|
| Approve + Merge | Reviewer approves, PR merged | Cascade workflow triggers next layer |
| Request Changes | Reviewer requests changes | Revision workflow triggered |
| Close without Merge | Reviewer closes PR | Policy workflow halted; manual intervention required |

### 7.5 Revision Workflow

**Trigger:** 
- `pull_request_review` event with `changes_requested` action

**Process:**

1. **Extract Review Feedback**
   - Fetch all review comments from PR
   - Fetch inline comments with file/line context
   - Structure as revision context JSON

2. **Build Revision Context**
   ```json
   {
     "generalFeedback": ["Comment 1", "Comment 2"],
     "sectionFeedback": {
       "3-1": ["Inline comment on line 45", "Suggestion for 3.1.2"],
       "3-2": ["Requested more detail on key rotation"]
     }
   }
   ```

3. **Trigger Regeneration**
   - Call `generate-layer.yml` with same `policy-id` and `layer`
   - Include `revision-context` with structured feedback

4. **Update Branch**
   - Force-push updated artifacts to existing branch
   - PR automatically updated with new diff

5. **Notify Reviewer**
   - GitHub notification via PR update
   - Optional: Comment on PR indicating revision complete

**Constraints:**
- Maximum 3 revision cycles before requiring manual intervention
- Revision counter tracked in `metadata.json`

### 7.6 Cascade Workflow

**Trigger:**
- `pull_request` event with `closed` action where `merged == true`
- Branch matches pattern `policy/*/layer-*`

**Process:**

1. **Identify Completed Layer**
   - Parse branch name for policy ID and layer
   - Verify merge was to `main`

2. **Determine Next Layer**
   - Layer progression: contextual → conceptual → logical → physical → component → operational
   - If current layer is operational, trigger finalize instead

3. **Update Metadata**
   - Set completed layer status to `approved`
   - Record PR number and merge timestamp
   - Set next layer status to `in-progress`

4. **Trigger Next Layer**
   - Call `generate-layer.yml` with next layer
   - Pass same `policy-id`

### 7.7 Finalize Workflow

**Trigger:**
- Cascade workflow detects operational layer merge

**Process:**

1. **Update Metadata**
   - Set policy status to `completed`
   - Record completion timestamp
   - Set all layer statuses to `approved`

2. **Create Release**
   - Tag: `policy/{policy-id}/v1.0`
   - Release title: `{policy-title} - Complete`
   - Release body: Summary of all layers with PR links

3. **Close Source Issue**
   - Add comment with completion summary
   - Link to release
   - Close issue

4. **Generate Consolidated Artifact (Optional)**
   - Compile all layer markdown into single document
   - Generate traceability matrix report
   - Attach to release

---

## 8. Component Specifications

### 8.1 Claude Composite Action

**Location:** `.github/actions/call-claude/`

**Files:**
```
call-claude/
├── action.yml      # Action metadata
├── index.js        # Main logic
├── package.json    # Dependencies
└── README.md       # Usage documentation
```

**action.yml:**
```yaml
name: 'Call Claude API'
description: 'Generate SABSA artifacts using Anthropic Claude'

inputs:
  prompt:
    description: 'Assembled prompt text'
    required: true
  anthropic-api-key:
    description: 'Anthropic API key'
    required: true
  max-retries:
    description: 'Maximum retry attempts on failure'
    required: false
    default: '2'
  expected-sections:
    description: 'JSON array of expected section IDs'
    required: true

outputs:
  result:
    description: 'Parsed JSON response'
  success:
    description: 'Whether generation fully succeeded'
  error-message:
    description: 'Error details if failed'
  partial-result:
    description: 'Parseable content if partial failure'

runs:
  using: 'node20'
  main: 'index.js'
```

**Core Logic (index.js outline):**

```javascript
// Pseudocode structure
async function run() {
  // 1. Get inputs
  const prompt = getInput('prompt');
  const apiKey = getInput('anthropic-api-key');
  const maxRetries = parseInt(getInput('max-retries'));
  const expectedSections = JSON.parse(getInput('expected-sections'));
  
  // 2. Call Anthropic API with retry logic
  let response;
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      response = await callAnthropic(prompt, apiKey);
      break;
    } catch (error) {
      if (isRateLimitError(error)) {
        await exponentialBackoff(attempt);
        attempt++;
      } else {
        throw error;
      }
    }
  }
  
  // 3. Parse JSON response
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch (parseError) {
    // Attempt to extract partial content
    const partial = extractPartialContent(response.content);
    setOutput('success', 'false');
    setOutput('partial-result', JSON.stringify(partial));
    setOutput('error-message', `JSON parse failed: ${parseError.message}`);
    return;
  }
  
  // 4. Validate expected sections
  const missingSections = validateSections(parsed, expectedSections);
  if (missingSections.length > 0) {
    setOutput('success', 'false');
    setOutput('partial-result', JSON.stringify(parsed));
    setOutput('error-message', `Missing sections: ${missingSections.join(', ')}`);
    return;
  }
  
  // 5. Output success
  setOutput('success', 'true');
  setOutput('result', JSON.stringify(parsed));
}
```

**API Call Parameters:**
```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 8000,
  messages: [
    { role: "user", content: assembledPrompt }
  ],
  // Request structured JSON output
  system: systemPrompt
}
```

### 8.2 Workflow Files

**initialize-policy.yml:**
```yaml
name: Initialize Policy

on:
  issues:
    types: [opened]
  workflow_dispatch:
    inputs:
      policy-title:
        description: 'Policy title'
        required: true
      policy-text:
        description: 'Full policy statement'
        required: true

jobs:
  initialize:
    runs-on: ubuntu-latest
    if: github.event_name == 'workflow_dispatch' || contains(github.event.issue.labels.*.name, 'new-policy')
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate Policy ID
        id: policy-id
        run: |
          # Logic to generate POL-YYYY-NNN
          
      - name: Create Folder Structure
        run: |
          # Create directories and initial files
          
      - name: Generate Summary
        uses: ./.github/actions/call-claude
        with:
          prompt: ${{ steps.build-summary-prompt.outputs.prompt }}
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          expected-sections: '["summary"]'
          
      - name: Commit to Main
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add policies/${{ steps.policy-id.outputs.id }}
          git commit -m "[${{ steps.policy-id.outputs.id }}] Initialize policy"
          git push
          
      - name: Trigger Layer 1
        uses: ./.github/workflows/generate-layer.yml
        with:
          policy-id: ${{ steps.policy-id.outputs.id }}
          layer: contextual
```

**generate-layer.yml:**
```yaml
name: Generate Layer

on:
  workflow_call:
    inputs:
      policy-id:
        required: true
        type: string
      layer:
        required: true
        type: string
      revision-context:
        required: false
        type: string
  workflow_dispatch:
    inputs:
      policy-id:
        description: 'Policy ID (e.g., POL-2025-001)'
        required: true
      layer:
        description: 'Layer to generate'
        required: true
        type: choice
        options:
          - contextual
          - conceptual
          - logical
          - physical
          - component
          - operational

jobs:
  generate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Load Dependencies Config
        id: deps
        run: |
          # Read layer-dependencies.json
          # Output required upstream sections
          
      - name: Assemble Context
        id: context
        run: |
          # Load summary.md
          # Load required upstream sections
          # Build combined context
          
      - name: Build Prompt
        id: prompt
        run: |
          # Combine system prompt + context + layer instructions
          
      - name: Call Claude
        id: claude
        uses: ./.github/actions/call-claude
        with:
          prompt: ${{ steps.prompt.outputs.prompt }}
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          expected-sections: ${{ steps.deps.outputs.expected-sections }}
          
      - name: Process Response
        run: |
          # Parse sections and traceability
          # Write to policy folder
          
      - name: Create Branch and PR
        run: |
          # Create branch: policy/{id}/layer-{n}-{name}
          # Commit artifacts
          # Open PR with template
```

### 8.3 Issue Template

**File:** `.github/ISSUE_TEMPLATE/new-policy.yml`

```yaml
name: New Security Policy
description: Submit a new security policy for SABSA artifact generation
title: "[Policy] "
labels: ["new-policy"]

body:
  - type: markdown
    attributes:
      value: |
        ## New Security Policy Submission
        
        This form initiates the automated SABSA policy workflow. Your policy statement will be processed through all six SABSA layers with human review at each stage.

  - type: input
    id: policy-title
    attributes:
      label: Policy Title
      description: A concise title for this policy
      placeholder: e.g., Customer PII Encryption Policy
    validations:
      required: true

  - type: textarea
    id: policy-statement
    attributes:
      label: Policy Statement
      description: |
        The complete policy statement. Include:
        - What must be protected
        - Required security controls
        - Compliance requirements
        - Any specific technical requirements
      placeholder: |
        All customer PII must be encrypted at rest using AES-256 and in transit using TLS 1.2 or higher...
    validations:
      required: true

  - type: textarea
    id: business-context
    attributes:
      label: Business Context (Optional)
      description: Additional context about why this policy is needed
      placeholder: |
        This policy supports our SOC 2 certification requirements and addresses findings from the Q3 security assessment...
    validations:
      required: false

  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: How urgent is this policy implementation?
      options:
        - Normal
        - High
        - Critical
    validations:
      required: true

  - type: input
    id: reviewer
    attributes:
      label: Requested Reviewer (Optional)
      description: GitHub username of preferred reviewer
      placeholder: "@username"
    validations:
      required: false
```

### 8.4 PR Description Template

**File:** `.github/templates/pr-description.md`

```markdown
## SABSA Artifact: {{layer_display}} Layer

**Policy ID:** {{policy_id}}
**Layer:** {{layer_number}} of 6 — {{layer_name}}
**Generated:** {{timestamp}}
**Status:** {{generation_status}}

---

### Policy Summary

> {{policy_summary}}

---

### Layer Progress

{{#each layer_status}}
- [{{#if completed}}x{{else}} {{/if}}] **{{name}}** {{#if pr_link}}([PR #{{pr_number}}]({{pr_link}})){{/if}}{{#if current}} ← **This PR**{{/if}}
{{/each}}

---

### Sections Generated

| Section | Title | Status | Traces To |
|---------|-------|--------|-----------|
{{#each sections}}
| {{id}} | {{title}} | {{status}} | {{traces_summary}} |
{{/each}}

---

### Review Checklist

- [ ] All sections are complete and coherent
- [ ] Rationale references appropriate frameworks
- [ ] Traceability links to correct upstream elements
- [ ] Content aligns with organizational context
- [ ] Technical accuracy verified

---

### Review Actions

| Action | Result |
|--------|--------|
| **Approve & Merge** | Triggers generation of next layer |
| **Request Changes** | Triggers automated revision with your feedback |
| **Close PR** | Halts policy workflow (requires manual restart) |

---

{{#if has_errors}}
### ⚠️ Generation Issues

The following issues were encountered during generation:

{{#each errors}}
**Section {{section}}:** {{error_type}}
```
{{message}}
```
{{/each}}

Manual review and completion may be required for flagged sections.
{{/if}}

---

<details>
<summary><strong>Section Rationale (expand for details)</strong></summary>

{{#each sections}}
#### Section {{id}}: {{title}}

**Why Suggested:**
{{rationale_why}}

**Condition Satisfied:**
{{rationale_condition}}

**Traceability:**
{{#each traces}}
- `{{source}}` ({{relationship}}){{#if description}}: {{description}}{{/if}}
{{/each}}

---

{{/each}}
</details>

---

<details>
<summary><strong>Upstream Context Used</strong></summary>

The following upstream sections were provided as context for this generation:

{{#each upstream_context}}
- `{{section_id}}`: {{section_title}}
{{/each}}

</details>
```

---

## 9. Context Assembly & Token Optimization

### 9.1 Design Rationale

Passing full upstream artifacts to each layer creates two problems:

1. **Token Consumption:** By Layer 6, cumulative context would exceed practical limits
2. **Signal Noise:** Layers receive information they don't need, potentially confusing generation

**Solution:** Selective context assembly based on explicit dependency mapping.

### 9.2 Layer Dependency Matrix

| Layer | Always Receives | Upstream Sections Required |
|-------|-----------------|---------------------------|
| **Contextual** | `summary.md` | None (first layer) |
| **Conceptual** | `summary.md` | `1-2` (Business Drivers), `1-3` (Risk Context), `1-4` (Success Criteria) |
| **Logical** | `summary.md` | `2-1` (Security Objectives), `2-2` (Security Services), `2-3` (Security Principles) |
| **Physical** | `summary.md` | `3-1` (Security Policies), `3-2` (Security Standards), `3-3` (Control Specs), `2-4` (Trust Model) |
| **Component** | `summary.md` | `4-1` (Implementation Specs), `4-2` (Procedures), `4-3` (Technical Standards) |
| **Operational** | `summary.md` | `5-1` (Tool Configs), `5-3` (Validation Tests), `5-4` (Deployment Checklist), `4-5` (Exception Handling) |

### 9.3 Configuration File

**File:** `config/layer-dependencies.json`

```json
{
  "layers": {
    "contextual": {
      "displayName": "Contextual",
      "number": 1,
      "receives": {
        "summary": true,
        "sections": []
      },
      "outputs": ["1-1", "1-2", "1-3", "1-4", "1-5"]
    },
    "conceptual": {
      "displayName": "Conceptual",
      "number": 2,
      "receives": {
        "summary": true,
        "sections": [
          {"layer": "contextual", "section": "1-2"},
          {"layer": "contextual", "section": "1-3"},
          {"layer": "contextual", "section": "1-4"}
        ]
      },
      "outputs": ["2-1", "2-2", "2-3", "2-4", "2-5"]
    },
    "logical": {
      "displayName": "Logical",
      "number": 3,
      "receives": {
        "summary": true,
        "sections": [
          {"layer": "conceptual", "section": "2-1"},
          {"layer": "conceptual", "section": "2-2"},
          {"layer": "conceptual", "section": "2-3"}
        ]
      },
      "outputs": ["3-1", "3-2", "3-3", "3-4", "3-5"]
    },
    "physical": {
      "displayName": "Physical",
      "number": 4,
      "receives": {
        "summary": true,
        "sections": [
          {"layer": "logical", "section": "3-1"},
          {"layer": "logical", "section": "3-2"},
          {"layer": "logical", "section": "3-3"},
          {"layer": "conceptual", "section": "2-4"}
        ]
      },
      "outputs": ["4-1", "4-2", "4-3", "4-4", "4-5"]
    },
    "component": {
      "displayName": "Component",
      "number": 5,
      "receives": {
        "summary": true,
        "sections": [
          {"layer": "physical", "section": "4-1"},
          {"layer": "physical", "section": "4-2"},
          {"layer": "physical", "section": "4-3"}
        ]
      },
      "outputs": ["5-1", "5-2", "5-3", "5-4", "5-5"]
    },
    "operational": {
      "displayName": "Operational",
      "number": 6,
      "receives": {
        "summary": true,
        "sections": [
          {"layer": "component", "section": "5-1"},
          {"layer": "component", "section": "5-3"},
          {"layer": "component", "section": "5-4"},
          {"layer": "physical", "section": "4-5"}
        ]
      },
      "outputs": ["6-1", "6-2", "6-3", "6-4", "6-5", "6-6"]
    }
  }
}
```

### 9.4 Token Budget Estimates

**Assumptions:**
- Policy summary: ~200 tokens
- Average section: ~500 tokens
- System prompt: ~800 tokens
- Layer-specific prompt: ~400 tokens
- Output buffer: ~4000 tokens

**Per-Layer Input Estimates:**

| Layer | Summary | Upstream Sections | Prompts | Total Input |
|-------|---------|-------------------|---------|-------------|
| Contextual | 200 | 0 | 1200 | ~1,400 |
| Conceptual | 200 | 1500 (3 sections) | 1200 | ~2,900 |
| Logical | 200 | 1500 (3 sections) | 1200 | ~2,900 |
| Physical | 200 | 2000 (4 sections) | 1200 | ~3,400 |
| Component | 200 | 1500 (3 sections) | 1200 | ~2,900 |
| Operational | 200 | 2000 (4 sections) | 1200 | ~3,400 |

**Conclusion:** All layers well within Claude's context window with room for output generation.

---

## 10. Error Handling Strategy

### 10.1 Error Categories

| Category | Examples | Handling |
|----------|----------|----------|
| **API Failure** | Rate limit, timeout, 5xx errors | Retry with exponential backoff (max 3 attempts) |
| **Parse Failure** | Malformed JSON, incomplete response | Extract partial content, flag for review |
| **Validation Failure** | Missing sections, invalid traceability | Include valid sections, mark missing as errors |
| **Workflow Failure** | Git conflicts, permission errors | Fail workflow, alert maintainer |

### 10.2 Retry Logic

```javascript
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  retryableErrors: ['rate_limit', 'timeout', 'server_error']
};

async function callWithRetry(fn) {
  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!RETRY_CONFIG.retryableErrors.includes(error.type)) {
        throw error;
      }
      if (attempt === RETRY_CONFIG.maxAttempts - 1) {
        throw error;
      }
      const delay = Math.min(
        RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
        RETRY_CONFIG.maxDelayMs
      );
      await sleep(delay);
    }
  }
}
```

### 10.3 Partial Result Handling

When generation produces partial results:

1. **Extract Valid Content**
   - Parse whatever JSON is valid
   - Identify complete sections
   - Mark incomplete sections with `null` content

2. **Preserve Raw Output**
   - Store raw Claude response in error details
   - Enable manual recovery of content

3. **Surface in PR**
   - Add `needs-manual-review` label
   - Include error details in PR description
   - Clearly mark which sections need attention

4. **Enable Manual Completion**
   - Reviewer can edit `sections.json` directly
   - Push changes to PR branch
   - Re-request review when complete

### 10.4 Revision Limits

To prevent infinite revision loops:

- Maximum 3 automated revision attempts per layer
- After limit reached:
  - Add label `revision-limit-reached`
  - Comment on PR with guidance
  - Require manual intervention

---

## 11. Implementation Phases

### Phase 1: Core Workflow (Week 1-2)

**Deliverables:**
- [ ] Repository structure and config files
- [ ] Claude composite action (JavaScript)
- [ ] Initialize workflow (with summary generation)
- [ ] Generate workflow (single layer, manual trigger)
- [ ] Basic PR creation

**Exit Criteria:**
- Can manually trigger generation for any layer
- Claude action successfully calls API and parses response
- PRs created with correct structure

**Testing:**
- Use test policy from Section 12
- Verify each layer generates independently
- Validate JSON schemas

### Phase 2: Review Integration (Week 3)

**Deliverables:**
- [ ] Cascade workflow (PR merge → next layer)
- [ ] Revision workflow (parse comments, regenerate)
- [ ] Issue template for policy input
- [ ] PR description template (full)

**Exit Criteria:**
- End-to-end flow from issue to Layer 3
- Revision cycle works (request changes → regenerate)
- Cascade triggers automatically on merge

**Testing:**
- Full flow test with human reviewer
- Verify revision feedback incorporated
- Test cascade for first 3 layers

### Phase 3: Completion & Polish (Week 4)

**Deliverables:**
- [ ] Finalize workflow (release tagging)
- [ ] Full 6-layer cascade testing
- [ ] Error handling refinement
- [ ] Branch protection rules
- [ ] Documentation and runbook

**Exit Criteria:**
- Complete policy can flow through all 6 layers
- Error scenarios handled gracefully
- Documentation complete

**Testing:**
- End-to-end test: issue → release
- Error injection testing
- Multiple concurrent policies

---

## 12. Conceptual Walkthrough

This section provides a complete walkthrough using the sample policy from the design document.

### 12.1 Sample Policy Statement

> "All customer PII must be encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Encryption keys must be rotated every 90 days and stored in a hardware security module. Access to encryption keys requires multi-factor authentication and must be logged for audit purposes."

### 12.2 Step-by-Step Execution

#### Step 1: Policy Submission

**User Action:** Creates GitHub issue using `new-policy` template

```
Title: [Policy] Customer PII Encryption Policy

Policy Statement:
All customer PII must be encrypted at rest using AES-256 and in transit 
using TLS 1.2 or higher. Encryption keys must be rotated every 90 days 
and stored in a hardware security module. Access to encryption keys 
requires multi-factor authentication and must be logged for audit purposes.

Business Context:
Supports SOC 2 Type II certification and GDPR Article 32 compliance requirements.
Addresses findings from Q3 penetration test regarding data-at-rest encryption gaps.

Priority: High
```

**System Response:** Issue created with `new-policy` label → Initialize workflow triggers

---

#### Step 2: Initialization

**Workflow:** `initialize-policy.yml`

**Actions:**
1. Generates ID: `POL-2025-001`
2. Creates folder structure
3. Calls Claude for summary generation

**Generated Summary (summary.md):**

> This policy mandates comprehensive encryption for customer personally identifiable information (PII). Key requirements include AES-256 encryption at rest, TLS 1.2+ in transit, HSM-based key storage, 90-day key rotation, MFA for key access, and complete audit logging. The policy supports SOC 2 and GDPR compliance obligations.

4. Commits to main
5. Triggers Layer 1 generation

---

#### Step 3: Layer 1 — Contextual

**Workflow:** `generate-layer.yml` with `layer=contextual`

**Context Assembled:**
- `summary.md` (200 tokens)
- System prompt (800 tokens)
- Contextual layer prompt (400 tokens)

**Claude Generates:**

```json
{
  "sections": {
    "1-1": {
      "title": "Business Process Overview",
      "content": "## 1.1 Business Process Overview\n\nThis policy governs the protection of customer personally identifiable information (PII) across all data processing activities...",
      "rationale_why": "NIST Privacy Framework requires understanding of data processing context before implementing controls.",
      "rationale_condition": "Establishes scope for encryption policy as stated in policy summary."
    },
    "1-2": {
      "title": "Business Drivers",
      "content": "## 1.2 Business Drivers\n\n### Regulatory Compliance\n- **SOC 2 Type II:** Trust Services Criteria CC6.1 requires encryption of confidential information\n- **GDPR Article 32:** Mandates appropriate technical measures including encryption...",
      "rationale_why": "ISO 27001 A.18.1.1 requires identification of applicable legislation.",
      "rationale_condition": "Directly addresses business context stating SOC 2 and GDPR requirements."
    }
    // ... sections 1-3, 1-4, 1-5
  }
}
```

**PR Created:** `[POL-2025-001] Layer 1: Contextual`

**Branch:** `policy/POL-2025-001/layer-1-contextual`

---

#### Step 4: Human Review — Layer 1

**Reviewer Action:** Opens PR, reviews generated content

**Review Comments:**
- "Section 1-3 should mention the Q3 penetration test finding specifically"
- Adds inline comment on 1-2: "Include PCI DSS reference for payment data"

**Decision:** Request Changes

---

#### Step 5: Revision — Layer 1

**Workflow:** `handle-revision.yml`

**Revision Context Built:**
```json
{
  "generalFeedback": [
    "Section 1-3 should mention the Q3 penetration test finding specifically"
  ],
  "sectionFeedback": {
    "1-2": ["Include PCI DSS reference for payment data"]
  }
}
```

**Claude Regenerates** with feedback incorporated:
- Section 1-2 now includes: "**PCI DSS 4.0:** Requirement 3.5 mandates strong cryptography for stored cardholder data"
- Section 1-3 now includes: "The Q3 penetration test identified gaps in data-at-rest encryption for customer databases..."

**PR Updated** with new commit

---

#### Step 6: Approval — Layer 1

**Reviewer Action:** Reviews revision, approves and merges PR

**Cascade Triggered:** `cascade-next-layer.yml` detects merge → triggers Layer 2

---

#### Step 7: Layer 2 — Conceptual

**Workflow:** `generate-layer.yml` with `layer=conceptual`

**Context Assembled:**
- `summary.md` (200 tokens)
- Section `1-2` Business Drivers (500 tokens)
- Section `1-3` Risk Context (500 tokens)
- Section `1-4` Success Criteria (500 tokens)
- System + conceptual prompts (1200 tokens)

**Claude Generates:**

```json
{
  "sections": {
    "2-1": {
      "title": "Security Objectives",
      "content": "## 2.1 Security Objectives\n\n### 2.1.1 Data Confidentiality\nEnsure customer PII remains confidential through encryption at rest and in transit...\n\n### 2.1.2 Key Security\nProtect encryption keys from unauthorized access through HSM storage and MFA...",
      "rationale_why": "NIST CSF PR.DS-1 and PR.DS-2 establish data protection objectives.",
      "rationale_condition": "Implements Business Drivers (1-2) requirement for SOC 2 CC6.1 compliance."
    }
    // ... sections 2-2, 2-3, 2-4, 2-5
  }
}
```

**Traceability Generated:**

```json
{
  "references": {
    "2-1": [
      {"source": "POL-2025-001.contextual.1-2", "relationship": "implements", "description": "Implements SOC 2 and GDPR requirements from business drivers"},
      {"source": "POL-2025-001.contextual.1-3", "relationship": "derives_from", "description": "Addresses encryption gaps identified in risk context"}
    ]
  }
}
```

**PR Created:** `[POL-2025-001] Layer 2: Conceptual`

---

#### Steps 8-11: Layers 3-6

The process continues:

| Layer | Key Content Generated | Upstream Context |
|-------|----------------------|------------------|
| **3. Logical** | AES-256 encryption policy, TLS 1.2 standard, key rotation requirements | Security objectives (2-1), services (2-2), principles (2-3) |
| **4. Physical** | AWS KMS configuration spec, TLS termination procedure, HSM integration architecture | Policies (3-1), standards (3-2), control specs (3-3), trust model (2-4) |
| **5. Component** | Terraform for KMS, AWS CLI key rotation script, validation test suite | Implementation specs (4-1), procedures (4-2), technical standards (4-3) |
| **6. Operational** | CloudWatch encryption alerts, key rotation runbook, incident playbook for key compromise | Tool configs (5-1), validation tests (5-3), deployment checklist (5-4), exception handling (4-5) |

---

#### Step 12: Finalization

**Workflow:** `finalize-policy.yml`

**Actions:**
1. Updates `metadata.json` → status: `completed`
2. Creates release tag: `policy/POL-2025-001/v1.0`
3. Generates release with:
   - Summary of all layers
   - Links to all merged PRs
   - Complete traceability matrix
4. Closes original issue with completion comment

---

### 12.3 Final Artifact Structure

```
policies/POL-2025-001/
├── metadata.json
├── summary.md
├── input/
│   └── policy-statement.md
├── contextual/
│   ├── sections.json      # 5 sections with rationale
│   └── traceability.json  # References to summary
├── conceptual/
│   ├── sections.json      # 5 sections with rationale
│   └── traceability.json  # References to 1-2, 1-3, 1-4
├── logical/
│   ├── sections.json      # 5 sections with rationale
│   └── traceability.json  # References to 2-1, 2-2, 2-3
├── physical/
│   ├── sections.json      # 5 sections with rationale
│   └── traceability.json  # References to 3-1, 3-2, 3-3, 2-4
├── component/
│   ├── sections.json      # 5 sections with rationale
│   └── traceability.json  # References to 4-1, 4-2, 4-3
└── operational/
    ├── sections.json      # 6 sections with rationale
    └── traceability.json  # References to 5-1, 5-3, 5-4, 4-5
```

### 12.4 Traceability Chain Example

Following a single thread from operational runbook back to business requirement:

```
6-2 (Key Rotation Runbook)
  └── validates → 5-1 (AWS KMS Configuration)
        └── refines → 4-2 (Key Rotation Procedure)
              └── implements → 3-2 (Key Rotation Standard: 90 days)
                    └── implements → 2-1 (Security Objective: Key Security)
                          └── derives_from → 1-2 (Business Driver: SOC 2 CC6.1)
                                └── derives_from → summary (90-day key rotation requirement)
```

**Audit Query:** "Why do we rotate keys every 90 days?"

**Answer Path:** The 90-day rotation is specified in the original policy statement → driven by SOC 2 CC6.1 requirements identified in Business Drivers → translated to a security objective for key security → formalized as a standard in the Logical layer → implemented as a procedure in Physical → configured in AWS KMS in Component → verified and maintained via the runbook in Operational.

---

## 13. Configuration Reference

### 13.1 Environment Variables

| Variable | Purpose | Location |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Claude API authentication | GitHub Secrets |

### 13.2 Repository Settings

**Branch Protection (main):**
- Require pull request reviews before merging
- Require status checks to pass
- Restrict who can push (GitHub Actions bot only for workflow commits)

**Labels:**
- `new-policy` — Triggers initialize workflow
- `sabsa-artifact` — Applied to all layer PRs
- `layer-1` through `layer-6` — Layer identification
- `needs-manual-review` — Partial generation requiring intervention
- `revision-limit-reached` — Maximum revisions exceeded

### 13.3 File Reference

| File | Purpose |
|------|---------|
| `config/layer-dependencies.json` | Defines upstream sections for each layer |
| `config/layer-sections.json` | Defines expected output sections per layer |
| `config/relationship-vocabulary.json` | Controlled vocabulary for traceability |
| `prompts/system-prompt.md` | Base system prompt for all Claude calls |
| `prompts/{layer}-prompt.md` | Layer-specific generation instructions |
| `prompts/summary-prompt.md` | Instructions for policy summary generation |

---

## 14. Appendices

### Appendix A: Prompt Templates

**System Prompt (system-prompt.md):**

```markdown
You are a security architecture expert specializing in the SABSA (Sherwood Applied Business Security Architecture) framework. Your role is to generate security architecture artifacts that are:

1. **Traceable** — Every element links to upstream requirements
2. **Framework-aligned** — References NIST, ISO 27001, CIS, and other standards
3. **Actionable** — Provides specific, implementable guidance
4. **Consistent** — Follows organizational templates and terminology

Output Format:
- Return valid JSON matching the provided schema
- Use markdown formatting within content fields
- Include rationale for every section
- Specify traceability links to upstream elements

Relationship Types (use only these):
- implements: Directly realizes upstream requirement
- derives_from: Logically follows from upstream element
- constrained_by: Bounded by upstream constraint
- refines: Adds detail to upstream element
- validates: Provides verification for upstream element
```

**Summary Prompt (summary-prompt.md):**

```markdown
Generate a concise summary (maximum 150 words) of the following security policy statement. The summary should:

1. Capture the core intent of the policy
2. List key requirements (encryption standards, key management, access controls)
3. Note any compliance frameworks mentioned
4. Be written in third person, present tense

Policy Statement:
{{policy_statement}}

Business Context (if provided):
{{business_context}}

Output as plain text, no JSON wrapper needed.
```

### Appendix B: JSON Schemas

**sections.json Schema:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["policyId", "layer", "version", "generatedAt", "generationStatus", "sections"],
  "properties": {
    "policyId": {"type": "string", "pattern": "^POL-\\d{4}-\\d{3}$"},
    "layer": {"type": "string", "enum": ["contextual", "conceptual", "logical", "physical", "component", "operational"]},
    "version": {"type": "integer", "minimum": 1},
    "generatedAt": {"type": "string", "format": "date-time"},
    "generationStatus": {"type": "string", "enum": ["complete", "partial"]},
    "sections": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["title"],
        "properties": {
          "title": {"type": "string"},
          "content": {"type": ["string", "null"]},
          "rationale_why": {"type": ["string", "null"]},
          "rationale_condition": {"type": ["string", "null"]}
        }
      }
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["section", "errorType", "message"],
        "properties": {
          "section": {"type": "string"},
          "errorType": {"type": "string"},
          "message": {"type": "string"},
          "rawContent": {"type": "string"}
        }
      }
    }
  }
}
```

### Appendix C: Glossary

| Term | Definition |
|------|------------|
| **SABSA** | Sherwood Applied Business Security Architecture — enterprise security architecture framework |
| **Layer** | One of six SABSA architectural views (Contextual through Operational) |
| **Section** | A specific artifact component within a layer (e.g., 3-1 Security Policies) |
| **Traceability** | The documented chain of relationships from requirements to implementation |
| **Cascade** | Automatic triggering of next layer generation upon PR merge |
| **Revision** | Regeneration of a layer artifact based on reviewer feedback |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-27 | Don Wood | Initial PRD based on design conversations |

---

*End of Document*
