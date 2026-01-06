#!/bin/bash
# Show all BEADS issues for SABSA policy workflow

echo "========================================="
echo "SABSA Layer Issues (sabsa-git repository)"
echo "========================================="
echo ""
cd /Users/test/aiwork/sabsa-git
bd list -l sabsa-git --pretty
echo ""
echo ""
echo "========================================="
echo "Finalization Issue (aiwork repository)"
echo "========================================="
echo ""
cd /Users/test/aiwork
bd list --title "Finalize POL-2025-004"
echo ""
