# Layer 2 (Conceptual) Section Templates - Summary

**Created:** 2026-01-06  
**Layer:** Conceptual (Layer 2)  
**Total Templates:** 5  
**Status:** Complete

## Template Files Created

| Section ID | Template File | Size | Purpose |
|------------|--------------|------|---------|
| **2-1** | `2-1-security-objectives-template.json` | 9.5 KB | Security architecture goals (SMART objectives) |
| **2-2** | `2-2-security-services-template.json` | 11 KB | Required security capabilities and services |
| **2-3** | `2-3-security-principles-template.json` | 12 KB | Architectural principles guiding design |
| **2-4** | `2-4-trust-model-template.json` | 12 KB | Trust boundaries and verification mechanisms |
| **2-5** | `2-5-security-architecture-template.json` | 14 KB | High-level security architecture overview |

**Total Size:** 58.5 KB

## Template Structure Overview

Each template follows consistent JSON structure:

```json
{
  "sectionId": "2-x",
  "layerId": "conceptual",
  "templateVersion": "1.0.0",
  "title": "Section Title",
  "purpose": "What this section achieves",
  "contentStructure": {
    "introduction": { /* ... */ },
    "subsection1": { /* ... */ },
    "subsection2": { /* ... */ }
  },
  "frameworkReferences": [ /* NIST CSF, ISO 27001, etc. */ ],
  "qualityChecks": { /* completeness, clarity, traceability */ },
  "commonPitfalls": [ /* what to avoid */ ],
  "exampleElements": [ /* POL-2025-004 examples */ ]
}
```

## Section-Specific Highlights

### 2-1: Security Objectives Template
- **Focus:** SMART objectives derived from Business Drivers (1-2), Risk Context (1-3), Success Criteria (1-4)
- **Subsections:** Introduction, Primary Objectives (confidentiality/integrity/availability/accountability), Supporting Objectives, Success Measurement, Traceability
- **Word Count:** 400-900 words
- **Key Elements:** Measurable criteria, validation methods, success thresholds
- **Frameworks:** NIST CSF PR.DS-1/PR.DS-2, ISO 27001 A.10.1.1, NIST SP 800-53 SC-28
- **Example Objectives:**
  - Confidentiality: "Ensure customer PII remains confidential through cryptographic protection"
  - Integrity: "Maintain data integrity through cryptographic hashing and validation"
  - Availability: "Maintain 99.9% uptime for encryption services"
  - Accountability: "Provide comprehensive audit trail of all cryptographic operations"

### 2-2: Security Services Template
- **Focus:** Technology-agnostic security capabilities (what services do, not how they're implemented)
- **Subsections:** Introduction, Identity Services, Data Protection Services, Monitoring Services, Incident Response Services, Service Interactions
- **Word Count:** 450-950 words
- **Key Elements:** Service definitions, service level expectations, capability requirements
- **Frameworks:** NIST CSF PR.AC-1/PR.DS-1/DE.CM-1, ISO 27001 A.12.4.1, NIST SP 800-53 AU-2
- **Example Services:**
  - Identity: Multi-factor authentication, RBAC, identity lifecycle
  - Data Protection: AES-256 encryption, automated key rotation, FIPS 140-2 Level 3 HSM
  - Monitoring: Comprehensive audit logging, threat detection, compliance monitoring
  - Incident Response: Automated detection, alerting, remediation

### 2-3: Security Principles Template
- **Focus:** Guiding principles for all security design decisions
- **Subsections:** Introduction, Fundamental Principles, Design Principles, Operational Principles, Principle Conflicts
- **Word Count:** 400-900 words
- **Key Elements:** Principle statements, rationale (WHY), application guidance (HOW)
- **Frameworks:** NIST SP 800-53 SC-7, NIST CSF PR.AC-4, NIST SP 800-207, ISO 27001 A.6.1.2, CIS Controls
- **Example Principles:**
  - Fundamental: Defense-in-depth, least privilege, separation of duties, fail secure
  - Design: Zero trust architecture, assume breach, secure by default, vendor neutrality
  - Operational: Automation first, continuous validation, evidence-based, graceful degradation

### 2-4: Trust Model Template
- **Focus:** Who trusts whom, where trust boundaries exist, how trust is verified
- **Subsections:** Introduction, Trust Boundaries, Trust Relationships, Trust Verification, Trust Assumptions
- **Word Count:** 400-850 words
- **Key Elements:** Boundary definitions, trust conditions, verification mechanisms, explicit assumptions
- **Frameworks:** NIST SP 800-207 Zero Trust, NIST CSF PR.AC-1, ISO 27001 A.9.2.1, NIST SP 800-53 AC-3
- **Example Trust Elements:**
  - Boundaries: Cryptographic boundary (HSM isolation), Key Management Zone, Production Data Zone
  - Relationships: Application-to-HSM trust (mutual TLS + service accounts), user trust (MFA + PAM approval)
  - Verification: Continuous authentication, authorization policy evaluation, anomaly detection
  - Assumptions: HSM integrity (FIPS 140-2 Level 3), Active Directory as identity authority

### 2-5: Security Architecture Overview Template
- **Focus:** High-level view of how security domains and components interact
- **Subsections:** Introduction, Security Domains, Architecture Components, Data Flows, Integration Points
- **Word Count:** 400-850 words
- **Key Elements:** Domain definitions, component responsibilities, data lifecycle, system interfaces
- **Frameworks:** SABSA Conceptual Architecture, NIST CSF ID.AM-3, TOGAF ADM, ISO 27001 A.8.1.1
- **Example Architecture Elements:**
  - Domains: Cryptographic Services, Identity & Access Management, Security Monitoring
  - Components: Key Management Infrastructure, HSM, Encryption Services, Identity Provider, Audit Logging
  - Data Flows: PII lifecycle (collection → encryption → processing → transmission → disposal)
  - Integrations: Application-to-Encryption API, HR system sync, SIEM integration

## Content Quality Requirements

### Traceability (All Sections)
- **Upstream References:** Sections 1-2 (Business Drivers), 1-3 (Risk Context), 1-4 (Success Criteria)
- **Lateral References:** Other Layer 2 sections (e.g., 2-1 → 2-2, 2-2 → 2-3)
- **Framework Citations:** Minimum 2 per section (NIST CSF, ISO 27001, NIST SP 800-53/800-207)
- **Relationship Types:** `implements`, `derives_from`, `supports`, `constrains_by`, `refines`, `validates`

### Technology-Agnostic Language
**Avoid:**
- Vendor names (AWS, Azure, Google Cloud)
- Specific products (AWS KMS, CloudHSM, Azure Key Vault)
- Implementation technologies (Python, Docker, Terraform)

**Use Instead:**
- Capabilities: "key management service", "hardware security module", "encryption service"
- Functions: "automated key rotation", "cryptographic isolation", "audit logging"
- Patterns: "defense-in-depth", "zero trust", "least privilege"

### Framework Alignment
Each section must cite:
- **NIST Cybersecurity Framework (CSF):** Protect (PR) and Detect (DE) functions
- **ISO 27001:** Relevant Annex A controls
- **NIST Special Publications:** SP 800-53 (security controls), SP 800-207 (zero trust)
- **Optional:** CIS Controls, SABSA, TOGAF

### Word Count Ranges
| Section | Minimum | Maximum | Target |
|---------|---------|---------|--------|
| 2-1 Security Objectives | 400 | 900 | 600-700 |
| 2-2 Security Services | 450 | 950 | 650-750 |
| 2-3 Security Principles | 400 | 900 | 600-700 |
| 2-4 Trust Model | 400 | 850 | 550-650 |
| 2-5 Security Architecture | 400 | 850 | 550-650 |

## Common Pitfalls to Avoid

### Across All Sections
1. **Technology specificity:** Mentioning AWS KMS instead of "key management service"
2. **Missing traceability:** Not referencing upstream sections 1-2, 1-3, 1-4
3. **Insufficient frameworks:** Fewer than 2 framework citations per section
4. **Vague statements:** Non-measurable objectives or principles without application guidance
5. **Implementation details:** Describing "how" instead of "what" (save for Layer 4/5)

### Section-Specific
- **2-1:** Objectives not SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- **2-2:** Services described with implementation technologies instead of capabilities
- **2-3:** Principles without rationale (WHY) or application guidance (HOW)
- **2-4:** Trust boundaries defined without enforcement mechanisms
- **2-5:** Architecture components without responsibility statements or interaction mapping

## Usage in Workflow

### How Templates Are Used
1. **Claude Generation:** Templates guide AI generation in `generate-layer.yml` workflow
2. **Prompt Assembly:** Loaded into conceptual-prompt.md as structured guidance
3. **Quality Validation:** `qualityChecks` section defines automated validation rules
4. **Human Review:** Examples and pitfalls help reviewers assess PR quality

### Generation Context
Each section receives:
- **Always:** `summary.md`, this section template
- **Upstream Context (from Layer 1):**
  - Section 2-1: Receives 1-2 (Business Drivers), 1-3 (Risk Context), 1-4 (Success Criteria)
  - Section 2-2: Receives 2-1 (Security Objectives)
  - Section 2-3: Receives 2-1 (Security Objectives), 2-2 (Security Services)
  - Section 2-4: Receives 2-2 (Security Services), 2-3 (Security Principles)
  - Section 2-5: Receives 2-1 through 2-4 (all previous Conceptual sections)

### Example POL-2025-004
All templates include examples from **POL-2025-004** (Customer PII Encryption Policy):
- Confidentiality objectives for PII protection
- Key management services with HSM requirements
- Zero trust and least privilege principles
- Cryptographic trust boundaries
- Encryption architecture with data flows

## Validation Criteria

### Completeness Checks
- ✅ All subsections present (introduction + 3-4 main subsections)
- ✅ Word count within range (400-950 words depending on section)
- ✅ All guiding questions addressed
- ✅ Framework references present (minimum 2)
- ✅ Traceability to upstream sections

### Clarity Checks
- ✅ Technology-agnostic language (no vendor names)
- ✅ Clear rationale for each element (WHY it matters)
- ✅ Application guidance where needed (HOW to apply)
- ✅ Measurable criteria where applicable

### Traceability Checks
- ✅ References to Section 2-1 (Security Objectives) where applicable
- ✅ References to upstream Layer 1 sections (1-2, 1-3, 1-4)
- ✅ Correct relationship types (`implements`, `derives_from`, `supports`)
- ✅ Framework citations in correct format (Framework + Control ID)

## Next Steps

### For Workflow Implementation
1. **Update `prompts/conceptual-prompt.md`:** Reference these templates for section structure
2. **Update `config/layer-dependencies.json`:** Ensure upstream section mapping correct
3. **Update `generate-layer.yml`:** Load templates during context assembly
4. **Test Generation:** Run Layer 2 generation for POL-2025-004 using templates

### For Future Layers
Use this template structure pattern for:
- **Layer 3 (Logical):** Policy and standard templates
- **Layer 4 (Physical):** Implementation specification templates
- **Layer 5 (Component):** Tool configuration templates
- **Layer 6 (Operational):** Runbook and playbook templates

## Files Location

**Directory:** `/Users/test/aiwork/sabsa-git/config/document-guides/section-templates/`

**Files:**
```
2-1-security-objectives-template.json
2-2-security-services-template.json
2-3-security-principles-template.json
2-4-trust-model-template.json
2-5-security-architecture-template.json
```

**Related Documentation:**
- Layer guide: `../layer-2-conceptual-guide.json`
- Layer 1 templates: `1-1-business-process-template.json`, etc.
- BEADS issues: `../../BEADS-ISSUES-SUMMARY.md`
