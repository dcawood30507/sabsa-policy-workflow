# Contributing to SABSA Agentic Policy Workflow

Thank you for your interest in contributing to the SABSA Agentic Policy Workflow! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)
7. [Contribution Areas](#contribution-areas)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- GitHub account
- Git installed locally
- Node.js (v18 or later) for testing the Claude action
- Anthropic API key for testing

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/sabsa-policy-workflow.git
   cd sabsa-policy-workflow
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/sabsa-policy-workflow.git
   ```

## Development Setup

### Install Dependencies

For the Claude action:
```bash
cd .github/actions/call-claude
npm install
```

### Configure Secrets (for local testing)

Create a `.env` file in the root directory:
```
ANTHROPIC_API_KEY=your-api-key-here
```

**Important**: Never commit this file! It's already in `.gitignore`.

## Making Changes

### Branch Naming

Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation updates
- `refactor/` — Code refactoring
- `test/` — Test additions or modifications

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(workflows): add retry logic to Claude API calls

Add exponential backoff retry logic to handle rate limits
and transient API failures more gracefully.

Closes #42
```

```
docs(readme): update setup instructions

Add section on configuring API keys and troubleshooting
common setup issues.
```

### Code Style

- **JavaScript**: Follow Airbnb style guide
- **YAML**: Use 2-space indentation
- **JSON**: Use 2-space indentation, no trailing commas
- **Markdown**: Use ATX-style headers, line length ≤120 characters

## Testing

### Test the Claude Action

```bash
cd .github/actions/call-claude
npm test
```

### Test Workflows Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run a workflow
act workflow_dispatch -W .github/workflows/initialize-policy.yml
```

### Manual Testing

1. Create a test issue in your fork
2. Verify workflows trigger correctly
3. Check PR creation and content
4. Test revision workflow with review comments

## Submitting Changes

### Pull Request Process

1. **Update from upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

### PR Requirements

- [ ] All tests pass
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow conventions
- [ ] PR description explains changes clearly
- [ ] Related issue referenced (if applicable)

### Review Process

- Maintainers will review your PR
- Address any feedback in new commits
- Once approved, maintainers will merge

## Contribution Areas

### High-Impact Opportunities

#### 1. Prompt Engineering

**Location**: `prompts/*.md`

Improve AI generation quality:
- Enhance layer-specific prompts
- Add domain-specific variations (cloud, network, data security)
- Improve framework mapping instructions

**Skills needed**: Security architecture, SABSA knowledge

#### 2. Error Handling

**Location**: `.github/actions/call-claude/index.js`

Enhance robustness:
- Better partial result extraction
- Improved retry strategies
- More detailed error messages

**Skills needed**: JavaScript, API integration

#### 3. Workflow Enhancements

**Location**: `.github/workflows/*.yml`

Add capabilities:
- Parallel policy processing
- Custom review workflows
- Integration with external systems

**Skills needed**: GitHub Actions, YAML

#### 4. Documentation

**Location**: `docs/`, `README.md`

Improve usability:
- Step-by-step tutorials
- Video walkthroughs
- Troubleshooting guides
- Architecture diagrams

**Skills needed**: Technical writing

#### 5. Testing

**Location**: `tests/`, `.github/actions/call-claude/__tests__/`

Increase reliability:
- Unit tests for Claude action
- Integration tests for workflows
- E2E test scenarios
- Mock data generators

**Skills needed**: Jest, GitHub Actions testing

#### 6. Configuration

**Location**: `config/*.json`

Expand flexibility:
- Additional framework mappings (NIST CSF, CIS Controls)
- Custom section definitions
- Industry-specific templates (finance, healthcare)

**Skills needed**: Security frameworks, JSON

### Feature Requests

Check the [Issues](https://github.com/your-org/sabsa-policy-workflow/issues) page for:
- Feature requests labeled `enhancement`
- Bugs labeled `bug`
- Good first issues labeled `good-first-issue`

## Questions?

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs or request features
- **Contact**: Reach out to maintainers via GitHub

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping improve the SABSA Agentic Policy Workflow!
