# Task 3: CI/CD Guide

## Pipeline Shape

The CircleCI workflow is designed as progressive quality gates. Fast checks run first, then browser and public-service checks run once the basic repo health is known.

```text
lint + unit
    |
smoke + contract
    |
ui + e2e + accessibility
```

The implemented pipeline is intentionally lightweight for the exercise. The production model would add integration, contract, performance, security, cross-browser, deployment, and post-deployment stages once stable environments and credentials exist.

## Jobs

| Job | Command | Purpose |
| --- | --- | --- |
| `lint` | `npm run lint` | Checks JavaScript syntax and common static issues |
| `unit_tests` | `npm run test:unit` | Runs deterministic availability-rule examples without a browser |
| `smoke_tests` | `npm run test:smoke` | Exercises the smallest public API/UI confidence path |
| `contract_tests` | `npm run test:contract` | Generates Pact consumer contracts for provider/consumer expectations |
| `ui_tests` | `npm run test:ui` | Runs browser-level checker discovery and input examples |
| `e2e_tests` | `npm run test:e2e` | Protects the critical submitted homepage-to-availability journey |
| `accessibility_tests` | `npm run test:a11y` | Checks the landing page with axe-core |
| `k6_performance_smoke` | `k6 run tests/non-functional/performance/k6/availability-smoke.js` | Optional low-volume performance smoke for scheduled or pre-release runs |

Playwright reports, screenshots, traces, and JUnit output are stored as CircleCI artifacts where available. The k6 job is defined but not attached to the default workflow because public demo systems should not be load-tested on every pull request.

## Full Pipeline Model

| Stage | Scope | Example Tools | Gate |
| --- | --- | --- | --- |
| Static analysis | Code quality, duplication, dependency and security signals | ESLint, SonarQube | Pull request |
| Unit | Date rules, availability filtering, auth rules | Node test, JUnit, Jest, pytest | Pull request |
| Integration | Internal services, persistence, mocked providers | Testcontainers, WireMock | Merge to main |
| API and contract | Business rules, validation, auth, provider/consumer stability | Playwright API, Newman, Pact | Pull request / merge |
| UI and accessibility | Rendering, interaction, critical accessibility baseline | Playwright, axe-core | Merge to main |
| E2E | Critical user journeys only | Playwright | Pre-release |
| Non-functional | Performance, security, compatibility | k6, OWASP ZAP, BrowserStack | Nightly / pre-release |
| Post-deploy smoke | Environment operational checks | Playwright, Newman | After deployment |

## Execution Triggers

| Trigger | Stages Run | Purpose |
| --- | --- | --- |
| Pull request | Static analysis, docs, unit, contract, and API/UI smoke | Fast feedback before merge |
| Merge to main | Full API regression, UI, integration, accessibility | Wider confidence after integration |
| Pre-release | Critical E2E, BrowserStack, selected security checks | Release confidence |
| Nightly | k6 performance, extended BrowserStack, deeper regression | Broader risk coverage without slowing PRs |
| Post-deployment | Smoke checks against live environment | Confirm the deployed environment is operational |

## Environment

The suite defaults to public demo URLs so reviewers can run it without private infrastructure:

- `B_AND_B_BASE_URL=https://automationintesting.online`
- `RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=password`

Real pipelines should provide explicit environment variables through the CI secret store. Admin credentials should not be committed.

For AWS or Kubernetes-hosted delivery, the same tests should target environment-specific URLs through externalised configuration. Ephemeral branch environments, staging namespaces, and production smoke targets should be selected through CI contexts rather than code changes.

## Recommended Pull Request Gates

For every pull request:

- `npm run lint`
- `npm run lint:docs`
- `npm run test:unit`
- `npm run test:contract`
- `npm run test:smoke`

Before release or on a scheduled run:

- `npm run test:all`
- `npm run test:performance`
- `npm run test:performance:k6`

The public demo systems may be unavailable or changed without notice, so failures in API/UI smoke checks should first be triaged as either product regressions, environment drift, or public-service instability.

## Reporting And Flaky Test Handling

Each stage should publish enough evidence for triage without requiring local reproduction:

- JUnit-compatible XML results for CI dashboards
- Playwright HTML reports with screenshots, videos, and traces
- axe-core findings attached to accessibility jobs
- k6 threshold reports from performance jobs
- API reports from Newman or equivalent tooling when API collections are used

Flaky checks should be quarantined, tracked, and fixed rather than silently deleted. Retries are acceptable for known environmental instability, but they should not hide unreliable assertions or poor test data isolation.

## Next CI Improvements

- Add `npm run lint:docs` to the CircleCI workflow if documentation is a formal handoff artifact.
- Publish the HTML Playwright report for every browser job.
- Split public-demo checks from team-owned environment checks once an internal environment exists.
- Add deterministic test data setup/teardown before expanding availability scenarios at the API or E2E layer.
- Publish generated Pact files to a Pact Broker and add provider verification once provider ownership and environments are agreed.
- Expand k6, OWASP ZAP, and BrowserStack only after the team agrees service thresholds, credentials, and environment ownership.
