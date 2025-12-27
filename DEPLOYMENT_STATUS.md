# 🚀 SABSA Policy Workflow - Deployment Status

**Repository:** https://github.com/dcawood30507/sabsa-policy-workflow
**Status:** ⏳ **AWAITING API KEY CONFIGURATION**
**Deployment Date:** December 27, 2024

---

## ✅ Completed Deployment Steps

### 1. Repository Creation ✅
- **URL:** https://github.com/dcawood30507/sabsa-policy-workflow
- **Visibility:** Public
- **Initial Commit:** 59 files, 15,103 lines
- **Branch:** main
- **Status:** Live and accessible

### 2. Labels Created ✅
All 10 workflow labels successfully created:
- ✅ `new-policy` (triggers workflow initialization)
- ✅ `sabsa-artifact` (layer artifact PRs)
- ✅ `layer-1` through `layer-6` (SABSA layers)
- ✅ `needs-manual-review` (partial generation)
- ✅ `revision-limit-reached` (max revisions)

### 3. Dependencies Installed ✅
- **Root dependencies:** 7 packages (ajv, ajv-formats)
- **Claude action:** 65 packages (@anthropic-ai/sdk, @actions/core)
- **Vulnerabilities:** 0 found
- **Status:** All packages installed successfully

---

## ⏳ Pending Configuration

### Required: Anthropic API Key

**You must configure your Anthropic API key before the workflows can run.**

#### Option 1: GitHub CLI (Recommended)
```bash
gh secret set ANTHROPIC_API_KEY
# Paste your API key when prompted
```

#### Option 2: GitHub Web Interface
1. Visit: https://github.com/dcawood30507/sabsa-policy-workflow/settings/secrets/actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your API key from https://console.anthropic.com/
5. Click "Add secret"

#### How to Get an Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to "API Keys"
4. Create a new key
5. Copy the key (you won't see it again!)

---

## 🧪 Next Steps: Submit Test Policy

Once you've configured the API key, submit the first test policy:

### Method 1: GitHub Web Interface (Easiest)
1. Go to https://github.com/dcawood30507/sabsa-policy-workflow/issues/new/choose
2. Click "Get started" on "New Security Policy"
3. Fill in the form:
   - **Title:** Customer PII Encryption Policy
   - **Policy Statement:** (copy from `.github/test-fixtures/sample-policy-encryption.md`)
   - **Priority:** High
4. Click "Submit new issue"
5. Watch the workflow run!

### Method 2: GitHub CLI
```bash
# Submit the sample encryption policy
gh issue create \
  --title "[Policy] Customer PII Encryption Policy" \
  --label "new-policy" \
  --body-file .github/test-fixtures/sample-policy-encryption.md
```

### Method 3: Automated Script
```bash
# Run the automated submission script
./scripts/submit-test-policy.sh
```

---

## 📊 What Happens Next

### Automatic Workflow Execution

1. **Initialize Workflow** (~30 seconds)
   - Generates Policy ID: `POL-2025-001`
   - Creates folder structure
   - Generates AI summary
   - Commits to main

2. **Layer 1 Generation** (~2 minutes)
   - Calls Claude API for Contextual layer
   - Generates 5 sections with framework references
   - Creates traceability mappings
   - Opens Pull Request for review

3. **Human Review** (your turn!)
   - Review the PR at: https://github.com/dcawood30507/sabsa-policy-workflow/pulls
   - Check sections quality
   - Approve or request changes
   - Merge when satisfied

4. **Cascade to Layer 2** (~2 minutes)
   - Automatically triggers Conceptual layer
   - Uses approved Layer 1 as context
   - Repeats PR review process

5. **Repeat for Layers 3-6** (~12 minutes total)
   - Each layer builds on previous approvals
   - Complete traceability maintained
   - Full SABSA artifact generated

6. **Finalize** (~10 seconds)
   - Creates Git tag: `policy/POL-2025-001/v1.0`
   - Generates GitHub Release
   - Closes source issue
   - Policy complete!

**Total Time:** ~15 minutes of automation + your review time

---

## 📈 Monitoring Workflow Execution

### View Workflow Runs
```bash
# List all workflow runs
gh run list --limit 10

# Watch a specific run
gh run watch

# View detailed logs
gh run view <run-id> --log
```

### Check Policy Status
```bash
# List all policies
ls -la policies/

# View policy metadata
cat policies/POL-2025-001/metadata.json | jq

# Check layer status
cat policies/POL-2025-001/metadata.json | jq '.layerStatus'
```

### Monitor Pull Requests
```bash
# List open PRs
gh pr list

# View PR details
gh pr view <pr-number>

# Approve a PR
gh pr review <pr-number> --approve

# Merge a PR
gh pr merge <pr-number>
```

---

## 🔍 Validation Commands

### Validate Generated Artifacts
```bash
# Validate all artifacts for a policy
node scripts/validate-artifacts.js POL-2025-001

# Validate specific layer
node scripts/validate-artifacts.js POL-2025-001 --layer contextual

# Verbose output
node scripts/validate-artifacts.js POL-2025-001 --verbose
```

### Compare Against Expected Output
```bash
# Compare summary
diff -u .github/test-fixtures/expected-summary.md \
        policies/POL-2025-001/summary.md

# Compare Layer 1 sections
diff -u <(jq -S . .github/test-fixtures/expected-contextual-sections.json) \
        <(jq -S . policies/POL-2025-001/contextual/sections.json)
```

### Check Traceability
```bash
# View traceability for Layer 1
cat policies/POL-2025-001/contextual/traceability.json | jq

# Count references
cat policies/POL-2025-001/contextual/traceability.json | \
  jq '.references | to_entries | length'
```

---

## 💰 Cost Tracking

### Per Policy Estimate
- **Claude API:** ~$0.143 per complete policy (6 layers)
- **GitHub Actions:** Free (public repository)
- **Storage:** Free (1GB included)

### Monitor Usage
```bash
# Check Claude API usage
# Visit: https://console.anthropic.com/settings/usage

# Check GitHub Actions usage
gh api repos/dcawood30507/sabsa-policy-workflow/actions/runs \
  --jq '.workflow_runs[] | {name: .name, duration: .duration}'
```

---

## 🐛 Troubleshooting

### Workflow Not Starting
- ✅ Check issue has `new-policy` label
- ✅ Verify ANTHROPIC_API_KEY secret is set
- ✅ Check GitHub Actions are enabled (Settings → Actions)

### Claude API Errors
- ✅ Verify API key is valid: https://console.anthropic.com/
- ✅ Check API quota hasn't been exceeded
- ✅ Review workflow logs: `gh run view --log`

### PR Not Auto-Created
- ✅ Check workflow completed successfully
- ✅ Verify generate-layer.yml ran without errors
- ✅ Check repository permissions (Actions can create PRs)

### Validation Failures
- ✅ Run validation script: `node scripts/validate-artifacts.js POL-2025-001`
- ✅ Check JSON syntax: `jq empty policies/POL-2025-001/*/sections.json`
- ✅ Review error logs in workflow output

---

## 📚 Documentation Links

- **README:** [README.md](README.md) - Project overview
- **CLAUDE.md:** [CLAUDE.md](CLAUDE.md) - AI assistant instructions
- **Testing Guide:** [.github/TESTING.md](.github/TESTING.md) - Comprehensive testing
- **PRD:** [SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md](SABSA-AGENTIC-POLICY-WORKFLOW-PRD.md) - Full specification
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

---

## 🎯 Success Criteria

### First Policy Complete When:
- ✅ All 6 layers generated
- ✅ All PRs approved and merged
- ✅ Release tag created: `policy/POL-2025-001/v1.0`
- ✅ Traceability complete (business → runbook)
- ✅ No validation errors
- ✅ Source issue closed

### Expected Timeline:
- **Automation:** ~15 minutes
- **Human Review:** 1-3 days (depends on review speed)
- **Total:** 1-3 days (vs. 3-6 months manual!)

---

## 🎊 Ready to Launch!

**Once you've configured the ANTHROPIC_API_KEY, you're ready to submit your first test policy!**

Use one of the methods above to submit the Customer PII Encryption Policy and watch the magic happen.

**Questions or issues?** Check the troubleshooting section above or review the comprehensive documentation.

**Happy automating! 🚀**

---

**Deployment Lead:** Claude Code
**Repository:** https://github.com/dcawood30507/sabsa-policy-workflow
**Status:** Awaiting API key configuration ⏳
