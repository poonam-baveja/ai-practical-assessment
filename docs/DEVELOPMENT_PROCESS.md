# Development Process

## Overview

The Support Ticket Management System was developed using an iterative, AI-assisted workflow with **Kiro** following a **Spec-Driven Development (SDD)** approach.

Instead of generating the complete application at once, the project was built incrementally through well-defined phases. Each phase was completed, reviewed, and validated before moving to the next.

---

# Development Phases

## Phase 1: Requirement Analysis

The project began by analyzing the assessment requirements and identifying the core functionality.

### Scope Decisions

Included:

- Ticket CRUD (Create, Read, Update)
- Ticket status workflow with state machine
- Search by title/description
- Filter by status
- Priority levels (LOW, MEDIUM, HIGH)
- User assignment (created by, assigned to)
- Comments on tickets
- Dashboard with status counts
- Validation (client + server)
- Integration tests

Excluded:

- Authentication
- Activity Log
- Notifications
- File Uploads
- Pagination
- Sorting

---

## Phase 2: System Design

A technical design was prepared before writing implementation code.

The design included:

- Monorepo structure (frontend, backend, database)
- Feature-based frontend architecture
- Layered backend architecture (Route → Controller → Service → Prisma)
- Data model: User, Ticket, Comment
- Status state machine with CANCELLED support
- API contract design

---

## Phase 3: Project Setup

```
ai-practical-assessment/
├── frontend/    # React + Vite + Chakra UI
├── backend/     # Express + TypeScript
├── database/    # Prisma + SQLite
└── docs/        # Documentation
```

---

## Phase 4: Backend Development

### Architecture

```
Routes → Controllers → Services → Prisma → SQLite
```

### Endpoints Implemented

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tickets | List (with search + status filter) |
| GET | /api/tickets/:id | Detail (with comments) |
| POST | /api/tickets | Create |
| PUT | /api/tickets/:id | Update fields |
| PATCH | /api/tickets/:id/status | Update status |
| GET | /api/tickets/:id/comments | List comments |
| POST | /api/tickets/:id/comments | Add comment |
| GET | /api/users | List users |

### Validation

- Zod schemas on all POST/PUT/PATCH bodies
- Query parameter validation on GET
- Path parameter validation (numeric ID check)
- Status transition enforcement via state machine

---

## Phase 5: Database

### Models

- **User** — id, name, email
- **Ticket** — id, title, description, status, priority, createdBy, assignedTo, timestamps
- **Comment** — id, message, ticketId, createdBy, timestamp

### Seed Data

3 users, 5 tickets across all statuses, 5 comments with author attribution.

---

## Phase 6: Frontend Development

### Architecture

```
features/tickets/
├── api/          # ticketApi, commentApi, userApi
├── components/   # TicketFilters, AddCommentForm, CommentList
├── hooks/        # useTickets, useTicket, useCreateTicket, useUpdateTicket,
│                 # useUpdateTicketStatus, useComments, useCreateComment, useUsers
├── pages/        # Dashboard, List, Create, Detail, Edit
├── utils/        # Status machine
└── types.ts      # Ticket, Comment, User, Status, Priority
```

### Screens

| Route | Page | Features |
|-------|------|----------|
| `/` | Dashboard | Status counts |
| `/tickets` | Ticket List | Table, search, status filter, priority/assignee display |
| `/tickets/new` | Create Ticket | Form with validation, priority, assignee |
| `/tickets/:id` | Ticket Detail | Full details, status update, comments |
| `/tickets/:id/edit` | Edit Ticket | Pre-filled form, update fields |

---

## Phase 7: Status Management

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
  ↓         ↓
CANCELLED  CANCELLED
```

- CLOSED and CANCELLED are terminal states.
- Invalid transitions return 400 from backend.
- Frontend only renders valid next-status options.
- State machine logic shared between frontend and backend.

---

## Phase 8: Testing

### Backend (75 tests)

- Health endpoint
- GET /api/tickets (list, search, filter, validation)
- POST /api/tickets (creation, validation, boundary values)
- PUT /api/tickets/:id (update, validation, status protection)
- PATCH /api/tickets/:id/status (valid transitions, invalid transitions, edge cases)
- Comments API (GET, POST, validation, 404)
- Status machine unit tests

### Frontend (15 tests)

- Status machine utility
- formatDate utility
- TicketFilters component (render, interaction, clear)

### Testing Tools

- Vitest (test runner)
- Supertest (HTTP integration testing without starting server)
- React Testing Library (component testing)

---

## Phase 9: Documentation

| Document | Content |
|----------|---------|
| `README.md` | Setup, features, API, architecture |
| `docs/ARCHITECTURE.md` | Diagrams, data model, data flow, sequence diagrams |
| `docs/AI_USAGE.md` | How AI was used, human oversight |
| `docs/DEVELOPMENT_PROCESS.md` | This file — phase-by-phase development log |
| `docs/REFLECTION.md` | Lessons learned, challenges, improvements |
| `PROMPT_HISTORY.md` | Chronological log of all AI interactions |

---

# Challenges Encountered

| Challenge | Resolution |
|-----------|-----------|
| Prisma in monorepo | Configured workspace with `postinstall` script for client generation |
| Zod v4 API changes | Replaced `required_error` with `.min(1, message)` pattern |
| Chakra UI v3 runtime crashes | Replaced compound components with plain primitives |
| Toast "children is not a function" | Created custom ToasterComponent with explicit render function |
| Test parallelism race conditions | Set `fileParallelism: false` in vitest config |
| Hardcoded user IDs in tests | Refactored to fetch real IDs via API |

---

# Outcome

The final application includes:

- 9 API endpoints
- 5 frontend pages
- 3 database models
- 75 backend tests + 15 frontend tests
- Enforced status workflow with 5 states
- Server-side search and filtering
- Full comment system with author attribution
- Comprehensive documentation
