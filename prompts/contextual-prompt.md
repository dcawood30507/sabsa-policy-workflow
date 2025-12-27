# Layer 1: Contextual — Generation Instructions

## Layer Purpose

The **Contextual Layer** answers the question: **"What does the business need?"**

This is the highest-level SABSA layer, focusing on business context, drivers, risks, and success criteria. The artifacts you generate here will establish the foundation for all downstream technical decisions.

## Expected Sections

You must generate **exactly 5 sections** with these IDs and titles:

| Section ID | Title | Purpose |
|------------|-------|---------|
| **1-1** | Business Process Overview | Describes the business process this policy protects |
| **1-2** | Business Drivers | Strategic and operational drivers requiring this policy |
| **1-3** | Risk Context | Threats, vulnerabilities, and risk appetite |
| **1-4** | Success Criteria | Measurable outcomes defining policy success |
| **1-5** | Constraints & Assumptions | Boundaries and dependencies |

## Section-Specific Guidance

### 1-1: Business Process Overview

**Content to include:**
- What business processes or data flows does this policy govern?
- Who are the stakeholders (business units, roles, customers)?
- What assets (data, systems, services) are in scope?
- What is the current state vs. desired state?

**Framework references:**
- NIST Privacy Framework (Core Functions)
- ISO 27001 Clause 4.1 (Understanding the organization and its context)

### 1-2: Business Drivers

**Content to include:**
- **Regulatory compliance requirements** (GDPR, PCI DSS, HIPAA, SOC 2, etc.)
- **Strategic business objectives** (market expansion, customer trust, competitive advantage)
- **Operational needs** (audit findings, incident response improvements)
- **Financial considerations** (cost avoidance, insurance requirements)

**Framework references:**
- ISO 27001 A.18.1.1 (Identification of applicable legislation)
- SOC 2 Trust Services Criteria
- Specific regulations mentioned in policy statement

### 1-3: Risk Context

**Content to include:**
- **Threat landscape** relevant to the policy scope
- **Vulnerabilities** being addressed (gaps, weaknesses, attack vectors)
- **Risk appetite** statement (what level of risk is acceptable?)
- **Potential impact** of failure to implement policy (financial, reputational, legal)

**Framework references:**
- NIST Risk Management Framework (RMF)
- ISO 27001 Clause 6.1.2 (Information security risk assessment)
- NIST SP 800-30 (Risk Assessment)

### 1-4: Success Criteria

**Content to include:**
- **Measurable objectives** (KPIs, metrics, SLAs)
- **Compliance milestones** (audit readiness dates, certification timelines)
- **Technical success indicators** (% encrypted, uptime targets, response times)
- **Business outcomes** (customer satisfaction, reduced incidents)

**Framework references:**
- NIST CSF (Outcomes)
- ISO 27001 Clause 9.1 (Monitoring, measurement, analysis and evaluation)

### 1-5: Constraints & Assumptions

**Content to include:**
- **Budget constraints** (capital expenditure limits, operational budgets)
- **Technology constraints** (legacy systems, vendor lock-in, platform limitations)
- **Organizational constraints** (staffing, skills, change management capacity)
- **Timeline assumptions** (project dependencies, resource availability)
- **Regulatory or contractual boundaries** (data residency, vendor requirements)

**Framework references:**
- PMBOK (Project constraints)
- ISO 27001 Clause 4.1 (External and internal issues)

## Upstream Context

You will receive:
- **Policy Summary** (≤150 words) — The core policy requirements

Since this is Layer 1, there are no upstream SABSA artifacts. All traceability links should reference the policy summary.

## Traceability Instructions

For each section, include traceability references in this format:

```json
"1-1": [
  {
    "source": "POL-YYYY-NNN.summary",
    "relationship": "derives_from",
    "description": "Business process scope derived from policy statement requirements for [specific element]"
  }
]
```

All sections in this layer should use `derives_from` relationship to the policy summary.

## Output Schema

```json
{
  "sections": {
    "1-1": {
      "title": "Business Process Overview",
      "content": "## 1.1 Business Process Overview\n\n[Markdown content]",
      "rationale_why": "Framework references and reasoning",
      "rationale_condition": "Satisfies policy summary requirement for [specific element]"
    },
    "1-2": {
      "title": "Business Drivers",
      "content": "## 1.2 Business Drivers\n\n[Markdown content]",
      "rationale_why": "Framework references and reasoning",
      "rationale_condition": "Satisfies policy summary requirement for [specific element]"
    },
    "1-3": {
      "title": "Risk Context",
      "content": "## 1.3 Risk Context\n\n[Markdown content]",
      "rationale_why": "Framework references and reasoning",
      "rationale_condition": "Satisfies policy summary requirement for [specific element]"
    },
    "1-4": {
      "title": "Success Criteria",
      "content": "## 1.4 Success Criteria\n\n[Markdown content]",
      "rationale_why": "Framework references and reasoning",
      "rationale_condition": "Satisfies policy summary requirement for [specific element]"
    },
    "1-5": {
      "title": "Constraints & Assumptions",
      "content": "## 1.5 Constraints & Assumptions\n\n[Markdown content]",
      "rationale_why": "Framework references and reasoning",
      "rationale_condition": "Satisfies policy summary requirement for [specific element]"
    }
  }
}
```

## Quality Checklist

Before finalizing your response, verify:

- [ ] All 5 sections present with correct IDs (1-1 through 1-5)
- [ ] Each section has complete markdown content
- [ ] Both rationale fields populated for each section
- [ ] Framework references include specific control IDs
- [ ] Traceability links to policy summary using `derives_from`
- [ ] Business language (avoid technical implementation details)
- [ ] Measurable criteria in section 1-4
- [ ] Valid JSON with proper escaping

Generate the Contextual layer artifacts now.
