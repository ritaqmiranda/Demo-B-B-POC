# Task 2: Scenario Matrix

## Purpose

This matrix turns the availability and authentication stories into examples that can be discussed, automated, or left for exploratory testing. The goal is not to automate every row at the UI layer. The goal is to put each risk at the cheapest reliable layer.

## Coverage Principle

The PoC follows the same principle as the full written strategy: each behaviour should be validated once at the cheapest reliable level.

| Layer | Responsibility | Example Tools | PoC Status |
| --- | --- | --- | --- |
| Unit | Business logic in isolation | Node test, JUnit, Jest, pytest | Illustrated with a small availability model; in production this should target real domain/service code |
| Integration | Internal component and persistence interactions | Testcontainers, WireMock | Recommended future layer |
| API | Live service-boundary status, response, and data checks | Playwright API, Postman/Newman | Implemented as public API examples |
| Contract | Provider/consumer expectations without depending on live service availability | Pact | Implemented as a small consumer contract example |
| UI | Presentation, discoverability, and input behaviour | Playwright, axe-core | Implemented for homepage availability examples |
| E2E | Critical cross-system user journeys only | Playwright | Implemented as a minimal critical journey |
| Exploratory | Unknown risks and real-world behaviour | DevTools, Postman, manual sessions | Documented as part of the approach |

## Availability Checker

| Scenario | Example | Primary Layer | Current Coverage |
| --- | --- | --- | --- |
| Checker is visible | User opens the homepage and can find the availability checker | UI smoke | `tests/ui/availability.ui.spec.js` |
| Valid future stay | Check-in is before checkout and not in the past | Unit, UI input | `tests/unit/availability.test.js`, `tests/ui/availability.ui.spec.js` |
| Check-in today | User searches from the current day to a future checkout | Unit | `tests/unit/availability.test.js` |
| Past date rejected | User cannot search for a stay that starts before today | Unit, future UI validation | `tests/unit/availability.test.js` |
| Same-day checkout rejected | Check-in and checkout are the same date | Unit, future UI validation | `tests/unit/availability.test.js` |
| Checkout before check-in rejected | End date is earlier than start date | Unit, future UI validation | `tests/unit/availability.test.js` |
| Partial booking overlap | Requested stay overlaps an existing booking by at least one night | Unit | `tests/unit/availability.test.js` |
| Checkout boundary allowed | Existing checkout date can be another guest's check-in date | Unit | `tests/unit/availability.test.js` |
| Submitted availability journey | User enters valid dates, submits the checker, and sees a bookable/result state | E2E | `tests/e2e/booking-journey.e2e.spec.js` |
| Mixed availability | One room conflicts and another room remains bookable | Unit, future deterministic E2E | `tests/unit/availability.test.js` |
| No availability | Every room conflicts with the requested dates | Unit, future UI empty state | `tests/unit/availability.test.js` |
| Public booking API responds | Restful Booker exposes a booking list | API smoke | `tests/api/availability.api.spec.js` |
| Booking detail shape | Booking details include check-in and checkout date boundaries | API regression | `tests/api/availability.api.spec.js` |
| Booking consumer contract | Consumer expects booking IDs and booking date fields from provider | Contract | `tests/contract/restful-booker.consumer.pact.spec.js` |

## Admin Authentication

| Scenario | Example | Primary Layer | Current Coverage |
| --- | --- | --- | --- |
| Valid admin login | Known admin credentials reach an authenticated state within 5 seconds | UI/API, future | Not automated until credentials and expected landing state are agreed |
| Invalid admin login | Invalid credentials do not create an authenticated session | UI/API, future | Not automated until error behavior is confirmed |
| Direct admin access blocked | Unauthenticated user cannot reach admin-only pages by URL | UI/API, future | Not automated until route behavior is confirmed |
| Session expiry | Expired sessions require re-authentication | UI/API, future | Candidate for later regression coverage |
| Rate limiting/audit behavior | Repeated failed login attempts are controlled and observable | Security, future | Candidate for exploratory/security testing |

## Non-Functional Scenario Transfer

The original strategy is broader than the executable PoC. These scenarios are intentionally documented so a reviewer can see how the suite would grow in a real team-owned environment.

| Area | Automated Baseline | Exploratory / Manual Focus | Suggested Cadence |
| --- | --- | --- | --- |
| Performance | Availability and authentication thresholds, API/workflow load tests | Perceived speed, loading indicators, network profile inspection | Nightly or pre-release |
| Accessibility | axe-core scans on landing, availability results, and login states | Keyboard-only flow, screen reader checks, zoom, focus order | UI stage and exploratory sessions |
| Compatibility | Targeted browser/device checks | Mobile/touch behaviour, responsive layout, date picker differences | Merge to main or nightly |
| Security | Authentication enforcement, unauthorised access, token/session checks, malformed payloads | Route manipulation, token storage inspection, error message leakage | API stage or pre-release |
| Reliability | Retry/recovery checks, duplicate submission protection, repeated API calls | Refresh during booking, interrupted network, tab switching | Regression or nightly |
| Usability | Usually not automated | Clarity of empty states, validation messages, and navigation flow | Manual feature review |

## Exploratory Focus

Exploratory testing should feed future automation choices rather than sit separately from the suite:

- unusual date combinations such as month-end, leap years, and long stays
- concurrent attempts to book the last available room
- stale availability after a confirmed booking
- refresh, back/forward, and tab-switching during the booking journey
- admin login autofill, repeated failures, session expiry, and direct route access
- clarity of no-availability and validation messages

## Prioritisation

The current suite focuses on the availability checker because it has clear observable behavior and can be partly modeled with deterministic fixtures. The unit layer is illustrative: it shows how the booking rules could be covered if the team had access to the real application/domain code. Admin login remains documented but intentionally unimplemented until the team confirms credentials, session behavior, and safe CI handling.

The next useful automation expansion is UI validation for invalid date ranges and the no-availability empty state, once the public demo exposes stable selectors or the team-owned app adds test hooks.
