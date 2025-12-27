## SABSA Artifact: {{layer_display}} Layer

**Policy ID:** {{policy_id}}
**Layer:** {{layer_number}} of 6 — {{layer_name}}
**Generated:** {{timestamp}}
**Status:** {{generation_status}}

---

### Policy Summary

> {{policy_summary}}

---

### Layer Progress

{{#each layer_status}}
- [{{#if completed}}x{{else}} {{/if}}] **{{name}}** {{#if pr_link}}([PR #{{pr_number}}]({{pr_link}})){{/if}}{{#if current}} ← **This PR**{{/if}}
{{/each}}

---

### Sections Generated

| Section | Title | Status | Traces To |
|---------|-------|--------|-----------|
{{#each sections}}
| {{id}} | {{title}} | {{status}} | {{traces_summary}} |
{{/each}}

---

### Review Checklist

- [ ] All sections are complete and coherent
- [ ] Rationale references appropriate frameworks
- [ ] Traceability links to correct upstream elements
- [ ] Content aligns with organizational context
- [ ] Technical accuracy verified

---

### Review Actions

| Action | Result |
|--------|--------|
| **Approve & Merge** | Triggers generation of next layer |
| **Request Changes** | Triggers automated revision with your feedback |
| **Close PR** | Halts policy workflow (requires manual restart) |

---

{{#if has_errors}}
### ⚠️ Generation Issues

The following issues were encountered during generation:

{{#each errors}}
**Section {{section}}:** {{error_type}}
```
{{message}}
```
{{/each}}

Manual review and completion may be required for flagged sections.
{{/if}}

---

<details>
<summary><strong>Section Rationale (expand for details)</strong></summary>

{{#each sections}}
#### Section {{id}}: {{title}}

**Why Suggested:**
{{rationale_why}}

**Condition Satisfied:**
{{rationale_condition}}

**Traceability:**
{{#each traces}}
- `{{source}}` ({{relationship}}){{#if description}}: {{description}}{{/if}}
{{/each}}

---

{{/each}}
</details>

---

<details>
<summary><strong>Upstream Context Used</strong></summary>

The following upstream sections were provided as context for this generation:

{{#each upstream_context}}
- `{{section_id}}`: {{section_title}}
{{/each}}

</details>
