# Layer 6: Operational — Generation Instructions

## Layer Purpose

The **Operational Layer** answers the question: **"How will it be maintained?"**

This is the final SABSA layer, defining operational runbooks, monitoring/alerting, incident response playbooks, maintenance procedures, metrics/reporting, and continuous improvement processes. It ensures security controls **remain effective over time** through ongoing operations.

## Expected Sections

You must generate **exactly 6 sections** with these IDs and titles:

| Section ID | Title | Purpose |
|------------|-------|---------|
| **6-1** | Monitoring & Alerting | What to monitor, alert thresholds, escalation |
| **6-2** | Operational Runbooks | Day-to-day operational procedures |
| **6-3** | Incident Response Playbooks | How to respond to security events |
| **6-4** | Maintenance Procedures | Scheduled maintenance tasks and updates |
| **6-5** | Metrics & Reporting | KPIs, dashboards, compliance reporting |
| **6-6** | Continuous Improvement | Feedback loops and improvement process |

## Section-Specific Guidance

### 6-1: Monitoring & Alerting

**Content to include:**
- **Monitoring requirements** for each control:
  - **Key metrics** to track (encryption status, key age, access attempts, API errors)
  - **Data sources** (CloudWatch, Splunk, Datadog, application logs)
  - **Collection frequency** (real-time, 1-minute, 5-minute, hourly)
  - **Retention periods** (30 days, 90 days, 1 year)

- **Alert definitions:**
  - **Alert name** and severity (Critical, High, Medium, Low)
  - **Trigger condition** (exact threshold, query, rule)
  - **Alert routing** (who gets notified, escalation path)
  - **Response SLA** (how quickly to acknowledge/respond)
  - **Auto-remediation** (if applicable)

**Example format:**
```markdown
### 6.1.1 KMS Key Monitoring

**Metrics to Track:**
- `kms:Decrypt` API errors (any non-zero indicates encryption issue)
- `kms:GenerateDataKey` latency (>100ms may impact application)
- Key rotation status (should rotate every 90 days)
- Key state (should always be "Enabled")

**Data Source:** AWS CloudWatch Metrics

**Collection Frequency:** 1-minute intervals

**Retention Period:** 90 days

---

**Alert: KMS-CRIT-001 - Encryption Key Disabled**

**Severity:** Critical

**Trigger Condition:**
```sql
SELECT key_state FROM aws_kms_keys
WHERE alias = 'alias/customer-pii-encryption-key'
AND key_state != 'Enabled'
```

**Alert Routing:**
- Immediate: PagerDuty → On-call Security Engineer
- Escalation (if no ack in 5 min): Security Lead + Engineering Manager

**Response SLA:**
- Acknowledge: 5 minutes
- Initial response: 15 minutes
- Resolution: 1 hour

**Auto-Remediation:** None (requires manual investigation)
```

**Framework references:**
- NIST SP 800-53 SI-4 (System Monitoring)
- ISO 27001 A.12.4 (Logging and monitoring)
- SRE principles (observability, SLIs, SLOs)

**Traceability:** Link to **5-1 (Tool Configuration Specifications)** and **5-3 (Validation Tests)**

### 6-2: Operational Runbooks

**Content to include:**
- **Day-to-day operational procedures:**
  - **Key rotation runbook** (how to rotate encryption keys manually if needed)
  - **Access review runbook** (quarterly access recertification procedure)
  - **Log review runbook** (weekly security log review process)
  - **Configuration drift detection** (how to identify and remediate config changes)
  - **Health check runbook** (daily/weekly health verification)

**For each runbook:**
- **Frequency:** How often this task is performed (daily, weekly, monthly, quarterly, annually, on-demand)
- **Owner:** Role responsible for execution
- **Prerequisites:** Required tools, permissions, access
- **Procedure:** Step-by-step instructions with screenshots/examples
- **Expected duration:** How long this should take
- **Documentation:** Where to record completion
- **Escalation:** When to escalate and to whom

**Example format:**
```markdown
### 6.2.1 Quarterly Access Review Runbook

**Frequency:** Quarterly (Jan 15, Apr 15, Jul 15, Oct 15)

**Owner:** Security Operations Team

**Expected Duration:** 4-6 hours

**Prerequisites:**
- Access to IAM management console or CLI
- List of all IAM roles/users with KMS permissions
- Previous quarter's review results

**Procedure:**

**Step 1: Generate access report**
```bash
# Export all IAM entities with kms:* permissions
aws iam generate-credential-report
aws iam get-credential-report --output json > access-report-$(date +%Y-%m-%d).json
```

**Step 2: Identify users with key access**
```bash
# Query for users/roles with KMS decrypt permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789012:role/CustomerDataRole \
  --action-names kms:Decrypt \
  --resource-arns arn:aws:kms:us-east-1:123456789012:key/CUSTOMER-PII-KEY
```

**Step 3: Review and validate each access**
- For each user/role:
  - Verify business justification still valid
  - Check last access date (remove if >90 days unused)
  - Confirm with resource owner (manager approval)
  - Document decision in access review spreadsheet

**Step 4: Revoke unnecessary access**
```bash
# Remove policy attachment for revoked access
aws iam detach-role-policy \
  --role-name UnusedRole \
  --policy-arn arn:aws:iam::aws:policy/KMSKeyAccess
```

**Step 5: Document and report**
- Update access review tracker: `docs/access-reviews/YYYY-QN-kms-review.md`
- Generate summary report for Security Lead
- Schedule next quarterly review

**Escalation:**
- If business owner doesn't respond within 5 days: Escalate to their manager
- If critical access needs removal but blocked: Escalate to CISO

**Success Criteria:**
- All access reviewed and documented
- No orphaned access (users/roles with no business justification)
- Report delivered to Security Lead within 7 days of quarter end
```

**Framework references:**
- NIST SP 800-53 AC-2 (Account Management)
- ISO 27001 A.9.2.6 (Removal of access rights)
- SOC 2 CC6.3 (Logical access controls)

**Traceability:** Link to **5-4 (Deployment Checklist)** and **4-5 (Exception Handling)**

### 6-3: Incident Response Playbooks

**Content to include:**
- **Security incident playbooks** for each threat scenario:
  - **Encryption key compromise** (key leaked, unauthorized access detected)
  - **Data breach** (customer PII accessed without authorization)
  - **Access control failure** (authentication bypass, privilege escalation)
  - **Monitoring failure** (logs not being collected, SIEM down)
  - **Compliance violation** (audit finding, regulatory notice)

**For each playbook:**
- **Trigger conditions:** What indicates this incident type
- **Severity classification:** How to determine severity (Critical/High/Medium/Low)
- **Immediate response actions** (first 15 minutes)
- **Investigation steps** (evidence collection, log analysis, root cause)
- **Containment actions** (isolate, disable, block)
- **Eradication actions** (remove threat, patch vulnerability)
- **Recovery actions** (restore service, re-encrypt data, rotate credentials)
- **Post-incident actions** (lessons learned, preventive measures)

**Example format:**
```markdown
### 6.3.1 Encryption Key Compromise Playbook

**Trigger Conditions:**
- KMS key material found in public repository (GitHub, GitLab)
- Unauthorized `kms:Decrypt` calls from unknown IP addresses
- Security alert: "KMS key exported to external account"
- Report from threat intelligence: Key appears in credential dump

**Severity Classification:**
- **Critical:** Key material publicly exposed OR active exploitation detected
- **High:** Key accessed by unauthorized internal user
- **Medium:** Suspicious access pattern but no confirmed breach

**Incident Response Team:**
- Incident Commander: On-call Security Lead
- Responders: Security Engineer, Cloud Engineer, Privacy Officer
- Communication: CISO, Legal (for Critical/High)

---

**Phase 1: Immediate Response (T+0 to T+15 minutes)**

1. **Activate incident response:**
   - Create incident ticket: `INC-YYYY-NNN-KEY-COMPROMISE`
   - Page incident response team via PagerDuty
   - Start incident war room: Zoom link or Slack channel

2. **Contain the incident:**
   ```bash
   # IMMEDIATE: Disable compromised key
   aws kms disable-key --key-id alias/customer-pii-encryption-key

   # Revoke all active sessions using this key
   aws kms revoke-grant --key-id CUSTOMER-PII-KEY --grant-id ALL
   ```

3. **Preserve evidence:**
   ```bash
   # Export CloudTrail logs for forensic analysis
   aws cloudtrail lookup-events \
     --lookup-attributes AttributeKey=ResourceName,AttributeValue=CUSTOMER-PII-KEY \
     --start-time $(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S) \
     --output json > evidence-kms-$(date +%Y%m%d-%H%M%S).json
   ```

---

**Phase 2: Investigation (T+15 to T+60 minutes)**

4. **Determine scope of compromise:**
   - How was key accessed? (API call analysis)
   - Who accessed it? (IAM user/role identification)
   - What data was decrypted? (query application logs)
   - When did compromise occur? (timeline reconstruction)

5. **Assess data exposure:**
   ```bash
   # Identify all data encrypted with compromised key
   aws rds describe-db-instances --query 'DBInstances[?KmsKeyId==`CUSTOMER-PII-KEY-ARN`]'
   aws s3api list-buckets --query 'Buckets[*].Name' | xargs -I {} \
     aws s3api get-bucket-encryption --bucket {}
   ```

6. **Determine if data breach occurred:**
   - Did attacker successfully decrypt customer PII?
   - Was decrypted data exfiltrated? (check network logs, S3 access logs)
   - Document findings for breach notification decision

---

**Phase 3: Containment & Eradication (T+1 hour to T+4 hours)**

7. **Rotate encryption key:**
   ```bash
   # Create new key
   terraform apply -target=aws_kms_key.customer_pii_v2

   # Update application configuration
   kubectl set env deployment/customer-api KMS_KEY_ID=new-key-arn
   ```

8. **Re-encrypt all data:**
   ```bash
   # Execute re-encryption script for all affected data stores
   ./scripts/re-encrypt-rds-with-new-key.sh OLD_KEY_ARN NEW_KEY_ARN
   ./scripts/re-encrypt-s3-with-new-key.sh OLD_KEY_ARN NEW_KEY_ARN
   ```

9. **Remove compromised key:**
   ```bash
   # Schedule deletion (30-day waiting period)
   aws kms schedule-key-deletion --key-id OLD_KEY_ID --pending-window-in-days 30
   ```

10. **Patch vulnerability:**
    - Remove hardcoded credentials from code repositories
    - Revoke overprivileged IAM permissions
    - Implement secret scanning (e.g., GitGuardian, AWS Secrets Manager)

---

**Phase 4: Recovery (T+4 hours to T+24 hours)**

11. **Restore normal operations:**
    - Verify all applications using new key successfully
    - Execute validation tests from 5-3
    - Monitor for errors over 24-hour period

12. **Verify no ongoing unauthorized access:**
    - Review CloudTrail for continued suspicious activity
    - Confirm all unauthorized access paths closed

---

**Phase 5: Post-Incident (T+24 hours to T+7 days)**

13. **Breach notification assessment:**
    - Determine if customer data was accessed/exfiltrated
    - Consult Legal and Privacy Officer
    - If breach confirmed: Follow breach notification procedure (see 6-3.5)

14. **Conduct lessons learned:**
    - Root cause analysis (5 Whys)
    - Timeline reconstruction
    - What worked well / what didn't
    - Preventive actions identified

15. **Implement preventive measures:**
    - Update IAM policies to prevent similar access
    - Implement automated secret scanning in CI/CD
    - Add additional monitoring/alerting rules
    - Update runbooks based on lessons learned

16. **Close incident:**
    - Final incident report published to stakeholders
    - Incident ticket closed with full documentation
    - Post-mortem meeting scheduled with leadership

**Escalation Triggers:**
- Data breach confirmed → Escalate to CISO + Legal immediately
- Unable to contain within 1 hour → Escalate to Incident Commander + Engineering VP
- Regulatory reporting required → Engage Compliance and Legal teams

**Success Criteria:**
- Compromised key disabled within 15 minutes
- All data re-encrypted with new key within 4 hours
- No customer data exfiltrated (or breach notification completed if occurred)
- Root cause identified and preventive measures implemented
```

**Framework references:**
- NIST SP 800-61 Rev. 2 (Incident Handling Guide)
- ISO 27001 A.16.1 (Incident management)
- SANS Incident Handler's Handbook

**Traceability:** Link to **5-5 (Rollback Procedures)** and **4-5 (Exception Handling)**

### 6-4: Maintenance Procedures

**Content to include:**
- **Scheduled maintenance tasks:**
  - **Key rotation schedule** (automated + manual verification)
  - **Software/firmware updates** (OS patches, tool updates, library upgrades)
  - **Configuration reviews** (monthly drift detection and remediation)
  - **Certificate renewals** (TLS certs, code signing certs)
  - **Backup verification** (monthly restore testing)
  - **Disaster recovery testing** (annual DR drill)

**For each maintenance task:**
- **Schedule:** When this occurs (cron schedule, calendar dates)
- **Automation status:** Automated, semi-automated, manual
- **Procedure:** Step-by-step instructions (or reference to automation script)
- **Validation:** How to verify successful completion
- **Rollback plan:** What to do if maintenance causes issues
- **Downtime:** Expected service impact (if any)
- **Notification:** Who to notify before/after maintenance

**Example format:**
```markdown
### 6.4.1 Automated KMS Key Rotation

**Schedule:** Every 90 days (automated via AWS KMS)

**Automation:** Fully automated (AWS KMS automatic key rotation)

**Verification Procedure:**
```bash
# Check key rotation status
aws kms describe-key --key-id alias/customer-pii-encryption-key \
  --query 'KeyMetadata.KeyRotationEnabled'

# View rotation history
aws kms list-key-rotations --key-id alias/customer-pii-encryption-key
```

**Expected Output:**
- `KeyRotationEnabled` = `true`
- Last rotation date within 90 days of current date

**Notification:**
- Automated email to Security Operations team on rotation completion
- No customer notification required (transparent operation)

**Downtime:** None (seamless rotation)

**Rollback:** N/A (old key versions retained for decryption of existing ciphertext)

---

### 6.4.2 Monthly Security Patch Management

**Schedule:** Second Tuesday of each month (following Microsoft Patch Tuesday)

**Automation:** Semi-automated (AWS Systems Manager Patch Manager)

**Owner:** Cloud Operations Team

**Procedure:**

1. **Pre-patching (T-2 days):**
   - Review patch release notes for breaking changes
   - Snapshot all production instances
   - Notify application teams of maintenance window

2. **Patching (T=0):**
   ```bash
   # Apply patches via Systems Manager
   aws ssm send-command \
     --document-name "AWS-RunPatchBaseline" \
     --targets "Key=tag:Environment,Values=Production" \
     --parameters "Operation=Install"
   ```

3. **Validation (T+1 hour):**
   - Verify all instances rebooted successfully
   - Execute health checks from 5-3
   - Monitor application metrics for anomalies

4. **Rollback (if needed):**
   ```bash
   # Restore from snapshot if critical issue
   aws ec2 create-image --instance-id i-xxxxx --name "pre-patch-backup"
   ```

**Downtime:** 15-30 minutes per instance (rolling restart)

**Notification:**
- T-48 hours: Email to stakeholders with maintenance window
- T+2 hours: Completion notification with patch summary

**Success Criteria:**
- All critical/high severity patches applied within 30 days
- No application outages or errors post-patching
- Patch compliance score >95% in AWS Systems Manager
```

**Framework references:**
- NIST SP 800-40 Rev. 4 (Patch and Vulnerability Management)
- ISO 27001 A.12.6.1 (Management of technical vulnerabilities)
- CIS Controls v8: Control 7 (Continuous Vulnerability Management)

**Traceability:** Link to **5-4 (Deployment Checklist)**

### 6-5: Metrics & Reporting

**Content to include:**
- **Key Performance Indicators (KPIs):**
  - **Security KPIs:** Encryption coverage %, key rotation compliance %, access review completion %
  - **Operational KPIs:** Incident MTTR, alert false positive rate, system uptime
  - **Compliance KPIs:** Audit findings remediation rate, policy exception count

- **Dashboards:**
  - Executive dashboard (high-level, monthly)
  - Security operations dashboard (daily monitoring)
  - Compliance dashboard (audit readiness)

- **Reports:**
  - **Daily:** Operational health report (automated)
  - **Weekly:** Security incident summary
  - **Monthly:** Compliance posture report
  - **Quarterly:** Risk scorecard and trend analysis
  - **Annually:** SOC 2 / ISO 27001 audit evidence packages

**For each metric:**
- **Metric name** and description
- **Data source** and calculation method
- **Target value** (goal to achieve)
- **Reporting frequency** (real-time, daily, weekly, monthly)
- **Audience** (who receives this report)

**Example format:**
```markdown
### 6.5.1 Encryption Coverage Percentage

**Metric:** Percentage of customer PII data stores with encryption enabled

**Calculation:**
```sql
(COUNT(encrypted_datastores) / COUNT(total_datastores_with_pii)) * 100
```

**Data Sources:**
- AWS Config: RDS encryption status
- AWS Config: S3 bucket encryption status
- Custom script: Application-level encryption audit

**Target:** 100% (all PII data stores encrypted)

**Current Value:** [Display in dashboard]

**Reporting Frequency:** Daily (dashboard), Monthly (compliance report)

**Audience:**
- Daily: Security Operations team
- Monthly: CISO, Compliance team, Audit committee

**Dashboard Visualization:** Gauge chart (red <95%, yellow 95-99%, green 100%)

**Alerting:** Trigger alert if drops below 100% (indicates new unencrypted datastore)

---

### 6.5.2 Key Rotation Compliance

**Metric:** Percentage of encryption keys rotated within required 90-day period

**Calculation:**
```python
# Pseudocode
for each key:
    days_since_rotation = current_date - last_rotation_date
    if days_since_rotation <= 90:
        compliant_count += 1

compliance_percentage = (compliant_count / total_keys) * 100
```

**Data Source:** AWS KMS API (`list-key-rotations`)

**Target:** 100%

**Reporting Frequency:** Weekly (dashboard), Monthly (compliance report)

**Audience:** Security Operations, Compliance, CISO

**Trend Analysis:** Track over time to identify rotation issues early

---

### 6.5.3 Monthly Compliance Posture Report

**Report Structure:**

**1. Executive Summary**
- Overall compliance score (Green/Yellow/Red)
- Key achievements this month
- Critical findings requiring attention
- Trend vs. last month

**2. Control Effectiveness Metrics**
- Encryption coverage: [XX]%
- Key rotation compliance: [XX]%
- Access review completion: [XX]%
- Vulnerability remediation rate: [XX]%

**3. Incident Summary**
- Total incidents: [N]
- By severity: Critical [N], High [N], Medium [N], Low [N]
- MTTR: [X.X hours]
- Unresolved incidents: [N]

**4. Audit Findings**
- Open findings: [N]
- Findings remediated this month: [N]
- Overdue findings: [N] (with action plan)

**5. Risk Register Updates**
- New risks identified: [N]
- Risks mitigated: [N]
- Top 5 residual risks (with mitigation status)

**6. Next Month Focus**
- Upcoming audits / assessments
- Planned improvements / initiatives
- Key milestones

**Delivery:**
- Generated on 5th business day of each month
- Distributed via email to CISO, Compliance, Audit, Executive Leadership
- Stored in compliance documentation repository
```

**Framework references:**
- ISO 27001 Clause 9.3 (Management review)
- SOC 2 CC4.1 (Monitoring activities)
- NIST CSF (Measurement and metrics)

**Traceability:** Link to **5-3 (Validation Tests)** and **4-2 (Security Procedures)**

### 6-6: Continuous Improvement

**Content to include:**
- **Feedback loop processes:**
  - **Post-incident reviews** (lessons learned after every incident)
  - **Metric review meetings** (monthly review of KPIs and trends)
  - **Audit findings remediation** (process for addressing audit gaps)
  - **Threat intelligence integration** (how new threats inform policy updates)
  - **Control effectiveness testing** (periodic validation that controls still work)

- **Improvement initiatives:**
  - **Process improvements** (automation opportunities, workflow optimization)
  - **Technology improvements** (tool upgrades, new capabilities)
  - **Policy updates** (revisions based on lessons learned or regulatory changes)

- **Governance:**
  - **Improvement backlog** (prioritized list of improvements)
  - **Review cadence** (quarterly security architecture review)
  - **Approval process** (who approves improvement initiatives)
  - **Tracking mechanism** (Jira, ServiceNow, project management tool)

**Example format:**
```markdown
### 6.6.1 Post-Incident Review Process

**Trigger:** Every security incident (regardless of severity)

**Timeline:** Within 5 business days of incident closure

**Participants:**
- Incident Commander (facilitator)
- All incident responders
- Relevant stakeholders (app owners, infrastructure teams)
- Security leadership (observer, optional)

**Meeting Structure:**

**1. Incident Timeline Reconstruction (15 min)**
- Review incident from detection to resolution
- Identify key decision points and delays
- No blame—focus on process and tools

**2. What Went Well (10 min)**
- Effective detection methods
- Good coordination/communication
- Successful containment actions

**3. What Didn't Go Well (20 min)**
- Delayed detection or response
- Inadequate documentation or runbooks
- Tool/automation failures
- Communication breakdowns

**4. Root Cause Analysis (15 min)**
- Use 5 Whys technique
- Identify systemic issues (not individual mistakes)
- Document underlying causes

**5. Action Items (10 min)**
- Preventive measures (stop this from happening again)
- Detective improvements (find it faster next time)
- Responsive improvements (handle it better next time)
- Assign owners and due dates

**Documentation:**
- Post-incident report template: `docs/post-mortems/INC-YYYY-NNN.md`
- Action items tracked in improvement backlog

**Follow-up:**
- Review action items in monthly security operations meeting
- Verify completion of preventive measures within 30 days

---

### 6.6.2 Quarterly Security Architecture Review

**Schedule:** Last week of each quarter (Mar, Jun, Sep, Dec)

**Owner:** Security Architecture team

**Participants:**
- Security Architect (lead)
- Security Operations representatives
- Cloud Engineering representatives
- Compliance representative

**Agenda:**

**1. Metrics Review (30 min)**
- Review KPIs from 6-5 for past quarter
- Identify trends (improving, degrading, stable)
- Compare to targets and industry benchmarks

**2. Control Effectiveness Review (30 min)**
- Review validation test results from 5-3
- Discuss any control failures or weaknesses
- Evaluate if controls still appropriate for threat landscape

**3. Threat Landscape Update (20 min)**
- Recent threat intelligence (new attack vectors, CVEs)
- Industry incidents (breaches at peer companies)
- Regulatory changes (new requirements, guidance)

**4. Improvement Backlog Prioritization (40 min)**
- Review proposed improvements
- Prioritize using risk-based scoring:
  - Risk reduction potential: High (3), Medium (2), Low (1)
  - Implementation effort: Low (3), Medium (2), High (1)
  - Priority Score = Risk Reduction × Implementation Effort
- Approve top 3-5 improvements for next quarter

**5. Policy Update Review (20 min)**
- Review proposed policy changes
- Approve updates based on:
  - Lessons learned from incidents
  - New regulatory requirements
  - Technology changes (e.g., cloud migration)

**Outputs:**
- Quarterly security architecture review report
- Updated improvement backlog with priorities
- Policy change requests (if applicable)
- Action items for next quarter

**Documentation:**
- Meeting notes: `docs/architecture-reviews/YYYY-QN-review.md`
- Updated improvement backlog: `docs/improvement-backlog.md`

---

### 6.6.3 Improvement Backlog Management

**Backlog Structure:**

| ID | Title | Category | Risk Reduction | Effort | Priority Score | Status | Owner | Due Date |
|----|-------|----------|----------------|--------|----------------|--------|-------|----------|
| IMP-001 | Automate key rotation validation | Automation | High (3) | Low (3) | 9 | In Progress | SecOps | 2025-02-28 |
| IMP-002 | Implement secret scanning in CI/CD | Preventive | High (3) | Medium (2) | 6 | Approved | DevSecOps | 2025-03-15 |
| IMP-003 | Add anomaly detection to KMS alerts | Detective | Medium (2) | High (1) | 2 | Backlog | SecEng | TBD |

**Prioritization Criteria:**
- **Risk Reduction Potential:**
  - High: Addresses critical control gap or high-likelihood threat
  - Medium: Enhances existing control or addresses medium risk
  - Low: Nice-to-have improvement, minimal risk impact

- **Implementation Effort:**
  - Low: <1 week, minimal resources
  - Medium: 1-4 weeks, moderate resources
  - High: >1 month, significant resources

**Review Cadence:**
- Monthly: Security Operations reviews backlog, updates status
- Quarterly: Security Architecture meeting re-prioritizes based on new risks

**Approval Process:**
- Priority Score ≥6: Auto-approved for next quarter
- Priority Score 3-5: Requires Security Lead approval
- Priority Score <3: Deferred unless specific business driver

**Tracking:**
- Tool: Jira (or equivalent project management system)
- Status values: Backlog → Approved → In Progress → Completed → Closed
- Metrics: Improvement velocity (items completed per quarter)
```

**Framework references:**
- ISO 27001 Clause 10 (Improvement)
- NIST CSF (Continuous improvement cycle)
- ITIL Continual Service Improvement (CSI)
- Plan-Do-Check-Act (PDCA) cycle

**Traceability:** Link to **6-3 (Incident Response Playbooks)** and **6-5 (Metrics & Reporting)**

## Upstream Context

You will receive:
- **Policy Summary** (≤150 words)
- **Section 5-1:** Tool Configuration Specifications
- **Section 5-3:** Validation Tests
- **Section 5-4:** Deployment Checklist
- **Section 4-5:** Exception Handling (from Physical layer)

Use these to define operational procedures, monitoring, and continuous improvement.

## Traceability Instructions

For each section, include traceability references in this format:

```json
"6-1": [
  {
    "source": "POL-YYYY-NNN.component.5-1",
    "relationship": "derives_from",
    "description": "Monitoring requirements derived from tool configurations and expected behaviors"
  },
  {
    "source": "POL-YYYY-NNN.component.5-3",
    "relationship": "validates",
    "description": "Alerts validate that controls tested in 5-3 remain effective"
  }
]
```

Typical relationships for this layer:
- **derives_from** — Monitoring derives from tool configs (5-1)
- **validates** — Monitoring and tests validate deployment (5-4)
- **refines** — Runbooks refine deployment procedures (5-4) with operational detail
- **implements** — Incident playbooks implement rollback procedures (5-5) and exception handling (4-5)

## Output Schema

```json
{
  "sections": {
    "6-1": {
      "title": "Monitoring & Alerting",
      "content": "## 6.1 Monitoring & Alerting\n\n[Markdown with metrics, alerts, SLAs]",
      "rationale_why": "NIST SP 800-53 SI-4, ISO 27001 A.12.4, SRE observability...",
      "rationale_condition": "Validates tool configurations from 5-1 remain effective"
    },
    "6-2": {
      "title": "Operational Runbooks",
      "content": "## 6.2 Operational Runbooks\n\n[Markdown with day-to-day procedures]",
      "rationale_why": "NIST SP 800-53 AC-2 account management, ISO 27001 operational procedures...",
      "rationale_condition": "Refines deployment procedures from 5-4 with operational detail"
    },
    "6-3": {
      "title": "Incident Response Playbooks",
      "content": "## 6.3 Incident Response Playbooks\n\n[Markdown with incident scenarios and response steps]",
      "rationale_why": "NIST SP 800-61 incident handling, ISO 27001 A.16.1...",
      "rationale_condition": "Implements rollback procedures from 5-5 in incident context"
    },
    "6-4": {
      "title": "Maintenance Procedures",
      "content": "## 6.4 Maintenance Procedures\n\n[Markdown with scheduled maintenance tasks]",
      "rationale_why": "NIST SP 800-40 patch management, ISO 27001 A.12.6.1...",
      "rationale_condition": "Derives from deployment procedures in 5-4"
    },
    "6-5": {
      "title": "Metrics & Reporting",
      "content": "## 6.5 Metrics & Reporting\n\n[Markdown with KPIs, dashboards, reports]",
      "rationale_why": "ISO 27001 Clause 9.3 management review, NIST CSF measurement...",
      "rationale_condition": "Validates test criteria from 5-3 on ongoing basis"
    },
    "6-6": {
      "title": "Continuous Improvement",
      "content": "## 6.6 Continuous Improvement\n\n[Markdown with feedback loops and improvement process]",
      "rationale_why": "ISO 27001 Clause 10 improvement, ITIL CSI, PDCA cycle...",
      "rationale_condition": "Implements lessons learned from incidents (6-3) and metrics review (6-5)"
    }
  }
}
```

## Quality Checklist

Before finalizing your response, verify:

- [ ] All 6 sections present with correct IDs (6-1 through 6-6)
- [ ] Each section has complete markdown content
- [ ] Monitoring section defines specific metrics, thresholds, and SLAs
- [ ] Operational runbooks include step-by-step procedures with commands
- [ ] Incident playbooks cover key compromise, data breach, and access failures
- [ ] Maintenance procedures define schedule, automation, and validation
- [ ] Metrics section includes KPIs with targets and reporting frequency
- [ ] Continuous improvement defines post-incident review and quarterly review processes
- [ ] Both rationale fields populated for each section
- [ ] Framework references include operational standards (ITIL, SRE, incident handling)
- [ ] Traceability links to Layer 5 sections (5-1, 5-3, 5-4) and 4-5
- [ ] Valid JSON with proper escaping

Generate the Operational layer artifacts now.
