# Technical Architecture

## Purpose

This PoC is designed to show how to turn the B&B Demo exercise into a maintainable automation and delivery structure. It is deliberately small, but the boundaries mirror how the suite could grow in a real team.

The README stays focused on setup and common commands. This document explains the architecture and why each choice was made.

## Architecture Overview

```text
src/                   Illustrative domain rules and fixtures
pages/                 Page Object Model classes and page components
tests/unit/            Fast dependency-free checks
tests/api/             Service boundary checks
tests/contract/        Consumer contract checks
tests/ui/              Browser-level discovery and input checks
tests/e2e/             Critical submitted journeys
tests/non-functional/  Accessibility and performance overlays
docs/                  Technical architecture and test strategy notes
.circleci/             CI/CD quality gates
```

The repo separates test intent by layer. That keeps feedback fast, makes failures easier to diagnose, and avoids repeatedly testing the same behaviour through the slowest path.

## Core Domain Helper

`src/domain/availability.js` contains the smallest useful illustrative slice of domain behaviour:

- date range validation
- booking overlap detection
- filtering available rooms

This is not intended to replace or verify the real product implementation. Because this is a standalone exercise repo, it is included to demonstrate what the low-level unit layer could look like. In a production team, these tests should live next to the actual domain/service implementation rather than duplicating product logic in a separate test repo. The API, UI, and E2E checks then validate that the deployed behaviour matches the agreed rules.

Fixtures live in `src/fixtures/` so tests can share example rooms, bookings, dates, and environment defaults without mixing sample data into the illustrative domain helper. This keeps the distinction clear: `src/domain/` shows the kind of business rules that should be unit tested in the real application, while `src/fixtures/` holds reusable example data and environment defaults. The matching unit tests in `tests/unit/availability.test.js` use Node's built-in test runner. That choice keeps the fastest checks dependency-light and means the first pipeline gate does not need a browser.

## Playwright Test Layers

Playwright is used for API, UI, and E2E examples because it can exercise both HTTP boundaries and real browser behaviour in one framework. 

The API tests validate the live Restful Booker boundary. These are useful before browser tests because they identify environment or response-shape problems early.

The Pact contract tests under `tests/contract/` are separate from live API tests. They exercise a small consumer client against a Pact mock provider and generate consumer contracts that could be published to a Pact Broker in a fuller implementation. This keeps live API availability checks and provider/consumer contract checks distinct: API tests ask "does the live service currently respond as expected?", while contract tests ask "what response shape does this consumer require from the provider?"

The UI tests validate whether the availability checker is discoverable and accepts user input from the landing page. They deliberately stop before asserting the submitted result so they do not duplicate the E2E journey. These tests should eventually use stable selectors such as `data-testid`; the current examples use accessible roles/text because this is a public demo app.

The E2E tests are intentionally few. They submit the availability search and protect the critical user journey rather than duplicating every unit, API, and UI assertion.

## Page Object Model

UI and E2E tests use a small Page Object Model:

- `BasePage` owns shared page navigation behaviour.
- `HomePage` exposes homepage availability controls, a non-submitting date-entry helper, and the submitted-search helper used by E2E tests.

These classes live under the top-level `pages/` folder rather than inside `tests/` because they are shared Page Object Model code, not executable test suites. The design keeps selectors inside page classes and keeps specs focused on behaviour. 

## Non-Functional Overlays

Accessibility and performance are treated as overlays rather than separate product areas.

`@axe-core/playwright` is used for accessibility because it integrates directly with browser tests and can provide actionable WCAG-oriented findings.

The current public demo page has a known critical `label` finding for form controls without accessible labels. The test allows that known issue while failing on any unexpected critical accessibility violation, so the suite remains useful without hiding new defects.

The accessibility probe lives under `tests/non-functional/accessibility/`. The Playwright performance probe is a lightweight browser budget check under `tests/non-functional/performance/`. The repo also includes an optional k6 smoke script under `tests/non-functional/performance/k6/` to show how HTTP-level performance checks could be versioned and run in CI. In a fuller implementation, this could evolve into richer k6 scenarios, Lighthouse CI, synthetic monitoring, or environment-level metrics depending on what the team already uses.

## Tagging Strategy

Tests use these tag groups:

- Layer tags: `@unit`, `@api`, `@ui`, `@e2e`
- Contract tag: `@contract`
- Intent tags: `@smoke`, `@regression`
- Quality overlays: `@accessibility`, `@performance`, `@security`

This keeps the model orthogonal. A test can be selected by where it runs, why it runs, or what quality concern it covers. That avoids tag explosion and makes CI jobs easier to understand.

## CI/CD Choices

CircleCI is used because the exercise documents reference it directly. The pipeline is structured as progressive gates:

- lint, documentation, and unit checks first
- API smoke and contract checks before wider browser coverage
- critical E2E after lower-level confidence exists
- accessibility and performance as later overlays

This ordering gives fast feedback on pull requests while still preserving confidence before deployment.

The current scripts are:

- `npm run lint`
- `npm run lint:docs`
- `npm run test:unit`
- `npm run test:api`
- `npm run test:contract`
- `npm run test:smoke`
- `npm run test:ui`
- `npm run test:e2e`
- `npm run test:accessibility`
- `npm run test:performance`
- `npm run test:performance:k6`
- `npm run test:all`

## Configuration

Environment variables are defined in `.env.example`:

- `B_AND_B_BASE_URL`
- `RESTFUL_BOOKER_BASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

The tests default to public demo URLs so the PoC is easy to inspect, but CI and real environments should provide explicit values.

## Trade-Offs And Next Steps

This repo includes representative tests and architecture rather than a large generated suite.

The next improvements would be:

- use stable selectors
- add admin authentication checks once credentials and expected behaviour are confirmed
- add test data setup/teardown for deterministic booking availability
- keep publishing Playwright reports and test results as CI artefacts
- publish generated Pact files to a Pact Broker and add provider verification once provider ownership is agreed
