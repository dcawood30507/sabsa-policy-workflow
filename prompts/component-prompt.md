# Layer 5: Component — Generation Instructions

## Layer Purpose

The **Component Layer** answers the question: **"What specific tools and configurations?"**

This layer defines tool-specific configurations, implementation scripts (Infrastructure as Code), validation tests, deployment checklists, and rollback procedures. It translates implementation specifications into **concrete, executable artifacts**.

## Expected Sections

You must generate **exactly 5 sections** with these IDs and titles:

| Section ID | Title | Purpose |
|------------|-------|---------|
| **5-1** | Tool Configuration Specifications | Specific tool settings and parameters |
| **5-2** | Implementation Scripts | Infrastructure as Code, automation scripts |
| **5-3** | Validation Tests | Test cases proving correct implementation |
| **5-4** | Deployment Checklist | Pre/post deployment verification steps |
| **5-5** | Rollback Procedures | How to revert if implementation fails |

## Section-Specific Guidance

### 5-1: Tool Configuration Specifications

**Content to include:**
- **Specific tool/service names** (now you can name vendors/products):
  - AWS KMS, Azure Key Vault, HashiCorp Vault
  - Splunk, Datadog, AWS CloudWatch
  - Okta, Auth0, AWS Cognito
  - Specific firewall/WAF products

- **For each tool:**
  - **Configuration parameters** (exact settings, values, options)
  - **API/CLI commands** to set configurations
  - **Integration settings** (endpoints, credentials management, webhooks)
  - **Scaling/performance settings** (instance sizes, retention periods, throughput limits)
  - **High availability settings** (replication, backup, failover)

**Structure:**
```markdown
### 5.1.1 AWS KMS Configuration

**Key Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:root"},
      "Action": "kms:*",
      "Resource": "*"
    }
  ]
}
```

**Key Rotation:**
- Automatic rotation: `Enabled`
- Rotation period: `90 days`

**Key Aliases:**
- `alias/customer-pii-encryption-key`
```

**Framework references:**
- Vendor best practices documentation (AWS Well-Architected, Azure Best Practices)
- NIST SP 800-53 implementation guidance for specific controls
- CIS Benchmarks for specific tools

**Traceability:** Link to **4-1 (Control Implementation Specifications)**, **4-2 (Security Procedures)**, **4-3 (Technical Standards)**

### 5-2: Implementation Scripts

**Content to include:**
- **Infrastructure as Code** (Terraform, CloudFormation, ARM templates, etc.):
  - Key management resources
  - Encryption configuration
  - Access control policies
  - Logging and monitoring resources
  - Network security resources

- **Automation scripts** (Python, Bash, PowerShell):
  - Key rotation scripts
  - Access provisioning/deprovisioning scripts
  - Compliance checking scripts
  - Backup and recovery scripts

**For each script:**
- **Purpose:** What it does and when to use it
- **Prerequisites:** Required permissions, tools, configurations
- **Parameters:** Input parameters and their meanings
- **Usage examples:** How to execute with sample values
- **Error handling:** What to do if script fails

**Example format:**
```markdown
### 5.2.1 Terraform: AWS KMS Encryption Key

**File:** `kms_customer_pii_key.tf`

```hcl
resource "aws_kms_key" "customer_pii" {
  description             = "Encryption key for customer PII"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Purpose     = "CustomerPIIEncryption"
    Compliance  = "SOC2,GDPR"
  }
}

resource "aws_kms_alias" "customer_pii" {
  name          = "alias/customer-pii-encryption-key"
  target_key_id = aws_kms_key.customer_pii.key_id
}
```

**Usage:**
```bash
terraform init
terraform plan -out=kms.tfplan
terraform apply kms.tfplan
```

**Validation:**
```bash
aws kms describe-key --key-id alias/customer-pii-encryption-key
```
```

**Framework references:**
- Infrastructure as Code best practices (HashiCorp, AWS, Azure)
- DevSecOps principles
- GitOps workflow standards

**Traceability:** Link to **4-1 (Control Implementation Specifications)** and **4-2 (Security Procedures)**

### 5-3: Validation Tests

**Content to include:**

**Part A: Automated Compliance Validation Checks**

For controls that can be validated using automated tools (Wiz, ICS), generate a **validationChecks array** with specifications for:

- **Wiz Policy Specifications** (for cloud resource compliance):
  - Policy name and description
  - WizQL query to detect non-compliant resources
  - Remediation guidance
  - Severity level
  - Compliance framework mapping

- **ICS Check Specifications** (for cloud security posture):
  - Check name and identifier
  - Cloud provider and service
  - Expected result (PASS/FAIL criteria)
  - Remediation steps

**Part B: Manual Evidence Collection**

For controls that require manual validation (physical systems, processes, vendor attestations), specify:

- **JIRA Evidence Requests**:
  - Evidence type and description
  - Accepted file formats
  - Collection frequency
  - Responsible owner
  - JIRA project and ticket template

**Part C: Traditional Test Cases**

For operational testing during implementation, include traditional test cases with:
- Test ID, objective, type
- Prerequisites, test steps, expected results
- Pass/fail criteria

**Validation Checks Array Format:**

```json
"validationChecks": [
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
      "remediation": "Enable KMS encryption on RDS instance: aws rds modify-db-instance --db-instance-identifier <id> --storage-encrypted --kms-key-id <key-arn>",
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
    "requirement": "Physical HSM key rotation performed quarterly",
    "validationType": "manual",
    "evidenceRequired": {
      "type": "document",
      "formats": ["pdf", "docx", "jpg", "png"],
      "description": "Signed key rotation certificate from HSM vendor with rotation date and operator signature",
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
```

**Example markdown format (combining all three parts):**

```markdown
### 5.3 Validation Tests

#### 5.3.1 Automated Compliance Validation

**Validation Checks:**

**ENC-AWS-001: RDS KMS Encryption Required**
- **Type:** Automated (Wiz + ICS)
- **Requirement:** All RDS instances must use KMS encryption at rest
- **Wiz Policy Query:** `cloudResource where type='AWS RDS Instance' and encryptionEnabled=false`
- **Severity:** HIGH
- **Remediation:** Enable KMS encryption on RDS instance
- **Compliance Mapping:** SOC2-CC6.1, NIST-800-53-SC-28

**ENC-GCP-001: Cloud SQL Encryption Required**
- **Type:** Automated (Wiz + ICS)
- **Requirement:** All Cloud SQL instances must use customer-managed encryption keys
- **Wiz Policy Query:** `cloudResource where type='GCP Cloud SQL Instance' and customerManagedEncryption=false`
- **Severity:** HIGH

#### 5.3.2 Manual Evidence Collection

**ENC-HSM-001: Physical HSM Key Rotation**
- **Type:** Manual evidence request
- **Requirement:** Physical HSM key rotation performed quarterly
- **Evidence:** Signed rotation certificate from HSM vendor
- **Formats:** PDF, DOCX, JPG, PNG
- **Frequency:** Quarterly (next due: 2025-03-31)
- **Owner:** Security Operations Manager
- **JIRA Ticket:** Project SEC, template "hsm-rotation-evidence"

#### 5.3.3 Operational Test Cases

**Test ID:** ENC-001

**Objective:** Verify customer PII is encrypted using AWS KMS

**Test Type:** Security validation test

**Prerequisites:**
- AWS CLI configured with appropriate permissions
- Sample PII data loaded into test database
- KMS key created and operational

**Test Steps:**
1. Query AWS RDS to verify encryption status:
   ```bash
   aws rds describe-db-instances --db-instance-identifier prod-customer-db \
     --query 'DBInstances[0].StorageEncrypted'
   ```
2. Verify KMS key is in use:
   ```bash
   aws rds describe-db-instances --db-instance-identifier prod-customer-db \
     --query 'DBInstances[0].KmsKeyId'
   ```
3. Attempt to access database storage directly (should fail or show encrypted data)

**Expected Result:**
- `StorageEncrypted` returns `true`
- `KmsKeyId` matches the customer-pii-encryption-key ARN
- Direct storage access shows encrypted data (not plaintext)

**Pass Criteria:**
- All three checks return expected results
- No plaintext PII accessible via direct storage access
```

**IMPORTANT:** The validationChecks array should be included in your JSON output for section 5-3, alongside the markdown content. This enables automated compliance workflows.

**Framework references:**
- NIST SP 800-53A (Assessment Procedures)
- OWASP Testing Guide
- Cloud provider security testing guidance
- Wiz Policy Language documentation
- ICS Check specifications

**Traceability:** Link to **4-1 (Control Implementation Specifications)** — tests validate implementations

### 5-4: Deployment Checklist

**Content to include:**
- **Pre-deployment checks:**
  - [ ] Configuration reviewed and approved
  - [ ] Scripts tested in non-production environment
  - [ ] Backup of current configuration completed
  - [ ] Rollback plan documented and tested
  - [ ] Change window scheduled and communicated
  - [ ] Required permissions verified

- **Deployment steps:**
  - Numbered sequence of deployment actions
  - Verification checkpoint after each major step
  - Go/no-go decision points

- **Post-deployment validation:**
  - [ ] All validation tests executed and passed
  - [ ] Monitoring confirms expected behavior
  - [ ] No errors in logs for 24 hours
  - [ ] Stakeholder sign-off obtained
  - [ ] Documentation updated

**Structure:**
```markdown
### 5.4.1 AWS KMS Key Deployment Checklist

**Pre-Deployment (T-24 hours)**
- [ ] Terraform plan reviewed by security team
- [ ] Change request CR-2025-001 approved
- [ ] Backup of existing key configurations exported
- [ ] Rollback tested in staging environment
- [ ] Deployment window: Saturday 2025-01-18, 02:00-04:00 UTC
- [ ] On-call rotation confirmed

**Deployment (T=0)**
1. [ ] **Step 1:** Apply Terraform configuration
   - Command: `terraform apply kms.tfplan`
   - Verify: Key created with status "Enabled"
   - Go/No-Go: ✅ Proceed if enabled, ❌ Rollback if error

2. [ ] **Step 2:** Update application configurations to use new key
   - Update environment variables: `KMS_KEY_ID=<new-key-arn>`
   - Rolling restart of application instances
   - Verify: Application logs show successful KMS connection

3. [ ] **Step 3:** Validate encryption on new data
   - Execute test ENC-001
   - Verify: Test passes

**Post-Deployment (T+24 hours)**
- [ ] Execute validation tests 5-3 (all tests)
- [ ] Review CloudWatch metrics for KMS API errors (expect: 0)
- [ ] Review application logs for encryption errors (expect: none)
- [ ] Stakeholder sign-off from Security and Engineering leads
- [ ] Update runbook documentation with new key ARN
```

**Framework references:**
- ITIL Change Management
- DevOps deployment best practices
- Site Reliability Engineering (SRE) principles

**Traceability:** Link to **5-2 (Implementation Scripts)** and **5-3 (Validation Tests)**

### 5-5: Rollback Procedures

**Content to include:**
- **Rollback triggers** (when to rollback):
  - Validation test failures
  - Critical errors in monitoring
  - Application unavailability
  - Data integrity issues
  - Security breach indicators

- **Rollback steps** (detailed procedure):
  - Decision authority (who can authorize rollback)
  - Rollback commands/scripts
  - Verification of rollback success
  - Communication plan (who to notify)

- **Recovery considerations:**
  - Data consistency after rollback
  - In-flight transactions handling
  - Key material recovery (if keys rotated)
  - Audit trail of rollback action

**Example format:**
```markdown
### 5.5.1 KMS Key Deployment Rollback

**Rollback Triggers:**
- Validation test ENC-001 fails
- Application cannot connect to KMS (>5 errors in 5 minutes)
- KMS key status shows "Disabled" or "PendingDeletion"
- Critical data encrypted with wrong key (detected via audit)

**Decision Authority:**
- Incident Commander during change window
- Security Lead and Engineering Lead (both required)

**Rollback Steps:**
1. **Immediate action:** Stop all new encryptions
   ```bash
   # Disable new key
   aws kms disable-key --key-id alias/customer-pii-encryption-key
   ```

2. **Revert application configuration:**
   ```bash
   # Update environment variable to previous key
   export KMS_KEY_ID=arn:aws:kms:us-east-1:123456789012:key/OLD-KEY-ID
   # Rolling restart of application instances
   kubectl rollout undo deployment/customer-api
   ```

3. **Verify rollback:**
   - Execute test ENC-001 with old key
   - Confirm application logs show old key in use
   - Verify no encryption errors in CloudWatch

4. **Cleanup:**
   ```bash
   # Schedule new key for deletion (30-day window)
   aws kms schedule-key-deletion --key-id alias/customer-pii-encryption-key \
     --pending-window-in-days 30
   ```

5. **Communication:**
   - Notify stakeholders of rollback via incident channel
   - Document rollback reason in change request CR-2025-001
   - Schedule post-mortem within 48 hours

**Data Consistency:**
- Any data encrypted with new key during deployment must be re-encrypted with old key
- Automated re-encryption script: `scripts/re-encrypt-pii.py --key-id OLD-KEY-ID`

**Audit Trail:**
- CloudTrail logs all KMS operations (key disable, deletion scheduling)
- Change management system records rollback authorization and timing
```

**Framework references:**
- ITIL Incident Management
- NIST SP 800-53 CP-10 (System Recovery and Reconstitution)
- Site Reliability Engineering (SRE) error budgets and rollback practices

**Traceability:** Link to **5-4 (Deployment Checklist)**

## Upstream Context

You will receive:
- **Policy Summary** (≤150 words)
- **Section 4-1:** Control Implementation Specifications
- **Section 4-2:** Security Procedures
- **Section 4-3:** Technical Standards

Use these to define specific tools, configurations, and scripts.

## Traceability Instructions

For each section, include traceability references in this format:

```json
"5-1": [
  {
    "source": "POL-YYYY-NNN.physical.4-1",
    "relationship": "refines",
    "description": "Tool configurations refine implementation specifications with product-specific settings"
  },
  {
    "source": "POL-YYYY-NNN.physical.4-3",
    "relationship": "implements",
    "description": "Implements technical standards with exact tool configurations"
  }
]
```

Typical relationships for this layer:
- **refines** — Tool configs refine implementation specs (4-1) with product details
- **implements** — Scripts implement procedures (4-2) and technical standards (4-3)
- **validates** — Tests validate implementation specs (4-1)

## Output Schema

```json
{
  "sections": {
    "5-1": {
      "title": "Tool Configuration Specifications",
      "content": "## 5.1 Tool Configuration Specifications\n\n[Markdown with specific tool configs, code blocks]",
      "rationale_why": "AWS Well-Architected Framework, vendor best practices...",
      "rationale_condition": "Refines control implementation specs from 4-1 with product-specific details"
    },
    "5-2": {
      "title": "Implementation Scripts",
      "content": "## 5.2 Implementation Scripts\n\n[Markdown with IaC templates, automation scripts]",
      "rationale_why": "Infrastructure as Code best practices, DevSecOps principles...",
      "rationale_condition": "Implements procedures from 4-2 as executable scripts"
    },
    "5-3": {
      "title": "Validation Tests",
      "content": "## 5.3 Validation Tests\n\n[Markdown with automated checks, manual evidence requests, and test cases]",
      "rationale_why": "NIST SP 800-53A assessment procedures, OWASP testing guide, Wiz policy language...",
      "rationale_condition": "Validates implementation specifications from 4-1",
      "validationChecks": [
        {
          "checkId": "ENC-AWS-001",
          "requirement": "Specific validation requirement",
          "validationType": "automated",
          "tools": ["wiz", "ics"],
          "wizPolicy": {
            "policyName": "Policy name",
            "queryLanguage": "wiz-ql",
            "query": "WizQL query string",
            "severity": "HIGH|MEDIUM|LOW",
            "remediation": "Remediation steps",
            "complianceFrameworks": ["SOC2-CC6.1", "NIST-800-53-SC-28"]
          },
          "icsCheck": {
            "checkName": "check-identifier",
            "cloudProvider": "aws|gcp|azure",
            "service": "service-name",
            "checkType": "security",
            "expectedResult": "PASS"
          }
        },
        {
          "checkId": "ENC-HSM-001",
          "requirement": "Manual validation requirement",
          "validationType": "manual",
          "evidenceRequired": {
            "type": "document",
            "formats": ["pdf", "docx", "jpg", "png"],
            "description": "Evidence description",
            "frequency": "quarterly|monthly|annual",
            "nextDueDate": "YYYY-MM-DD",
            "owner": "Role or person responsible",
            "jiraTicket": {
              "project": "PROJECT-KEY",
              "issueType": "Evidence Request",
              "template": "template-name",
              "labels": ["compliance", "encryption"]
            }
          }
        }
      ]
    },
    "5-4": {
      "title": "Deployment Checklist",
      "content": "## 5.4 Deployment Checklist\n\n[Markdown with pre/deployment/post checklists]",
      "rationale_why": "ITIL Change Management, SRE deployment practices...",
      "rationale_condition": "Operationalizes scripts from 5-2 and tests from 5-3"
    },
    "5-5": {
      "title": "Rollback Procedures",
      "content": "## 5.5 Rollback Procedures\n\n[Markdown with rollback triggers, steps, recovery]",
      "rationale_why": "NIST SP 800-53 CP-10 system recovery, ITIL incident management...",
      "rationale_condition": "Provides recovery path for deployment checklist from 5-4"
    }
  }
}
```

## Quality Checklist

Before finalizing your response, verify:

- [ ] All 5 sections present with correct IDs (5-1 through 5-5)
- [ ] Each section has complete markdown content
- [ ] Tool configurations specify exact product names and settings
- [ ] Implementation scripts include actual code (Terraform, CloudFormation, Bash, Python)
- [ ] **Section 5-3 includes validationChecks array with both automated and manual checks**
- [ ] **Automated checks specify Wiz policies (WizQL queries) and ICS check identifiers**
- [ ] **Manual checks specify JIRA ticket requirements and evidence formats**
- [ ] Validation tests have clear pass/fail criteria
- [ ] Deployment checklist includes pre/deployment/post sections with checkboxes
- [ ] Rollback procedures define triggers and step-by-step recovery
- [ ] Code blocks properly formatted (use triple backticks with language identifier)
- [ ] Both rationale fields populated for each section
- [ ] Framework references include vendor-specific best practices
- [ ] Traceability links to Layer 4 sections (4-1, 4-2, 4-3)
- [ ] Valid JSON with proper escaping (especially for code blocks with quotes)

Generate the Component layer artifacts now.
