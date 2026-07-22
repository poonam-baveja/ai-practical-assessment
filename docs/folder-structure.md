# Project Folder Structure

> Recommended monorepo layout for the Support Ticket Management System.
> Each entry shows the file/folder and its single responsibility.
> 3 screens, 2 database tables, one feature module.

---

## Root

```
/
├── frontend/                    # React + TypeScript + Vite application
├── backend/                     # Express + TypeScript API server
├── database/                    # Prisma schema, migrations, seed
├── docs/                        # Project documentation
├── tests/                       # Cross-cutting / E2E tests (if needed)
├── ai-prompts/                  # AI-assisted development prompt logs
├── tool-specific/               # Tool-specific artifacts (Kiro specs)
├── package.json                 # Workspace root — scripts to run both apps
├── .gitignore                   # Git ignore rules
└── README.md                    # Project overview, setup instructions
```

---

## Frontend (`frontend/`)

```
frontend/
├── public/
│   └── favicon.svg                         # App favicon
├── src/
│   ├── app/
│   │   ├── App.tsx                         # Root component — wraps providers and router
│   │   ├── routes.tsx                      # Route definitions (/, /tickets/new, /tickets/:id)
│   │   └── providers.tsx                   # Provider composition (Chakra, QueryClient, Router)
│   │
│   ├── theme/
│   │   ├── index.ts                        # extendTheme() — exports the custom Chakra theme
│   │   ├── foundations/
│   │   │   ├── colors.ts                   # Semantic color tokens (status, priority, UI)
│   │   │   └── typography.ts               # Font families, sizes, weights
│   │   ├── components/
│   │   │   ├── button.ts                   # Button variant overrides (primary, secondary, destructive)
│   │   │   ├── badge.ts                    # Badge variants for status and priority
│   │   │   └── input.ts                    # Input/Textarea/Select default styles
│   │   └── styles.ts                       # Global style overrides (body, focus rings)
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── FormInput.tsx               # Wrapper: Chakra FormControl + Input + error display
│   │   │   ├── FormTextarea.tsx            # Wrapper: Chakra FormControl + Textarea + char count
│   │   │   ├── FormSelect.tsx              # Wrapper: Chakra FormControl + Select + error display
│   │   │   ├── StatusBadge.tsx             # Maps status enum → Chakra Badge variant
│   │   │   ├── PriorityBadge.tsx           # Maps priority enum → Chakra Badge variant
│   │   │   ├── ConfirmModal.tsx            # Chakra Modal — confirm/cancel dialog pattern
│   │   │   ├── Pagination.tsx              # Page controls with boundary handling
│   │   │   ├── EmptyState.tsx              # Message + action CTA for zero-item views
│   │   │   ├── ErrorState.tsx              # Error message + retry button
│   │   │   └── LoadingState.tsx            # Spinner or Skeleton for loading views
│   │   ├── hooks/
│   │   │   ├── useAppToast.ts              # Custom wrapper around Chakra useToast with defaults
│   │   │   └── useDebounce.ts              # Debounce hook for search input
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx              # App shell: Header + responsive nav + content area
│   │   ├── types/
│   │   │   ├── ticket.ts                   # Ticket, Comment, Status, Priority, Category types
│   │   │   └── api.ts                      # API response types (success, error, pagination)
│   │   └── utils/
│   │       ├── apiClient.ts                # Typed fetch wrapper (get, post, patch, del)
│   │       ├── constants.ts                # App-wide constants (API base URL, page size)
│   │       └── formatDate.ts               # Date formatting utility
│   │
│   ├── features/
│   │   └── tickets/
│   │       ├── components/
│   │       │   ├── TicketCard.tsx           # Single ticket display card (list item)
│   │       │   ├── TicketForm.tsx           # Create ticket form (React Hook Form + Chakra)
│   │       │   ├── TicketTable.tsx          # Table/list view for tickets
│   │       │   ├── StatusTransitionControl.tsx  # Valid next-status buttons with confirm modal
│   │       │   ├── FilterBar.tsx            # Row of filter selects (status, priority, category) + clear
│   │       │   ├── SearchInput.tsx          # Debounced search input with icon
│   │       │   └── CommentSection.tsx       # Comment list + add comment form
│   │       ├── hooks/
│   │       │   ├── useTickets.ts            # TanStack Query — fetch ticket list with params
│   │       │   ├── useTicket.ts             # TanStack Query — fetch single ticket by ID
│   │       │   ├── useCreateTicket.ts       # TanStack Mutation — create ticket
│   │       │   ├── useUpdateTicket.ts       # TanStack Mutation — update ticket
│   │       │   ├── useComments.ts           # TanStack Query — fetch comments for a ticket
│   │       │   ├── useAddComment.ts         # TanStack Mutation — add comment to a ticket
│   │       │   └── useFilters.ts            # Reads/writes URL search params (filters, search, page)
│   │       ├── pages/
│   │       │   ├── TicketListPage.tsx       # Screen 1: Table + search + status filter + create button
│   │       │   ├── CreateTicketPage.tsx     # Screen 2: Form + validation
│   │       │   └── TicketDetailPage.tsx     # Screen 3: Details + change status + comments
│   │       ├── services/
│   │       │   └── ticketApi.ts             # API calls (tickets CRUD, comments, search, filter)
│   │       ├── utils/
│   │       │   └── statusMachine.ts         # getValidTransitions(currentStatus) — frontend state machine
│   │       └── index.ts                     # Barrel export — public API for this feature
│   │
│   ├── main.tsx                             # Vite entry point — renders App
│   └── vite-env.d.ts                        # Vite type declarations
│
├── index.html                               # Vite HTML entry
├── vite.config.ts                           # Vite configuration (proxy, aliases)
├── tsconfig.json                            # TypeScript config (strict mode, path aliases)
├── .env                                     # Environment variables (VITE_API_URL)
└── package.json                             # Frontend dependencies and scripts
```

---

## Backend (`backend/`)

```
backend/
├── src/
│   ├── server.ts                            # Express app setup, middleware registration, listen
│   ├── routes/
│   │   ├── tickets.ts                       # Ticket routes — CRUD, search, filter, status transition
│   │   └── comments.ts                      # Comment routes — list and add comments for a ticket
│   ├── controllers/
│   │   ├── ticketController.ts              # Ticket request handling — parse, call service, respond
│   │   └── commentController.ts             # Comment request handling — parse, call service, respond
│   ├── services/
│   │   ├── ticketService.ts                 # Ticket business logic — CRUD, state machine, search, filter
│   │   └── commentService.ts                # Comment business logic — create, list by ticket
│   ├── validators/
│   │   ├── ticketValidator.ts               # Zod schemas — createTicket, updateTicket, queryParams
│   │   └── commentValidator.ts              # Zod schemas — createComment
│   ├── middleware/
│   │   ├── errorHandler.ts                  # Global error catch — formats consistent error response
│   │   ├── notFound.ts                      # 404 catch-all for unmatched routes
│   │   └── contentType.ts                   # Rejects POST/PATCH without application/json
│   ├── utils/
│   │   ├── statusMachine.ts                 # Transition map + isValidTransition() function
│   │   └── apiResponse.ts                   # success() and error() response helpers
│   └── types/
│       └── index.ts                         # Backend-specific TypeScript types
│
├── tsconfig.json                            # TypeScript config (strict mode)
├── .env                                     # Environment variables (PORT, DATABASE_URL)
└── package.json                             # Backend dependencies and scripts
```

---

## Database (`database/`)

```
database/
├── prisma/
│   ├── schema.prisma                        # 2 models: Ticket + Comment (with enums)
│   ├── migrations/                          # Auto-generated migration files
│   └── seed.ts                              # Seed script — sample tickets with comments
└── package.json                             # Prisma CLI dependency and seed script config
```

### Data Model (2 Tables)

```
┌─────────────┐         ┌─────────────┐
│   Ticket    │ 1 ──► N │   Comment   │
├─────────────┤         ├─────────────┤
│ id          │         │ id          │
│ title       │         │ content     │
│ description │         │ author      │
│ status      │         │ ticketId    │
│ priority    │         │ createdAt   │
│ category    │         └─────────────┘
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

---

## 3 Screens Summary

| # | Screen          | Route          | Key Elements                              |
|---|-----------------|----------------|-------------------------------------------|
| 1 | Ticket List     | `/`            | Table, Search, Status Filter, Create Button |
| 2 | Create Ticket   | `/tickets/new` | Form, Validation                          |
| 3 | Ticket Details  | `/tickets/:id` | Details, Change Status, Comments          |

---

## Key Placement Rules

| Concern                    | Location                                      |
|----------------------------|-----------------------------------------------|
| Chakra theme tokens        | `frontend/src/theme/foundations/`              |
| Chakra component variants  | `frontend/src/theme/components/`              |
| Reusable UI wrappers       | `frontend/src/shared/components/`             |
| Ticket components          | `frontend/src/features/tickets/components/`   |
| Filter & search components | `frontend/src/features/tickets/components/`   |
| Comment UI                 | `frontend/src/features/tickets/components/CommentSection.tsx` |
| Data-fetching hooks        | `frontend/src/features/tickets/hooks/`        |
| API call functions         | `frontend/src/features/tickets/services/`     |
| Status machine (frontend)  | `frontend/src/features/tickets/utils/`        |
| Shared types/enums         | `frontend/src/shared/types/`                  |
| Shared utilities           | `frontend/src/shared/utils/`                  |
| App-wide hooks             | `frontend/src/shared/hooks/`                  |
| API routes                 | `backend/src/routes/`                         |
| Request handlers           | `backend/src/controllers/`                    |
| Business logic + DB access | `backend/src/services/`                       |
| Zod validation schemas     | `backend/src/validators/`                     |
| Cross-cutting middleware   | `backend/src/middleware/`                      |
| Status machine (backend)   | `backend/src/utils/statusMachine.ts`          |
| Prisma schema              | `database/prisma/schema.prisma`               |
| Database seed data         | `database/prisma/seed.ts`                     |
