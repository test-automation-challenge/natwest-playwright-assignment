# Online Banking UI Automation (Playwright + TypeScript)

## About This Solution
This project automates core workflows of the XYZ Bank demo application using Playwright and TypeScript. The focus is
on maintainable tests, clear separation of concerns via the Page Object Model (POM), and a mix of functional and
visual validations. I also added an extra user story (JIRA‑4) to strengthen coverage beyond the given scope.

App under test:
https://www.globalsqa.com/angularJs-protractor/BankingProject

## Framework & Design
- Playwright test runner with TypeScript
- Page Object Model (POM) for UI actions and locators
- Tests grouped by domain: bank manager, customer, and visual
- Helpers for data generation and parsing
- Cross‑browser coverage (Chromium, Firefox, WebKit)

## Covered Scenarios
JIRA‑1: Create Customer
- Required field validation
- Successful creation message
- Duplicate customer handling
- Customer record presence in table
- Cleanup after test

JIRA‑2: Open Account
- Currency options validation
- Successful account creation message
- Account number extraction and verification in Customers table

JIRA‑3: Deposit
- Success message and balance update
- Transaction row created as Credit
- Empty amount validation tooltip

JIRA‑4: Withdrawal (added by me to strengthen coverage)
- Success message and balance update
- Transaction row created as Debit
- Empty amount validation tooltip
- Failure message for excessive withdrawal

## Visual Testing
Static pages are validated with `toHaveScreenshot`. Baseline images are stored under `tests/.snapshots/`. Snapshot
updates are done locally and committed after review.

## Stability Note
The Transactions table intermittently fails to load on the first attempt in the demo app. A targeted retry is
implemented (navigate Back and re‑open Transactions) to reduce test flakiness while keeping failures visible.

## Project Layout
- `pages/` page objects
- `tests/` test suites by feature
- `utils/` helpers (test data, parsers, URLs, constants)
- `tests/.snapshots/` visual baselines

## Setup
```bash
npm ci
npx playwright install --with-deps
```

## Running Tests
All tests:
```bash
npx playwright test
```

By suite:
```bash
npx playwright test tests/bank-manager
npx playwright test tests/customer
npx playwright test tests/visual
```

Update visual baselines:
```bash
npx playwright test tests/visual --update-snapshots
```

## Configuration
- Override base URL:
  ```bash
  BASE_URL=https://www.globalsqa.com/angularJs-protractor/BankingProject npx playwright test
  ```
- Snapshot path template:
  `tests/.snapshots/{testFilePath}/{arg}{ext}`

## CI
GitHub Actions runs the full suite on pushes/PRs to `main`/`master` and uploads the Playwright HTML report as an
artifact.

## Future Enhancements
- Cloud execution with BrowserStack/Sauce Labs for wider device/OS coverage
- Parallel shards in CI to reduce runtime
- Data-driven test matrix for account types and currencies
- Custom reporter (Allure or HTML with trend history)
- Accessibility checks (axe‑core)
- API setup/teardown for faster, more deterministic preconditions
