# Support Ticket Management System

A full-stack support ticket management system built as part of an AI Practical Assessment. The project demonstrates structured, spec-driven development using AI tooling (Kiro) to produce a production-quality web application.

---

## Project Overview

This application allows users to create, view, search, filter, and manage support tickets through a defined status workflow. It consists of a React frontend consuming a REST API backed by SQLite.

**3 Screens:**
- **Ticket List** — Searchable, filterable table with status badges
- **Create Ticket** — Validated form with real-time feedback
- **Ticket Detail** — View details and update ticket status

---

## Features

- Create support tickets with title and description
- View all tickets in a responsive table
- Search tickets by title or description (case-insensitive, server-side)
- Filter tickets by status
- Update ticket status through an enforced workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Client-side and server-side validation using Zod
- Toast notifications for success and error states
- Loading, empty, and error states on every view
- Fully typed end-to-end with TypeScript

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, Chakra UI v3 |
| State & Data | TanStack Query v5, React Hook Form, Zod |
| HTTP | Axios |
| Backend | Express 5, TypeScript, Zod |
| Database | SQLite via Prisma ORM |
| Testing | Vitest, React Testing Library |

---

## Architecture Overview

```
┌──────────────────────────────────────────────┐
│            Frontend (React + Vite)            │
│   Chakra UI · TanStack Query · React Router  │
└──────────────────────┬───────────────────────┘
                       │ REST / JSON
                       ▼
┌──────────────────────────────────────────────┐
│           Backend (Express + TS)             │
│    Routes → Controllers → Services          │
└──────────────────────┬───────────────────────┘
                       │ Prisma Client
                       ▼
┌──────────────────────────────────────────────┐
│             SQLite (file-based)              │
└──────────────────────────────────────────────┘
```

- **Frontend** uses feature-based architecture with colocated components, hooks, API calls, and types.
- **Backend** uses layered architecture — routes define endpoints, controllers parse requests, services handle business logic and database operations.

---

## Folder Structure

```
├── frontend/src/
│   ├── app/                        # Providers, routes
│   ├── components/layout/          # Header, PageContainer, AppLayout
│   ├── features/tickets/
│   │   ├── api/                    # Axios API functions
│   │   ├── components/             # TicketFilters
│   │   ├── hooks/                  # useTickets, useTicket, useCreateTicket, useUpdateTicketStatus
│   │   ├── pages/                  # TicketListPage, CreateTicketPage, TicketDetailPage
│   │   ├── utils/                  # Status machine (frontend)
│   │   └── types.ts               # Ticket, Comment, Status types
│   ├── services/                   # Shared Axios instance
│   ├── shared/                     # Utilities, hooks, toaster
│   └── theme/                      # Chakra UI custom theme
│
├── backend/src/
│   ├── controllers/                # Request handlers
│   ├── routes/                     # Express route definitions
│   ├── services/                   # Business logic + Prisma queries
│   ├── utils/                      # Status machine (backend)
│   └── validators/                 # Zod schemas
│
├── database/prisma/
│   ├── schema.prisma               # Ticket + Comment models
│   └── seed.ts                     # Sample data
│
├── docs/                           # Requirements, design, acceptance criteria
└── tool-specific/kiro-specs/       # Spec-driven development artifacts
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repository-url>
cd ai-practical-assessment
npm install
```
> **Note:** `npm install` automatically generates the Prisma Client via the `postinstall` script.

### Database Setup

```bash
cd database
npm run migrate
npm run seed
```
> **Note:** The project includes `database/.env` with the SQLite connection (`DATABASE_URL="file:./dev.db"`), so no additional environment configuration is required.
---

## Running the Application

### Start both (from root):

```bash
npm run dev
```

### Start individually:

```bash
# Backend (http://localhost:3001)
cd backend && npm run dev

# Frontend (http://localhost:5173)
cd frontend && npm run dev
```

### Run Tests:

```bash
# All workspaces
npm test

# Individual
cd backend && npm test
cd frontend && npm test
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | List tickets (supports `?search=` and `?status=`) |
| `GET` | `/api/tickets/:id` | Get a single ticket by ID |
| `POST` | `/api/tickets` | Create a new ticket |
| `PATCH` | `/api/tickets/:id/status` | Update ticket status |
| `GET` | `/health` | Health check |

### Status Workflow (Enforced)

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

Invalid transitions return `400` with a descriptive error message.

---

## AI-Assisted Development Approach

This project was developed using **Kiro** with a **Spec-Driven Development** workflow:

### Process

1. **Requirements** — Defined scope, features, and constraints
2. **Acceptance Criteria** — Documented in Given-When-Then format
3. **Architecture Design** — Documented decisions with rationale
4. **Task Breakdown** — Organized into checkpoints with verifiable deliverables
5. **Incremental Implementation** — One layer at a time, verified at each step

### Artifacts

| Document | Location |
|----------|----------|
| Requirements | `docs/requirements.md` |
| Acceptance Criteria | `docs/acceptance-criteria.md` |
| Design Document | `docs/design.md` |
| Folder Structure | `docs/folder-structure.md` |
| Kiro Specs | `tool-specific/kiro-specs/` |

### Development Protocol

- Each feature implemented through structured prompts
- Backend endpoint completed and tested before building the corresponding UI
- Issues debugged iteratively with clear problem statements
- No code generated without an approved requirement backing it

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Chakra UI v3 | Built-in accessibility, responsive props, TypeScript support |
| TanStack Query | Eliminates manual loading/error state management, cache invalidation |
| Zod on both layers | Single validation library with TypeScript type inference |
| Feature-based frontend | Colocation improves discoverability and reduces coupling |
| Flat API responses | Simple contract — arrays for lists, objects for singles |
| SQLite + Prisma | Zero infrastructure, type-safe database access |
| Status machine in service layer | Centrally enforced, independently testable |
| Native `<select>` elements | Full keyboard and screen reader support without library issues |
| Colocated tests | Tests live next to source files for discoverability |

---

## Future Improvements

- Comments on tickets
- Pagination for large datasets
- Sorting (by date, status, title)
- Dashboard with ticket statistics
- User authentication and role-based access
- Dark mode support
- Activity log / audit trail
- File attachments

---

## Screenshots

> To be added.

| Screen | Description |
|--------|-------------|
| Ticket List | Searchable table with status filter and create button |
| Create Ticket | Validated form with loading state and toast feedback |
| Ticket Detail | Full details with status transition workflow |

---

## License

MIT
