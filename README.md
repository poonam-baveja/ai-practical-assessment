# Support Ticket Management System

A full-stack support ticket management system built with React, Express, and SQLite — developed using AI-assisted, spec-driven development methodology.

## Features

- **Ticket CRUD** — Create, view, and list support tickets
- **Status Workflow** — Enforced state machine: Open → In Progress → Resolved → Closed
- **Search & Filter** — Search by title/description, filter by status
- **Responsive UI** — Works across desktop, tablet, and mobile
- **Real-time Feedback** — Toast notifications for all actions
- **Validation** — Client-side (Zod + React Hook Form) and server-side (Zod)
- **Type Safety** — TypeScript strict mode across the entire stack

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Chakra UI v3, TanStack Query, React Hook Form |
| Backend | Express 5, TypeScript, Zod validation |
| Database | SQLite via Prisma ORM |
| Testing | Vitest, React Testing Library |

## Architecture

```
┌──────────────────────────────────────────┐
│           Frontend (React + Vite)         │
│   Chakra UI · TanStack Query · Router    │
└─────────────────────┬────────────────────┘
                      │ HTTP/REST
                      ▼
┌──────────────────────────────────────────┐
│          Backend (Express + TS)           │
│   Routes → Controllers → Services       │
└─────────────────────┬────────────────────┘
                      │ Prisma Client
                      ▼
┌──────────────────────────────────────────┐
│            SQLite (file-based)            │
└──────────────────────────────────────────┘
```

**Frontend:** Feature-based architecture with colocated components, hooks, API calls, and types.

**Backend:** Layered architecture — routes handle HTTP mapping, controllers parse requests, services contain business logic and database access.

## Folder Structure

```
├── frontend/
│   └── src/
│       ├── app/                  # Providers, routes
│       ├── components/layout/    # Header, PageContainer, AppLayout
│       ├── features/tickets/     # Pages, components, hooks, API, types
│       ├── services/             # Shared Axios instance
│       ├── shared/               # Utilities (formatDate, debounce, toaster)
│       └── theme/                # Chakra UI custom theme
├── backend/
│   └── src/
│       ├── routes/               # Express route definitions
│       ├── controllers/          # Request handlers
│       ├── services/             # Business logic + Prisma queries
│       ├── validators/           # Zod schemas
│       ├── middleware/           # Error handler, content-type
│       └── utils/                # Status machine, response helpers
├── database/
│   └── prisma/                   # Schema, migrations, seed script
├── docs/                         # Requirements, design, acceptance criteria
└── tool-specific/kiro-specs/     # Spec-driven development artifacts
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-practical-assessment

# Install all workspace dependencies
npm install

# Generate Prisma client and create database
cd database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

### Running the Application

**Backend** (port 3001):
```bash
cd backend
npm run dev
```

**Frontend** (port 5173):
```bash
cd frontend
npm run dev
```

**Both simultaneously** (from root):
```bash
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List all tickets (supports `?search=` and `?status=`) |
| GET | `/api/tickets/:id` | Get a single ticket |
| POST | `/api/tickets` | Create a new ticket |
| PATCH | `/api/tickets/:id/status` | Update ticket status |
| GET | `/health` | Health check |

### Status Transitions (Enforced)

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

Invalid transitions return HTTP 400 with a descriptive error message.

## AI-Assisted Development Approach

This project was built using **Kiro** with a **Spec-Driven Development** workflow:

1. **Requirements** — Defined functional and non-functional requirements
2. **Acceptance Criteria** — Written in Given-When-Then format for each requirement
3. **Design** — Documented architecture decisions with rationale
4. **Task Breakdown** — Organized into 7 checkpoints with verifiable deliverables
5. **Incremental Implementation** — One feature at a time, verified at each step

### Spec Documents

| Document | Purpose |
|----------|---------|
| `docs/requirements.md` | Functional requirements and scope |
| `docs/acceptance-criteria.md` | Measurable criteria per feature |
| `docs/design.md` | Architecture and technical decisions |
| `docs/folder-structure.md` | Project structure reference |
| `tool-specific/kiro-specs/` | Implementation-focused specs and tasks |

### AI Development Protocol

- Each feature was implemented through conversational prompts
- Backend and frontend developed in parallel layers
- Each endpoint tested before building the corresponding UI
- UI issues debugged iteratively (e.g., Chakra UI v3 API compatibility)

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Chakra UI v3 | Built-in accessibility, responsive props, TypeScript support |
| TanStack Query | Eliminates manual loading/error state management |
| Zod (both layers) | Single validation library with TypeScript inference |
| Feature-based frontend | Colocation improves discoverability and encapsulation |
| Flat API responses | Simpler contract — arrays for lists, objects for singles |
| SQLite + Prisma | Zero infrastructure, type-safe database access |
| Status machine in service layer | Central enforcement, testable independently |
| Native `<select>` elements | Full keyboard accessibility without complex component issues |

## Future Enhancements

- Comments on tickets
- Pagination for large ticket lists
- Sorting (by date, status)
- Dashboard with statistics
- Dark mode
- User authentication
- Activity log / audit trail

## Screenshots

> Screenshots to be added after deployment.

| Screen | Description |
|--------|-------------|
| Ticket List | Table with search, status filter, and create button |
| Create Ticket | Form with validation and loading state |
| Ticket Detail | Full details with status update workflow |

## Assumptions

- Single-user system (no authentication required for this assessment)
- SQLite is sufficient for the data volume (< 1000 tickets)
- Linear status workflow only (no reverse transitions)
- No file attachments or email notifications
- Modern browser support (ES2020+)

## License

MIT
