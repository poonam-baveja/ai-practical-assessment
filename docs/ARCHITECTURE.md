# Architecture

## Overview

The Support Ticket Management System follows a simple, modular architecture designed to meet the assessment requirements while remaining easy to understand and maintain.

The application is divided into three independent workspaces:

- **Frontend** – React application for the user interface
- **Backend** – Express REST API
- **Database** – Prisma ORM with SQLite

This separation keeps responsibilities clear and allows each layer to evolve independently.

---

# High-Level Architecture

```text
+----------------------+
|      React UI        |
|  (Chakra UI + TS)    |
+----------+-----------+
           |
      HTTP (Axios)
           |
+----------v-----------+
|     Express API      |
|  Routes → Controller |
|        → Service     |
+----------+-----------+
           |
     Prisma Client
           |
+----------v-----------+
|      SQLite DB       |
+----------------------+
```

---

# Monorepo Structure

The project is organized as a monorepo using npm workspaces.

```text
ai-practical-assessment/
│
├── frontend/
├── backend/
├── database/
├── docs/
├── package.json
└── README.md
```

### Why Monorepo?

- Single repository for the entire application.
- Shared dependency management.
- Easier local development.
- Simple project setup for the assessment.

---

# Frontend Architecture

The frontend follows a **feature-based architecture**, grouping related components, hooks, services, and pages by domain.

```text
src/
│
├── app/
├── components/
├── features/
│   └── tickets/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── types.ts
├── services/
├── shared/
└── theme/
```

## Why Feature-Based Architecture?

Instead of organizing files by type (components, hooks, pages), all ticket-related files are grouped together.

Benefits:

- Easier navigation.
- Better scalability.
- Reduced coupling.
- Clear ownership of functionality.

---

# Backend Architecture

The backend follows a simple layered architecture.

```text
Route
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
SQLite
```

## Responsibilities

### Routes

- Define API endpoints.
- Forward requests to controllers.
- No business logic.

### Controllers

- Validate request data.
- Handle HTTP responses.
- Coordinate request flow.

### Services

- Contain business logic.
- Interact with Prisma.
- Enforce ticket status transition rules.

### Prisma

- Database access layer.
- Generates type-safe queries.
- Maps application models to SQLite.

---

# Database Design

A single **Ticket** model is used to keep the application focused on the assessment requirements.

## Ticket Model

| Field | Type | Description |
|--------|------|-------------|
| id | Integer | Auto-increment primary key |
| title | String | Ticket title |
| description | String | Ticket description |
| status | Enum | Current ticket status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

# API Design

The backend exposes a small REST API.

| Method | Endpoint | Purpose |
|----------|--------------------------|----------------|
| GET | /api/tickets | List tickets |
| POST | /api/tickets | Create ticket |
| GET | /api/tickets/:id | Ticket details |
| PATCH | /api/tickets/:id/status | Update ticket status |

Search and filtering are implemented through query parameters.

Example:

```
GET /api/tickets?search=login&status=OPEN
```

---

# State Management

The frontend uses **TanStack Query** for server state management.

Responsibilities:

- Data fetching.
- Request caching.
- Background refetching.
- Cache invalidation.
- Loading and error states.

Local UI state (form inputs, filters) is managed using React state.

---

# Form Management

Forms are implemented using:

- React Hook Form
- Zod

Benefits:

- Minimal re-renders.
- Strong TypeScript support.
- Shared validation approach.
- Better user experience.

---

# UI Architecture

The application uses **Chakra UI** for component styling.

Reasons for choosing Chakra UI:

- Component-based design.
- Built-in accessibility.
- Responsive style props.
- Consistent design system.
- Minimal custom CSS.

A custom theme is used to centralize design tokens and maintain consistent styling.

---

# Validation Strategy

Validation occurs at two levels.

## Frontend

Zod validates user input before API requests are sent.

Examples:

- Required fields.
- Maximum length.
- Empty values.

## Backend

All incoming requests are validated again using Zod.

This ensures invalid requests cannot bypass frontend validation.

---

# Error Handling

Errors are handled consistently across the application.

Backend:

- Validation errors return HTTP 400.
- Missing resources return HTTP 404.
- Unexpected failures return HTTP 500.

Frontend:

- Loading indicators.
- Error messages.
- Toast notifications.
- Empty states.

---

# Ticket Status Lifecycle

The application enforces a simple state machine.

```text
OPEN
   │
   ▼
IN_PROGRESS
   │
   ▼
RESOLVED
   │
   ▼
CLOSED
```

Only valid transitions are allowed.

Examples:

✅ OPEN → IN_PROGRESS

✅ IN_PROGRESS → RESOLVED

✅ RESOLVED → CLOSED

Invalid transitions return an HTTP 400 response.

---

# Design Principles

The architecture follows a few guiding principles:

- Keep the project simple.
- Prefer readability over abstraction.
- Separate responsibilities clearly.
- Validate all external input.
- Reuse shared components where appropriate.
- Avoid unnecessary dependencies.

---

# Key Technology Decisions

| Technology | Reason |
|------------|--------|
| React | Component-based frontend development |
| TypeScript | Static typing and improved maintainability |
| Chakra UI | Accessible UI components with minimal custom styling |
| TanStack Query | Efficient server state management |
| React Hook Form | Lightweight form handling |
| Zod | Shared validation strategy |
| Express | Simple REST API framework |
| Prisma | Type-safe ORM |
| SQLite | Lightweight database suitable for the assessment |

---

# Future Improvements

If additional time were available, the architecture could be extended with:

- Authentication and authorization.
- Role-based access control.
- Ticket comments.
- Activity history.
- Pagination.
- Sorting.
- File attachments.
- Automated testing with higher coverage.
- CI/CD pipeline.