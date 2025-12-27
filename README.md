# SABSA Agentic Policy Workflow

[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Claude AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204-8B5CF6?logo=anthropic&logoColor=white)](https://www.anthropic.com/claude)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-org/sabsa-policy-workflow/pulls)

An automated security policy workflow system that transforms security policy statements into complete, traceable SABSA (Sherwood Applied Business Security Architecture) artifacts across all six architectural layers.

## Overview

Traditional security architecture development is manual, time-consuming, and inconsistent. This system leverages Anthropic's Claude AI and GitHub's native collaboration features to:

- **Accelerate delivery**: Reduce policy-to-runbook cycle time from 3-6 months to < 2 weeks
- **Ensure consistency**: 100% template compliance across all generated artifacts
- **Maintain traceability**: Complete automated lineage from business requirements to operational runbooks
- **Enable collaboration**: Familiar GitHub Pull Request workflow for human review at each layer

## What is SABSA?

SABSA (Sherwood Applied Business Security Architecture) is an enterprise security architecture framework that provides a structured approach to designing security solutions. It consists of six layers that progressively transform business requirements into operational procedures:

| Layer | View | Focus | Example Output |
|-------|------|-------|----------------|
| **1. Contextual** | Business | What does the business need? | Business drivers, risk context, success criteria |
| **2. Conceptual** | Architect | What security capabilities? | Security objectives, services, principles, trust model |
| **3. Logical** | Designer | What are the security rules? | Policies, standards, control specifications |
| **4. Physical** | Builder | How will it be implemented? | Procedures, technical standards, integration specs |
| **5. Component** | Tradesman | What specific tools/configs? | Tool configurations, IaC templates, validation tests |
| **6. Operational** | Operations | How will it be maintained? | Runbooks, monitoring, incident response playbooks |

## Quick Start

### Prerequisites

- GitHub repository with Actions enabled
- Anthropic API key (Claude Sonnet model access)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/sabsa-policy-workflow.git
   cd sabsa-policy-workflow
   ```

2. **Configure secrets**
   - Navigate to repository Settings → Secrets and variables → Actions
   - Add secret: `ANTHROPIC_API_KEY` with your Claude API key

3. **Enable workflows**
   - Navigate to Actions tab
   - Enable GitHub Actions for this repository

### Submit Your First Policy

1. **Create a new issue** using the "New Security Policy" template
2. **Fill in the required fields**:
   - Policy Title
   - Policy Statement (what needs to be protected and how)
   - Business Context (optional)
   - Priority level
3. **Submit the issue**

The workflow will automatically:
- Generate a unique policy ID (e.g., `POL-2025-001`)
- Create a policy summary
- Generate Layer 1 (Contextual) artifacts
- Open a Pull Request for your review

### Review Process

For each layer:
1. **Review the PR** — Check generated sections and traceability
2. **Provide feedback** — Use inline comments for specific changes
3. **Make a decision**:
   - **Approve & Merge** → Next layer is automatically generated
   - **Request Changes** → AI regenerates with your feedback
   - **Close PR** → Workflow halts (requires manual restart)

## Architecture

### System Components

```
┌─────────────┐
│   GitHub    │
│    Issue    │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────┐
│      Initialize Workflow                 │
│  • Generate Policy ID                    │
│  • Create folder structure               │
│  • Generate summary (Claude)             │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│      Generate Layer Workflow             │
│  • Load dependencies from config         │
│  • Assemble context (summary + upstream) │
│  • Call Claude API                       │
│  • Parse structured JSON response        │
│  • Create Pull Request                   │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────┐      ┌────────────────┐
│   Human Review   │─────>│    Revision    │
│   (GitHub PR)    │      │    Workflow    │
└──────┬───────────┘      └────────────────┘
       │ approve & merge
       ▼
┌──────────────────────────────────────────┐
│      Cascade Workflow                    │
│  • Detect merged layer                   │
│  • Trigger next layer generation         │
│  • Repeat for layers 2-6                 │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│      Finalize Workflow                   │
│  • Update metadata                       │
│  • Create release tag                    │
│  • Generate traceability report          │
│  • Close source issue                    │
└──────────────────────────────────────────┘
```

### Repository Structure

```
sabsa-policy-workflow/
├── .github/
│   ├── workflows/           # GitHub Actions workflows
│   ├── actions/call-claude/ # Claude API integration
│   ├── ISSUE_TEMPLATE/      # Policy submission template
│   └── templates/           # PR description template
├── config/                  # Configuration files
│   ├── layer-dependencies.json
│   ├── layer-sections.json
│   └── relationship-vocabulary.json
├── prompts/                 # Claude prompt templates
│   ├── system-prompt.md
│   ├── summary-prompt.md
│   └── {layer}-prompt.md
├── policies/                # Generated policy artifacts
│   └── {policy-id}/
│       ├── metadata.json
│       ├── summary.md
│       └── {layer}/
│           ├── sections.json
│           └── traceability.json
├── schemas/                 # JSON schemas for validation
└── scripts/                 # Utility scripts
```

## Configuration

### Layer Dependencies

The system uses selective context assembly to optimize token usage. Each layer receives only the upstream sections it needs:

| Layer | Receives |
|-------|----------|
| Contextual | Summary only |
| Conceptual | Summary + Business Drivers, Risk Context, Success Criteria |
| Logical | Summary + Security Objectives, Services, Principles |
| Physical | Summary + Policies, Standards, Control Specs, Trust Model |
| Component | Summary + Implementation Specs, Procedures, Technical Standards |
| Operational | Summary + Tool Configs, Validation Tests, Deployment Checklist, Exception Handling |

See `config/layer-dependencies.json` for the complete dependency matrix.

### Customization

- **Prompts**: Modify files in `prompts/` to adjust AI generation behavior
- **Section Structure**: Edit `config/layer-sections.json` to change expected outputs
- **Traceability**: Update `config/relationship-vocabulary.json` to customize relationship types

## Usage Guide

### Policy Statement Best Practices

A good policy statement should:
- Clearly define **what** must be protected
- Specify **how** it should be protected (standards, controls)
- Include any **compliance requirements** (GDPR, SOC 2, PCI DSS, etc.)
- Provide **business context** when available

**Example:**
```
All customer PII must be encrypted at rest using AES-256 and in transit
using TLS 1.2 or higher. Encryption keys must be rotated every 90 days
and stored in a hardware security module. Access to encryption keys
requires multi-factor authentication and must be logged for audit purposes.

Business Context: Supports SOC 2 Type II certification and GDPR Article 32
compliance requirements. Addresses Q3 penetration test findings.
```

### Reviewing Generated Artifacts

When reviewing a layer PR:

1. **Check completeness**: Verify all expected sections are present
2. **Validate accuracy**: Ensure technical details are correct for your environment
3. **Review traceability**: Confirm links to upstream elements make sense
4. **Verify rationale**: Check that framework references (NIST, ISO) are appropriate
5. **Assess alignment**: Ensure content aligns with organizational policies

### Requesting Revisions

To request changes:
1. Add **inline comments** on specific lines in the PR
2. Add **general comments** for overall feedback
3. Click **Request Changes** in the review interface

The AI will regenerate the layer incorporating your feedback.

### Manual Intervention

If the AI generates partial results or encounters errors:
1. The PR will be labeled `needs-manual-review`
2. Review the error details in the PR description
3. You can manually edit `sections.json` in the PR branch
4. Commit your changes and re-request review

## Development and Testing

### Running Workflows Manually

You can trigger workflows manually for testing:

```bash
# Via GitHub CLI
gh workflow run initialize-policy.yml \
  -f policy-title="Test Policy" \
  -f policy-text="All test data must be encrypted..."

# Or use the Actions UI
# Navigate to Actions → Select workflow → Run workflow
```

### Testing Individual Layers

To test a specific layer without going through the full cascade:

```bash
gh workflow run generate-layer.yml \
  -f policy-id="POL-2025-001" \
  -f layer="logical"
```

### Validating JSON Schemas

```bash
# Install ajv-cli for schema validation
npm install -g ajv-cli

# Validate a sections.json file
ajv validate -s schemas/sections.schema.json -d policies/POL-2025-001/logical/sections.json
```

## Documentation

- **[Product Requirements Document](SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md)** — Complete system specification
- **[Development Guide](CLAUDE.md)** — Claude Code instructions and architecture details
- **[Workflow Reference](docs/WORKFLOW_REFERENCE.md)** — Detailed workflow documentation (coming soon)
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** — Common issues and solutions (coming soon)

## Troubleshooting

### Common Issues

**Issue: Workflow doesn't trigger after creating issue**
- Ensure issue has `new-policy` label
- Check that GitHub Actions are enabled
- Verify workflows are not disabled in repository settings

**Issue: Claude API errors**
- Check `ANTHROPIC_API_KEY` is set correctly in repository secrets
- Verify API key has sufficient quota
- Check workflow logs for specific error messages

**Issue: PR not created after generation**
- Verify GitHub Actions bot has write permissions
- Check workflow logs for git push errors
- Ensure branch protection rules don't block Actions bot

**Issue: Partial generation results**
- Review error details in PR description
- Check if specific sections failed parsing
- Manually complete missing sections and commit to PR branch

### Getting Help

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions or share use cases
- **Documentation**: Check the PRD and development guide

## Contributing

We welcome contributions! Areas for improvement:

- Additional prompt templates for specialized domains
- Enhanced error handling and recovery
- Support for parallel policy processing
- Integration with policy management systems
- Additional framework mappings (NIST CSF, CIS Controls, etc.)

See our contributing guidelines for details on submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **SABSA Framework**: Sherwood Applied Business Security Architecture methodology
- **Anthropic Claude**: AI-powered artifact generation
- **GitHub Actions**: Workflow automation platform

## Roadmap

- [x] Core workflow implementation (Layers 1-6)
- [x] Human review integration
- [x] Automated cascade and finalization
- [ ] Multi-domain support (Information, Application, Infrastructure)
- [ ] Parallel policy processing
- [ ] Custom framework integrations
- [ ] Policy comparison and versioning
- [ ] Audit report generation
- [ ] GitHub Enterprise support

---

**Built with GitOps principles and AI-augmented architecture workflows**
