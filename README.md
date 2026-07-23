# Support Ticket Management System

A full-stack support ticket management system built as part of an AI Practical Assessment. The project demonstrates structured, spec-driven development using AI tooling (Kiro) to produce a production-quality web application.

---

## Project Overview

This application allows users to create, view, search, filter, edit, and manage support tickets through a defined status workflow. It consists of a React frontend consuming a REST API backed by SQLite.

**5 Screens:**
- **Dashboard** — Overview with ticket counts by status
- **Ticket List** — Searchable, filterable table with status and priority badges
- **Create Ticket** — Validated form with priority and assignee selection
- **Ticket Detail** — Full details, status update, and comments
- **Edit Ticket** — Update title, description, priority, and assignee

---

## Features

- Create support tickets with title, description, priority, and assignee
- View all tickets in a responsive table with status and priority badges
- Search tickets by title or description (case-insensitive, server-side)
- Filter tickets by status
- Update ticket status through an enforced workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED, with CANCELLED available from OPEN and IN_PROGRESS)
- Edit ticket details (title, description, priority, assignee)
- Add comments to tickets with author attribution
- Dashboard with ticket counts grouped by status
- User assignment (created by, assigned to)
- Priority levels (LOW, MEDIUM, HIGH)
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
| Testing | Vitest, React Testing Library, Supertest |

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
│   │   ├── api/                    # ticketApi, commentApi, userApi
│   │   ├── components/             # TicketFilters, AddCommentForm, CommentList
│   │   ├── hooks/                  # useTickets, useTicket, useCreateTicket, useUpdateTicket,
│   │   │                           # useUpdateTicketStatus, useComments, useCreateComment, useUsers
│   │   ├── pages/                  # DashboardPage, TicketListPage, CreateTicketPage,
│   │   │                           # TicketDetailPage, EditTicketPage
│   │   ├── utils/                  # Status machine (frontend)
│   │   └── types.ts               # Ticket, Comment, User, Status, Priority
│   ├── services/                   # Shared Axios instance
│   ├── shared/                     # Utilities, hooks, toaster component
│   └── theme/                      # Chakra UI custom theme
│
├── backend/src/
│   ├── controllers/                # ticketController, commentController, userController
│   ├── routes/                     # tickets, comments, users
│   ├── services/                   # ticketService, commentService, userService
│   ├── tests/                      # Integration tests (Supertest)
│   ├── utils/                      # Status machine (backend)
│   └── validators/                 # ticketValidator, commentValidator
│
├── database/prisma/
│   ├── schema.prisma               # User + Ticket + Comment models
│   ├── migrations/                 # Database migration history
│   └── seed.ts                     # Sample data (3 users, 5 tickets, 5 comments)
│
└── docs/                           # Architecture, AI usage, development process, reflection
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

> `npm install` automatically generates the Prisma Client via the `postinstall` script.

### Database Setup

```bash
cd database
npx prisma migrate dev
npx prisma db seed
```

> The project includes `database/.env` with the SQLite connection (`DATABASE_URL="file:./dev.db"`), so no additional environment configuration is required.

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
cd backend && npm test    # 75 tests
cd frontend && npm test   # 15 tests
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | List tickets (supports `?search=` and `?status=`) |
| `GET` | `/api/tickets/:id` | Get ticket by ID (includes comments) |
| `POST` | `/api/tickets` | Create a new ticket |
| `PUT` | `/api/tickets/:id` | Update ticket fields (title, description, priority, assignee) |
| `PATCH` | `/api/tickets/:id/status` | Update ticket status |
| `GET` | `/api/tickets/:id/comments` | List comments for a ticket |
| `POST` | `/api/tickets/:id/comments` | Add a comment to a ticket |
| `GET` | `/api/users` | List all users |
| `GET` | `/health` | Health check |

### Status Workflow (Enforced)

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
  ↓         ↓
CANCELLED  CANCELLED
```

- OPEN can move to IN_PROGRESS or CANCELLED
- IN_PROGRESS can move to RESOLVED or CANCELLED
- RESOLVED can move to CLOSED
- CLOSED and CANCELLED are terminal states (no further transitions)

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

### Documentation

| Document | Location |
|----------|----------|
| Architecture & Design | `docs/ARCHITECTURE.md` |
| AI Usage & Methodology | `docs/AI_USAGE.md` |
| Development Process | `docs/DEVELOPMENT_PROCESS.md` |
| Prompt History | `PROMPT_HISTORY.md` |
| Reflection | `docs/REFLECTION.md` |

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

- Pagination for large datasets
- Sorting (by date, status, priority)
- User authentication and role-based access
- Dark mode support
- Activity log / audit trail
- File attachments
- Real-time updates (WebSocket)

---

## Screenshots

> To be added.

| Screen | Description |
|--------|-------------|
| Dashboard | Status counts (Total, Open, In Progress, Resolved, Closed, Cancelled) |
| Ticket List | Searchable table with status filter, priority badges, and create button |
| Create Ticket | Validated form with priority, assignee, and toast feedback |
| Ticket Detail | Full details with status transitions and comment thread |
| Edit Ticket | Pre-filled form for updating ticket fields |

---

## License

MIT
