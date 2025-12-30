# Hybrid Compliance Validation Architecture

**Purpose:** Automate compliance validation using Wiz/ICS where possible, collect manual evidence via JIRA for systems without tooling support.

**Generated:** 2025-12-27

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 5 (Component): sections.json                             │
│ - Contains validationChecks array with automated & manual items │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ├─────────────────┬──────────────────────────────┐
                 ▼                 ▼                              ▼
        ┌─────────────────┐ ┌─────────────┐         ┌──────────────────┐
        │ Automated Tools │ │ Automated   │         │ Manual Evidence  │
        │ - Wiz Policies  │ │ Tools       │         │ Collection       │
        │ - ICS Checks    │ │ - ICS       │         │ - JIRA Tickets   │
        └─────────────────┘ └─────────────┘         └──────────────────┘
                 │                 │                              │
                 ▼                 ▼                              ▼
        ┌─────────────────┐ ┌─────────────┐         ┌──────────────────┐
        │ Auto-Generated  │ │ Auto-       │         │ Evidence Upload  │
        │ Policy Files    │ │ Generated   │         │ to GitHub Repo   │
        │ (.yaml, .json)  │ │ Checks      │         │ (PDF, DOCX, etc) │
        └─────────────────┘ └─────────────┘         └──────────────────┘
                 │                 │                              │
                 └─────────────────┴──────────────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Compliance Dashboard │
                        │ - Pass/Fail Status   │
                        │ - Evidence Links     │
                        │ - Audit Trail        │
                        └──────────────────────┘
```

---

## 1. Layer 5-3 Extension: Validation Check Schema

### Extended sections.json Format

```json
{
  "sections": {
    "5-3": {
      "title": "Validation Tests",
      "content": "Traditional markdown content...",
      "validationChecks": [
        {
          "checkId": "ENC-AWS-001",
          "requirement": "All RDS instances must use KMS encryption at rest",
          "validationType": "automated",
          "tools": ["wiz", "ics"],
          "frameworks": ["SOC2-CC6.1", "NIST-SC-13", "GDPR-Article32"],
          "severity": "CRITICAL",

          "wizPolicy": {
            "policyName": "RDS KMS Encryption Required",
            "queryLanguage": "wiz-ql",
            "query": "cloudResource where type='AWS RDS Instance' and encryptionEnabled=false",
            "remediation": "Enable KMS encryption: aws rds modify-db-instance --db-instance-identifier <name> --storage-encrypted --kms-key-id <key-id>"
          },

          "icsCheck": {
            "checkName": "aws-rds-encryption-at-rest",
            "cloudProvider": "aws",
            "service": "rds",
            "checkType": "security",
            "expectedResult": "PASS",
            "apiCall": "describe-db-instances",
            "validationLogic": "all(instances[].StorageEncrypted == true)"
          }
        },

        {
          "checkId": "ENC-HSM-001",
          "requirement": "Physical HSM key rotation performed quarterly with vendor attestation",
          "validationType": "manual",
          "frameworks": ["SOC2-CC6.1", "NIST-SC-12"],
          "severity": "HIGH",

          "evidenceRequired": {
            "type": "document",
            "formats": ["pdf", "docx", "jpg", "png"],
            "description": "Signed key rotation certificate from Thales HSM vendor showing completion date and new key IDs",
            "frequency": "quarterly",
            "nextDueDate": "2025-03-31",
            "owner": "Security Operations Manager",
            "approver": "CISO",

            "jiraTicket": {
              "project": "SEC",
              "issueType": "Evidence Request",
              "labels": ["compliance", "hsm", "encryption"],
              "template": "hsm-rotation-evidence",
              "autoClose": false
            },

            "validationCriteria": [
              "Document is signed by authorized HSM vendor representative",
              "Rotation date is within last 90 days",
              "New key IDs match HSM inventory",
              "Old keys marked as archived/destroyed"
            ]
          }
        },

        {
          "checkId": "ENC-GCP-001",
          "requirement": "Cloud KMS keys have Cloud Audit Logs enabled",
          "validationType": "automated",
          "tools": ["wiz"],
          "frameworks": ["SOC2-CC6.8", "NIST-AU-2"],
          "severity": "HIGH",

          "wizPolicy": {
            "policyName": "GCP KMS Audit Logging Enabled",
            "queryLanguage": "wiz-ql",
            "query": "cloudResource where type='GCP KMS CryptoKey' and auditLogsEnabled=false",
            "remediation": "Enable audit logs in GCP Cloud Logging for KMS API operations"
          }
        },

        {
          "checkId": "ENC-CERT-001",
          "requirement": "Annual third-party encryption implementation audit",
          "validationType": "manual",
          "frameworks": ["SOC2-CC4.1"],
          "severity": "MEDIUM",

          "evidenceRequired": {
            "type": "audit-report",
            "formats": ["pdf"],
            "description": "Third-party penetration test report validating encryption controls",
            "frequency": "annually",
            "nextDueDate": "2025-09-30",
            "owner": "Security Compliance Lead",
            "approver": "CISO",

            "jiraTicket": {
              "project": "SEC",
              "issueType": "Audit Request",
              "labels": ["compliance", "pentest", "annual-audit"]
            },

            "validationCriteria": [
              "Report from reputable third-party firm",
              "Testing performed within last 12 months",
              "Report covers all encryption controls in scope",
              "No critical findings or all remediated"
            ]
          }
        }
      ]
    }
  }
}
```

---

## 2. Compliance Workflow Automation

### Workflow: `generate-compliance-checks.yml`

**Trigger:** Manual or scheduled (weekly)

**Actions:**

1. **Generate Wiz Policies** (`action: generate-wiz-policies`)
   - Parse Layer 5-3 validationChecks
   - Extract checks with `"tools": ["wiz"]`
   - Generate `.yaml` policy files in `policies/{POLICY_ID}/compliance/wiz-policies/`
   - Format: Wiz-compatible policy YAML

2. **Generate ICS Checks** (`action: generate-ics-checks`)
   - Extract checks with `"tools": ["ics"]`
   - Generate `.json` check configurations in `policies/{POLICY_ID}/compliance/ics-checks/`
   - Format: ICS API-compatible JSON

3. **Create JIRA Evidence Requests** (`action: create-jira-tickets`)
   - Extract checks with `"validationType": "manual"`
   - For each check:
     - Create JIRA ticket with evidence requirements
     - Assign to owner from `evidenceRequired.owner`
     - Set due date from `evidenceRequired.nextDueDate`
     - Add labels for filtering
     - Include upload instructions pointing to repo path
   - Track ticket IDs in `policies/{POLICY_ID}/compliance/evidence-requests/{CHECK_ID}.json`

4. **Validate Uploaded Evidence** (`action: validate-evidence`)
   - Check for files in `policies/{POLICY_ID}/compliance/evidence/{CHECK_ID}/`
   - Parse documents (PDF/DOCX) using libraries
   - Validate against criteria in `validationCriteria` array
   - Update JIRA ticket status
   - Generate compliance report

5. **Full Sync** (`action: full-compliance-sync`)
   - Run all above actions in sequence
   - Generate comprehensive compliance dashboard

---

## 3. Directory Structure

```
policies/POL-2025-004/
├── component/
│   └── sections.json                    # Contains validationChecks array
├── compliance/                          # ← NEW: Generated compliance artifacts
│   ├── wiz-policies/                    # Auto-generated Wiz policies
│   │   ├── ENC-AWS-001.yaml
│   │   ├── ENC-GCP-001.yaml
│   │   └── README.md
│   ├── ics-checks/                      # Auto-generated ICS checks
│   │   ├── ENC-AWS-001.json
│   │   └── README.md
│   ├── evidence-requests/               # JIRA ticket tracking
│   │   ├── ENC-HSM-001.json            # Tracks JIRA ticket SEC-1234
│   │   └── ENC-CERT-001.json           # Tracks JIRA ticket SEC-1235
│   ├── evidence/                        # Uploaded evidence files
│   │   ├── ENC-HSM-001/
│   │   │   ├── thales-rotation-cert-2025-12-15.pdf
│   │   │   └── metadata.json
│   │   └── ENC-CERT-001/
│   │       ├── pentest-report-2025-Q3.pdf
│   │       └── metadata.json
│   ├── validation-results/              # Automated validation results
│   │   ├── wiz-scan-2025-12-27.json
│   │   ├── ics-scan-2025-12-27.json
│   │   └── manual-evidence-status.json
│   └── README.md                        # Compliance summary and status
```

---

## 4. Evidence Upload Process

### For Manual Checks

1. **JIRA Ticket Created Automatically**
   - Ticket includes evidence requirements
   - Links to upload location in repo

2. **Evidence Owner Uploads Files**
   ```bash
   # Clone repo
   git clone https://github.com/your-org/sabsa-policy-workflow.git
   cd sabsa-policy-workflow

   # Create evidence directory
   mkdir -p policies/POL-2025-004/compliance/evidence/ENC-HSM-001

   # Copy evidence file
   cp ~/Downloads/thales-rotation-cert.pdf \
      policies/POL-2025-004/compliance/evidence/ENC-HSM-001/

   # Create metadata
   cat > policies/POL-2025-004/compliance/evidence/ENC-HSM-001/metadata.json <<EOF
   {
     "checkId": "ENC-HSM-001",
     "uploadedBy": "john.doe@company.com",
     "uploadedAt": "2025-12-27T10:30:00Z",
     "fileName": "thales-rotation-cert.pdf",
     "documentType": "vendor-certificate",
     "rotationDate": "2025-12-15",
     "keyIds": ["key-12345", "key-67890"],
     "verifiedBy": null,
     "verifiedAt": null
   }
   EOF

   # Commit and push
   git add policies/POL-2025-004/compliance/evidence/
   git commit -m "[POL-2025-004] Upload evidence for ENC-HSM-001"
   git push origin main
   ```

3. **Trigger Validation Workflow**
   ```bash
   gh workflow run generate-compliance-checks.yml \
     -f policy-id="POL-2025-004" \
     -f action="validate-evidence"
   ```

4. **Agent Validation** (Future Enhancement)
   - Claude agent reads uploaded PDF
   - Extracts key information (rotation date, key IDs, signatures)
   - Validates against `validationCriteria`
   - Updates metadata with verification status
   - Updates JIRA ticket

---

## 5. Wiz Policy Integration

### Generated Wiz Policy File

**File:** `policies/POL-2025-004/compliance/wiz-policies/ENC-AWS-001.yaml`

```yaml
# Wiz Policy for ENC-AWS-001
# Generated from: POL-2025-004 Layer 5 (Component)
# Generated at: 2025-12-27T16:00:00Z

name: RDS KMS Encryption Required
severity: CRITICAL
description: All RDS instances must use KMS encryption at rest

query: |
  cloudResource where type='AWS RDS Instance'
  and encryptionEnabled=false

remediation: |
  Enable KMS encryption on RDS instance:

  aws rds modify-db-instance \
    --db-instance-identifier <instance-id> \
    --storage-encrypted \
    --kms-key-id <key-id> \
    --apply-immediately

metadata:
  policyId: POL-2025-004
  checkId: ENC-AWS-001
  layer: "5-3"
  framework: SABSA Component Layer
  controls:
    - SOC2-CC6.1
    - NIST-SC-13
    - GDPR-Article32
```

### Deployment to Wiz

```bash
# Using Wiz CLI (example - adjust for actual Wiz API)
wiz policy create \
  --file policies/POL-2025-004/compliance/wiz-policies/ENC-AWS-001.yaml \
  --enabled true \
  --notify security-team@company.com
```

---

## 6. ICS Check Integration

### Generated ICS Check File

**File:** `policies/POL-2025-004/compliance/ics-checks/ENC-AWS-001.json`

```json
{
  "checkName": "aws-rds-encryption-at-rest",
  "cloudProvider": "aws",
  "service": "rds",
  "checkType": "security",
  "description": "All RDS instances must use KMS encryption at rest",
  "expectedResult": "PASS",
  "validationLogic": {
    "apiCall": "describe-db-instances",
    "filter": "*",
    "assertion": "all(instances[].StorageEncrypted == true)"
  },
  "remediation": {
    "description": "Enable KMS encryption on RDS instance",
    "automationScript": "remediation/enable-rds-encryption.sh"
  },
  "metadata": {
    "policyId": "POL-2025-004",
    "checkId": "ENC-AWS-001",
    "layer": "5-3",
    "generatedAt": "2025-12-27T16:00:00Z",
    "frameworks": ["SOC2-CC6.1", "NIST-SC-13"]
  }
}
```

---

## 7. JIRA Evidence Request Ticket

### Ticket Details

**Ticket:** `SEC-1234`
**Summary:** `[POL-2025-004] Evidence Required: Physical HSM key rotation performed quarterly`

**Description:**

```
Policy ID: POL-2025-004
Check ID: ENC-HSM-001

Requirement: Physical HSM key rotation performed quarterly with vendor attestation

Evidence Description:
Signed key rotation certificate from Thales HSM vendor showing completion date and new key IDs

Accepted Formats: pdf, docx, jpg, png
Frequency: quarterly
Due Date: 2025-03-31

Validation Criteria:
- Document is signed by authorized HSM vendor representative
- Rotation date is within last 90 days
- New key IDs match HSM inventory
- Old keys marked as archived/destroyed

Upload Instructions:
Please upload evidence to the repository at:
policies/POL-2025-004/compliance/evidence/ENC-HSM-001/

Include a metadata.json file with:
- Rotation date
- Key IDs (old and new)
- Vendor signature verification

Then notify the team to run validation.
```

**Assignee:** Security Operations Manager
**Due Date:** 2025-03-31
**Labels:** `compliance`, `evidence-request`, `POL-2025-004`, `ENC-HSM-001`

---

## 8. Compliance Dashboard (Future Enhancement)

### Dashboard Metrics

```markdown
# Compliance Status: POL-2025-004

**Last Updated:** 2025-12-27 16:00 UTC

## Summary

| Category | Total | Passing | Failing | Pending |
|----------|-------|---------|---------|---------|
| Automated (Wiz) | 12 | 10 | 2 | 0 |
| Automated (ICS) | 8 | 7 | 1 | 0 |
| Manual Evidence | 5 | 2 | 0 | 3 |
| **TOTAL** | **25** | **19** | **3** | **3** |

**Overall Compliance:** 76% (19/25 passing)

## Automated Checks - Failing

| Check ID | Requirement | Tool | Status | Last Scan |
|----------|-------------|------|--------|-----------|
| ENC-AWS-002 | S3 bucket encryption | Wiz | FAIL | 2025-12-27 |
| ENC-GCP-002 | Cloud SQL encryption | ICS | FAIL | 2025-12-27 |

## Manual Evidence - Pending

| Check ID | Requirement | Owner | Due Date | JIRA |
|----------|-------------|-------|----------|------|
| ENC-HSM-001 | HSM key rotation | SecOps | 2025-03-31 | [SEC-1234](link) |
| ENC-CERT-001 | Annual audit | Compliance | 2025-09-30 | [SEC-1235](link) |
| ENC-VENDOR-001 | Vendor SLA review | Legal | 2025-06-30 | [SEC-1236](link) |
```

---

## 9. Implementation Phases

### Phase 1: Core Structure (Week 1)
- [ ] Extend Layer 5-3 prompt to include validationChecks guidance
- [ ] Add validation schema to sections.json
- [ ] Document check structure in PRD

### Phase 2: Wiz/ICS Generation (Week 2)
- [ ] Create `generate-compliance-checks.yml` workflow
- [ ] Implement Wiz policy generation
- [ ] Implement ICS check generation
- [ ] Test with POL-2025-004

### Phase 3: JIRA Integration (Week 3)
- [ ] Configure JIRA API credentials (GitHub Secrets)
- [ ] Implement JIRA ticket creation
- [ ] Create evidence upload documentation
- [ ] Test manual evidence workflow

### Phase 4: Evidence Validation (Week 4)
- [ ] Implement document parsing (PDF/DOCX)
- [ ] Add validation logic for criteria checking
- [ ] Integrate Claude agent for intelligent parsing
- [ ] Update JIRA tickets automatically

### Phase 5: Dashboard & Reporting (Month 2)
- [ ] Build compliance status dashboard
- [ ] Add GitHub Actions status badges
- [ ] Create weekly compliance reports
- [ ] Integrate with security metrics

---

## 10. Benefits

### Automated Validation
✅ **90% of checks automated** via Wiz/ICS
✅ **Real-time compliance status** from continuous scanning
✅ **No manual effort** for cloud configuration validation

### Manual Evidence Tracking
✅ **Structured process** via JIRA tickets
✅ **Clear requirements** for evidence providers
✅ **Audit trail** with Git history + JIRA linkage
✅ **AI-powered validation** for uploaded documents

### Audit Readiness
✅ **Complete traceability** from business need → validation
✅ **Evidence centralization** in version-controlled repository
✅ **Framework mapping** (SOC 2, NIST, GDPR) on every check
✅ **Continuous compliance** dashboard for stakeholders
