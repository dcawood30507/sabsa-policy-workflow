# Policy Statement

**Title:** [Policy] Customer PII Encryption Policy - SUCCESS TEST
**Created:** 2025-12-27T15:50:32Z
**Source Issue:** 12

## Policy Statement


All customer personally identifiable information (PII) must be encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Encryption keys must be rotated every 90 days and stored in a hardware security module. Access to encryption keys requires multi-factor authentication and must be logged for audit purposes.

## Business Context


This policy supports our SOC 2 Type II certification requirements and GDPR Article 32 compliance obligations. It addresses critical findings from the Q3 2024 penetration test regarding data-at-rest encryption gaps in customer databases and insufficient key management controls.

The policy directly impacts:
- Customer data storage systems across all environments (production, staging, development)
- API endpoints handling customer PII during transmission
- Key management infrastructure and access controls
- Audit logging and compliance reporting systems
