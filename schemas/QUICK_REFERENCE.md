# JSON Schema Validation - Quick Reference

## File Locations

```
policies/
└── {policy-id}/
    ├── metadata.json              → metadata.schema.json
    └── {layer}/
        ├── sections.json          → sections.schema.json
        └── traceability.json      → traceability.schema.json
```

## Validation Commands

```bash
# All layers
node scripts/validate-artifacts.js POL-2025-001

# Single layer
node scripts/validate-artifacts.js POL-2025-001 --layer logical

# Verbose
node scripts/validate-artifacts.js POL-2025-001 --verbose
```

## Schema Requirements Cheat Sheet

### sections.json

**Required Fields:**
- `policyId` (pattern: `POL-YYYY-NNN`)
- `layer` (enum: 6 SABSA layers)
- `version` (integer ≥1)
- `generatedAt` (date-time)
- `generationStatus` (enum: complete, partial)
- `sections` (object with section IDs)

**Section Properties:**
- `title` (required, string)
- `content` (string or null)
- `rationale_why` (string or null)
- `rationale_condition` (string or null)

**Conditional Rules:**
- If `generationStatus` = "partial" → `errors` array required (≥1 item)
- If `generationStatus` = "complete" → `errors` array must be empty

---

### traceability.json

**Required Fields:**
- `policyId` (pattern: `POL-YYYY-NNN`)
- `layer` (enum: 6 SABSA layers)
- `version` (integer ≥1)
- `generatedAt` (date-time)
- `references` (object with section IDs)

**Reference Properties:**
- `source` (required, pattern: `POL-YYYY-NNN.layer.section`)
- `relationship` (required, enum: 5 types)
- `description` (optional, string)

**Valid Relationships:**
- `implements`
- `derives_from`
- `constrained_by`
- `refines`
- `validates`

---

### metadata.json

**Required Fields:**
- `policyId` (pattern: `POL-YYYY-NNN`)
- `title` (string, 1-200 chars)
- `createdAt` (date-time)
- `createdBy` (string)
- `sourceIssue` (integer ≥1)
- `status` (enum: in-progress, completed, archived)
- `currentLayer` (enum: 6 SABSA layers)
- `layerStatus` (object with 6 layer entries)

**Layer Status Properties:**
- `status` (required, enum: not-started, pending-review, approved)
- `prNumber` (integer, conditional)
- `createdAt` (date-time, conditional)
- `mergedAt` (date-time, conditional)

**Conditional Rules:**
- `status` = "not-started" → only `status` required
- `status` = "pending-review" → requires `prNumber`, `createdAt`
- `status` = "approved" → requires `prNumber`, `createdAt`, `mergedAt`
- Policy `status` = "completed" → requires `completedAt`, `releaseTag`

---

## Common Patterns

### Policy ID
```
POL-2025-001
POL-2024-042
```

### Section ID
```
1-1, 1-2, ..., 1-5  (Contextual)
2-1, 2-2, ..., 2-5  (Conceptual)
3-1, 3-2, ..., 3-5  (Logical)
4-1, 4-2, ..., 4-5  (Physical)
5-1, 5-2, ..., 5-5  (Component)
6-1, 6-2, ..., 6-6  (Operational)
```

### Source Reference
```
POL-2025-001.contextual.1-2
POL-2025-001.logical.3-1
POL-2025-001.operational.6-4
```

### Release Tag
```
policy/POL-2025-001/v1.0
policy/POL-2024-042/v2.1
```

---

## Error Examples

### Invalid Policy ID
```json
{
  "policyId": "INVALID-ID"  // ✗ Must match POL-YYYY-NNN
}
```

### Missing Required Field
```json
{
  "policyId": "POL-2025-001",
  "layer": "logical"
  // ✗ Missing: version, generatedAt, generationStatus, sections
}
```

### Invalid Relationship
```json
{
  "source": "POL-2025-001.logical.3-1",
  "relationship": "references"  // ✗ Not in controlled vocabulary
}
```

### Incomplete Layer Status
```json
{
  "status": "approved",
  "prNumber": 123,
  "createdAt": "2025-01-15T10:00:00Z"
  // ✗ Missing: mergedAt (required for approved status)
}
```

---

## NPM Scripts

```bash
npm run validate -- POL-2025-001
npm run validate -- POL-2025-001 --layer logical
npm run validate -- POL-2025-001 --verbose
npm test  # Shows help
```

---

## CI/CD Integration

### GitHub Actions (in PR workflow)
```yaml
- run: node scripts/validate-artifacts.js ${{ steps.policy.outputs.id }}
```

### Pre-commit Hook
```bash
#!/bin/bash
POLICY_ID=$(git diff --cached --name-only | grep -oP 'POL-\d{4}-\d{3}' | head -1)
[ -n "$POLICY_ID" ] && node scripts/validate-artifacts.js "$POLICY_ID"
```

---

## Exit Codes

- `0` - All artifacts valid
- `1` - Validation errors found
- `2` - Missing dependencies or invalid arguments

---

## Enumerations

### Layers (6)
`contextual`, `conceptual`, `logical`, `physical`, `component`, `operational`

### Generation Status (2)
`complete`, `partial`

### Error Types (4)
`parse_failure`, `api_error`, `validation_error`, `incomplete_generation`

### Relationships (5)
`implements`, `derives_from`, `constrained_by`, `refines`, `validates`

### Policy Status (3)
`in-progress`, `completed`, `archived`

### Layer Status (3)
`not-started`, `pending-review`, `approved`

---

## Dependencies

```bash
npm install ajv ajv-formats
```

Or use package.json:
```bash
npm install
```

---

**For detailed documentation, see:**
- `schemas/README.md` - Comprehensive guide
- `SCHEMA_VALIDATION_COMPLETE.md` - Completion report
