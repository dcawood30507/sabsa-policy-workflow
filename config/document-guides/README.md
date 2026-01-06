# SABSA Document Guides

This directory contains JSON-based document guides that define formatting, structure, content, and validation rules for all SABSA layer artifacts. These guides ensure consistency, quality, and compliance across all generated security policy documents.

## Purpose

Document guides serve three key purposes:

1. **Agent Guidance**: Claude agents use these guides during artifact generation to ensure output meets quality standards
2. **Validation**: Automated validation scripts check generated artifacts against guide specifications
3. **Documentation**: Guides serve as reference documentation for humans reviewing or creating SABSA artifacts

## Directory Structure

```
config/document-guides/
├── master-schema.json                     # Schema all layer guides must follow
├── layer-1-contextual-guide.json          # Contextual layer guide
├── layer-2-conceptual-guide.json          # Conceptual layer guide
├── layer-3-logical-guide.json             # Logical layer guide
├── layer-4-physical-guide.json            # Physical layer guide
├── layer-5-component-guide.json           # Component layer guide (v1.1 with compliance validation)
├── layer-6-operational-guide.json         # Operational layer guide
├── section-templates/                     # Section-specific content templates
│   └── 1-1-business-process-template.json
└── README.md                              # This file
```

## Master Schema

`master-schema.json` defines the required structure for all layer-specific guides:

- **Layer Metadata**: ID, name, number, version, purpose
- **Formatting Rules**: Fonts, colors, spacing
- **Section Layouts**: Structure, required/optional elements, content guidelines
- **Content Quality Rules**: Traceability, framework alignment, technical depth
- **Validation Rules**: Structure checks, content checks, rationale requirements

All layer guides conform to this schema.

## Layer-Specific Guides

Each layer has a dedicated guide JSON file:

### Layer 1: Contextual (layer-1-contextual-guide.json)

**Perspective**: Business stakeholder view
**Tone**: Business-focused, non-technical, accessible to executives
**Technical Depth**: Conceptual
**Key Characteristics**:
- No upstream traceability required (first layer)
- Minimum 2 framework citations per section (NIST Privacy Framework, ISO 27001, GDPR)
- Word count: 400-1000 per section
- Mandatory sections: 1-1 through 1-5

**Sections**:
- 1-1: Business Process Overview
- 1-2: Business Drivers
- 1-3: Risk Context
- 1-4: Success Criteria
- 1-5: Constraints & Assumptions

### Layer 2: Conceptual (layer-2-conceptual-guide.json)

**Perspective**: Architect view
**Tone**: Architectural, principles-based, security-focused but technology-agnostic
**Technical Depth**: Conceptual
**Key Characteristics**:
- Minimum 2 traceability references to Layer 1 (contextual)
- Minimum 2 framework citations (NIST CSF, ISO 27001, SABSA)
- Word count: 400-950 per section
- Focus on capabilities, not implementations

**Sections**:
- 2-1: Security Objectives
- 2-2: Security Services
- 2-3: Security Principles
- 2-4: Trust Model
- 2-5: Security Domains

### Layer 3: Logical (layer-3-logical-guide.json)

**Perspective**: Designer view
**Tone**: Formal, authoritative, compliance-focused, mandatory language
**Technical Depth**: Detailed (standards and controls)
**Key Characteristics**:
- Minimum 2 traceability references to Layer 2 (conceptual)
- Minimum 3 framework citations (NIST SP 800-53, ISO 27001, PCI DSS, GDPR)
- Word count: 400-1000 per section
- Formal policy statements with "SHALL" language

**Sections**:
- 3-1: Security Policies
- 3-2: Security Standards
- 3-3: Logical Control Specifications
- 3-4: Information Classification
- 3-5: Logical Access Model

### Layer 4: Physical (layer-4-physical-guide.json)

**Perspective**: Builder view
**Tone**: Technical, implementation-focused, architecture-oriented
**Technical Depth**: Implementation
**Key Characteristics**:
- Minimum 2 traceability references to Layer 3 (logical) and Layer 2 (conceptual)
- Minimum 2 framework citations (NIST SP 800-53, CIS Controls, cloud best practices)
- Word count: 400-1100 per section
- Technology-specific but vendor-agnostic where possible

**Sections**:
- 4-1: Control Implementation Specifications
- 4-2: Security Procedures
- 4-3: Technical Standards
- 4-4: Integration Architecture
- 4-5: Exception Handling

### Layer 5: Component (layer-5-component-guide.json) - v1.1

**Perspective**: Tradesman view
**Tone**: Technical, tool-specific, configuration-focused, compliance-validation ready
**Technical Depth**: Implementation (executable code and configurations)
**Key Characteristics**:
- **Version 1.1 Feature**: Compliance validation v1.1 with Wiz policies, ICS checks, and JIRA specifications
- Minimum 2 traceability references to Layer 4 (physical)
- Minimum 2 framework citations (NIST SP 800-53A, CIS Controls, Wiz Policy Language, ICS)
- Word count: 400-1500 per section (5-3 extended for compliance validation)
- Vendor-specific, executable, testable

**Sections**:
- 5-1: Tool Configuration Specifications
- 5-2: Implementation Scripts (IaC, automation)
- 5-3: Validation Tests (automated: Wiz/ICS, manual: JIRA evidence, traditional test cases)
- 5-4: Deployment Checklist
- 5-5: Rollback Procedures

**Compliance Validation v1.1 (Section 5-3)**:

Section 5-3 generates a `validationChecks` array with hybrid compliance validation:

1. **Automated Checks** (`validationType: "automated"`):
   - **Wiz Policies**: WizQL queries to detect non-compliant resources
   - **ICS Checks**: Cloud provider checks (AWS, GCP, Azure)

2. **Manual Evidence Collection** (`validationType: "manual"`):
   - **JIRA Evidence Requests**: Structured tickets for manual evidence collection
   - Evidence types: document, screenshot, log, attestation
   - Frequencies: daily, weekly, monthly, quarterly, annual

**Required Fields for Wiz Policies**:
```json
{
  "wizPolicy": {
    "policyName": "Human-readable policy name",
    "queryLanguage": "wiz-ql",
    "query": "WizQL query detecting non-compliance",
    "severity": "CRITICAL|HIGH|MEDIUM|LOW",
    "remediation": "How to fix non-compliant resources",
    "complianceFrameworks": ["SOC2-CC6.1", "NIST-800-53-SC-28"]
  }
}
```

**Required Fields for ICS Checks**:
```json
{
  "icsCheck": {
    "checkName": "ics-check-identifier",
    "cloudProvider": "aws|gcp|azure",
    "service": "service-name",
    "checkType": "security|compliance|configuration",
    "expectedResult": "PASS|FAIL"
  }
}
```

**Required Fields for JIRA Evidence**:
```json
{
  "evidenceRequired": {
    "type": "document|screenshot|log|attestation",
    "formats": ["pdf", "docx", "jpg", "png"],
    "description": "What evidence is required",
    "frequency": "daily|weekly|monthly|quarterly|annual",
    "nextDueDate": "ISO 8601 date",
    "owner": "Role or person responsible",
    "jiraTicket": {
      "project": "JIRA project key",
      "issueType": "Evidence Request",
      "template": "Template name",
      "labels": ["compliance", "encryption"]
    }
  }
}
```

### Layer 6: Operational (layer-6-operational-guide.json)

**Perspective**: Operations view
**Tone**: Operational, procedural, maintenance-focused
**Technical Depth**: Implementation (runbooks and procedures)
**Key Characteristics**:
- Minimum 2 traceability references to Layer 5 (component) and Layer 4 (physical)
- Minimum 1 framework citation (ITIL, NIST SP 800-61, ISO 20000)
- Word count: 400-1300 per section
- Executable operational procedures

**Sections**:
- 6-1: Monitoring & Alerting
- 6-2: Operational Runbooks
- 6-3: Incident Response Playbooks
- 6-4: Maintenance Procedures
- 6-5: Metrics & Reporting
- 6-6: Continuous Improvement

## Section Templates

The `section-templates/` directory contains detailed content structure templates for specific sections. These provide:

- Subsection structure
- Word count guidance per subsection
- Guiding questions to address
- Example content snippets
- Framework references
- Quality checks

Example: `1-1-business-process-template.json` defines structure for Contextual Layer section 1-1.

## Using Document Guides

### For Claude Agents

When generating SABSA artifacts, agents should:

1. **Load the layer guide**: Read the appropriate `layer-{n}-{layername}-guide.json`
2. **Review formatting rules**: Apply fonts, colors, spacing per guide specifications
3. **Follow section layouts**: Use required structure and elements for each section
4. **Apply content guidelines**: Match tone, perspective, tense, and length requirements
5. **Ensure quality**: Include required traceability references and framework citations
6. **Validate output**: Self-check against validation rules before returning

### For Validation Scripts

The validation script (`scripts/validate-document-format.js`) uses guides to:

1. **Check structure**: Verify all required sections present in correct order
2. **Validate content**: Ensure word counts, traceability, and framework citations meet minimums
3. **Verify rationale**: Confirm rationale fields present and sufficient length
4. **Generate report**: Provide detailed pass/fail/warning output

**Usage**:
```bash
node scripts/validate-document-format.js <policy-id> <layer>
```

**Example**:
```bash
node scripts/validate-document-format.js POL-2025-004 contextual
```

**Output**:
- ✓ Green: Passed checks
- ⚠ Yellow: Warnings (not blockers)
- ✗ Red: Failed checks (blockers)

### For Human Reviewers

Reviewers can use guides to:

1. **Understand expectations**: Know what each section should contain
2. **Verify completeness**: Check all required elements present
3. **Assess quality**: Evaluate tone, depth, and framework alignment
4. **Provide feedback**: Reference specific guide requirements in PR comments

## Updating Guides

When guide requirements change:

1. **Update master schema** (if structural changes)
2. **Update layer-specific guides** to reflect new requirements
3. **Version guides** using semantic versioning (major.minor.patch)
4. **Document changes** in guide comments
5. **Update prompts** to reference new guide version
6. **Re-validate existing artifacts** to assess impact

## Example Validation Output

```bash
$ node scripts/validate-document-format.js POL-2025-004 contextual

Loading document guide and sections...

=== Structure Validation ===
  ✓ Section 1-1 present
  ✓ Section 1-2 present
  ✓ Section 1-3 present
  ✓ Section 1-4 present
  ✓ Section 1-5 present
  ✓ Sections in sequential order

=== Content Validation ===
  ✓ Section 1-1: 487 words (within 400-800)
  ✓ Section 1-2: 621 words (within 500-1000)
  ✓ Section 1-3: 712 words (within 500-1000)
  ✓ Section 1-4: 598 words (within 400-900)
  ✓ Section 1-5: 723 words (within 400-900)
  ✓ Section 1-1: 2 traceability reference(s)
  ✓ Section 1-2: 3 traceability reference(s)
  ✓ Section 1-3: 2 traceability reference(s)
  ✓ Section 1-4: 2 traceability reference(s)
  ✓ Section 1-5: 2 traceability reference(s)
  ✓ Section 1-1: 4 framework citation(s)
  ✓ Section 1-2: 6 framework citation(s)
  ✓ Section 1-3: 5 framework citation(s)
  ✓ Section 1-4: 4 framework citation(s)
  ✓ Section 1-5: 3 framework citation(s)

=== Rationale Validation ===
  ✓ Section 1-1: Rationale present (287 chars)
  ✓ Section 1-2: Rationale present (312 chars)
  ✓ Section 1-3: Rationale present (298 chars)
  ✓ Section 1-4: Rationale present (289 chars)
  ✓ Section 1-5: Rationale present (267 chars)

================================================================================
VALIDATION REPORT
Policy: POL-2025-004 | Layer: contextual
================================================================================

Passed (26)
  ✓ Section 1-1 present
  ✓ Section 1-2 present
  ... (full list)

================================================================================
SUMMARY
Total Checks: 26
✓ Passed: 26
⚠ Warnings: 0
✗ Failed: 0
================================================================================
```

## Framework Reference

Common frameworks cited across layers:

- **NIST Privacy Framework**: Data protection and privacy (Layer 1)
- **NIST CSF**: Cybersecurity framework (Layers 1-2)
- **NIST RMF**: Risk management framework (Layer 1)
- **NIST SP 800-53**: Security controls (Layers 3-5)
- **NIST SP 800-53A**: Control assessment (Layer 5)
- **NIST SP 800-61**: Incident response (Layer 6)
- **ISO 27001**: Information security management (All layers)
- **ISO 20000**: IT service management (Layer 6)
- **GDPR**: Data protection regulation (Layers 1, 3)
- **PCI DSS**: Payment card security (Layers 1, 3)
- **SOC 2**: Trust services criteria (Layers 1-3)
- **CIS Controls**: Security best practices (Layers 3-5)
- **SABSA**: Security architecture framework (Layer 2)
- **ITIL**: IT service management (Layer 6)
- **Wiz Policy Language**: Cloud security policy queries (Layer 5 v1.1)
- **ICS Checks**: Cloud compliance checks (Layer 5 v1.1)

## Version History

- **v1.1.0** (2025-01-05): Added compliance validation v1.1 to Layer 5 Component guide
- **v1.0.0** (2025-01-05): Initial document guide system release

## Support

For questions or issues:

1. Review this README and layer-specific guides
2. Examine section templates for detailed structure examples
3. Run validation script to identify specific issues
4. Consult `SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md` for requirements
5. Reference `CLAUDE.md` for formatting conventions

## Future Enhancements

Potential future additions:

- [ ] Additional section templates for all layer sections
- [ ] Visual formatting examples (color swatches, layout diagrams)
- [ ] Framework mapping matrices (which frameworks apply to which sections)
- [ ] Content quality heuristics (readability, clarity, conciseness)
- [ ] Automated framework citation validation (check control IDs exist)
- [ ] Multi-language support for international deployments
- [ ] PDF/DOCX export format specifications
