#!/bin/bash

##############################################################################
# SABSA Policy Workflow - Submit Test Policy
#
# This script submits the sample Customer PII Encryption Policy to test
# the complete SABSA workflow automation.
#
# Prerequisites:
# - GitHub CLI (gh) installed and authenticated
# - ANTHROPIC_API_KEY secret configured in repository
# - Repository: dcawood30507/sabsa-policy-workflow
#
# Usage:
#   ./scripts/submit-test-policy.sh
#
##############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         SABSA Policy Workflow - Submit Test Policy                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ GitHub CLI (gh) not found${NC}"
    echo "Please install: https://cli.github.com/"
    exit 1
fi
echo -e "${GREEN}✓ GitHub CLI installed${NC}"

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}✗ Not authenticated with GitHub${NC}"
    echo "Please run: gh auth login"
    exit 1
fi
echo -e "${GREEN}✓ GitHub authenticated${NC}"

# Check if API key is configured
if ! gh secret list | grep -q "ANTHROPIC_API_KEY"; then
    echo -e "${RED}✗ ANTHROPIC_API_KEY secret not configured${NC}"
    echo ""
    echo "Please configure your Anthropic API key:"
    echo "  gh secret set ANTHROPIC_API_KEY"
    echo ""
    echo "Or visit:"
    echo "  https://github.com/dcawood30507/sabsa-policy-workflow/settings/secrets/actions"
    exit 1
fi
echo -e "${GREEN}✓ ANTHROPIC_API_KEY configured${NC}"

# Check if sample policy exists
if [ ! -f ".github/test-fixtures/sample-policy-encryption.md" ]; then
    echo -e "${RED}✗ Sample policy file not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Sample policy file found${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 Submitting Test Policy: Customer PII Encryption Policy${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""

# Read the sample policy
POLICY_BODY=$(cat .github/test-fixtures/sample-policy-encryption.md)

# Create the issue
echo -e "${BLUE}Creating GitHub issue...${NC}"

ISSUE_URL=$(gh issue create \
    --title "[Policy] Customer PII Encryption Policy" \
    --label "new-policy" \
    --body "$POLICY_BODY" \
    --repo dcawood30507/sabsa-policy-workflow)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Issue created successfully!${NC}"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Test Policy Submitted Successfully!${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "📝 Issue URL: ${BLUE}$ISSUE_URL${NC}"
    echo ""
    echo -e "${YELLOW}What happens next:${NC}"
    echo ""
    echo "  1. ⏱️  Initialize workflow starts (~30 seconds)"
    echo "     - Generates Policy ID: POL-2025-001"
    echo "     - Creates folder structure"
    echo "     - Generates AI summary"
    echo ""
    echo "  2. 🤖 Layer 1 (Contextual) generation (~2 minutes)"
    echo "     - Calls Claude API"
    echo "     - Generates 5 sections with framework references"
    echo "     - Creates Pull Request for review"
    echo ""
    echo "  3. 👀 Your turn: Review the PR"
    echo "     - Check sections quality"
    echo "     - Approve or request changes"
    echo "     - Merge when satisfied"
    echo ""
    echo "  4. 🔄 Cascade continues through Layers 2-6"
    echo "     - Each layer builds on previous approvals"
    echo "     - ~15 minutes total automation time"
    echo ""
    echo "  5. 🎉 Finalization"
    echo "     - Creates Git tag and release"
    echo "     - Closes source issue"
    echo "     - Policy complete!"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}📊 Monitoring Commands:${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "  Watch workflow progress:"
    echo -e "    ${BLUE}gh run watch${NC}"
    echo ""
    echo "  List workflow runs:"
    echo -e "    ${BLUE}gh run list --limit 5${NC}"
    echo ""
    echo "  View detailed logs:"
    echo -e "    ${BLUE}gh run view --log${NC}"
    echo ""
    echo "  List pull requests:"
    echo -e "    ${BLUE}gh pr list${NC}"
    echo ""
    echo "  View policy status:"
    echo -e "    ${BLUE}cat policies/POL-2025-001/metadata.json | jq${NC}"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}🚀 Workflow automation started! Watch it at:${NC}"
    echo -e "${BLUE}https://github.com/dcawood30507/sabsa-policy-workflow/actions${NC}"
    echo ""
else
    echo -e "${RED}✗ Failed to create issue${NC}"
    exit 1
fi
