# Layer 2: Conceptual — Generation Instructions

## Layer Purpose

The **Conceptual Layer** answers the question: **"What security capabilities are required?"**

This layer translates business requirements into security objectives, services, principles, trust models, and security domains. It defines **what** security must achieve without prescribing **how** it will be implemented.

## Expected Sections

You must generate **exactly 5 sections** with these IDs and titles:

| Section ID | Title | Purpose |
|------------|-------|---------|
| **2-1** | Security Objectives | What security must achieve to satisfy business needs |
| **2-2** | Security Services | Required security capabilities (confidentiality, integrity, availability, etc.) |
| **2-3** | Security Principles | Guiding tenets for design decisions |
| **2-4** | Trust Model | Trust boundaries, zones, and relationships |
| **2-5** | Security Domains | Logical groupings of protected assets |

## Section-Specific Guidance

### 2-1: Security Objectives

**Content to include:**
- High-level security goals derived from business drivers
- Specific objectives for each key security service (e.g., "Ensure customer PII confidentiality through encryption")
- Objectives that directly address risks identified in Layer 1
- Prioritization or criticality of each objective

**Framework references:**
- NIST CSF Core Functions (Identify, Protect, Detect, Respond, Recover)
- ISO 27001 A.6.1.1 (Information security roles and responsibilities)
- COBIT 2019 (Governance and management objectives)

**Traceability:** Link to **1-2 (Business Drivers)** and **1-3 (Risk Context)**

### 2-2: Security Services

**Content to include:**
- **Confidentiality services** required (encryption, access control, data masking)
- **Integrity services** required (checksums, digital signatures, version control)
- **Availability services** required (redundancy, failover, backup)
- **Authentication services** required (MFA, SSO, certificate-based)
- **Authorization services** required (RBAC, ABAC, least privilege)
- **Non-repudiation services** required (audit logs, digital signatures)
- **Accountability services** required (logging, monitoring, alerting)

**Framework references:**
- NIST SP 800-53 Control Families (AC, AU, SC, etc.)
- ISO 27002 Controls
- CIS Controls v8

**Traceability:** Link to **2-1 (Security Objectives)** and **1-4 (Success Criteria)**

### 2-3: Security Principles

**Content to include:**
- **Defense in Depth** — Layered security controls
- **Least Privilege** — Minimum necessary access
- **Separation of Duties** — No single point of control
- **Fail Secure** — Default-deny posture
- **Zero Trust** — Never trust, always verify
- **Privacy by Design** — Embed privacy from the start
- **Simplicity** — Reduce attack surface
- Other principles relevant to the policy context

Explain **how each principle applies** to this specific policy.

**Framework references:**
- NIST SP 800-160 Vol. 1 (Systems Security Engineering)
- ISO 27001 A.5.1.1 (Policies for information security)
- CISA Zero Trust Maturity Model

**Traceability:** Link to **2-1 (Security Objectives)**

### 2-4: Trust Model

**Content to include:**
- **Trust zones** (e.g., Trusted Internal, DMZ, Untrusted External)
- **Trust boundaries** (where zones meet, what crosses them)
- **Trust relationships** (which entities trust which others, and why)
- **Implicit vs. explicit trust** decisions
- **Trust anchors** (root CAs, HSMs, identity providers)

**Visual representation (in markdown):**
- Use a table or text-based diagram to show trust zones and boundaries

**Framework references:**
- NIST SP 800-207 (Zero Trust Architecture)
- Jericho Forum Commandments
- Cloud Security Alliance (CSA) Trust Model

**Traceability:** Link to **2-2 (Security Services)** and **1-3 (Risk Context)**

### 2-5: Security Domains

**Content to include:**
- **Logical groupings** of assets, data, or systems with similar security requirements
- **Domain definitions** (e.g., Customer Data Domain, Corporate Network Domain, Cloud Services Domain)
- **Domain boundaries** and how they relate to trust zones
- **Security requirements** specific to each domain
- **Cross-domain interaction rules** (how domains communicate securely)

**Framework references:**
- DoD Information Security Architecture (domains and enclaves)
- ISO 27001 A.8.2.1 (Classification of information)

**Traceability:** Link to **2-4 (Trust Model)** and **1-1 (Business Process Overview)**

## Upstream Context

You will receive:
- **Policy Summary** (≤150 words)
- **Section 1-2:** Business Drivers
- **Section 1-3:** Risk Context
- **Section 1-4:** Success Criteria

Use these to inform your security objectives, services, and principles.

## Traceability Instructions

For each section, include traceability references in this format:

```json
"2-1": [
  {
    "source": "POL-YYYY-NNN.contextual.1-2",
    "relationship": "implements",
    "description": "Security objectives implement regulatory compliance drivers from business context"
  },
  {
    "source": "POL-YYYY-NNN.contextual.1-3",
    "relationship": "derives_from",
    "description": "Objectives derived from identified threats and vulnerabilities"
  }
]
```

Typical relationships for this layer:
- **implements** — Business drivers → Security objectives
- **derives_from** — Risk context → Security objectives
- **implements** — Success criteria → Security services

## Output Schema

```json
{
  "sections": {
    "2-1": {
      "title": "Security Objectives",
      "content": "## 2.1 Security Objectives\n\n[Markdown content with subsections for each objective]",
      "rationale_why": "NIST CSF and ISO 27001 references...",
      "rationale_condition": "Implements business drivers from 1-2 and addresses risks from 1-3"
    },
    "2-2": {
      "title": "Security Services",
      "content": "## 2.2 Security Services\n\n[Markdown content categorized by service type]",
      "rationale_why": "NIST SP 800-53 control families...",
      "rationale_condition": "Implements security objectives from 2-1"
    },
    "2-3": {
      "title": "Security Principles",
      "content": "## 2.3 Security Principles\n\n[Markdown content with principle explanations]",
      "rationale_why": "NIST SP 800-160 and Zero Trust model...",
      "rationale_condition": "Guides implementation of security objectives from 2-1"
    },
    "2-4": {
      "title": "Trust Model",
      "content": "## 2.4 Trust Model\n\n[Markdown content with trust zones and boundaries]",
      "rationale_why": "NIST SP 800-207 Zero Trust Architecture...",
      "rationale_condition": "Defines trust boundaries for security services from 2-2"
    },
    "2-5": {
      "title": "Security Domains",
      "content": "## 2.5 Security Domains\n\n[Markdown content with domain definitions]",
      "rationale_why": "ISO 27001 asset classification and DoD architecture patterns...",
      "rationale_condition": "Logical grouping aligned with trust model from 2-4"
    }
  }
}
```

## Quality Checklist

Before finalizing your response, verify:

- [ ] All 5 sections present with correct IDs (2-1 through 2-5)
- [ ] Each section has complete markdown content
- [ ] Security objectives clearly trace to business drivers
- [ ] Security services are comprehensive (confidentiality, integrity, availability, authentication, authorization)
- [ ] Principles include defense-in-depth, least privilege, and zero trust (where applicable)
- [ ] Trust model defines clear zones and boundaries
- [ ] Both rationale fields populated for each section
- [ ] Framework references include specific control IDs
- [ ] Traceability links to Layer 1 sections (1-2, 1-3, 1-4)
- [ ] Valid JSON with proper escaping

Generate the Conceptual layer artifacts now.
