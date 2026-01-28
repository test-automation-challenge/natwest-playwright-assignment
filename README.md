# Test Automation Assignment with Playwright/TypeScript

## Role Background
Within the team, we are dedicated to provide high-quality services to our Online Banking application users.
Your role with the team as a Quality Automation Engineer will include, but is not limited to designing and writing
automated tests for the Online Banking application. We use a custom built test framework based on
Playwright/TypeScript and follow the Page Object Model (POM) design pattern.

## Assignment Intro
As part of this assignment, you are expected to design and implement a set of automated tests following good test
design principles and best practices.

Estimated Duration: 1-2 hours (guidance only).

## Application Under Test
XYZ Bank demo app:
https://www.globalsqa.com/angularJs-protractor/BankingProject

## Requirements
Required:
- Implement automated tests for a set of user stories
- Organise tests in test suites which can be executed separately
- Implement different types of tests to validate functionality as well as visual appearance
- Go beyond the given acceptance criteria with justification

Nice to have:
- Follow clean code practices such as good naming and method design
- Provide the solution using Git (or via email)
- Design and implement setup and clean-up steps

## Example User Stories (Implemented)
JIRA-1: Bank Manager Operations - Create a customer
- Validate mandatory fields for first name, last name, and post code
- Validate success message
- Prevent duplicate customers
- Verify new record in Customers table
- Cleanup after test

JIRA-2: Bank Manager Operations - Open an account
- Validate supported currencies
- Validate success message and extract account number
- Verify account number appears in Customers table

JIRA-3: Bank Customer Operations - Make a deposit
- Validate success message
- Validate balance update
- Validate transaction record (Credit)
- Validate empty amount tooltip

JIRA-4: Bank Customer Operations - Make a withdrawal (added by me to strengthen coverage)
- Validate success message
- Validate balance update
- Validate transaction record (Debit)
- Validate empty amount tooltip
- Validate failure on excessive withdrawal

## Solution Overview
- Framework: Playwright + TypeScript
- Pattern: Page Object Model (POM)
- Tests grouped by feature area (bank manager, customer, visual)
- Setup/cleanup included in tests where applicable
- Visual regression tests included for static pages
- Workaround: Transactions table can be unstable in the app. A retry that navigates Back and re-opens the
  Transactions tab is implemented to improve stability. This is noted as an application-side flakiness workaround.

## Project Structure
- `pages/` POM classes for manager and customer flows
- `tests/` test suites by feature
- `utils/` test data helpers, parsers, URLs, constants
- `tests/.snapshots/` baseline visual snapshots

## Setup
```bash
npm ci
npx playwright install --with-deps
```

## Run Tests
Run all tests:
```bash
npx playwright test
```

Run a suite:
```bash
npx playwright test tests/bank-manager
npx playwright test tests/customer
npx playwright test tests/visual
```

Update visual snapshots locally:
```bash
npx playwright test tests/visual --update-snapshots
```

## Configuration
- Base URL can be overridden:
  ```bash
  BASE_URL=https://www.globalsqa.com/angularJs-protractor/BankingProject npx playwright test
  ```
- Browser coverage: Chromium, Firefox, WebKit
- Snapshot path:
  `tests/.snapshots/{testFilePath}/{arg}{ext}`

## CI
GitHub Actions workflow runs tests on pushes/PRs to `main`/`master` and uploads the Playwright report artifact.
Visual snapshots are treated as baseline; updates are performed locally and committed after review.
