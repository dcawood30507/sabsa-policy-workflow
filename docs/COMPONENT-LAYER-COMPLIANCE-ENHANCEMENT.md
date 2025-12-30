# Component Layer Compliance Validation Enhancement

**Date:** 2025-12-30
**Commit:** c0861d9
**Status:** Complete

## Overview

Enhanced the Component layer (Layer 5) prompt to automatically generate hybrid compliance validation specifications when Claude creates SABSA policy artifacts.

## What Changed

### Modified File
- **`prompts/component-prompt.md`** - Section 5-3 (Validation Tests) guidance

### Enhancement Details

**Before:**
- Section 5-3 only guided Claude to generate manual test cases (e.g., ENC-001 with CLI commands)
- No guidance for automated compliance validation
- No integration with compliance tools (Wiz, ICS)
- No structured evidence collection workflow

**After:**
- Section 5-3 now generates **three types of validation**:
  1. **Automated Compliance Checks** - Wiz policies and ICS checks
  2. **Manual Evidence Collection** - JIRA ticket specifications
  3. **Operational Test Cases** - Traditional test procedures

### New JSON Structure

When Claude generates Layer 5, section 5-3 will now include a `validationChecks` array:

```json
{
  "sections": {
    "5-3": {
      "title": "Validation Tests",
      "content": "...(markdown content)...",
      "rationale_why": "...",
      "rationale_condition": "...",
      "validationChecks": [
        {
          "checkId": "ENC-AWS-001",
          "requirement": "All RDS instances must use KMS encryption",
          "validationType": "automated",
          "tools": ["wiz", "ics"],
          "wizPolicy": {
            "policyName": "RDS KMS Encryption Required",
            "queryLanguage": "wiz-ql",
            "query": "cloudResource where type='AWS RDS Instance' and encryptionEnabled=false",
            "severity": "HIGH",
            "remediation": "Enable KMS encryption...",
            "complianceFrameworks": ["SOC2-CC6.1", "NIST-800-53-SC-28"]
          },
          "icsCheck": {
            "checkName": "aws-rds-encryption-at-rest",
            "cloudProvider": "aws",
            "service": "rds",
            "checkType": "security",
            "expectedResult": "PASS"
          }
        },
        {
          "checkId": "ENC-HSM-001",
          "requirement": "Physical HSM key rotation quarterly",
          "validationType": "manual",
          "evidenceRequired": {
            "type": "document",
            "formats": ["pdf", "docx", "jpg", "png"],
            "description": "Signed rotation certificate from HSM vendor",
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
      ]
    }
  }
}
```

## User Requirements Addressed

From user request:
> "we have tools that validate configs. ICS and WIZ. For those things that can be validated with a tool or software platform, we should write the guidance for the check or the check policy language. for systems that don't support compliance via a tool, i want the ability to open a JIRA ticket to request evidence be uploaded as part of the final validation steps."

**Solution:**
1. ✅ **Automated validation** - Wiz policy specifications with WizQL queries
2. ✅ **Automated validation** - ICS check specifications with cloud provider/service details
3. ✅ **Manual evidence** - JIRA ticket specifications with evidence requirements
4. ✅ **Hybrid approach** - Both types can coexist in the same policy

## How It Works in the Workflow

### Step 1: Policy Initialization
User creates GitHub Issue requesting a new policy (e.g., POL-2025-005: Network Segmentation Policy)

### Step 2: Layers 1-4 Generation
System generates Contextual → Conceptual → Logical → Physical layers via PR workflow

### Step 3: Layer 5 (Component) Generation
When Claude generates Layer 5, section 5-3 now automatically includes:

**Markdown content:**
```markdown
### 5.3 Validation Tests

#### 5.3.1 Automated Compliance Validation

**ENC-AWS-001: RDS KMS Encryption Required**
- Type: Automated (Wiz + ICS)
- Requirement: All RDS instances must use KMS encryption at rest
- Wiz Policy Query: `cloudResource where type='AWS RDS Instance' and encryptionEnabled=false`
- Severity: HIGH
- Remediation: Enable KMS encryption on RDS instance
- Compliance Mapping: SOC2-CC6.1, NIST-800-53-SC-28

#### 5.3.2 Manual Evidence Collection

**ENC-HSM-001: Physical HSM Key Rotation**
- Type: Manual evidence request
- Requirement: Physical HSM key rotation performed quarterly
- Evidence: Signed rotation certificate from HSM vendor
- Formats: PDF, DOCX, JPG, PNG
- Frequency: Quarterly (next due: 2025-03-31)
- Owner: Security Operations Manager
- JIRA Ticket: Project SEC, template "hsm-rotation-evidence"

#### 5.3.3 Operational Test Cases

**Test ID:** ENC-001
(Traditional test case format with CLI commands)
```

**Plus validationChecks array in JSON** for automated processing

### Step 4: Future Automation (Planned)

Once Layer 5 is generated, the validationChecks array enables:

1. **Wiz Policy Deployment**
   - Extract Wiz policies from validationChecks
   - Generate YAML policy files
   - Deploy to Wiz platform via API/UI

2. **ICS Check Configuration**
   - Extract ICS checks from validationChecks
   - Generate check configuration files
   - Register checks in ICS platform

3. **JIRA Ticket Creation**
   - Extract manual evidence requirements
   - Create JIRA tickets using specified templates
   - Assign to responsible owners
   - Set due dates based on frequency

4. **Compliance Dashboard**
   - Aggregate automated check results (Wiz + ICS)
   - Track manual evidence collection status
   - Generate audit reports

## Example Use Case: Customer PII Encryption Policy

**Policy:** POL-2025-004 (Customer PII Encryption Policy)

**Layer 5, Section 5-3 would generate:**

### Automated Checks
1. **ENC-AWS-001** - RDS encryption validation (Wiz + ICS)
2. **ENC-AWS-002** - S3 bucket encryption validation (Wiz + ICS)
3. **ENC-GCP-001** - Cloud SQL encryption validation (Wiz + ICS)
4. **ENC-AZURE-001** - Azure SQL encryption validation (Wiz + ICS)

### Manual Evidence Requests
1. **ENC-HSM-001** - Physical HSM rotation certificate (quarterly)
2. **ENC-AUDIT-001** - Key access audit logs review (monthly)
3. **ENC-VENDOR-001** - Third-party encryption attestation (annual)

### Operational Tests
1. **ENC-001** - Verify KMS encryption operational test
2. **ENC-002** - Verify key rotation process test
3. **ENC-003** - Verify access logging test

## Benefits

### For Security Teams
- ✅ Automated continuous compliance monitoring (Wiz/ICS)
- ✅ Structured evidence collection workflow (JIRA)
- ✅ Clear mapping to compliance frameworks (SOC2, NIST)
- ✅ Audit-ready documentation

### For Engineering Teams
- ✅ Executable validation specifications (WizQL queries)
- ✅ Clear remediation guidance
- ✅ Integration with existing tools (Wiz, ICS, JIRA)

### For Compliance Teams
- ✅ Standardized evidence formats
- ✅ Automated vs manual validation tracking
- ✅ Framework mapping (SOC2, NIST, GDPR)
- ✅ Evidence due date tracking

### For Auditors
- ✅ AI-generated, traceable policy artifacts
- ✅ Automated compliance verification
- ✅ Evidence collection workflow
- ✅ Complete audit trail

## Next Steps

### Immediate (No Code Changes Needed)
1. ✅ **Prompt updated** - Layer 5 generation will now include validationChecks
2. ⏳ **Wait for Layer 5 PR** - POL-2025-004 will reach Layer 5 in ~4-5 PR cycles
3. ⏳ **Review generated output** - Verify Claude produces validationChecks array

### Future Enhancements (Requires Workflow)
1. **Wiz Policy Generator Workflow** - Extract and deploy Wiz policies
2. **ICS Check Generator Workflow** - Extract and configure ICS checks
3. **JIRA Evidence Workflow** - Create tickets for manual evidence
4. **Compliance Dashboard** - Aggregate results and evidence status

## Related Documentation

- **Architecture Design:** `docs/COMPLIANCE-VALIDATION-ARCHITECTURE.md`
- **Layer 5 Prompt:** `prompts/component-prompt.md`
- **Sample Policy:** `policies/POL-2025-004/` (currently at Layer 2)

## Testing Plan

### Test Case 1: New Policy Generation
**Action:** Create POL-2025-005 and progress to Layer 5
**Expected:** Section 5-3 includes validationChecks array with automated + manual checks
**Validation:** Review `policies/POL-2025-005/component/sections.json`

### Test Case 2: Validation Check Quality
**Action:** Review generated Wiz queries and ICS checks
**Expected:** Valid WizQL syntax, correct cloud providers, appropriate severity levels
**Validation:** Manual review by security team

### Test Case 3: JIRA Integration Readiness
**Action:** Extract JIRA ticket specifications
**Expected:** Complete ticket templates with all required fields
**Validation:** Attempt to create JIRA tickets using extracted specs

## Success Metrics

When this enhancement is working correctly:

1. ✅ **100% of Layer 5 artifacts** include validationChecks array
2. ✅ **Automated checks** have valid Wiz queries and ICS specifications
3. ✅ **Manual checks** have complete JIRA ticket requirements
4. ✅ **Framework mapping** links checks to SOC2, NIST, GDPR controls
5. ✅ **Zero rework** - Generated specs deploy to Wiz/ICS without modification

## Notes

- This enhancement does NOT create automated workflows (yet)
- Generated validationChecks are currently **documentation only**
- Future workflows will consume this data to deploy to Wiz/ICS/JIRA
- Architecture document (`COMPLIANCE-VALIDATION-ARCHITECTURE.md`) defines complete automation vision
