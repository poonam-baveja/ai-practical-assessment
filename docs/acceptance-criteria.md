# Support Ticket Management System — Acceptance Criteria

This document defines measurable acceptance criteria for each functional requirement using the Given–When–Then format. It covers validation, error handling, status transitions, UI behavior, backend rules, persistence, and testing expectations.

---

## FR-1: Ticket Creation

### AC-1.1: Successful ticket creation with all valid fields

- **Given** the user is on the Create Ticket page
- **When** the user fills in a valid title, description, selects a priority and category, and submits the form
- **Then** the system creates a new ticket with status "Open", a unique ID, and a `createdAt` timestamp
- **And** the user is redirected to the ticket list
- **And** a success toast notification is displayed
- **And** the new ticket appears in the ticket list

### AC-1.2: Title validation — required

- **Given** the user is on the Create Ticket page
- **When** the user leaves the title field empty and blurs the field
- **Then** an inline error message is displayed: "Title is required"
- **And** the submit button remains disabled

### AC-1.3: Title validation — max length

- **Given** the user is on the Create Ticket page
- **When** the user enters more than 200 characters in the title field
- **Then** an inline error message is displayed: "Title must be 200 characters or fewer"
- **And** the submit button remains disabled

### AC-1.4: Description validation — required

- **Given** the user is on the Create Ticket page
- **When** the user leaves the description field empty and blurs the field
- **Then** an inline error message is displayed: "Description is required"
- **And** the submit button remains disabled

### AC-1.5: Description validation — max length

- **Given** the user is on the Create Ticket page
- **When** the user enters more than 2000 characters in the description field
- **Then** an inline error message is displayed: "Description must be 2000 characters or fewer"
- **And** the submit button remains disabled

### AC-1.6: Priority validation — required

- **Given** the user is on the Create Ticket page
- **When** the user does not select a priority
- **Then** an inline error message is displayed: "Priority is required"
- **And** the submit button remains disabled

### AC-1.7: Category validation — required

- **Given** the user is on the Create Ticket page
- **When** the user does not select a category
- **Then** an inline error message is displayed: "Category is required"
- **And** the submit button remains disabled

### AC-1.8: Backend validation — reject invalid payload

- **Given** a POST request is sent to `/api/tickets` with missing or invalid fields
- **When** the server processes the request
- **Then** the server responds with HTTP 400
- **And** the response body contains field-level error messages

### AC-1.9: Prevent double submission

- **Given** the user has filled out a valid form and clicks submit
- **When** the API call is in progress
- **Then** the submit button shows a loading state and is disabled
- **And** clicking the button again has no effect

### AC-1.10: Form reset after success

- **Given** the user has successfully created a ticket
- **When** they navigate back to the Create Ticket page
- **Then** all form fields are empty/reset to defaults

### AC-1.11: Persistence

- **Given** a ticket has been successfully created
- **When** the application is restarted
- **Then** the ticket still exists in the database and appears in the ticket list

---

## FR-2: Ticket Listing & Viewing

### AC-2.1: Display all tickets in a paginated list

- **Given** there are 25 tickets in the database
- **When** the user navigates to the ticket list page
- **Then** the first 10 tickets are displayed
- **And** pagination controls show 3 pages

### AC-2.2: Ticket list item displays correct information

- **Given** tickets exist in the database
- **When** the ticket list loads
- **Then** each ticket card/row shows: ticket ID, title, status badge, priority badge, category, and creation date

### AC-2.3: Navigate to ticket detail

- **Given** the user is viewing the ticket list
- **When** the user clicks on a ticket
- **Then** the user is navigated to the ticket detail page at `/tickets/:id`
- **And** the full ticket information is displayed

### AC-2.4: Ticket detail displays all fields

- **Given** a ticket exists with all fields populated
- **When** the user views the ticket detail page
- **Then** the page displays: title, description, status, priority, category, created date, and last updated date

### AC-2.5: Pagination — navigate between pages

- **Given** there are more than 10 tickets
- **When** the user clicks "Next" or a page number
- **Then** the next set of tickets is displayed
- **And** the current page indicator updates

### AC-2.6: Pagination — first and last page boundaries

- **Given** the user is on page 1
- **Then** the "Previous" control is disabled
- **Given** the user is on the last page
- **Then** the "Next" control is disabled

### AC-2.7: Loading state

- **Given** the user navigates to the ticket list
- **When** the API call is in progress
- **Then** a loading spinner or skeleton UI is displayed

### AC-2.8: Empty state

- **Given** there are no tickets in the database
- **When** the user navigates to the ticket list
- **Then** an empty state message is displayed (e.g. "No tickets yet")
- **And** a call-to-action button to create a ticket is shown

### AC-2.9: Error state

- **Given** the API request to fetch tickets fails
- **When** the ticket list page loads
- **Then** an error message is displayed
- **And** a "Retry" button is available

### AC-2.10: Ticket not found

- **Given** the user navigates to `/tickets/nonexistent-id`
- **When** the page loads
- **Then** a 404 / "Ticket not found" message is displayed
- **And** the backend responds with HTTP 404

---

## FR-3: Ticket Filtering

### AC-3.1: Filter by status

- **Given** tickets exist with various statuses
- **When** the user selects "Open" from the status filter
- **Then** only tickets with status "Open" are displayed
- **And** the filter is visually indicated as active

### AC-3.2: Filter by priority

- **Given** tickets exist with various priorities
- **When** the user selects "High" from the priority filter
- **Then** only tickets with priority "High" are displayed

### AC-3.3: Filter by category

- **Given** tickets exist with various categories
- **When** the user selects "Bug" from the category filter
- **Then** only tickets with category "Bug" are displayed

### AC-3.4: Combine multiple filters

- **Given** tickets exist with varying statuses, priorities, and categories
- **When** the user selects status "Open" AND priority "High"
- **Then** only tickets matching both criteria are displayed

### AC-3.5: Clear individual filter

- **Given** the user has an active status filter
- **When** the user clears the status filter
- **Then** the status filter is removed and results update accordingly
- **And** other active filters remain in effect

### AC-3.6: Clear all filters

- **Given** the user has multiple active filters
- **When** the user clicks "Clear all filters"
- **Then** all filters are removed
- **And** the full unfiltered (paginated) list is displayed

### AC-3.7: Filter with no results

- **Given** no tickets match the selected filter combination
- **When** the filters are applied
- **Then** an empty state is displayed: "No tickets match your filters"
- **And** a "Clear filters" action is available

### AC-3.8: Filters reset pagination

- **Given** the user is on page 3 of the ticket list
- **When** the user applies a filter
- **Then** the list resets to page 1 with filtered results

### AC-3.9: Backend filtering

- **Given** a GET request to `/api/tickets?status=Open&priority=High`
- **When** the server processes the request
- **Then** only tickets matching all provided query parameters are returned

---

## FR-4: Ticket Updates

### AC-4.1: Update status — valid transition

- **Given** a ticket has status "Open"
- **When** the user changes the status to "In Progress"
- **Then** the ticket status is updated in the database
- **And** the `updatedAt` timestamp is refreshed
- **And** the UI reflects the new status immediately
- **And** a success toast is displayed

### AC-4.2: Update status — only valid options shown

- **Given** a ticket has status "Open"
- **When** the user views the status change options
- **Then** only "In Progress" is available as a next status

- **Given** a ticket has status "In Progress"
- **When** the user views the status change options
- **Then** "Resolved" and "Open" are available

- **Given** a ticket has status "Resolved"
- **When** the user views the status change options
- **Then** "Closed" and "Open" are available

- **Given** a ticket has status "Closed"
- **When** the user views the status change options
- **Then** no status transitions are available (UI disables/hides the control)

### AC-4.3: Update status — invalid transition rejected by backend

- **Given** a ticket has status "Open"
- **When** a PATCH request attempts to set status to "Closed"
- **Then** the server responds with HTTP 400
- **And** the response body contains: "Invalid status transition from Open to Closed"

### AC-4.4: Update priority

- **Given** a ticket exists with priority "Low"
- **When** the user changes priority to "High"
- **Then** the priority is updated in the database
- **And** the `updatedAt` timestamp is refreshed
- **And** the UI reflects the new priority

### AC-4.5: Update category

- **Given** a ticket exists with category "Bug"
- **When** the user changes category to "Feature Request"
- **Then** the category is updated in the database
- **And** the `updatedAt` timestamp is refreshed
- **And** the UI reflects the new category

### AC-4.6: Backend validation — invalid enum values

- **Given** a PATCH request to `/api/tickets/:id` with `priority: "Urgent"`
- **When** the server processes the request
- **Then** the server responds with HTTP 400
- **And** the response body indicates the value is not a valid enum

### AC-4.7: Backend validation — ticket not found

- **Given** a PATCH request to `/api/tickets/nonexistent-id`
- **When** the server processes the request
- **Then** the server responds with HTTP 404

### AC-4.8: Persistence of updates

- **Given** a ticket has been updated
- **When** the page is refreshed
- **Then** the updated values persist and are displayed correctly

---

## FR-5: Ticket Search

### AC-5.1: Search by title

- **Given** a ticket exists with title "Login page broken"
- **When** the user types "login" in the search field
- **Then** the ticket appears in the results

### AC-5.2: Search by description

- **Given** a ticket exists with description "Users cannot reset their password"
- **When** the user types "reset password" in the search field
- **Then** the ticket appears in the results

### AC-5.3: Case-insensitive search

- **Given** a ticket exists with title "API Timeout Error"
- **When** the user searches "api timeout"
- **Then** the ticket appears in the results

### AC-5.4: Search with no results

- **Given** no tickets match the search query
- **When** the user enters a search term
- **Then** an empty state message is shown: "No tickets match your search"
- **And** a "Clear search" action is available

### AC-5.5: Search combined with filters

- **Given** tickets exist with various statuses
- **When** the user searches "login" AND filters by status "Open"
- **Then** only open tickets matching "login" are displayed

### AC-5.6: Search resets pagination

- **Given** the user is on page 2
- **When** the user enters a search query
- **Then** results reset to page 1

### AC-5.7: Clear search

- **Given** the user has an active search query
- **When** the user clears the search field
- **Then** the full (filtered if applicable) ticket list is displayed

### AC-5.8: Backend search

- **Given** a GET request to `/api/tickets?search=login`
- **When** the server processes the request
- **Then** tickets where title OR description contains "login" (case-insensitive) are returned

---

## Status State Machine — Validation Criteria

### SM-1: Initial state

- **Given** a new ticket is created
- **Then** its status is always "Open"
- **And** no other initial status can be set via the API

### SM-2: Valid transitions enforced

| Current Status | Valid Next Status(es)       |
|----------------|-----------------------------|
| Open           | In Progress                 |
| In Progress    | Resolved, Open              |
| Resolved       | Closed, Open                |
| Closed         | (none — terminal state)     |

### SM-3: Terminal state — Closed

- **Given** a ticket has status "Closed"
- **When** any status update is attempted (via UI or API)
- **Then** the transition is rejected
- **And** the backend returns HTTP 400 with a descriptive message

### SM-4: Cannot set status on creation

- **Given** a POST request to `/api/tickets` includes a `status` field
- **When** the server processes the request
- **Then** the provided status is ignored and the ticket is created with status "Open"

---

## UI Behavior — Cross-Cutting Criteria

### UI-1: Loading states

- **Given** any page or component is fetching data
- **Then** a spinner or skeleton placeholder is visible until data arrives

### UI-2: Error states with retry

- **Given** an API call fails (network error or server error)
- **Then** an error message is displayed
- **And** a "Retry" button re-triggers the failed request

### UI-3: Empty states with action

- **Given** a list view has zero items (after filtering or on first use)
- **Then** a helpful empty-state message is displayed
- **And** a relevant action (e.g. "Create ticket" or "Clear filters") is offered

### UI-4: Responsive layout

- **Given** the user views the app on a mobile device (< 768px)
- **Then** the layout adjusts to a single-column view with stacked elements
- **Given** the user views on desktop (≥ 992px)
- **Then** filters appear in a sidebar and the layout uses available width

### UI-5: Accessibility — keyboard navigation

- **Given** a keyboard-only user navigates the application
- **Then** all interactive elements are reachable via Tab
- **And** focus indicators are visible
- **And** buttons and links are activatable via Enter/Space

### UI-6: Accessibility — screen readers

- **Given** a screen reader user navigates the application
- **Then** form inputs have associated labels
- **And** error messages are announced via `aria-live` or associated with inputs via `aria-describedby`
- **And** status/priority badges have accessible text alternatives

### UI-7: Toast notifications

- **Given** a create or update operation succeeds
- **Then** a success toast appears briefly and auto-dismisses
- **Given** an operation fails
- **Then** an error toast appears and persists until dismissed

---

## Backend — Cross-Cutting Criteria

### BE-1: Consistent error response format

- **Given** any validation or server error occurs
- **Then** the response follows a consistent structure:
  - `status`: HTTP status code
  - `error`: human-readable error type
  - `message`: descriptive error message
  - `details`: (optional) field-level errors array

### BE-2: Input sanitization

- **Given** any request with user-provided string fields
- **Then** leading/trailing whitespace is trimmed before validation and storage

### BE-3: Unknown fields ignored

- **Given** a request body contains fields not in the schema (e.g. `assignee`)
- **Then** those fields are silently ignored
- **And** the valid fields are processed normally

### BE-4: Content-Type enforcement

- **Given** a POST or PATCH request without `Content-Type: application/json`
- **Then** the server responds with HTTP 415 (Unsupported Media Type)

---

## Testing Expectations

### TE-1: Unit tests

- All validation logic (frontend and backend) has unit test coverage
- Status state machine transition logic has full path coverage
- Reusable UI components have render and interaction tests

### TE-2: Integration tests

- Each API endpoint has tests for success and failure cases
- Filter and search query parameter combinations are tested
- Pagination edge cases are tested (empty, single page, multiple pages)

### TE-3: Frontend component tests

- Form components test validation behavior (valid, invalid, boundary values)
- List component tests loading, empty, error, and populated states
- Ticket detail tests correct rendering and status action availability
