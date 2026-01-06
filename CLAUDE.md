# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **SABSA Agentic Policy Workflow** — a GitHub Actions-based automation platform that transforms security policy statements into complete SABSA (Sherwood Applied Business Security Architecture) artifacts across all six layers using Claude AI.

**Core Purpose:** Accept a security policy statement as input and automatically generate comprehensive security architecture documentation through six layers with human review gates.

**Platform:** GitHub Actions with Pull Request review mechanics
**AI Engine:** Claude Sonnet 4 (claude-sonnet-4-20250514)

## Quick Start Commands

### Validate Artifacts

```bash
# Install dependencies first
npm install

# Validate all layers for a policy
npm run validate POL-2025-001

# Validate specific layer only
node scripts/validate-artifacts.js POL-2025-001 --layer logical

# Verbose validation output
node scripts/validate-artifacts.js POL-2025-001 --verbose
```

### Manual Workflow Triggers

```bash
# Initialize a new policy (manual trigger)
gh workflow run initialize-policy.yml \
  -f policy-title="Customer PII Encryption Policy" \
  -f policy-text="All customer PII must be encrypted..."

# Generate specific layer (useful for testing)
gh workflow run generate-layer.yml \
  -f policy-id="POL-2025-001" \
  -f layer="logical"

# Check workflow status
gh run list --workflow=generate-layer.yml --limit 5
gh run view <run-id> --log
```

### Local Testing with Act

```bash
# Install Act (GitHub Actions local runner)
brew install act

# Test initialize workflow locally
act issues -e .github/test-fixtures/new-policy-event.json

# Test generate layer workflow
act workflow_call -e .github/test-fixtures/generate-layer-event.json
```

## Architecture Overview

### The Six SABSA Layers

| Layer | Prefix | View | Core Question | Primary Output |
|-------|--------|------|---------------|----------------|
| **Contextual** | 1-x | Business | What does business need? | Business context, risks, success criteria |
| **Conceptual** | 2-x | Architect | What security capabilities? | Security objectives, services, principles |
| **Logical** | 3-x | Designer | What are security rules? | Policies, standards, control specs |
| **Physical** | 4-x | Builder | How to implement? | Procedures, technical standards |
| **Component** | 5-x | Tradesman | What tools/configs? | Tool configs, IaC, validation tests |
| **Operational** | 6-x | Operations | How to maintain? | Runbooks, monitoring, incident response |

### Workflow Execution Flow

```
GitHub Issue (new-policy label)
    ↓
Initialize → Generate Policy ID → Create Folders → Generate Summary → Commit
    ↓
Generate Layer 1 (Contextual) → Create PR → Human Review
    ↓
[If Approved & Merged] → Cascade to Layer 2
[If Changes Requested] → Revision Workflow → Regenerate
    ↓
Repeat for Layers 2-6
    ↓
Finalize → Create Release Tag → Close Issue
```

## Critical Design Principles

### Context Assembly & Token Optimization

**Key Insight:** Each layer receives ONLY the upstream sections it needs (not full artifacts).

Example Layer Dependencies:
- **Conceptual** receives: Business Drivers (1-2), Risk Context (1-3), Success Criteria (1-4)
- **Logical** receives: Security Objectives (2-1), Security Services (2-2), Security Principles (2-3)
- **Physical** receives: Policies (3-1), Standards (3-2), Control Specs (3-3), Trust Model (2-4)

Configuration file: `config/layer-dependencies.json`

### Naming Conventions

**Policy IDs:** `POL-{YYYY}-{NNN}` (e.g., `POL-2025-001`)
**Section IDs:** `{policy-id}.{layer}.{section}` (e.g., `POL-2025-001.logical.3-1`)
**Branch Names:** `policy/{policy-id}/layer-{n}-{layer-name}` (e.g., `policy/POL-2025-001/layer-3-logical`)

### Traceability Relationships

**Only use these five relationship types:**

- `implements` - Directly realizes upstream requirement
- `derives_from` - Logically follows from upstream element
- `constrained_by` - Bounded by upstream constraint
- `refines` - Adds implementation detail to upstream
- `validates` - Provides verification for upstream element

## Key File Locations

### Configuration Files
- `config/layer-dependencies.json` - Defines which upstream sections each layer receives
- `config/layer-sections.json` - Expected output sections per layer
- `config/relationship-vocabulary.json` - Controlled traceability vocabulary

### Prompt Templates
- `prompts/system-prompt.md` - Base system prompt for all Claude calls
- `prompts/summary-prompt.md` - Policy summary generation
- `prompts/contextual-prompt.md` through `prompts/operational-prompt.md` - Layer-specific prompts

### Workflow Files
- `.github/workflows/initialize-policy.yml` - Bootstrap new policies from issues
- `.github/workflows/generate-layer.yml` - Generate SABSA artifacts using Claude
- `.github/workflows/handle-revision.yml` - Capture feedback and trigger regeneration
- `.github/workflows/cascade-next-layer.yml` - Auto-trigger next layer on PR merge
- `.github/workflows/finalize-policy.yml` - Create release and complete workflow

### Schemas
- `schemas/sections.schema.json` - Validates sections.json structure
- `schemas/traceability.schema.json` - Validates traceability.json structure
- `schemas/metadata.schema.json` - Validates metadata.json structure

## Data Model

### Policy Directory Structure

```
policies/POL-2025-001/
├── metadata.json              # Policy status, layer progress, PR tracking
├── summary.md                 # 150-word policy summary
├── input/
│   └── policy-statement.md    # Original policy text
├── contextual/
│   ├── sections.json          # Layer 1 artifacts with rationale
│   └── traceability.json      # Upstream references
├── conceptual/                # Layer 2 artifacts
├── logical/                   # Layer 3 artifacts
├── physical/                  # Layer 4 artifacts
├── component/                 # Layer 5 artifacts
└── operational/               # Layer 6 artifacts
```

### sections.json Structure

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
      "content": "## 3.1 Security Policies\n\n...",
      "rationale_why": "NIST SP 800-53 SC-28 mandates...",
      "rationale_condition": "Satisfies Security Objective 2-1..."
    }
  },
  "errors": []
}
```

### traceability.json Structure

```json
{
  "policyId": "POL-2025-001",
  "layer": "logical",
  "references": {
    "3-1": [
      {
        "source": "POL-2025-001.conceptual.2-1",
        "relationship": "implements",
        "description": "Implements confidentiality objective for PII"
      }
    ]
  }
}
```

## Development Workflow

### Creating New Prompts

When modifying layer prompts, ensure they include:

1. **Purpose** - What this layer achieves in SABSA
2. **Expected Sections** - All section IDs and titles to generate
3. **Upstream Context** - What sections are provided and why
4. **Output Schema** - JSON structure with required fields
5. **Generation Instructions** - Specific guidance for content

### Error Handling Strategy

The system captures partial results and surfaces them in PRs for human intervention:

**Partial Result Example:**
```json
{
  "generationStatus": "partial",
  "sections": {
    "3-1": { "content": "...", "rationale_why": "...", "rationale_condition": "..." },
    "3-2": { "content": null, "rationale_why": null, "rationale_condition": null }
  },
  "errors": [
    {
      "section": "3-2",
      "errorType": "parse_failure",
      "message": "JSON parse error at position 4521"
    }
  ]
}
```

### Security Hardening

All workflows follow GitHub security best practices:

**❌ NEVER do this (command injection risk):**
```yaml
run: echo "${{ github.event.issue.title }}"
```

**✅ ALWAYS do this (safe):**
```yaml
env:
  TITLE: ${{ github.event.issue.title }}
run: echo "$TITLE"
```

## Testing Strategy

### Unit Testing (Individual Workflows)

Test each workflow in isolation using manual triggers or local Act runner.

### Integration Testing (End-to-End)

1. Create test policy issue
2. Verify initialization creates folder structure
3. Review Layer 1 PR for valid JSON structure
4. Test revision flow by requesting changes
5. Test cascade by merging Layer 1
6. Complete all 6 layers
7. Verify finalize creates release tag

### Sample Test Policy

```
Title: [Policy] Customer PII Encryption Policy

Policy Statement:
All customer PII must be encrypted at rest using AES-256 and in transit using
TLS 1.2 or higher. Encryption keys must be rotated every 90 days and stored in
a hardware security module. Access to encryption keys requires multi-factor
authentication and must be logged for audit purposes.

Business Context:
Supports SOC 2 Type II certification and GDPR Article 32 compliance.

Priority: High
```

## Common Issues & Solutions

### Workflow doesn't trigger on issue creation
- Check issue has `new-policy` label
- Verify workflow file syntax with `yamllint`
- Check workflow permissions in repository settings

### JSON parse failures in Claude responses
- Check prompt clarity in layer-specific prompt files
- Verify output schema definition in prompt
- Enable partial result handling (already implemented)

### Missing traceability references
- Verify upstream sections loaded correctly
- Check `config/layer-dependencies.json` mappings
- Review Claude prompt includes traceability instructions

### Cascade doesn't trigger after PR merge
- Verify branch matches pattern `policy/*/layer-*`
- Check PR was merged to `main` (not closed without merge)
- Review workflow permissions allow triggering other workflows

## Compliance Validation (v1.1)

**New Feature:** Layer 5 (Component) generates hybrid compliance validation specifications.

### Validation Check Types

**Automated Checks:**
- **Wiz Policies** - WizQL queries to detect non-compliant resources
- **ICS Checks** - Cloud security posture checks (AWS/GCP/Azure)

**Manual Checks:**
- **JIRA Tickets** - Evidence collection specifications
- **Evidence Requirements** - File formats, frequency, responsible owners

### Example Generated Check

```json
{
  "checkId": "ENC-AWS-001",
  "requirement": "All RDS instances must use KMS encryption",
  "validationType": "automated",
  "wizPolicy": {
    "policyName": "RDS KMS Encryption Required",
    "query": "cloudResource where type='AWS RDS Instance' and encryptionEnabled=false",
    "severity": "HIGH"
  }
}
```

## Repository Settings Required

### GitHub Secrets
- `ANTHROPIC_API_KEY` - Claude API authentication

### Labels
- `new-policy` - Triggers initialize workflow
- `sabsa-artifact` - Applied to all layer PRs
- `layer-1` through `layer-6` - Layer identification
- `needs-manual-review` - Partial generation requiring intervention
- `revision-limit-reached` - Maximum revisions exceeded (3 per layer)

### Branch Protection (main)
- Require pull request reviews before merging
- Require status checks to pass
- Restrict pushes to GitHub Actions bot for workflow commits

## Documentation Reference

- **PRD:** `SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md` - Complete product specification
- **README:** `README.md` - Quick start and overview
- **Workflow Report:** `WORKFLOW_IMPLEMENTATION_REPORT.md` - Implementation details
- **Setup Guide:** `SETUP_COMPLETE.md` - Initial setup documentation
- **Schema Guide:** `schemas/README.md` - Schema documentation
- **Contributing:** `CONTRIBUTING.md` - Contribution guidelines

## Performance Characteristics

### Per-Layer Timing
- **Generation:** 1-3 minutes (Claude API + PR creation)
- **Human Review:** 30-60 minutes (variable)
- **Revision:** 1-3 minutes (if needed)

### Complete Policy Cycle
- **Best Case (no revisions):** 3-6 hours (mostly review time)
- **With Revisions:** 4-8 hours (1 revision per layer)
- **Active Automation Time:** ~20-30 minutes total

## Key Success Metrics

| Metric | Target State |
|--------|--------------|
| Policy-to-runbook cycle time | < 2 weeks (down from 3-6 months) |
| Artifact consistency | 100% template compliance |
| Traceability coverage | Complete automated lineage |
| Audit trail completeness | Single source of truth |
