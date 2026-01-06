# Layer 6 (Operational) Section Templates - Summary

**Created:** 2026-01-06
**Layer:** Operational (Layer 6)
**Total Templates:** 6

---

## Template Files Created

| Section | File | Size | Focus Area |
|---------|------|------|------------|
| **6-1** | `6-1-monitoring-alerting-template.json` | 10 KB | CloudWatch alarms, metrics, dashboards, escalation paths |
| **6-2** | `6-2-operational-runbooks-template.json` | 12 KB | Key rotation, troubleshooting, access provisioning, audit review (10+ steps each) |
| **6-3** | `6-3-incident-response-template.json` | 16 KB | Security incidents (key compromise, service outage, unauthorized access, data breach) |
| **6-4** | `6-4-maintenance-procedures-template.json` | 15 KB | Daily, weekly, monthly, quarterly, annual maintenance schedules |
| **6-5** | `6-5-metrics-reporting-template.json` | 15 KB | KPIs, security/compliance/operational metrics, reporting schedules |
| **6-6** | `6-6-continuous-improvement-template.json` | 21 KB | Feedback mechanisms, improvement workflow, lessons learned, optimization |

**Total Size:** 89 KB
**Total Content:** ~470 lines per template (JSON structure with examples)

---

## Key Features Across All Templates

### 1. Operational Focus
- **CloudWatch-specific examples** (alarms, metrics, dashboards, Logs Insights)
- **AWS CLI commands** with placeholders (`aws kms describe-key --key-id <key-id>`)
- **Time-based procedures** (0-15 min immediate response, 15-120 min forensics)
- **Realistic operational scenarios** for POL-2025-004 (Customer PII Encryption Policy)

### 2. Structured Content Elements

Each template includes:
- **Introduction** (50-100 words): Establishes section context and scope
- **3-5 Major Subsections** (80-250 words each): Core operational content
- **Guiding Questions**: 4-5 questions per subsection to guide content generation
- **Detailed Examples**: AWS-specific, CloudWatch-based, realistic scenarios
- **Word Count Ranges**: Minimum and maximum for quality control

### 3. Upstream Traceability

All templates reference:
- **Component Layer** (sections 5-1, 5-3, 5-4, 5-5): Tool configs, validation tests, deployment checklists
- **Physical Layer** (sections 4-1, 4-2, 4-3): Implementation specs, procedures, technical standards
- **Relationship Types**: `validates`, `refines`, `implements`
- **Minimum 2 References** per section

### 4. Framework Alignment

Common frameworks cited:
- **NIST SP 800-61 Rev. 2** (Incident Handling Guide)
- **NIST SP 800-53** (Security and Privacy Controls)
- **NIST SP 800-137** (Continuous Monitoring)
- **ITIL 4** (Service Operation, Incident Management, Continual Improvement)
- **ISO 27001** (Controls A.12.4.1, A.16.1.6, A.18.2.3)
- **ISO 27035** (Information Security Incident Management)
- **ISO 20000** (Service Management)
- **GDPR** (Article 33 - 72-hour breach notification)
- **SRE Principles** (Runbook Automation)

### 5. Quality Checks

Each template includes validation for:
- **Completeness**: All structural elements present, word counts met
- **Technical Specificity**: AWS commands, CloudWatch metrics, actual alarm names
- **Operational Realism**: Time estimates, escalation paths, realistic scenarios
- **Framework Citations**: Minimum 1-2 framework references per section

---

## Section-Specific Highlights

### 6-1: Monitoring & Alerting
- **CloudWatch Alarms**: KMS API error rate >10% → Critical alert
- **Escalation Paths**: L1 Ops (5 min) → L2 Security Ops (15 min) → CISO (60 min)
- **Dashboards**: Real-time 1-min refresh, 5 widget types (line, table, map, number, log)
- **Metrics**: `kms:GetDataKey`, `kms:Decrypt`, `kms:Encrypt` with P50/P95/P99 latency

### 6-2: Operational Runbooks
- **Key Rotation Runbook**: 10+ steps (prerequisites, execution, verification, rollback)
- **Troubleshooting**: Encryption failures with diagnostics, resolution, escalation
- **Access Provisioning**: JIRA-based request workflow with IAM policy updates
- **Audit Log Review**: Weekly CloudWatch Logs Insights queries for KMS events

### 6-3: Incident Response Playbooks
- **Severity Levels**: P0 CRITICAL, P1 HIGH with time-windowed responses
- **Key Compromise**: 0-15 min isolation, 15-120 min forensics, 2-4 hour recovery
- **Service Outage**: Failover procedures, cached keys, secondary region
- **Data Breach**: GDPR 72-hour notification, regulatory compliance
- **Communication Protocols**: Stakeholder notification timelines (T+0, T+15, T+30 min)

### 6-4: Maintenance Procedures
- **Daily**: 06:00 UTC KMS health check, 08:00 UTC key rotation status review
- **Weekly**: Monday 14:00 UTC encryption coverage audit, CloudTrail log review
- **Monthly**: First Sunday 02:00-06:00 UTC HSM backup (4-hour window)
- **Quarterly**: Comprehensive key rotation, compliance audit prep, DR testing
- **Annual**: Penetration testing, policy review, architecture evolution planning

### 6-5: Metrics & Reporting
- **Security KPIs**: Encryption coverage (100% target), key rotation compliance (100%)
- **Operational KPIs**: KMS availability (99.95% = 21.6 min/month downtime max), P95 latency (<100ms)
- **Compliance KPIs**: Policy compliance score, audit finding closure rate, CloudTrail coverage
- **Reporting Schedule**: Daily (08:00 UTC), Weekly (Monday 09:00 UTC), Monthly (1st day), Quarterly, Annual
- **SMART Framework**: Specific, Measurable, Achievable, Relevant, Time-bound

### 6-6: Continuous Improvement
- **Feedback Sources**: Incident post-mortems, metrics reviews, audit findings, user surveys, threat intel
- **Improvement Workflow**: Submit → Evaluate (5-point scale) → Prioritize (P0-P3) → Implement (PDCA) → Measure
- **Prioritization**: Security×2 + Operational + Cost + Complexity + Urgency = Total (max 30 points)
- **Lessons Learned**: Capture within 72 hours, document in Confluence, 3-year archive
- **Optimizations**: Performance (DEK caching -80% API calls), Cost (key consolidation saves $660/year), Security (quantum-resistant algorithms)

---

## Example Policy Integration (POL-2025-004)

All templates use **Customer PII Encryption Policy** as the reference scenario:

### Sample Monitoring Alert (6-1)
```
CRITICAL: KMS API error rate >10% for 5 minutes
→ Page Security Operations + DevOps
→ Auto-escalate to CISO after 15 min
→ SNS topic: encryption-critical-alerts
→ Slack: #security-alerts
```

### Sample Runbook Snippet (6-2)
```
Key Rotation Runbook:
1. Verify key status: aws kms describe-key --key-id <key-id>
2. Check in-flight ops: CloudWatch kms:Encrypt <100 ops/min
3. Enable rotation: aws kms enable-key-rotation --key-id <key-id>
4. Update app configs: Deploy new key ARN via parameter store
5. Verify: aws kms list-key-rotations --key-id <key-id>
```

### Sample Incident Response (6-3)
```
INCIDENT: Suspected KMS Key Compromise
SEVERITY: CRITICAL (P0)

IMMEDIATE RESPONSE (0-15 min):
1. Disable key: aws kms disable-key --key-id <key-id>
2. Page CISO + Security Lead
3. Snapshot CloudTrail for forensics
4. Revoke active sessions

FORENSIC ANALYSIS (15-120 min):
- Timeline reconstruction from CloudTrail (90 days)
- Access pattern analysis
- Data exposure assessment

RECOVERY (2-4 hours):
- Create new key
- Re-encrypt data
- Schedule old key deletion (7-day waiting period)
```

### Sample Maintenance Schedule (6-4)
```
Daily (06:00 UTC): KMS health check, key rotation status
Weekly (Monday 14:00 UTC): Encryption coverage audit, CloudTrail review
Monthly (First Sunday 02:00-06:00 UTC): HSM backup, performance review
Quarterly: Key rotation, compliance audit prep, DR test
Annual: Penetration testing, policy review, architecture planning
```

### Sample KPI (6-5)
```
Encryption Coverage KPI
- Target: 100%
- Measurement: Daily AWS Config query (encrypted / total × 100)
- Data Source: AWS Config
- Reporting: Weekly to Security Ops, Monthly to CISO
- Alert: <95% warning, <90% critical
```

### Sample Improvement (6-6)
```
Improvement: DEK Caching Implementation
- Problem: High KMS API costs ($3200/month)
- Solution: Implement data encryption key caching
- Expected: Reduce API calls by 80% (-$640/month)
- Effort: 2 sprint dev effort ($8K)
- ROI: 96% first year, 12.5 month payback
- Priority: P1 (Score: 23/30)
```

---

## Template Consistency

### Structural Consistency
All templates follow the **same JSON structure** established in Layer 1-5 templates:
- `sectionId`, `layerId`, `templateVersion`, `title`, `purpose`
- `contentStructure` with subsections (introduction + 3-5 major elements)
- `upstreamTraceability` with required references
- `frameworkReferences` with 2-3 industry standards
- `qualityChecks` with completeness, technical depth, operational focus
- `commonPitfalls` (avoid vs include guidance)
- `examplePolicyScenario` with POL-2025-004 snippets

### Word Count Consistency
Total word counts per section align with layer guide:
- **6-1**: 550-950 words (monitoring & alerting)
- **6-2**: 550-900 words (operational runbooks)
- **6-3**: 550-900 words (incident response)
- **6-4**: 400-660 words (maintenance procedures)
- **6-5**: 450-700 words (metrics & reporting)
- **6-6**: 460-740 words (continuous improvement)

### Traceability Consistency
All templates reference:
- **Component layer** (5-1, 5-3, 5-4, 5-5) - Primary upstream source
- **Physical layer** (4-1, 4-2, 4-3, 4-5) - Secondary upstream source
- **Operational layer self-references** (6-6 refines 6-1, 6-2, 6-3, 6-5)

---

## Usage Guidelines for Claude

### When Generating Layer 6 Sections

1. **Read the template** for the specific section (e.g., `6-1-monitoring-alerting-template.json`)
2. **Follow the content structure** exactly (introduction + major subsections)
3. **Answer all guiding questions** within each subsection
4. **Use CloudWatch-specific examples** (alarms, metrics, dashboards, Logs Insights)
5. **Include AWS CLI commands** with realistic placeholders
6. **Meet word count ranges** for each subsection
7. **Add upstream traceability** (minimum 2 references to Component/Physical layers)
8. **Cite frameworks** (NIST, ITIL, ISO 27001, GDPR)
9. **Include operational time windows** (0-15 min, 15-120 min, 2-4 hours)
10. **Provide rationale** explaining WHY this operational procedure validates/refines upstream implementations

### Common Operational Patterns

- **Monitoring (6-1)**: Metrics → Thresholds → Alerts → Escalation → Dashboards
- **Runbooks (6-2)**: Prerequisites → Execution → Verification → Rollback
- **Incident Response (6-3)**: Detection → Immediate Response → Forensics → Recovery → Communication
- **Maintenance (6-4)**: Daily → Weekly → Monthly → Quarterly → Annual schedules
- **Metrics (6-5)**: KPI definition (Name, Target, Measurement, Source, Reporting)
- **Improvement (6-6)**: Feedback → Evaluation → Prioritization → Implementation → Measurement

---

## File Locations

```
/Users/test/aiwork/sabsa-git/config/document-guides/section-templates/
├── 6-1-monitoring-alerting-template.json
├── 6-2-operational-runbooks-template.json
├── 6-3-incident-response-template.json
├── 6-4-maintenance-procedures-template.json
├── 6-5-metrics-reporting-template.json
└── 6-6-continuous-improvement-template.json
```

**Parent Guide:** `/Users/test/aiwork/sabsa-git/config/document-guides/layer-6-operational-guide.json`

---

## Next Steps

These templates are now ready for use in the **Layer 6 generation workflow** for POL-2025-004:

1. **Generate Layer 6 PR** using these templates as guidance
2. **Claude reads templates** during generation to ensure consistency
3. **Quality validation** ensures all sections meet template requirements
4. **Traceability validation** ensures proper references to Component/Physical layers
5. **Framework alignment** ensures NIST, ITIL, ISO citations present

**Status:** Layer 6 templates COMPLETE ✅
**Total Layer Templates:** 36 (6 layers × 6 sections each, except Layer 4 & 5 with 5 sections)
