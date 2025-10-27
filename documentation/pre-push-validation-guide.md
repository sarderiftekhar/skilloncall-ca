# Pre-Push Validation & Testing Guide - SkillOnCall.ca

**Complete guide for code quality, testing, and validation before pushing changes**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Automated Checks](#automated-checks)
- [Manual Validation](#manual-validation)
- [Testing Requirements](#testing-requirements)
- [Code Quality Standards](#code-quality-standards)
- [Commit Message Format](#commit-message-format)
- [Quick Commands Reference](#quick-commands-reference)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project uses automated git hooks to ensure code quality and prevent bugs before they reach the repository. These checks run automatically at different stages of the git workflow.

### Validation Levels

1. **Pre-Commit** (Automatic) - Runs on `git commit`
2. **Commit Message** (Automatic) - Validates on `git commit`
3. **Pre-Push** (Automatic) - Runs on `git push`
4. **Manual** - Should be run before committing/pushing

---

## 🚀 Quick Start

### Installation

The validation tools are already configured. To ensure everything is set up:

```bash
# Install dependencies (if not already done)
npm install
composer install

# Husky will automatically be initialized via npm prepare script
```

### Testing the Setup

```bash
# Try a commit to test pre-commit hooks
git add .
git commit -m "SOC-001: test: Verify hooks setup"

# If the format is wrong, you'll see an error message
```

---

## 🤖 Automated Checks

### On `git commit` (Pre-Commit Hook)

The pre-commit hook automatically runs **lint-staged** which executes:

#### JavaScript/TypeScript Files (`*.js`, `*.jsx`, `*.ts`, `*.tsx`)
```bash
# 1. ESLint with auto-fix
eslint --fix

# 2. Prettier formatting
prettier --write
```

**What it checks:**
- React hooks rules (rules-of-hooks, exhaustive-deps)
- TypeScript recommended rules
- React best practices
- Code formatting (indentation, quotes, semicolons)
- Import organization

#### JSON & CSS Files (`*.json`, `*.css`)
```bash
# Prettier formatting
prettier --write
```

#### PHP Files (`*.php`)
```bash
# Laravel Pint style checking and auto-fix
composer format
```

**What it checks:**
- PSR-12 coding standards
- Laravel coding style
- Proper indentation and spacing

### On `git commit` (Commit Message Hook)

```bash
# Validate commit message format
npx commitlint --edit
```

**Required Format:**
```
SOC-123: type: description

Examples:
✅ SOC-001: feat: Add mobile navigation drawer
✅ SOC-002: fix: Resolve hamburger menu positioning issue
✅ SOC-003: docs: Update worker platform plan
✅ SOC-004: style: Format dashboard component
✅ SOC-005: refactor: Simplify AppSidebarHeader logic
```

**Valid Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code restructuring
- `perf` - Performance improvements
- `test` - Adding tests
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Maintenance tasks
- `revert` - Revert previous commit

**Rules:**
- Must start with `SOC-` followed by numbers
- Subject must start with uppercase letter
- Subject must not end with period
- Header max length: 120 characters

### On `git push` (Pre-Push Hook)

```bash
# 1. TypeScript type checking
npm run types

# 2. PHP tests (Pest)
php artisan test
```

**What it checks:**
- TypeScript compilation errors
- Type safety issues
- All PHP unit tests
- All PHP feature tests
- Database migrations
- API endpoint tests
- Authentication tests

---

## 🔧 Manual Validation

### Complete Quality Check

Run the complete quality check suite before pushing:

```bash
# Complete quality check (Frontend + Backend)
npm run quality
```

This executes in order:
1. TypeScript type checking (`npm run types`)
2. ESLint checking (`npm run lint:check`)
3. Prettier format check (`npm run format:check`)
4. PHP Pint formatting check (`composer format-check`)
5. PHP tests (`php artisan test`)

### Individual Frontend Checks

#### TypeScript Type Checking
```bash
npm run types
# or
npx tsc --noEmit
```

**What it checks:**
- Type errors
- Missing type definitions
- Incorrect prop types
- Type mismatches

#### ESLint Check (Without Auto-Fix)
```bash
npm run lint:check
# or
npx eslint .
```

#### ESLint with Auto-Fix
```bash
npm run lint
# or
npx eslint . --fix
```

#### Prettier Check (Without Auto-Fix)
```bash
npm run format:check
# or
npx prettier --check resources/
```

#### Prettier with Auto-Fix
```bash
npm run format
# or
npx prettier --write resources/
```

### Backend Validation

#### Laravel Pint Formatting Check
```bash
composer format-check
# or
vendor/bin/pint --test
```

#### Laravel Pint Auto-Format
```bash
composer format
# or
vendor/bin/pint
```

#### PHP Tests (Pest)
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run specific test file
php artisan test tests/Feature/Auth/LoginTest.php

# Run with coverage (requires Xdebug or PCOV)
php artisan test --coverage

# Stop on first failure
php artisan test --stop-on-failure

# Run specific test method
php artisan test --filter test_user_can_login
```

---

## 🧪 Testing Requirements

### Backend Tests (PHP/Laravel)

#### Test Structure
```
tests/
├── Feature/              # Integration/Feature tests
│   ├── Auth/            # Authentication tests
│   ├── Settings/        # Settings tests
│   └── DashboardTest.php
├── Unit/                # Unit tests
├── Pest.php             # Pest configuration
└── TestCase.php         # Base test case
```

#### What to Test

**Feature Tests (`tests/Feature/`):**
- HTTP endpoints (GET, POST, PUT, DELETE)
- Authentication/Authorization
- Form validation
- Database operations
- Inertia responses
- Permissions and roles
- Email sending
- File uploads

**Unit Tests (`tests/Unit/`):**
- Service methods
- Model methods
- Helper functions
- Business logic

#### Test Example
```php
<?php

use App\Models\User;
use function Pest\Laravel\{actingAs, get, post};

it('allows authenticated users to view dashboard', function () {
    $user = User::factory()->create();
    
    actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('worker/dashboard')
        );
});

it('validates user creation request', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    
    actingAs($admin)
        ->post('/admin/users', [
            'name' => '',
            'email' => 'invalid-email',
        ])
        ->assertSessionHasErrors(['name', 'email']);
});
```

---

## 📝 Code Quality Standards

### PHP Standards (PSR-12 + Laravel)
- Use 4 spaces for indentation
- Opening braces on same line for methods
- One blank line between methods
- Type hints for parameters and return types
- DocBlocks for complex methods
- No trailing whitespace

### TypeScript/React Standards
- Use 4 spaces for indentation (consistent)
- PascalCase for components
- camelCase for functions/variables
- Interfaces for all props
- Export components as default
- Named exports for utilities

### ESLint Rules (Enforced)
- `react/react-in-jsx-scope`: off (React 19)
- `react/prop-types`: off (using TypeScript)
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: error

---

## 💬 Commit Message Format

### Required Format

```
SOC-<number>: <type>: <description>

Example:
SOC-123: feat: Add mobile navigation drawer
```

### Components

1. **Project Prefix**: `SOC-` (Skill On Call)
2. **Issue Number**: Any positive number (e.g., `001`, `123`, `456`)
3. **Type**: One of the valid types (see below)
4. **Description**: Brief description (sentence case, no period)

### Valid Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `SOC-001: feat: Add worker dashboard` |
| `fix` | Bug fix | `SOC-002: fix: Resolve menu positioning` |
| `docs` | Documentation | `SOC-003: docs: Update README` |
| `style` | Formatting | `SOC-004: style: Format components` |
| `refactor` | Code restructuring | `SOC-005: refactor: Simplify header` |
| `perf` | Performance | `SOC-006: perf: Optimize queries` |
| `test` | Tests | `SOC-007: test: Add dashboard tests` |
| `build` | Build system | `SOC-008: build: Update vite config` |
| `ci` | CI/CD | `SOC-009: ci: Add github actions` |
| `chore` | Maintenance | `SOC-010: chore: Update dependencies` |
| `revert` | Revert commit | `SOC-011: revert: Undo feature X` |

### ❌ Invalid Examples

```bash
# Missing SOC prefix
git commit -m "feat: Add feature"

# Wrong format
git commit -m "SOC feat: Add feature"

# Missing type
git commit -m "SOC-123: Add feature"

# Lowercase type
git commit -m "SOC-123: Feat: Add feature"

# Period at end
git commit -m "SOC-123: feat: Add feature."
```

### ✅ Valid Examples

```bash
git commit -m "SOC-123: feat: Add mobile navigation drawer"
git commit -m "SOC-456: fix: Resolve hamburger menu positioning issue"
git commit -m "SOC-789: docs: Update worker platform plan"
git commit -m "SOC-012: style: Format dashboard component"
git commit -m "SOC-345: refactor: Simplify AppSidebarHeader logic"
git commit -m "SOC-678: test: Add worker dashboard tests"
git commit -m "SOC-901: chore: Update npm dependencies"
```

---

## 📚 Quick Commands Reference

### Pre-Push Complete Checklist

Run these commands in order before pushing:

```bash
# 1. Format all code
npm run format
composer format

# 2. Run complete quality check
npm run quality

# 3. Check git status
git status

# 4. Stage changes
git add .

# 5. Commit (hooks run automatically)
git commit -m "SOC-123: feat: Your feature description"

# 6. Push (pre-push hook runs automatically)
git push origin your-branch
```

### Quick Validation Scripts

```bash
# Complete quality check
npm run quality

# Frontend only
npm run test:js

# Backend only
php artisan test

# Format everything
npm run format && composer format

# Check everything without fixing
npm run lint:check && npm run format:check && composer format-check
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Pre-Commit Hook Fails

**ESLint Errors:**
```bash
# Auto-fix lint errors
npm run lint

# Check what's wrong
npm run lint:check

# Manual fix if needed
npx eslint path/to/file.tsx --fix
```

**Prettier Errors:**
```bash
# Format all files
npm run format

# Format specific file
npx prettier --write path/to/file.tsx
```

**PHP Pint Errors:**
```bash
# Auto-fix PHP style
composer format

# Check specific file
vendor/bin/pint path/to/file.php
```

#### 2. Pre-Push Hook Fails

**TypeScript Errors:**
```bash
# Check types
npm run types

# Common fixes:
# - Add missing type definitions
# - Fix type mismatches
# - Add interface for props
# - Remove unused imports
```

**Test Failures:**
```bash
# Run tests verbosely to see details
php artisan test --verbose

# Run specific failing test
php artisan test --filter test_name

# Clear cache and retry
php artisan cache:clear
php artisan config:clear
php artisan test
```

#### 3. Commit Message Rejected

**Error Message:**
```
⧗   input: Add feature
✖   Please add rules to your `commitlint.config.js`
    - header must match pattern
```

**Solution:**
Use correct format:
```bash
# ❌ Wrong
git commit -m "Add feature"

# ✅ Correct
git commit -m "SOC-123: feat: Add user management feature"
```

#### 4. Build Failures

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Clear build
rm -rf public/build

# Rebuild
npm run build
```

#### 5. Database Test Failures

```bash
# Ensure test database is fresh
php artisan config:clear

# Check migrations
php artisan migrate:status

# Run tests with fresh database
php artisan test --env=testing
```

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit and commit-msg hooks
git commit --no-verify -m "message"

# Skip pre-push hook
git push --no-verify

# ⚠️ WARNING: Only use in emergencies!
# You must fix issues in a follow-up commit immediately!
```

---

## ✅ Best Practices

### Before Committing

- [ ] Code is tested locally
- [ ] No `console.log()` or debug code
- [ ] No commented-out code (unless documented)
- [ ] Imports are organized
- [ ] No unused imports or variables
- [ ] TypeScript types are defined
- [ ] Commit message follows convention
- [ ] Files are properly formatted

### Before Pushing

- [ ] All commits follow naming convention
- [ ] Branch is up to date with main/staging
- [ ] All tests pass locally
- [ ] No merge conflicts
- [ ] Branch name follows convention
- [ ] Code reviewed (if possible)
- [ ] Documentation updated (if needed)

---

## 🎯 Complete Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/mobile-menu

# 2. Make changes
# ... code changes ...

# 3. Run manual validation
npm run quality

# 4. Stage changes
git add .

# 5. Commit (pre-commit hook runs)
git commit -m "SOC-123: feat: Add mobile navigation menu"

# 6. Push (pre-push hook runs)
git push origin feature/mobile-menu

# 7. Create Pull Request
# - Review changes
# - Merge to staging/main
```

---

## 📄 Configuration Files

### Key Configuration Files

```
Project Root
├── .husky/                          # Git hooks
│   ├── pre-commit                  # Lint-staged
│   ├── commit-msg                  # Commitlint
│   └── pre-push                    # Types + Tests
├── .lintstagedrc.json              # Lint-staged config
├── commitlint.config.js            # Commit message rules
├── eslint.config.js                # ESLint configuration
├── tsconfig.json                   # TypeScript config
├── phpunit.xml                     # PHP testing config
├── vite.config.ts                  # Build configuration
├── composer.json                   # PHP dependencies & scripts
└── package.json                    # JS dependencies & scripts
```

---

## 🆘 Need Help?

1. Check this guide first
2. Review error messages carefully
3. Run `git status` to see current state
4. Run `npm run quality` to identify issues
5. Check project documentation
6. Ask team lead or senior developer

---

**Remember:** These checks exist to maintain code quality and prevent bugs. While they may seem strict, they save time in the long run by catching issues early!

---

**Version:** 1.0.0  
**Last Updated:** October 24, 2025  
**Project:** SkillOnCall.ca  
**Maintained By:** Development Team

