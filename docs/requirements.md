# Support Ticket Management System — Requirements

## 1. Project Overview

A web-based support ticket management system that allows users to create, view, update, and manage support tickets. Built as a full-stack application demonstrating AI-assisted development capabilities.

### Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React + TypeScript + Vite   |
| Backend    | Express + TypeScript        |
| Database   | SQLite via Prisma ORM       |
| Styling    | Chakra UI                   |
| Testing    | Vitest + React Testing Library |

---

## 2. Functional Requirements

### FR-1: Ticket Creation

- Users can create a new support ticket with:
  - **Title** (required, max 200 characters)
  - **Description** (required, max 2000 characters)
  - **Priority** (required): Low, Medium, High, Critical
  - **Category** (required): Bug, Feature Request, Question, Other
- System assigns a unique ticket ID upon creation
- System records creation timestamp automatically
- System sets initial status to "Open"

### FR-2: Ticket Listing & Viewing

- Users can view a list of all tickets
- List displays: ticket ID, title, status, priority, category, creation date
- Users can click a ticket to view full details
- List supports pagination (10 tickets per page)

### FR-3: Ticket Filtering

- Users can filter tickets by:
  - Status (Open, In Progress, Resolved, Closed)
  - Priority (Low, Medium, High, Critical)
  - Category (Bug, Feature Request, Question, Other)
- Filters can be combined (e.g. show all "High" priority "Open" tickets)
- Active filters are visually indicated and clearable

### FR-4: Ticket Updates

- Users can update ticket status following the state machine (see Section 6)
- Users can update priority and category
- System records `updatedAt` timestamp on every change

### FR-5: Ticket Search

- Users can search tickets by title or description (text-based search)
- Search is case-insensitive
- Search can be combined with active filters

---

## 3. Non-Functional Requirements

### NFR-1: Performance

- API response time < 500ms for standard operations
- Frontend initial load < 3 seconds
- Support up to 1000 tickets without degradation

### NFR-2: Usability & Accessibility

- Responsive design (mobile, tablet, desktop breakpoints)
- WCAG 2.1 AA compliance:
  - Semantic HTML elements
  - Proper ARIA labels on interactive elements
  - Keyboard navigable (focus management, tab order)
  - Sufficient color contrast ratios
  - Screen reader compatible form labels and error messages
- Clear, inline error messages for validation failures
- Toast/notification for successful operations (create, update)

### NFR-3: Reliability

- Input validation on both client and server
- Graceful error handling (no unhandled crashes)
- Data persistence (SQLite file-based)

### NFR-4: Maintainability

- TypeScript strict mode enabled
- Consistent code formatting (ESLint + Prettier)
- Modular component architecture
- API follows RESTful conventions

---

## 4. Frontend UX Requirements

### 4.1 UI States

Every data-fetching view must handle these states:

| State    | Behavior                                                    |
|----------|-------------------------------------------------------------|
| Loading  | Display a spinner or skeleton placeholder                   |
| Empty    | Display a helpful message with a call-to-action (e.g. "No tickets yet — create one") |
| Error    | Display an error message with a retry option                |
| Success  | Display the data                                            |

### 4.2 Reusable Components

The frontend should use a consistent set of shared UI components:

- **Button** — primary, secondary, destructive variants; disabled state; loading state
- **Input / Textarea** — with label, placeholder, validation error display
- **Select / Dropdown** — for priority, category, status filters
- **Card** — for ticket list items
- **Badge** — for status and priority labels (color-coded)
- **Modal / Dialog** — for confirmations (e.g. status change)
- **Pagination** — page controls with current page indicator
- **Spinner / Skeleton** — for loading states
- **Toast / Notification** — for success/error feedback
- **EmptyState** — illustration or icon with message and action button

### 4.3 Responsive Design

| Breakpoint | Layout                                      |
|------------|---------------------------------------------|
| Mobile     | Single column, stacked cards, hamburger nav |
| Tablet     | Two-column where appropriate                |
| Desktop    | Full layout with sidebar filters            |

### 4.4 Form Behavior

- Inline validation on blur (field-level)
- Disable submit button until form is valid
- Show loading state on submit button during API call
- Prevent double submission
- Reset form on successful creation

---

## 5. Data Model

### Ticket

| Field       | Type      | Constraints                              |
|-------------|-----------|------------------------------------------|
| id          | String    | Primary key, auto-generated (cuid)       |
| title       | String    | Required, max 200 chars                  |
| description | String    | Required, max 2000 chars                 |
| status      | Enum      | Open, InProgress, Resolved, Closed       |
| priority    | Enum      | Low, Medium, High, Critical              |
| category    | Enum      | Bug, FeatureRequest, Question, Other     |
| createdAt   | DateTime  | Auto-set on creation                     |
| updatedAt   | DateTime  | Auto-updated on modification             |

---

## 6. Ticket Status State Machine

Tickets follow a defined lifecycle. Only the transitions listed below are valid.

```
┌────────┐      ┌─────────────┐      ┌──────────┐      ┌────────┐
│  Open  │ ───► │ In Progress │ ───► │ Resolved │ ───► │ Closed │
└────────┘      └─────────────┘      └──────────┘      └────────┘
                       │                    │
                       │                    │
                       ▼                    ▼
                  ┌────────┐          ┌────────┐
                  │  Open  │          │  Open  │
                  └────────┘          └────────┘
```

### Valid Transitions

| From          | To                     |
|---------------|------------------------|
| Open          | In Progress            |
| In Progress   | Resolved               |
| In Progress   | Open (revert/reopen)   |
| Resolved      | Closed                 |
| Resolved      | Open (reopen)          |

### Rules

- A newly created ticket always starts as **Open**
- **Closed** is a terminal state — no further transitions allowed
- The UI must only present valid next-status options based on current state
- Invalid transitions must be rejected by the backend with a 400 error

---

## 7. API Endpoints

### Tickets

| Method | Endpoint              | Description                                  |
|--------|-----------------------|----------------------------------------------|
| POST   | /api/tickets          | Create a new ticket                          |
| GET    | /api/tickets          | List tickets (with filters, search, pagination) |
| GET    | /api/tickets/:id      | Get ticket details                           |
| PATCH  | /api/tickets/:id      | Update a ticket (status, priority, category) |
| DELETE | /api/tickets/:id      | Delete a ticket                              |

### Query Parameters for GET /api/tickets

| Parameter | Type   | Description                        |
|-----------|--------|------------------------------------|
| status    | String | Filter by status                   |
| priority  | String | Filter by priority                 |
| category  | String | Filter by category                 |
| search    | String | Search title and description       |
| page      | Number | Page number (default: 1)           |
| limit     | Number | Items per page (default: 10)       |

---

## 8. Frontend Pages / Views

| Page            | Route              | Description                          |
|-----------------|--------------------|--------------------------------------|
| Ticket List     | /                  | Filterable ticket list (home page)   |
| Ticket Detail   | /tickets/:id       | Full ticket view with status actions |
| Create Ticket   | /tickets/new       | Form to create a new ticket          |

---

## 9. Scope Boundaries (Out of Scope)

- User authentication / authorization
- Role-based access control
- Email notifications
- File attachments
- Real-time updates (WebSocket)
- Multi-tenancy
- Comments / discussion threads
- Activity log / audit trail

---

## 10. Future Enhancements

These features are not part of the core assessment but could be added later:

- Sorting by creation date, priority, or last updated
- Dashboard view with summary statistics and charts
- Comments on tickets
- Activity log tracking field-level changes
- Bulk ticket operations (close multiple, assign priority)
- Search result highlighting
- Dark mode theme toggle

---

## 11. Acceptance Criteria

1. A user can create a ticket with title, description, priority, and category
2. A user can view a paginated list of all tickets
3. A user can filter tickets by status, priority, and category
4. A user can search tickets by title or description
5. A user can view full ticket details on a detail page
6. A user can update ticket status following valid state transitions only
7. A user can update ticket priority and category
8. Invalid status transitions are rejected by the API
9. All forms validate input and show inline error messages
10. The app displays proper loading, empty, and error states
11. The app is responsive across mobile, tablet, and desktop
12. The app meets basic accessibility standards (keyboard nav, ARIA labels, contrast)
