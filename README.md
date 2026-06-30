# QE B&B Demo PoC

This repository is a compact Proof of Concept for the B&B Demo availability checker and the Restful Booker API. It combines executable tests, scenario notes, and CI guidance so the approach can be reviewed as both code and strategy.

## Submission Map

The technical test asks for three written deliverables. This repo supports them with lightweight executable examples:

| Exercise deliverable | Repo evidence |
| --- | --- |
| Task 1 - approach to verifying scenarios | `docs/task-1-verification-approach.md` |
| Task 2 - functional and non-functional scenarios | `docs/task-2-scenario-matrix.md` |
| Task 3 - CI/CD implementation guide | `docs/task-3-cicd-guide.md` and `.circleci/config.yml` |
| Supporting automation PoC | `src/domain/availability.js`, `tests/`, `pages/` and `playwright.config.js` |

The code is intentionally small and demonstrates how the strategy starts to become maintainable automation. Because this is a standalone exercise repo, `src/domain/availability.js` is an illustrative model, not the real product implementation. It shows the kind of low-level coverage I would expect in the product codebase. In a production team, I would place these unit tests next to the actual domain/service implementation rather than duplicating product logic in a separate test repo; API, UI, and E2E checks would then validate the deployed behaviour.

## What This Covers

- Unit examples for booking date validation and availability filtering.
- API examples against the public Restful Booker service.
- Pact consumer contract examples for the Restful Booker client expectations.
- UI examples for checker discoverability/input and an E2E example for the submitted availability journey.
- Accessibility and performance probes as non-functional overlays.
- CircleCI gates that run faster checks before browser-heavy suites.

For architecture decisions and test layer rationale, see [docs/technical-architecture.md](docs/technical-architecture.md).

## Target Systems

- B&B Demo website: `https://automationintesting.online`
- Restful Booker API: `https://restful-booker.herokuapp.com`

## Repo Structure

```text
docs/                  Technical architecture and QE strategy notes
pages/                 Page Object Model classes
src/domain/            Illustrative domain rules for unit-test examples
src/fixtures/          Environment and test data fixtures
tests/unit/            Dependency-free unit tests
tests/api/             Playwright API examples
tests/contract/        Pact consumer contract examples
tests/ui/              Playwright UI discovery and interaction examples
tests/e2e/             Critical submitted journey examples
tests/non-functional/  Accessibility and performance probes
.circleci/config.yml   Progressive pipeline quality gates
```
## Running Locally

Install dependencies:

```bash
npm install
npx playwright install
```

Run fast deterministic checks:

```bash
npm run lint
npm run lint:docs
npm run test:unit
```

Run the default smoke path:

```bash
npm test
```

Run tagged suites:

```bash
npm run test:smoke
npm run test:api
npm run test:contract
npm run test:ui
npm run test:e2e
npm run test:accessibility
npm run test:performance
npm run test:performance:k6
npm run test:all
```

`npm run test:performance:k6` requires the k6 CLI. It is intentionally low-volume and should be treated as a performance smoke/budget check rather than a public load test. The CircleCI k6 job is defined for scheduled or pre-release use, but it is not attached to the default workflow.

`npm run test:contract` generates Pact files under `pacts/`. Those files are ignored locally because this PoC does not publish to a Pact Broker yet.

## Tagging Model

Tests use a minimal tag model so pipeline stages can select intent without duplicating coverage:

- Layer: `@unit`, `@api`, `@ui`, `@e2e`
- Contract: `@contract`
- Intent: `@smoke`, `@regression`
- Quality overlay: `@accessibility`, `@performance`, `@security`

## PoC Notes

The live demo systems can change independently of this repo, so the browser and public API suites are intentionally small. In a real scenario, the next step would be to add deterministic booking data setup/teardown for stability and compatibility across shared environments.

The PoC deliberately does not implement every production recommendation from the written strategy. Items such as Pact Broker publishing/provider verification, broader k6 load profiles, BrowserStack coverage, OWASP ZAP scans, and full admin authentication automation are documented as next steps because they need stable service ownership, credentials, environments, and team agreement.
