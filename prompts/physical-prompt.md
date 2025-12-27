# Layer 4: Physical — Generation Instructions

## Layer Purpose

The **Physical Layer** answers the question: **"How will it be implemented?"**

This layer defines control implementation specifications, security procedures, technical standards, integration architecture, and exception handling processes. It bridges the gap between **what** must be done (Logical) and **which specific tools** will be used (Component).

## Expected Sections

You must generate **exactly 5 sections** with these IDs and titles:

| Section ID | Title | Purpose |
|------------|-------|---------|
| **4-1** | Control Implementation Specifications | How controls will be technically implemented |
| **4-2** | Security Procedures | Step-by-step operational procedures |
| **4-3** | Technical Standards | Technology-specific requirements |
| **4-4** | Integration Architecture | How components connect and interact |
| **4-5** | Exception Handling | Process for managing policy exceptions |

## Section-Specific Guidance

### 4-1: Control Implementation Specifications

**Content to include:**
- **For each control from 3-3**, define implementation approach:
  - **Technology category** (e.g., "Key Management Service", "Web Application Firewall", "SIEM platform")
  - **Deployment model** (cloud-native, on-premises, hybrid)
  - **Integration points** (what it connects to)
  - **Performance requirements** (latency, throughput, availability)
  - **Redundancy and failover** requirements

**Structure:**
- Group by control type (encryption, access control, monitoring, etc.)
- For each control:
  1. Control ID reference (from 3-3)
  2. Implementation approach (how it will be realized)
  3. Technology options (categories, not specific products)
  4. Integration requirements
  5. Performance/availability requirements

**Example format:**
```markdown
### 4.1.1 Encryption Controls Implementation

**Control AC-001: Data Encryption at Rest**
- **Implementation Approach:** Cloud-native key management service with hardware security module backend
- **Technology Category:** Managed Key Management Service (KMS)
- **Integration Points:** Database services, object storage, application encryption APIs
- **Performance Requirements:** < 10ms key retrieval latency, 99.95% availability
- **Redundancy:** Multi-region key replication with automatic failover
```

**Framework references:**
- NIST SP 800-53 Implementation Guidance
- CSA Cloud Controls Matrix
- CIS Implementation Groups

**Traceability:** Link to **3-1 (Security Policies)**, **3-2 (Security Standards)**, **3-3 (Logical Control Specifications)**

### 4-2: Security Procedures

**Content to include:**
- **Step-by-step procedures** for implementing security controls and processes:
  - **Key rotation procedures** (how to rotate keys, who does it, when, what to verify)
  - **Access provisioning procedures** (how to grant/revoke access, approval workflow, documentation)
  - **Incident response procedures** (detection, triage, escalation, containment, eradication, recovery)
  - **Change management procedures** (security review process, testing requirements, rollback plans)
  - **Audit and compliance procedures** (log review, compliance checks, evidence collection)

**Structure each procedure:**
1. **Purpose:** What this procedure accomplishes
2. **Scope:** When and where it applies
3. **Roles and Responsibilities:** Who does what
4. **Prerequisites:** Required tools, permissions, information
5. **Steps:** Detailed numbered steps with decision points
6. **Verification:** How to confirm successful completion
7. **Documentation:** What to record and where

**Framework references:**
- ITIL v4 Processes
- NIST SP 800-61 (Incident Handling)
- NIST SP 800-128 (Configuration Management)

**Traceability:** Link to **3-1 (Security Policies)** and **3-3 (Logical Control Specifications)**

### 4-3: Technical Standards

**Content to include:**
- **Technology-specific requirements** (more detailed than Layer 3 standards):
  - **Cloud platform standards** (AWS/Azure/GCP configuration baselines)
  - **Operating system hardening standards** (CIS benchmarks, STIG baselines)
  - **Database security standards** (TDE configuration, row-level security, audit logging)
  - **Network security standards** (VPC design, subnet segmentation, security group rules)
  - **Container security standards** (image scanning, runtime protection, orchestration security)
  - **API security standards** (authentication methods, rate limiting, input validation)

**For each standard:**
- Specific configuration requirements (exact settings, not just "enable encryption")
- Validation criteria (how to verify compliance)
- Exceptions process (when deviations are allowed)

**Framework references:**
- CIS Benchmarks (specific OS/platform versions)
- DISA STIGs
- Vendor security best practices (AWS Well-Architected, Azure Security Benchmark)
- OWASP Top 10 (for API/web standards)

**Traceability:** Link to **3-2 (Security Standards)** and **2-4 (Trust Model)**

### 4-4: Integration Architecture

**Content to include:**
- **Architecture diagrams** (text-based or described in detail):
  - **Data flow diagrams** showing how sensitive data moves through systems
  - **Authentication/authorization flows** (SSO, MFA, token exchange)
  - **Key management architecture** (key generation, distribution, rotation, destruction)
  - **Logging and monitoring architecture** (log sources → aggregation → SIEM → alerting)

**For each integration:**
- **Source and destination** systems/services
- **Protocol and security** (TLS, mutual TLS, API keys, OAuth, etc.)
- **Data in transit protection** (encryption, network segmentation)
- **Failure modes** (what happens if integration fails, graceful degradation)
- **Dependencies** (what must be operational for this integration to work)

**Visual representation:**
- Use markdown tables, mermaid-style text diagrams, or detailed textual descriptions

**Framework references:**
- NIST SP 800-207 (Zero Trust Architecture)
- ISO 27001 A.13.1 (Network security management)
- Cloud Security Alliance (CSA) Architecture Patterns

**Traceability:** Link to **2-4 (Trust Model)** and **4-1 (Control Implementation Specifications)**

### 4-5: Exception Handling

**Content to include:**
- **Exception request process:**
  1. **Request submission** (who can request, what information required)
  2. **Risk assessment** (how to evaluate exception risk)
  3. **Approval workflow** (who approves, escalation path)
  4. **Compensating controls** (alternative controls if exception granted)
  5. **Documentation requirements** (what to record, where to store)
  6. **Review and expiration** (how long exceptions last, review frequency)

- **Exception categories:**
  - **Temporary exceptions** (e.g., during migration, testing)
  - **Permanent exceptions** (e.g., legacy systems with no remediation path)
  - **Emergency exceptions** (incident response, business continuity)

- **Exception tracking:**
  - Register location (database, ticketing system)
  - Reporting requirements (dashboard, periodic reports to management)
  - Automated expiration and renewal process

**Framework references:**
- ISO 27001 A.5.1.2 (Review of policies)
- NIST SP 800-53 CA-9 (Security Assessments)
- COBIT 2019 (Exception Management)

**Traceability:** Link to **3-1 (Security Policies)**

## Upstream Context

You will receive:
- **Policy Summary** (≤150 words)
- **Section 3-1:** Security Policies
- **Section 3-2:** Security Standards
- **Section 3-3:** Logical Control Specifications
- **Section 2-4:** Trust Model (from Conceptual layer)

Use these to define how controls will be implemented and integrated.

## Traceability Instructions

For each section, include traceability references in this format:

```json
"4-1": [
  {
    "source": "POL-YYYY-NNN.logical.3-3",
    "relationship": "implements",
    "description": "Implementation specifications realize logical control requirements for encryption and access control"
  },
  {
    "source": "POL-YYYY-NNN.logical.3-2",
    "relationship": "constrained_by",
    "description": "Implementation constrained by cryptographic and authentication standards"
  }
]
```

Typical relationships for this layer:
- **implements** — Implementation specs implement logical controls (3-3) and policies (3-1)
- **refines** — Procedures refine logical controls (3-3) with step-by-step detail
- **constrained_by** — Technical standards constrained by logical standards (3-2) and trust model (2-4)
- **derives_from** — Integration architecture derives from trust model (2-4)

## Output Schema

```json
{
  "sections": {
    "4-1": {
      "title": "Control Implementation Specifications",
      "content": "## 4.1 Control Implementation Specifications\n\n[Markdown content with implementation approaches per control]",
      "rationale_why": "NIST SP 800-53 implementation guidance and CSA controls...",
      "rationale_condition": "Implements logical control specifications from 3-3"
    },
    "4-2": {
      "title": "Security Procedures",
      "content": "## 4.2 Security Procedures\n\n[Markdown content with step-by-step procedures]",
      "rationale_why": "ITIL v4 process framework and NIST incident handling...",
      "rationale_condition": "Refines logical controls from 3-3 with operational procedures"
    },
    "4-3": {
      "title": "Technical Standards",
      "content": "## 4.3 Technical Standards\n\n[Markdown content with technology-specific requirements]",
      "rationale_why": "CIS Benchmarks, DISA STIGs, AWS Well-Architected Framework...",
      "rationale_condition": "Constrained by logical security standards from 3-2"
    },
    "4-4": {
      "title": "Integration Architecture",
      "content": "## 4.4 Integration Architecture\n\n[Markdown content with architecture diagrams and flows]",
      "rationale_why": "NIST Zero Trust Architecture and ISO network security management...",
      "rationale_condition": "Derives from trust model (2-4) and implements control specs from 4-1"
    },
    "4-5": {
      "title": "Exception Handling",
      "content": "## 4.5 Exception Handling\n\n[Markdown content with exception process and categories]",
      "rationale_why": "ISO 27001 policy review and COBIT exception management...",
      "rationale_condition": "Implements exception process referenced in policies from 3-1"
    }
  }
}
```

## Quality Checklist

Before finalizing your response, verify:

- [ ] All 5 sections present with correct IDs (4-1 through 4-5)
- [ ] Each section has complete markdown content
- [ ] Control implementations reference specific controls from 3-3
- [ ] Procedures include numbered steps, roles, verification
- [ ] Technical standards specify exact configurations (not just "enable feature")
- [ ] Integration architecture describes data flows and protocols
- [ ] Exception handling defines clear approval workflow and compensating controls
- [ ] Both rationale fields populated for each section
- [ ] Framework references include specific benchmarks/guides (e.g., "CIS Ubuntu 22.04 Benchmark")
- [ ] Traceability links to Layer 3 sections (3-1, 3-2, 3-3) and 2-4
- [ ] Valid JSON with proper escaping

Generate the Physical layer artifacts now.
