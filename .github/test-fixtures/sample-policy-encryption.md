# Customer PII Encryption Policy

## Policy Statement

All customer personally identifiable information (PII) must be encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Encryption keys must be rotated every 90 days and stored in a hardware security module. Access to encryption keys requires multi-factor authentication and must be logged for audit purposes.

## Business Context

This policy supports our SOC 2 Type II certification requirements and GDPR Article 32 compliance obligations. It addresses critical findings from the Q3 2024 penetration test regarding data-at-rest encryption gaps in customer databases and insufficient key management controls.

The policy directly impacts:
- Customer data storage systems across all environments (production, staging, development)
- API endpoints handling customer PII during transmission
- Key management infrastructure and access controls
- Audit logging and compliance reporting systems

## Compliance Requirements

### Regulatory Frameworks
- **SOC 2 Type II:** Trust Services Criteria CC6.1 (logical and physical access controls)
- **GDPR Article 32:** Security of processing - appropriate technical and organizational measures
- **PCI DSS 4.0:** Requirement 3.5 (protection of stored cardholder data with strong cryptography)

### Industry Standards
- **NIST SP 800-53:** SC-28 (Protection of Information at Rest)
- **ISO 27001:2022:** A.10.1.1 (Policy on the use of cryptographic controls)
- **CIS Controls v8:** Control 3.11 (Encrypt Sensitive Data at Rest)

## Scope

### In Scope
- All databases containing customer PII (name, email, phone, address, payment information)
- File storage systems with customer documents or data exports
- Backup and disaster recovery systems containing customer data
- Data warehouse and analytics platforms processing customer information
- Inter-service API communications transmitting customer PII

### Out of Scope
- Internal employee data (covered by separate HR data protection policy)
- Public marketing data already published with customer consent
- Anonymized/pseudonymized data that cannot be re-identified
- Development test data (synthetic data only, no production PII)

## Priority

**High** - Implementation required within 90 days to meet SOC 2 audit timeline and address penetration test findings.

## Success Criteria

1. **Technical Implementation:**
   - 100% of customer PII encrypted at rest with AES-256 or stronger
   - 100% of customer PII transmissions protected by TLS 1.2+ with forward secrecy
   - All encryption keys stored in FIPS 140-2 Level 2 or higher HSM
   - Automated key rotation every 90 days with zero-downtime procedures

2. **Access Controls:**
   - Multi-factor authentication required for all key management operations
   - Complete audit trail of key access and encryption operations
   - Separation of duties enforced (key generation ≠ key usage)

3. **Compliance Verification:**
   - SOC 2 Type II audit findings cleared
   - GDPR Article 32 compliance demonstrated
   - Penetration test remediation validated
   - Quarterly encryption coverage reports at 100%

## Requested Reviewer

<!-- Leave blank for automated assignment -->
