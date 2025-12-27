# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **SABSA Agentic Policy Workflow** system - a GitHub Actions-based automation platform that transforms security policy statements into complete, traceable SABSA (Sherwood Applied Business Security Architecture) artifacts across all six architectural layers using Anthropic Claude AI.

**Core Purpose:** Accept a security policy statement as input and automatically generate comprehensive security architecture documentation through all six SABSA layers (Contextual → Conceptual → Logical → Physical → Component → Operational) with human review gates at each layer.

**Platform:** GitHub Actions with native Pull Request review mechanics, treating artifacts as code (GitOps approach)

**AI Engine:** Anthropic Claude (claude-sonnet-4-20250514)

## Architecture & Design Philosophy

### Key Design Principles

1. **Artifacts as Code** - All outputs stored in Git with full version history
2. **Human in the Loop** - Every layer requires explicit PR approval before proceeding
3. **Minimal Context** - Each layer receives only the upstream sections it needs (token optimization)
4. **Structured Traceability** - JSON documents capture all relationships; markdown for content
5. **Graceful Degradation** - Partial results surfaced for human intervention on failures
6. **Familiar UX** - Standard GitHub PR workflow—no custom interfaces

### The Six SABSA Layers (Process Domain)

| Layer | Prefix | View | Core Question | Primary Output |
|-------|--------|------|---------------|----------------|
| **Contextual** | 1-x | Business | What does the business need? | Business context, risks, success criteria |
| **Conceptual** | 2-x | Architect | What security capabilities? | Security objectives, services, principles, trust model |
| **Logical** | 3-x | Designer | What are the security rules? | Policies, standards, control specifications |
| **Physical** | 4-x | Builder | How will it be implemented? | Procedures, technical standards, integration specs |
| **Component** | 5-x | Tradesman | What specific tools/configs? | Tool configs, IaC templates, validation tests |
| **Operational** | 6-x | Operations | How will it be maintained? | Runbooks, monitoring, incident response playbooks |

### Workflow Flow

```
GitHub Issue (new-policy)
    ↓
Initialize Workflow → Generate Policy ID → Create Folder Structure → Generate Summary → Commit to Main
    ↓
Generate Layer 1 (Contextual) → Create PR → Human Review
    ↓
[If Approved & Merged] Cascade to Layer 2
[If Changes Requested] Revision Workflow → Regenerate with Feedback
    ↓
Repeat for Layers 2-6
    ↓
Finalize Workflow → Create Release Tag → Close Issue
```

## Repository Structure

```
sabsa-policy-workflow/
├── .github/
│   ├── workflows/              # GitHub Actions workflows
│   │   ├── initialize-policy.yml      # Policy initialization & summary generation
│   │   ├── generate-layer.yml         # Layer artifact generation (core workflow)
│   │   ├── handle-revision.yml        # Process PR review feedback & regenerate
│   │   ├── cascade-next-layer.yml     # Trigger next layer on PR merge
│   │   └── finalize-policy.yml        # Create release, close issue
│   ├── actions/
│   │   └── call-claude/        # Composite action for Claude API integration
│   │       ├── action.yml      # Action metadata & input/output definitions
│   │       ├── index.js        # Main logic: API calls, retry, JSON parsing
│   │       └── package.json    # Dependencies (@anthropic-ai/sdk, @actions/core)
│   ├── ISSUE_TEMPLATE/
│   │   └── new-policy.yml      # Issue form for policy submission
│   └── templates/
│       └── pr-description.md   # Template for layer PR descriptions
├── config/
│   ├── layer-dependencies.json        # Defines upstream sections each layer receives
│   ├── layer-sections.json            # Defines expected output sections per layer
│   └── relationship-vocabulary.json   # Controlled vocabulary for traceability
├── prompts/
│   ├── system-prompt.md        # Base system prompt for all Claude calls
│   ├── summary-prompt.md       # Policy summary generation instructions
│   ├── contextual-prompt.md    # Layer 1 generation instructions
│   ├── conceptual-prompt.md    # Layer 2 generation instructions
│   ├── logical-prompt.md       # Layer 3 generation instructions
│   ├── physical-prompt.md      # Layer 4 generation instructions
│   ├── component-prompt.md     # Layer 5 generation instructions
│   └── operational-prompt.md   # Layer 6 generation instructions
├── policies/
│   └── {policy-id}/            # Generated artifacts (e.g., POL-2025-001/)
│       ├── metadata.json       # Policy status, layer progress, PR tracking
│       ├── summary.md          # 150-word policy summary
│       ├── input/
│       │   └── policy-statement.md    # Original policy text
│       ├── contextual/
│       │   ├── sections.json   # Layer 1 artifacts with rationale
│       │   └── traceability.json      # Upstream references
│       ├── conceptual/         # Layer 2 artifacts
│       ├── logical/            # Layer 3 artifacts
│       ├── physical/           # Layer 4 artifacts
│       ├── component/          # Layer 5 artifacts
│       └── operational/        # Layer 6 artifacts
└── archive/                    # Rejected or abandoned policies
```

## Data Model & Naming Conventions

### Policy ID Format

**Pattern:** `POL-{YYYY}-{NNN}`
- `YYYY` - Four-digit year
- `NNN` - Sequential number, zero-padded (e.g., `POL-2025-001`)

### Section Naming

**Pattern:** `{policy-id}.{layer}.{section}`
- Example: `POL-2025-001.contextual.1-2` (Contextual layer, Business Drivers section)
- Example: `POL-2025-001.logical.3-1` (Logical layer, Security Policies section)

### Traceability Relationships

Only use these relationship types in `traceability.json`:

| Relationship | Definition | Typical Direction | Example |
|-------------|-----------|-------------------|---------|
| `implements` | Directly realizes upstream requirement | downstream → upstream | Logical control implements Conceptual objective |
| `derives_from` | Logically follows from upstream element | any → any | Physical procedure derives from Logical standard |
| `constrained_by` | Bounded by upstream constraint | downstream → upstream | Physical implementation constrained by Logical policy |
| `refines` | Adds implementation detail | downstream → immediate upstream | Component script refines Physical procedure |
| `validates` | Provides verification/proof | downstream → upstream | Component test validates Physical specification |

## Context Assembly & Token Optimization

**Critical Design Decision:** Selective context assembly based on explicit dependency mapping to prevent token bloat.

### Layer Dependency Matrix

| Layer | Always Receives | Upstream Sections Required |
|-------|-----------------|---------------------------|
| Contextual | `summary.md` | None (first layer) |
| Conceptual | `summary.md` | `1-2` (Business Drivers), `1-3` (Risk Context), `1-4` (Success Criteria) |
| Logical | `summary.md` | `2-1` (Security Objectives), `2-2` (Security Services), `2-3` (Security Principles) |
| Physical | `summary.md` | `3-1` (Security Policies), `3-2` (Security Standards), `3-3` (Control Specs), `2-4` (Trust Model) |
| Component | `summary.md` | `4-1` (Implementation Specs), `4-2` (Procedures), `4-3` (Technical Standards) |
| Operational | `summary.md` | `5-1` (Tool Configs), `5-3` (Validation Tests), `5-4` (Deployment Checklist), `4-5` (Exception Handling) |

**Configuration:** All dependencies defined in `config/layer-dependencies.json`

## Implementation Guidelines

### Creating Workflow Files

**Workflow Trigger Patterns:**
- `initialize-policy.yml` - Trigger: Issue opened with `new-policy` label OR `workflow_dispatch`
- `generate-layer.yml` - Trigger: `workflow_call` from other workflows OR `workflow_dispatch`
- `handle-revision.yml` - Trigger: `pull_request_review` with `changes_requested` action
- `cascade-next-layer.yml` - Trigger: `pull_request` closed with `merged == true`
- `finalize-policy.yml` - Trigger: Cascade workflow detects operational layer merge

**Branch Naming:** `policy/{policy-id}/layer-{n}-{layer-name}`
- Example: `policy/POL-2025-001/layer-3-logical`

**PR Naming:** `[{policy-id}] Layer {n}: {layer-name}`
- Example: `[POL-2025-001] Layer 3: Logical`

### Implementing the Claude Action (`.github/actions/call-claude/`)

**Core Responsibilities:**
1. Accept assembled prompt as input
2. Call Anthropic API with retry logic (rate limit handling)
3. Parse JSON response
4. Validate expected sections are present
5. Handle partial results gracefully
6. Return structured output or error details

**API Configuration:**
```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 8000,
  messages: [{ role: "user", content: assembledPrompt }],
  system: systemPrompt  // From prompts/system-prompt.md
}
```

**Retry Logic:**
- Max attempts: 3
- Exponential backoff: 1s → 2s → 4s
- Retryable errors: rate_limit, timeout, server_error

**Output Schema:**
```yaml
outputs:
  result:           # Parsed JSON response (if success)
  success:          # 'true' or 'false'
  error-message:    # Error details if failed
  partial-result:   # Parseable content if partial failure
```

### Error Handling Strategy

**Philosophy:** Capture partial results and surface in PR for human intervention rather than failing completely.

**Error Categories:**

| Category | Examples | Handling |
|----------|----------|----------|
| API Failure | Rate limit, timeout, 5xx errors | Retry with exponential backoff (max 3 attempts) |
| Parse Failure | Malformed JSON, incomplete response | Extract partial content, flag for review |
| Validation Failure | Missing sections, invalid traceability | Include valid sections, mark missing as errors |
| Workflow Failure | Git conflicts, permission errors | Fail workflow, alert maintainer |

**Partial Result Pattern:**
- Set `generationStatus: "partial"` in `sections.json`
- Include `errors` array with section-specific details
- Add `needs-manual-review` label to PR
- Preserve raw Claude output in error details

**Revision Limits:**
- Maximum 3 automated revision attempts per layer
- After limit: Add `revision-limit-reached` label, require manual intervention

### Writing Prompts

**System Prompt Requirements (`prompts/system-prompt.md`):**
- Define role: Security architecture expert specializing in SABSA
- Specify output format: Valid JSON matching schema
- List relationship types (implements, derives_from, etc.)
- Emphasize traceability and framework alignment (NIST, ISO 27001, CIS)

**Layer-Specific Prompt Structure:**
```markdown
# Layer {N}: {Layer Name}

## Purpose
[What this layer achieves in SABSA framework]

## Expected Sections
[List all section IDs and titles this layer must generate]

## Upstream Context
[Explain what upstream sections are provided and why]

## Output Schema
[Define JSON structure with all required fields]

## Generation Instructions
[Specific guidance for this layer's content]
```

**Summary Prompt Requirements (`prompts/summary-prompt.md`):**
- Maximum 150 words
- Capture core intent
- List key requirements
- Note compliance frameworks
- Third person, present tense

## Common Development Commands

### Testing Workflows Locally (Act)

```bash
# Install Act (GitHub Actions local runner)
brew install act

# Test initialize workflow
act issues -e .github/test-events/new-policy-event.json

# Test generate layer workflow
act workflow_call -e .github/test-events/generate-layer-event.json

# Test specific job in workflow
act -j generate -W .github/workflows/generate-layer.yml
```

### Validating JSON Schemas

```bash
# Validate sections.json against schema
npm install -g ajv-cli
ajv validate -s schemas/sections.schema.json -d policies/POL-2025-001/contextual/sections.json

# Validate traceability.json against schema
ajv validate -s schemas/traceability.schema.json -d policies/POL-2025-001/contextual/traceability.json
```

### Manual Workflow Triggers

```bash
# Trigger initialize workflow (via gh CLI)
gh workflow run initialize-policy.yml \
  -f policy-title="Customer PII Encryption Policy" \
  -f policy-text="All customer PII must be encrypted..."

# Trigger generate layer workflow
gh workflow run generate-layer.yml \
  -f policy-id="POL-2025-001" \
  -f layer="contextual"

# Check workflow status
gh run list --workflow=generate-layer.yml --limit 5
gh run view <run-id> --log
```

### Policy Management

```bash
# List all policies
ls -d policies/POL-*

# Check policy status
cat policies/POL-2025-001/metadata.json | jq '.status, .currentLayer, .layerStatus'

# View policy summary
cat policies/POL-2025-001/summary.md

# Extract specific section content
cat policies/POL-2025-001/logical/sections.json | jq '.sections["3-1"].content'

# Generate traceability report
node scripts/generate-traceability-report.js POL-2025-001
```

## Key Configuration Files

### `config/layer-dependencies.json`

Defines which upstream sections each layer receives as context. **Critical for token optimization.**

Structure:
```json
{
  "layers": {
    "contextual": {
      "displayName": "Contextual",
      "number": 1,
      "receives": {
        "summary": true,
        "sections": []  // First layer, no upstream
      },
      "outputs": ["1-1", "1-2", "1-3", "1-4", "1-5"]
    },
    "conceptual": {
      "receives": {
        "summary": true,
        "sections": [
          {"layer": "contextual", "section": "1-2"},  // Business Drivers
          {"layer": "contextual", "section": "1-3"},  // Risk Context
          {"layer": "contextual", "section": "1-4"}   // Success Criteria
        ]
      }
    }
  }
}
```

### `config/layer-sections.json`

Defines expected output structure for each layer (section IDs, titles, descriptions).

### `config/relationship-vocabulary.json`

Controlled vocabulary for traceability relationships. **Only use defined relationship types.**

## Environment Variables & Secrets

### Required GitHub Secrets

| Secret | Purpose | Where Used |
|--------|---------|-----------|
| `ANTHROPIC_API_KEY` | Claude API authentication | `.github/actions/call-claude` |

### Repository Settings

**Branch Protection (main):**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Restrict pushes to GitHub Actions bot only (for workflow commits)

**Required Labels:**
- `new-policy` - Triggers initialize workflow
- `sabsa-artifact` - Applied to all layer PRs
- `layer-1` through `layer-6` - Layer identification
- `needs-manual-review` - Partial generation requiring intervention
- `revision-limit-reached` - Maximum revisions exceeded

## Testing Strategy

### Unit Testing (Claude Action)

```bash
cd .github/actions/call-claude
npm install
npm test  # Run Jest tests

# Test specific scenarios
npm test -- --testNamePattern="should handle partial JSON response"
npm test -- --testNamePattern="should retry on rate limit"
```

### Integration Testing (End-to-End)

1. **Create test policy issue** using `.github/ISSUE_TEMPLATE/new-policy.yml`
2. **Verify initialization:** Check `policies/POL-YYYY-NNN/` structure created
3. **Review Layer 1 PR:** Validate sections.json structure, traceability.json correctness
4. **Test revision flow:** Request changes, verify regeneration with feedback
5. **Test cascade:** Merge Layer 1, verify Layer 2 PR auto-created
6. **Complete all layers:** Verify finalize workflow creates release tag

### Sample Test Policy

```
Title: [Policy] Customer PII Encryption Policy

Policy Statement:
All customer PII must be encrypted at rest using AES-256 and in transit using
TLS 1.2 or higher. Encryption keys must be rotated every 90 days and stored in
a hardware security module. Access to encryption keys requires multi-factor
authentication and must be logged for audit purposes.

Business Context:
Supports SOC 2 Type II certification and GDPR Article 32 compliance requirements.

Priority: High
```

## Implementation Phases

### Phase 1: Core Workflow (Week 1-2)
- [ ] Repository structure and config files
- [ ] Claude composite action (JavaScript)
- [ ] Initialize workflow (with summary generation)
- [ ] Generate workflow (single layer, manual trigger)
- [ ] Basic PR creation

### Phase 2: Review Integration (Week 3)
- [ ] Cascade workflow (PR merge → next layer)
- [ ] Revision workflow (parse comments, regenerate)
- [ ] Issue template for policy input
- [ ] PR description template (full)

### Phase 3: Completion & Polish (Week 4)
- [ ] Finalize workflow (release tagging)
- [ ] Full 6-layer cascade testing
- [ ] Error handling refinement
- [ ] Branch protection rules
- [ ] Documentation and runbook

## Troubleshooting

### Common Issues

**Workflow doesn't trigger on issue creation:**
- Check issue has `new-policy` label
- Verify workflow file syntax: `yamllint .github/workflows/initialize-policy.yml`
- Check workflow permissions in repository settings

**Claude API rate limit errors:**
- Verify retry logic in `call-claude/index.js` (exponential backoff implemented)
- Check API key validity: `echo $ANTHROPIC_API_KEY` in workflow logs
- Increase max retry attempts if persistent

**JSON parse failures in Claude responses:**
- Check prompt clarity in `prompts/{layer}-prompt.md`
- Verify output schema definition in prompt
- Enable partial result handling in `call-claude/index.js`

**Missing traceability references:**
- Verify upstream sections loaded in `generate-layer.yml` context assembly step
- Check `config/layer-dependencies.json` for correct section mappings
- Review Claude prompt includes traceability instructions

**Cascade doesn't trigger after PR merge:**
- Verify `cascade-next-layer.yml` has correct branch pattern filter: `policy/*/layer-*`
- Check PR was merged to `main` (not closed without merge)
- Review workflow permissions allow triggering other workflows

### Debugging Workflow Runs

```bash
# View workflow run logs
gh run view <run-id> --log

# Download workflow artifacts
gh run download <run-id>

# Debug specific job
gh run view <run-id> --job=<job-id> --log

# Re-run failed workflow
gh run rerun <run-id>
```

### Validating Generated Artifacts

```bash
# Validate all sections present
jq '.sections | keys' policies/POL-2025-001/logical/sections.json

# Check for partial generation
jq '.generationStatus, .errors' policies/POL-2025-001/logical/sections.json

# Verify traceability completeness
jq '.references | to_entries | map(select(.value | length == 0))' \
  policies/POL-2025-001/logical/traceability.json
```

## Documentation Reference

- **Product Requirements Document:** `SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md` (complete specification)
- **Workflow Diagrams:** See PRD Section 7.1
- **Data Model Schemas:** See PRD Section 6
- **Prompt Templates:** See PRD Appendix A
- **JSON Schemas:** See PRD Appendix B

## Key Success Metrics

| Metric | Target State |
|--------|--------------|
| Policy-to-runbook cycle time | < 2 weeks (down from 3-6 months) |
| Artifact consistency | 100% template compliance |
| Traceability coverage | Complete automated lineage |
| Audit trail completeness | Single source of truth |
