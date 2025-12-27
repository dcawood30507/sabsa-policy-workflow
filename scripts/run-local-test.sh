#!/bin/bash
#
# SABSA Workflow Local Testing Script
#
# This script uses `act` (https://github.com/nektos/act) to run GitHub Actions
# workflows locally for testing the SABSA policy automation system.
#
# Requirements:
#   - act CLI tool installed: brew install act
#   - Docker running locally
#   - ANTHROPIC_API_KEY environment variable set
#
# Usage:
#   ./scripts/run-local-test.sh [test-type]
#
# Test types:
#   new-policy          - Test policy initialization workflow
#   pr-approved         - Test PR approval and cascade workflow
#   pr-changes          - Test revision workflow with changes requested
#   pr-merged           - Test layer cascade on PR merge
#   all                 - Run all tests in sequence
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TEST_FIXTURES_DIR="${REPO_ROOT}/.github/test-fixtures"
TEST_EVENTS_DIR="${REPO_ROOT}/.github/test-events"
TEST_OUTPUT_DIR="${REPO_ROOT}/.github/test-output"

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check if act is installed
    if ! command -v act &> /dev/null; then
        print_error "act CLI tool not found"
        echo "Install with: brew install act"
        echo "Or visit: https://github.com/nektos/act"
        exit 1
    fi
    print_success "act CLI found: $(act --version)"

    # Check if Docker is running
    if ! docker ps &> /dev/null; then
        print_error "Docker is not running"
        echo "Please start Docker Desktop and try again"
        exit 1
    fi
    print_success "Docker is running"

    # Check if ANTHROPIC_API_KEY is set
    if [ -z "${ANTHROPIC_API_KEY}" ]; then
        print_warning "ANTHROPIC_API_KEY not set in environment"
        print_info "Tests will use mock responses"
    else
        print_success "ANTHROPIC_API_KEY is set"
    fi

    # Create test output directory
    mkdir -p "${TEST_OUTPUT_DIR}"
    print_success "Test output directory created: ${TEST_OUTPUT_DIR}"
}

# Function to validate test fixtures exist
validate_fixtures() {
    print_header "Validating Test Fixtures"

    local fixtures=(
        "sample-policy-encryption.md"
        "expected-summary.md"
        "expected-contextual-sections.json"
        "expected-traceability.json"
    )

    for fixture in "${fixtures[@]}"; do
        if [ -f "${TEST_FIXTURES_DIR}/${fixture}" ]; then
            print_success "Found: ${fixture}"
        else
            print_error "Missing: ${fixture}"
            exit 1
        fi
    done

    print_header "Validating Test Events"

    local events=(
        "new-policy-event.json"
        "pr-approved-event.json"
        "pr-changes-requested-event.json"
        "pr-merged-event.json"
    )

    for event in "${events[@]}"; do
        if [ -f "${TEST_EVENTS_DIR}/${event}" ]; then
            print_success "Found: ${event}"
        else
            print_error "Missing: ${event}"
            exit 1
        fi
    done
}

# Function to test new policy initialization
test_new_policy() {
    print_header "Testing: New Policy Initialization"

    cd "${REPO_ROOT}"

    print_info "Running initialize-policy workflow with new-policy-event.json"

    if act issues \
        --eventpath "${TEST_EVENTS_DIR}/new-policy-event.json" \
        --workflows .github/workflows/initialize-policy.yml \
        --secret ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
        --artifact-server-path "${TEST_OUTPUT_DIR}/artifacts" \
        > "${TEST_OUTPUT_DIR}/new-policy-test.log" 2>&1; then
        print_success "Initialize workflow completed successfully"

        # Validate outputs
        print_info "Validating generated artifacts..."

        # Check if policy folder was created (in test mode, check logs)
        if grep -q "POL-2025-001" "${TEST_OUTPUT_DIR}/new-policy-test.log"; then
            print_success "Policy ID generated: POL-2025-001"
        else
            print_warning "Could not verify policy ID in output"
        fi

        return 0
    else
        print_error "Initialize workflow failed"
        print_info "Check logs: ${TEST_OUTPUT_DIR}/new-policy-test.log"
        return 1
    fi
}

# Function to test PR approval flow
test_pr_approved() {
    print_header "Testing: PR Approved Flow"

    cd "${REPO_ROOT}"

    print_info "Running cascade workflow with pr-approved-event.json"

    if act pull_request_review \
        --eventpath "${TEST_EVENTS_DIR}/pr-approved-event.json" \
        --workflows .github/workflows/cascade-next-layer.yml \
        --secret ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
        --artifact-server-path "${TEST_OUTPUT_DIR}/artifacts" \
        > "${TEST_OUTPUT_DIR}/pr-approved-test.log" 2>&1; then
        print_success "PR approval workflow completed successfully"
        return 0
    else
        print_error "PR approval workflow failed"
        print_info "Check logs: ${TEST_OUTPUT_DIR}/pr-approved-test.log"
        return 1
    fi
}

# Function to test PR changes requested flow
test_pr_changes_requested() {
    print_header "Testing: PR Changes Requested Flow"

    cd "${REPO_ROOT}"

    print_info "Running revision workflow with pr-changes-requested-event.json"

    if act pull_request_review \
        --eventpath "${TEST_EVENTS_DIR}/pr-changes-requested-event.json" \
        --workflows .github/workflows/handle-revision.yml \
        --secret ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
        --artifact-server-path "${TEST_OUTPUT_DIR}/artifacts" \
        > "${TEST_OUTPUT_DIR}/pr-changes-test.log" 2>&1; then
        print_success "Revision workflow completed successfully"

        # Check if feedback was extracted
        if grep -q "generalFeedback" "${TEST_OUTPUT_DIR}/pr-changes-test.log" || \
           grep -q "sectionFeedback" "${TEST_OUTPUT_DIR}/pr-changes-test.log"; then
            print_success "Review feedback extracted successfully"
        else
            print_warning "Could not verify feedback extraction in output"
        fi

        return 0
    else
        print_error "Revision workflow failed"
        print_info "Check logs: ${TEST_OUTPUT_DIR}/pr-changes-test.log"
        return 1
    fi
}

# Function to test PR merged flow
test_pr_merged() {
    print_header "Testing: PR Merged Flow"

    cd "${REPO_ROOT}"

    print_info "Running cascade workflow with pr-merged-event.json"

    if act pull_request \
        --eventpath "${TEST_EVENTS_DIR}/pr-merged-event.json" \
        --workflows .github/workflows/cascade-next-layer.yml \
        --secret ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
        --artifact-server-path "${TEST_OUTPUT_DIR}/artifacts" \
        > "${TEST_OUTPUT_DIR}/pr-merged-test.log" 2>&1; then
        print_success "Cascade workflow completed successfully"

        # Check if next layer was triggered
        if grep -q "layer.*conceptual" "${TEST_OUTPUT_DIR}/pr-merged-test.log" || \
           grep -q "Layer 2" "${TEST_OUTPUT_DIR}/pr-merged-test.log"; then
            print_success "Next layer (Conceptual) triggered successfully"
        else
            print_warning "Could not verify next layer trigger in output"
        fi

        return 0
    else
        print_error "Cascade workflow failed"
        print_info "Check logs: ${TEST_OUTPUT_DIR}/pr-merged-test.log"
        return 1
    fi
}

# Function to validate output against expected fixtures
validate_output() {
    print_header "Validating Output Against Expected Fixtures"

    print_info "Comparing generated artifacts with golden files..."

    # Note: In real tests, we would compare actual generated files
    # For now, we just check if expected files exist as reference

    if [ -f "${TEST_FIXTURES_DIR}/expected-summary.md" ] && \
       [ -f "${TEST_FIXTURES_DIR}/expected-contextual-sections.json" ] && \
       [ -f "${TEST_FIXTURES_DIR}/expected-traceability.json" ]; then
        print_success "Expected output fixtures available for comparison"
        print_info "Manual comparison required after workflow implementation"
    else
        print_warning "Some expected fixtures missing"
    fi
}

# Function to run all tests
run_all_tests() {
    print_header "Running All Tests"

    local total_tests=0
    local passed_tests=0
    local failed_tests=0

    # Array of test functions
    tests=(
        "test_new_policy"
        "test_pr_approved"
        "test_pr_changes_requested"
        "test_pr_merged"
    )

    for test in "${tests[@]}"; do
        ((total_tests++))
        if ${test}; then
            ((passed_tests++))
        else
            ((failed_tests++))
        fi
    done

    # Validate output
    validate_output

    # Print summary
    print_header "Test Summary"
    echo -e "Total Tests:  ${total_tests}"
    echo -e "${GREEN}Passed:       ${passed_tests}${NC}"
    echo -e "${RED}Failed:       ${failed_tests}${NC}"

    if [ ${failed_tests} -eq 0 ]; then
        print_success "All tests passed!"
        return 0
    else
        print_error "Some tests failed. Check logs in ${TEST_OUTPUT_DIR}"
        return 1
    fi
}

# Function to print usage
print_usage() {
    cat << EOF
Usage: $0 [test-type]

Test types:
  new-policy          - Test policy initialization workflow
  pr-approved         - Test PR approval and cascade workflow
  pr-changes          - Test revision workflow with changes requested
  pr-merged           - Test layer cascade on PR merge
  all                 - Run all tests in sequence (default)
  help                - Show this help message

Examples:
  $0                  # Run all tests
  $0 new-policy       # Test only initialization
  $0 pr-changes       # Test only revision workflow

Environment:
  ANTHROPIC_API_KEY   - Optional: API key for Claude integration
                        If not set, tests will use mock responses

Output:
  Test logs saved to: ${TEST_OUTPUT_DIR}/
  Test artifacts saved to: ${TEST_OUTPUT_DIR}/artifacts/

EOF
}

# Main script
main() {
    local test_type="${1:-all}"

    case "${test_type}" in
        help|-h|--help)
            print_usage
            exit 0
            ;;
        new-policy)
            check_prerequisites
            validate_fixtures
            test_new_policy
            ;;
        pr-approved)
            check_prerequisites
            validate_fixtures
            test_pr_approved
            ;;
        pr-changes)
            check_prerequisites
            validate_fixtures
            test_pr_changes_requested
            ;;
        pr-merged)
            check_prerequisites
            validate_fixtures
            test_pr_merged
            ;;
        all)
            check_prerequisites
            validate_fixtures
            run_all_tests
            ;;
        *)
            print_error "Unknown test type: ${test_type}"
            print_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
