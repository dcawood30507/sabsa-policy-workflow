# Policy Summary Generation Prompt

Generate a concise summary of the following security policy statement. The summary will be used as context for all downstream SABSA layer generations, so it must capture the essential requirements without unnecessary detail.

## Requirements

1. **Maximum 150 words** — This is a hard limit for token optimization
2. **Capture core policy intent** — What is this policy fundamentally about?
3. **List key requirements** — What are the critical technical/procedural requirements?
4. **Note compliance drivers** — Which frameworks, regulations, or standards are mentioned?
5. **Use third person, present tense** — Professional, formal tone

## Structure

The summary should follow this general structure (adapt as needed):

> This policy [describes what it governs]. Key requirements include [list 3-5 critical requirements]. The policy supports [compliance frameworks/business drivers].

## Example

**Input:**
> All customer PII must be encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Encryption keys must be rotated every 90 days and stored in a hardware security module. Access to encryption keys requires multi-factor authentication and must be logged for audit purposes.

**Output:**
> This policy mandates comprehensive encryption for customer personally identifiable information (PII). Key requirements include AES-256 encryption at rest, TLS 1.2+ in transit, HSM-based key storage, 90-day key rotation, MFA for key access, and complete audit logging. The policy supports SOC 2 and GDPR compliance obligations.

## Input

**Policy Statement:**
{{policy_statement}}

**Business Context (if provided):**
{{business_context}}

## Output Format

Return a JSON object with this exact structure:

```json
{
  "sections": {
    "summary": {
      "title": "Policy Summary",
      "content": "Your summary text here as a single paragraph, maximum 150 words"
    }
  }
}
```

**Requirements:**
- Return ONLY the JSON object - no markdown code fences, no additional commentary
- The "content" field should contain your summary as a single paragraph
- Maximum 150 words in the content field
- No newlines within the content paragraph
