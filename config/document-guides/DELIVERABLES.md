# Document Guide System - Deliverables Summary

## Overview

Created a comprehensive JSON-based document guide system for SABSA layer artifacts that ensures consistent formatting, structure, content quality, and validation across all generated security policy documents.

## Deliverables

### 1. Master Schema (`master-schema.json`)

**Purpose**: Defines the required structure that all layer-specific guides must follow

**Key Features**:
- Layer metadata requirements (ID, name, number, version, purpose)
- Formatting specifications (fonts, colors, spacing)
- Section layout definitions (structure, required/optional elements, content guidelines)
- Content quality rules (traceability, framework alignment, technical depth)
- Validation rule specifications (structure, content, rationale checks)

**Schema Compliance**: All layer guides conform to this schema, ensuring consistency

### 2. Layer-Specific Document Guides (6 files)

#### `layer-1-contextual-guide.json`
- **Perspective**: Business stakeholder view
- **Tone**: Business-focused, non-technical
- **Technical Depth**: Conceptual
- **Word Count Range**: 400-1000 per section
- **Framework Focus**: NIST Privacy Framework, ISO 27001, GDPR
- **Key Characteristics**: No upstream traceability (first layer), business terminology, risk-focused

#### `layer-2-conceptual-guide.json`
- **Perspective**: Architect view
- **Tone**: Architectural, principles-based, technology-agnostic
- **Technical Depth**: Conceptual
- **Word Count Range**: 400-950 per section
- **Framework Focus**: NIST CSF, ISO 27001, SABSA
- **Key Characteristics**: 2+ traceability refs to Layer 1, capability-oriented, service definitions

#### `layer-3-logical-guide.json`
- **Perspective**: Designer view
- **Tone**: Formal, authoritative, compliance-focused
- **Technical Depth**: Detailed (standards and controls)
- **Word Count Range**: 400-1000 per section
- **Framework Focus**: NIST SP 800-53, ISO 27001, PCI DSS, GDPR
- **Key Characteristics**: Formal "SHALL" language, policy statements, control specifications

#### `layer-4-physical-guide.json`
- **Perspective**: Builder view
- **Tone**: Technical, implementation-focused
- **Technical Depth**: Implementation
- **Word Count Range**: 400-1100 per section
- **Framework Focus**: NIST SP 800-53, CIS Controls, cloud best practices
- **Key Characteristics**: Technology-specific but vendor-agnostic, procedures, integration architecture

#### `layer-5-component-guide.json` (v1.1)
- **Perspective**: Tradesman view
- **Tone**: Technical, tool-specific, compliance-validation ready
- **Technical Depth**: Implementation (executable)
- **Word Count Range**: 400-1500 per section (5-3 extended)
- **Framework Focus**: NIST SP 800-53A, CIS Controls, Wiz Policy Language, ICS
- **Key Characteristics**: 
  - **NEW v1.1 Feature**: Compliance validation v1.1 in Section 5-3
  - Automated checks: Wiz policies (WizQL queries), ICS checks (cloud provider)
  - Manual evidence: JIRA evidence request specifications
  - Vendor-specific configurations, IaC templates, executable scripts

**Section 5-3 Compliance Validation Specifications**:
- **Wiz Policies**: 6 required fields (policyName, queryLanguage, query, severity, remediation, complianceFrameworks)
- **ICS Checks**: 5 required fields (checkName, cloudProvider, service, checkType, expectedResult)
- **JIRA Evidence**: 11 required fields (8 in evidenceRequired, 4 in jiraTicket subobject)

#### `layer-6-operational-guide.json`
- **Perspective**: Operations view
- **Tone**: Operational, procedural, maintenance-focused
- **Technical Depth**: Implementation (runbooks)
- **Word Count Range**: 400-1300 per section
- **Framework Focus**: ITIL, NIST SP 800-61, ISO 20000
- **Key Characteristics**: Runbooks, monitoring specs, incident response, KPI definitions

### 3. Section Template (`section-templates/1-1-business-process-template.json`)

**Purpose**: Provides detailed content structure template for Section 1-1 (Business Process Overview)

**Features**:
- 5 subsection definitions (introduction, core process, stakeholders, assets, current vs desired)
- Word count guidance per subsection (50-200 words)
- Guiding questions to address
- Example content snippets
- Framework references (NIST Privacy Framework, ISO 27001)
- Quality checks (completeness, clarity, traceability)

**Pattern**: This template demonstrates the pattern for creating templates for all other sections

### 4. Validation Script (`scripts/validate-document-format.js`)

**Purpose**: Automated validation of generated artifacts against document guide specifications

**Functionality**:
1. **Structure Validation**: Verifies all required sections present in correct order
2. **Content Validation**: 
   - Word count validation (min/max ranges per section)
   - Traceability reference validation (minimum count)
   - Framework citation validation (regex pattern matching for NIST, ISO, GDPR, PCI DSS, SOC 2, CIS, FIPS)
3. **Rationale Validation**: Confirms rationale fields present and meet minimum length
4. **Report Generation**: Color-coded pass/fail/warning output

**Usage**:
```bash
node scripts/validate-document-format.js <policy-id> <layer>
```

**Example Output**:
- ✓ Green: Passed checks (structure correct, citations present, rationale sufficient)
- ⚠ Yellow: Warnings (word count exceeded but not critical)
- ✗ Red: Failed checks (missing sections, insufficient citations, no traceability)

**Exit Code**: 0 if all validations pass, 1 if any failures

### 5. README (`config/document-guides/README.md`)

**Purpose**: Comprehensive documentation for the document guide system

**Sections**:
1. **Purpose**: Why document guides exist (agent guidance, validation, documentation)
2. **Directory Structure**: Overview of all files and organization
3. **Master Schema**: Explanation of schema structure
4. **Layer-Specific Guides**: Detailed breakdown of all 6 layer guides
5. **Section Templates**: How to use and create section templates
6. **Using Document Guides**: Instructions for agents, validation scripts, and human reviewers
7. **Updating Guides**: Version management and change process
8. **Example Validation Output**: Sample validation report
9. **Framework Reference**: List of all compliance frameworks cited
10. **Version History**: Changelog for document guide system
11. **Support**: Help resources and references
12. **Future Enhancements**: Roadmap for additional features

**Special Features**:
- **Compliance Validation v1.1 Documentation**: Detailed guide to Layer 5 compliance features
- Wiz policy structure specifications
- ICS check structure specifications
- JIRA evidence template requirements

## Testing Results

**Test Case**: POL-2025-004 Contextual Layer

**Command**: `node scripts/validate-document-format.js POL-2025-004 contextual`

**Results**:
- ✓ 16 Passed: Structure, framework citations, rationale present
- ✗ 10 Failed: Word counts below minimum (expected - content is abbreviated), traceability file missing
- Total Checks: 26

**Validation**: Script successfully detected expected issues and confirmed correct elements

## File Structure

```
config/document-guides/
├── master-schema.json (3.8 KB)
├── layer-1-contextual-guide.json (12.4 KB)
├── layer-2-conceptual-guide.json (11.8 KB)
├── layer-3-logical-guide.json (11.3 KB)
├── layer-4-physical-guide.json (9.2 KB)
├── layer-5-component-guide.json (14.6 KB) - v1.1 with compliance validation
├── layer-6-operational-guide.json (11.9 KB)
├── section-templates/
│   └── 1-1-business-process-template.json (3.1 KB)
├── README.md (20.3 KB)
└── DELIVERABLES.md (this file)

scripts/
└── validate-document-format.js (6.8 KB) - executable validation script
```

## Key Metrics

- **Total Files Created**: 11
- **Total Lines of JSON Configuration**: ~2,800
- **Total Documentation**: ~1,200 lines (README + DELIVERABLES)
- **Validation Rules Defined**: 26 checks per layer
- **Framework Citations Supported**: 15+ frameworks (NIST, ISO, GDPR, PCI DSS, SOC 2, CIS, FIPS, SABSA, ITIL, Wiz, ICS)
- **Sections Defined**: 31 sections across 6 layers
- **Layer-Specific Characteristics Documented**: 60+ unique requirements

## Usage Workflow

### For Claude Agents During Generation

1. Load layer guide: `config/document-guides/layer-{n}-{layername}-guide.json`
2. Review formatting rules and apply to output
3. Follow section layouts for each section ID
4. Apply content guidelines (tone, perspective, tense, length)
5. Ensure quality (traceability, framework citations, rationale)
6. Self-validate against validation rules before returning

### For Validation in CI/CD

```bash
# In GitHub Actions workflow
- name: Validate Generated Artifacts
  run: |
    node scripts/validate-document-format.js ${{ inputs.policy-id }} ${{ inputs.layer }}
    if [ $? -ne 0 ]; then
      echo "Validation failed - see output above"
      exit 1
    fi
```

### For Human Reviewers

1. Open layer guide to understand expectations
2. Review generated sections.json against guide specifications
3. Check word counts, framework citations, traceability references
4. Verify tone, perspective, and technical depth appropriate
5. Provide feedback referencing specific guide requirements

## Compliance Validation v1.1 (Layer 5)

### Wiz Policy Example
```json
{
  "checkId": "ENC-AWS-001",
  "requirement": "All RDS instances must use KMS encryption at rest",
  "validationType": "automated",
  "tools": ["wiz", "ics"],
  "wizPolicy": {
    "policyName": "RDS KMS Encryption Required",
    "queryLanguage": "wiz-ql",
    "query": "cloudResource where type='AWS RDS Instance' and encryptionEnabled=false",
    "severity": "HIGH",
    "remediation": "Enable KMS encryption on RDS instance: aws rds modify-db-instance...",
    "complianceFrameworks": ["SOC2-CC6.1", "NIST-800-53-SC-28"]
  }
}
```

### ICS Check Example
```json
{
  "checkId": "ENC-AWS-001",
  "icsCheck": {
    "checkName": "aws-rds-encryption-at-rest",
    "cloudProvider": "aws",
    "service": "rds",
    "checkType": "security",
    "expectedResult": "PASS"
  }
}
```

### JIRA Evidence Example
```json
{
  "checkId": "ENC-HSM-001",
  "requirement": "Physical HSM key rotation performed quarterly",
  "validationType": "manual",
  "evidenceRequired": {
    "type": "document",
    "formats": ["pdf", "docx", "jpg", "png"],
    "description": "Signed key rotation certificate from HSM vendor...",
    "frequency": "quarterly",
    "nextDueDate": "2025-03-31",
    "owner": "Security Operations Manager",
    "jiraTicket": {
      "project": "SEC",
      "issueType": "Evidence Request",
      "template": "hsm-rotation-evidence",
      "labels": ["compliance", "encryption", "hsm"]
    }
  }
}
```

## Next Steps

1. **Expand Section Templates**: Create templates for all 31 sections (currently 1 of 31 complete)
2. **Integrate with Prompts**: Update layer prompts to reference document guides
3. **CI/CD Integration**: Add validation script to GitHub Actions workflows
4. **Agent Training**: Ensure Claude agents load and follow document guides
5. **Compliance Automation Workflows** (Future Phase 4):
   - Wiz policy deployment workflow
   - ICS check configuration workflow
   - JIRA evidence ticket creation workflow
   - Compliance dashboard development

## Success Criteria Met

✅ Master schema defined for all layer guides
✅ All 6 layer-specific guides created with comprehensive specifications
✅ Layer 5 includes compliance validation v1.1 features (Wiz, ICS, JIRA)
✅ Section template created demonstrating content structure pattern
✅ Validation script implemented and tested
✅ Comprehensive README documentation provided
✅ Example validation output demonstrates script functionality

## Version

**Document Guide System**: v1.1.0 (January 5, 2025)
- v1.1.0: Added compliance validation v1.1 to Layer 5
- v1.0.0: Initial release with all 6 layers and validation script
