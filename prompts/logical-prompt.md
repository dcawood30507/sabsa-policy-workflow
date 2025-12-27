# Layer 3: Logical — Generation Instructions

## Layer Purpose

The **Logical Layer** answers the question: **"What are the security rules?"**

This layer defines formal security policies, standards, control specifications, information classification, and logical access models. It translates security objectives and services into **specific requirements** without implementation details.

## Expected Sections

You must generate **exactly 5 sections** with these IDs and titles:

| Section ID | Title | Purpose |
|------------|-------|---------|
| **3-1** | Security Policies | Formal policy statements and requirements |
| **3-2** | Security Standards | Mandatory technical and procedural standards |
| **3-3** | Logical Control Specifications | Control requirements without implementation detail |
| **3-4** | Information Classification | Data categorization and handling requirements |
| **3-5** | Logical Access Model | Who can access what under which conditions |

## Section-Specific Guidance

### 3-1: Security Policies

**Content to include:**
- **Formal policy statements** that mandate specific security requirements
- **Policy scope** (what systems, data, people are covered)
- **Policy requirements** (SHALL statements defining mandatory controls)
- **Policy applicability** (when and where the policy applies)
- **Exceptions process** (reference to how exceptions are handled)

**Structure each policy as:**
1. Policy Statement (SHALL requirement)
2. Scope
3. Requirements (detailed SHALL/MUST statements)
4. Roles and Responsibilities
5. Compliance and Enforcement

**Framework references:**
- ISO 27001 A.5.1 (Management direction for information security)
- NIST SP 800-53 PM family (Program Management)
- SOC 2 Trust Services Criteria

**Traceability:** Link to **2-1 (Security Objectives)** — policies implement objectives

### 3-2: Security Standards

**Content to include:**
- **Cryptographic standards** (algorithms, key lengths, protocols)
- **Authentication standards** (password complexity, MFA requirements, session management)
- **Network security standards** (TLS versions, firewall rules, segmentation)
- **Data protection standards** (encryption at rest/in transit, tokenization, masking)
- **Logging and monitoring standards** (retention periods, log formats, alert thresholds)
- **Configuration standards** (hardening baselines, patch management timelines)

For each standard, specify:
- **Mandatory requirements** (MUST/SHALL)
- **Recommended practices** (SHOULD)
- **Rationale** (why this standard is necessary)

**Framework references:**
- NIST SP 800-52 (TLS Guidelines)
- NIST SP 800-63B (Authentication and Lifecycle Management)
- NIST SP 800-175B (Cryptographic Standards)
- CIS Benchmarks
- PCI DSS Technical Requirements

**Traceability:** Link to **2-2 (Security Services)** and **2-3 (Security Principles)**

### 3-3: Logical Control Specifications

**Content to include:**
- **Access control specifications** (RBAC models, permission matrices, approval workflows)
- **Data protection control specifications** (encryption controls, DLP, data classification enforcement)
- **Monitoring and detection control specifications** (SIEM rules, anomaly detection, threat intelligence)
- **Incident response control specifications** (detection thresholds, escalation procedures, containment requirements)

For each control:
- **Control ID** (e.g., AC-001, DP-002)
- **Control objective** (what it's supposed to achieve)
- **Control specification** (functional requirements)
- **Control type** (preventive, detective, corrective)
- **Implementation guidance** (high-level, no vendor specifics)

**Framework references:**
- NIST SP 800-53 Control Catalog
- ISO 27002 Controls
- CIS Controls v8
- COBIT Control Objectives

**Traceability:** Link to **3-1 (Security Policies)** and **2-2 (Security Services)**

### 3-4: Information Classification

**Content to include:**
- **Classification levels** (e.g., Public, Internal, Confidential, Restricted)
- **Criteria for each level** (what makes data fit each category)
- **Handling requirements per level:**
  - Storage requirements (encryption, access controls, retention)
  - Transmission requirements (encryption, approved channels)
  - Access requirements (who can access, authentication level)
  - Disposal requirements (secure deletion, destruction methods)
- **Classification process** (who classifies, when, how)
- **Labeling requirements** (metadata, visual markings, headers/footers)

**Framework references:**
- ISO 27001 A.8.2 (Information classification)
- NIST SP 800-60 (Information Categorization)
- GDPR Data Categories
- PCI DSS Data Classification

**Traceability:** Link to **2-5 (Security Domains)** and **2-2 (Security Services)**

### 3-5: Logical Access Model

**Content to include:**
- **Access control model** (RBAC, ABAC, MAC, DAC — which and why)
- **Role definitions** (role hierarchy, role descriptions, role assignments)
- **Permission matrix** (roles × resources × operations)
- **Access conditions** (time-based, location-based, context-based restrictions)
- **Privileged access requirements** (who gets admin rights, approval process, monitoring)
- **Access request and approval workflow** (who can request, who approves, how long access lasts)
- **Access review process** (periodic recertification, automated deprovisioning)

**Visual representation:**
- Include a role hierarchy diagram or permission matrix table

**Framework references:**
- NIST SP 800-162 (Attribute-Based Access Control)
- ISO 27001 A.9.1 (Access control)
- NIST SP 800-53 AC family (Access Control)

**Traceability:** Link to **2-4 (Trust Model)** and **3-3 (Logical Control Specifications)**

## Upstream Context

You will receive:
- **Policy Summary** (≤150 words)
- **Section 2-1:** Security Objectives
- **Section 2-2:** Security Services
- **Section 2-3:** Security Principles

Use these to define specific policies, standards, and control requirements.

## Traceability Instructions

For each section, include traceability references in this format:

```json
"3-1": [
  {
    "source": "POL-YYYY-NNN.conceptual.2-1",
    "relationship": "implements",
    "description": "Policy statements implement security objectives for data confidentiality and integrity"
  }
]
```

Typical relationships for this layer:
- **implements** — Policies implement objectives from 2-1
- **derives_from** — Standards derive from services (2-2) and principles (2-3)
- **refines** — Control specifications refine security services from 2-2
- **constrained_by** — Access model constrained by trust model from 2-4 (if referenced)

## Output Schema

```json
{
  "sections": {
    "3-1": {
      "title": "Security Policies",
      "content": "## 3.1 Security Policies\n\n[Markdown content with formal policy statements]",
      "rationale_why": "ISO 27001 A.5.1 and NIST PM controls...",
      "rationale_condition": "Implements security objectives from 2-1"
    },
    "3-2": {
      "title": "Security Standards",
      "content": "## 3.2 Security Standards\n\n[Markdown content with cryptographic, authentication, network standards]",
      "rationale_why": "NIST cryptographic standards and CIS benchmarks...",
      "rationale_condition": "Derives from security services (2-2) and defense-in-depth principle (2-3)"
    },
    "3-3": {
      "title": "Logical Control Specifications",
      "content": "## 3.3 Logical Control Specifications\n\n[Markdown content with control specifications]",
      "rationale_why": "NIST SP 800-53 control families and ISO 27002...",
      "rationale_condition": "Refines security services from 2-2 and implements policies from 3-1"
    },
    "3-4": {
      "title": "Information Classification",
      "content": "## 3.4 Information Classification\n\n[Markdown content with classification levels and handling]",
      "rationale_why": "ISO 27001 A.8.2 and NIST SP 800-60...",
      "rationale_condition": "Implements data protection services from 2-2 and aligns with security domains from 2-5"
    },
    "3-5": {
      "title": "Logical Access Model",
      "content": "## 3.5 Logical Access Model\n\n[Markdown content with access control model and role matrix]",
      "rationale_why": "NIST SP 800-162 ABAC and ISO 27001 A.9.1...",
      "rationale_condition": "Implements access control specifications from 3-3 and aligns with trust model from 2-4"
    }
  }
}
```

## Quality Checklist

Before finalizing your response, verify:

- [ ] All 5 sections present with correct IDs (3-1 through 3-5)
- [ ] Each section has complete markdown content
- [ ] Policies use SHALL/MUST language (mandatory requirements)
- [ ] Standards specify exact versions/algorithms (e.g., "TLS 1.2 or higher", "AES-256")
- [ ] Control specifications include control IDs and types (preventive/detective/corrective)
- [ ] Information classification defines at least 3-4 levels with clear criteria
- [ ] Logical access model specifies RBAC/ABAC with role definitions
- [ ] Both rationale fields populated for each section
- [ ] Framework references include specific control IDs
- [ ] Traceability links to Layer 2 sections (2-1, 2-2, 2-3)
- [ ] Valid JSON with proper escaping

Generate the Logical layer artifacts now.
