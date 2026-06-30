# Task 1: Verification Approach

## Goal

The goal is to verify that the proposed scenarios for the B&B Demo availability checker and admin login are correct, testable, and aligned with user needs before automation is added.

I would treat this as a quality engineering activity rather than only a test-writing activity. The main outcome is shared confidence that the user stories express the right behaviour, that the acceptance criteria are observable, and that any assumptions or risks are visible to the team.

## System Context

The B&B Demo is a fictional hotel booking product. The new Availability Checker allows end users to search for available rooms from the front page. It is supported by the Restful Booker APIs and is intended to speed up the booking journey.

This is a high-trust transactional feature. Incorrect behaviour can affect:

- booking integrity, including double booking or hiding genuinely available rooms
- conversion and revenue, if users cannot find suitable rooms quickly
- user trust, if search results are inconsistent or confusing
- operational support load, especially during busy booking periods
- security, if admin authentication is weak or unclear

Because the feature sits at the start of the booking journey, the testing approach needs to cover both functional correctness and the user's experience of confidence.

## Starting Point: Three Amigos

I would begin with a Three Amigos session involving Product, Engineering, and Quality Engineering. The session would focus on intent rather than implementation details.

The objectives would be:

- confirm what problem the user story is solving
- agree the expected behaviour in normal, edge, and failure cases
- identify examples that prove the acceptance criteria
- expose gaps or assumptions before development diverges
- decide which behaviours should be automated at which layer
- agree what remains better suited to exploratory testing

This session would also include any relevant user research, analytics, support feedback, or operational knowledge. For example, if users often search same-day stays or weekends, those behaviours should shape the examples we choose.

## Story 1 Review

User story:

> As a new booking user, I want to see which rooms are available on the dates I select, so that I can book suitable rooms quickly.

Acceptance criteria:

- The user can see the Availability Checker in the landing screen.
- The user can select a range of dates in the Availability Checker.
- The user can see available rooms for booking using the Availability Checker with valid dates.

### Clarifications

- What exactly counts as the landing screen on desktop and mobile?
- Is the Availability Checker visible without scrolling on common viewports?
- What date format should the user see?
- Can users type dates, use a date picker, or both?
- Are past dates blocked or rejected after submission?
- Are same-day check-in/check-out searches valid?
- Is there a minimum or maximum stay length?
- What timezone should date validation use?
- Are rooms available by room type, individual room, inventory count, or another model?

### Example Acceptance Tests

- Given the user opens the landing page, when the page loads, then the Availability Checker is visible and usable.
- Given the user selects a valid future date range, when they submit the checker, then available rooms are displayed.
- Given the user enters an invalid date range, when they submit the checker, then a clear validation message is displayed and no misleading results are shown.

## Story 2 Review

User story:

> As a new booking user, I want to know only the rooms that are available, so that I can avoid wasting time making bookings that will fail.

Acceptance criteria:

- The user can use the Availability Checker to see only rooms that are available in a valid date range.
- The user cannot see rooms that are unavailable in a valid date range using the Availability Checker.
- The user is informed on the page if there are no rooms available in the date range they select.

### Clarifications

- Should unavailable rooms be hidden entirely or shown as unavailable?
- How is availability calculated when a room has partial overlap with the selected dates?
- Is checkout day considered available for another guest's check-in?
- How quickly should availability update after a booking is confirmed?
- What should happen if availability changes while the user is viewing results?
- What is the exact no-rooms-available message?
- Does the empty state offer useful next actions, such as changing dates?

### Example Acceptance Tests

- Given a room is already booked for any night in the selected range, when the user searches those dates, then that room is not shown as available.
- Given no rooms are available for the selected range, when the user searches, then the page shows a clear no-availability message.
- Given one room is available and another is unavailable, when the user searches the range, then only the available room can be selected for booking.

## Story 3 Review

User story:

> As an admin, I want the system to only allow authenticated admin users to be able to log in, so that the system remains safe and secure from unauthorised users.

Acceptance criteria:

- A user can log in and is authenticated within 5 seconds.
- An unauthenticated user is not able to log in.

### Clarifications

- What does "authenticated within 5 seconds" mean: API response, valid session, redirect completion, or fully usable admin page?
- Which identity source is authoritative?
- What message should unauthenticated users see?
- Are rate limits, account lockouts, or audit logs in scope?
- How are expired sessions handled?
- Should failed login attempts expose generic messages to avoid user enumeration?
- What environments can safely hold admin test credentials?

### Example Acceptance Tests

- Given valid admin credentials, when the admin logs in, then they reach a usable authenticated state within 5 seconds.
- Given invalid credentials, when the user attempts to log in, then authentication fails and admin-only pages remain inaccessible.
- Given no authenticated session, when a user attempts to access an admin page directly, then they are redirected or blocked.

## Risk-Based Review

I would prioritise test effort using business and technical risk.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Incorrect date validation | Users cannot search or can search invalid ranges | Unit tests for date rules, UI validation checks, exploratory date picker testing |
| Incorrect overlap logic | Double booking or hidden availability | Unit and API tests for booking boundary rules |
| UI/API mismatch | User sees results that cannot be booked | Live API checks, consumer contract checks, and one critical E2E journey |
| Empty state is unclear | Users abandon instead of changing dates | UI checks and exploratory content review |
| Stale availability | Last-room race conditions | Integration/API tests and exploratory concurrency testing |
| Weak admin authentication | Unauthorised access | Security-focused API/UI checks and environment controls |
| Slow authentication | Frustration or timeout risk | Performance budget and monitoring |

## Testability Review

Before automating, I would check that the stories can be tested reliably:

- stable selectors or accessible names exist for UI elements
- test data can create available and unavailable room states
- API responses expose enough information to confirm expected behaviour
- environments are stable and representative
- admin credentials can be provided securely in CI
- tests can clean up or isolate any data they create
- error messages and status codes are agreed

Where testability is weak, I would raise small engineering improvements such as `data-testid` attributes, deterministic test fixtures, API-level setup helpers, or clearer error contracts.

## Functional And Non-Functional Alignment

Functional quality confirms that the feature does the right thing:

- user can find the checker
- user can enter valid dates
- available rooms are shown
- unavailable rooms are not shown
- no-availability state is clear
- authenticated admins can log in
- unauthenticated users cannot log in

Non-functional quality confirms the behaviour is acceptable in real use:

- response time is reasonable
- validation is understandable
- the page is accessible
- authentication is secure
- errors are recoverable
- the system behaves predictably under slow or partial failure

## Definition Of Ready

A scenario is ready for development and automation when:

- the user need is clear
- acceptance criteria are measurable and observable
- examples cover normal, edge, and failure cases
- data setup and expected results are known
- the right test layer is agreed
- unresolved assumptions are documented
- non-functional expectations have thresholds where possible

## Definition Of Done

The feature should be considered done when:

- agreed acceptance criteria pass
- critical risks have appropriate automated or exploratory coverage
- no high-severity accessibility or security issue remains open
- test results are visible in CI
- known limitations are documented
- defects and quality observations are communicated to the team
