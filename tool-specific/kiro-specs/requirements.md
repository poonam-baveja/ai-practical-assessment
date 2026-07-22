# Requirements — Support Ticket Management System

> Kiro Spec: Implementation-focused requirements derived from project documents.
> Source: `docs/requirements.md`, `docs/acceptance-criteria.md`

---

## REQ-1: Ticket Creation [FR-1]

### Description
Users can create support tickets through a form with validated fields. The system assigns a unique ID, sets status to "Open", and records timestamps.

### Acceptance Criteria

- **Given** the user is on the Create Ticket page, **when** they submit a valid form (title, description, priority, category), **then** the ticket is created with status "Open", a unique cuid ID, and `createdAt` timestamp; the user is redirected to the ticket list; a success toast is shown.
- **Given** the title field is empty on blur, **then** inline error "Title is required" is displayed and submit is disabled.
- **Given** the title exceeds 200 characters, **then** inline error "Title must be 200 characters or fewer" is displayed.
- **Given** the description field is empty on blur, **then** inline error "Description is required" is displayed.
- **Given** the description exceeds 2000 characters, **then** inline error "Description must be 2000 characters or fewer" is displayed.
- **Given** priority is not selected, **then** inline error "Priority is required" is displayed.
- **Given** category is not selected, **then** inline error "Category is required" is displayed.
- **Given** a POST to `/api/tickets` with invalid data, **then** the server responds 400 with field-level errors.
- **Given** the form is submitting, **then** the submit button shows a loading state and is disabled (prevents double submission).
- **Given** creation succeeds and user revisits the form, **then** all fields are reset to defaults.
- **Given** a ticket is created, **when** the app restarts, **then** the ticket persists in the database.

---

## REQ-2: Ticket Listing & Viewing [FR-2]

### Description
Users can view a paginated list of all tickets and navigate to individual ticket detail pages.

### Acceptance Criteria

- **Given** 25 tickets exist, **when** the user visits the list page, **then** the first 10 are shown with pagination controls indicating 3 pages.
- **Given** tickets exist, **then** each card shows: ticket ID, title, status badge, priority badge, category, creation date.
- **Given** the user clicks a ticket, **then** they navigate to `/tickets/:id` showing full details (title, description, status, priority, category, createdAt, updatedAt).
- **Given** the user clicks "Next" or a page number, **then** the corresponding page of tickets is displayed.
- **Given** the user is on page 1, **then** "Previous" is disabled. **Given** the user is on the last page, **then** "Next" is disabled.
- **Given** the list is loading, **then** a spinner or skeleton is shown.
- **Given** zero tickets exist, **then** an empty state with "Create ticket" CTA is shown.
- **Given** the API fails, **then** an error message with "Retry" button is shown.
- **Given** the user navigates to a non-existent ticket ID, **then** a 404 message is displayed (backend returns 404).

---

## REQ-3: Ticket Filtering [FR-3]

### Description
Users can filter the ticket list by status, priority, and category. Filters combine with AND logic and are reflected in URL state.

### Acceptance Criteria

- **Given** the user selects status "Open", **then** only Open tickets are shown and the filter is visually active.
- **Given** the user selects priority "High", **then** only High priority tickets are shown.
- **Given** the user selects category "Bug", **then** only Bug tickets are shown.
- **Given** the user selects status "Open" AND priority "High", **then** only tickets matching both are shown.
- **Given** the user clears one filter, **then** that filter is removed; other filters remain active.
- **Given** the user clicks "Clear all filters", **then** all filters are removed and the full list is shown.
- **Given** no tickets match filters, **then** empty state "No tickets match your filters" with "Clear filters" CTA is shown.
- **Given** the user is on page 3 and applies a filter, **then** pagination resets to page 1.
- **Given** GET `/api/tickets?status=Open&priority=High`, **then** only matching tickets are returned.

---

## REQ-4: Ticket Updates [FR-4]

### Description
Users can update ticket status (following the state machine), priority, and category from the detail page.

### Acceptance Criteria

- **Given** a ticket is "Open" and user changes status to "In Progress", **then** the status updates, `updatedAt` refreshes, UI reflects the change, and a success toast appears.
- **Given** a ticket is "Open", **then** only "In Progress" is shown as a valid next status.
- **Given** a ticket is "In Progress", **then** "Resolved" and "Open" are valid next statuses.
- **Given** a ticket is "Resolved", **then** "Closed" and "Open" are valid next statuses.
- **Given** a ticket is "Closed", **then** no status transition options are available.
- **Given** a PATCH attempts an invalid transition (e.g. Open → Closed), **then** the server responds 400 with "Invalid status transition from Open to Closed".
- **Given** a user changes priority from "Low" to "High", **then** priority updates and `updatedAt` refreshes.
- **Given** a user changes category from "Bug" to "Feature Request", **then** category updates and `updatedAt` refreshes.
- **Given** a PATCH with invalid enum value (e.g. `priority: "Urgent"`), **then** server responds 400.
- **Given** a PATCH to a non-existent ticket ID, **then** server responds 404.
- **Given** a ticket is updated, **when** the page refreshes, **then** updated values persist.

---

## REQ-5: Ticket Search [FR-5]

### Description
Users can search tickets by title or description text. Search is case-insensitive and combines with active filters.

### Acceptance Criteria

- **Given** a ticket with title "Login page broken", **when** the user searches "login", **then** the ticket appears.
- **Given** a ticket with description "Users cannot reset their password", **when** the user searches "reset password", **then** the ticket appears.
- **Given** a ticket with title "API Timeout Error", **when** the user searches "api timeout", **then** the ticket appears (case-insensitive).
- **Given** no tickets match the search, **then** empty state "No tickets match your search" with "Clear search" CTA is shown.
- **Given** user searches "login" AND filters by status "Open", **then** only open tickets matching "login" are shown.
- **Given** the user is on page 2 and enters a search, **then** results reset to page 1.
- **Given** the user clears the search field, **then** the full (filtered if applicable) list is shown.
- **Given** GET `/api/tickets?search=login`, **then** tickets where title OR description contains "login" (case-insensitive) are returned.

---

## REQ-6: Status State Machine [SM]

### Description
Tickets follow a defined lifecycle with enforced transitions. The state machine is enforced on both frontend (valid options only) and backend (400 on invalid).

### Acceptance Criteria

- **Given** a new ticket is created, **then** its status is always "Open" regardless of any status field in the request body.
- **Given** the valid transitions table, **then** only these transitions are allowed: Open→InProgress, InProgress→Resolved, InProgress→Open, Resolved→Closed, Resolved→Open.
- **Given** a ticket is "Closed", **when** any status update is attempted, **then** it is rejected with 400.
- **Given** a POST to `/api/tickets` includes `status: "IN_PROGRESS"`, **then** the status field is ignored and ticket is created as "Open".

---

## REQ-7: UI States & Responsiveness [NFR-2, UX-4.1, UX-4.3]

### Description
All data-fetching views handle loading, empty, error, and success states. The layout is responsive across mobile, tablet, and desktop.

### Acceptance Criteria

- **Given** any data-fetching view is loading, **then** a spinner or skeleton is visible.
- **Given** an API call fails, **then** an error message and "Retry" button are displayed.
- **Given** a list has zero items, **then** a helpful empty-state message with action CTA is displayed.
- **Given** mobile viewport (< 768px), **then** layout is single-column with stacked cards.
- **Given** desktop viewport (≥ 992px), **then** full layout with sidebar filters is shown.
- **Given** a create or update succeeds, **then** a success toast appears and auto-dismisses.
- **Given** an operation fails, **then** an error toast persists until manually dismissed.

---

## REQ-8: Accessibility [NFR-2]

### Description
The application meets WCAG 2.1 AA standards with semantic HTML, keyboard navigation, and screen reader support.

### Acceptance Criteria

- **Given** a keyboard-only user, **then** all interactive elements are reachable via Tab with visible focus indicators.
- **Given** a screen reader, **then** form inputs have associated labels; errors are linked via `aria-describedby`.
- **Given** status/priority badges, **then** color is never the sole indicator of meaning (text labels always present).
- **Given** toast notifications, **then** they use `role="status"` and `aria-live="polite"`.
- **Given** any interactive element, **then** touch targets are minimum 44×44px.

---

## REQ-9: Backend Consistency [BE-1 through BE-4]

### Description
The backend provides consistent error responses, sanitizes input, ignores unknown fields, and enforces content-type.

### Acceptance Criteria

- **Given** any error, **then** response follows: `{ status, error, message, details? }`.
- **Given** string inputs with leading/trailing whitespace, **then** whitespace is trimmed before validation.
- **Given** unknown fields in request body, **then** they are silently ignored.
- **Given** a POST/PATCH without `Content-Type: application/json`, **then** server responds 415.
