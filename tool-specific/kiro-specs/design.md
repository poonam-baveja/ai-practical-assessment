# Design — Support Ticket Management System

> Kiro Spec: Implementation-focused design decisions derived from project architecture.
> Source: `docs/design.md`

---

## 1. Architecture Overview

### Monorepo Layout

```
/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express + TypeScript
├── database/          # Prisma schema, migrations, seed
├── docs/              # Project documentation
├── tests/             # Cross-cutting tests
├── ai-prompts/        # AI development logs
└── tool-specific/     # Kiro specs
```

### Communication

- Frontend communicates with backend via REST/JSON over HTTP
- Base URL configurable via environment variable (`VITE_API_URL`)
- Backend communicates with SQLite via Prisma Client

---

## 2. Frontend Architecture

### Structure: Feature-Based with Chakra Theme Layer

```
frontend/src/
├── app/               # App.tsx, routes.tsx, providers.tsx
├── features/
│   ├── tickets/       # components/, hooks/, pages/, services/, types/, utils/
│   └── filters/       # components/, hooks/
├── shared/
│   ├── components/    # App-specific wrappers built on Chakra primitives
│   ├── hooks/         # useDebounce
│   ├── layouts/       # MainLayout, PageHeader
│   ├── types/         # Enums, API response types
│   └── utils/         # formatDate, constants
├── theme/
│   ├── index.ts       # extendTheme() — exports the custom theme
│   ├── foundations/   # colors.ts, typography.ts, spacing.ts
│   ├── components/    # button.ts, badge.ts, input.ts, select.ts
│   └── styles.ts      # Global style overrides
└── main.tsx
```

### Key Libraries

| Purpose              | Library              | Rationale                                          |
|----------------------|----------------------|----------------------------------------------------|
| Routing              | React Router v6      | Standard, declarative routing with URL params      |
| Server state         | TanStack Query v5    | Caching, refetch, loading/error states built-in    |
| Form management      | React Hook Form      | Performant, minimal re-renders, validation hooks   |
| Styling / Components | Chakra UI            | Component library with built-in a11y, theming, responsive props |
| Build tool           | Vite                 | Fast HMR, ESBuild-powered, TypeScript native       |

### Provider Hierarchy

```
<ChakraProvider theme={customTheme}>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
</ChakraProvider>
```

### Chakra UI Best Practices

| Principle                          | Implementation                                            |
|------------------------------------|------------------------------------------------------------|
| ChakraProvider at root             | Outermost wrapper, provides theme + CSS reset              |
| Custom theme for design tokens     | Colors, typography, component variants in `theme/`         |
| Prefer Chakra primitives           | Box, Flex, Grid, Stack, Container for all layout           |
| Style via props                    | Inline style props on Chakra components, no CSS files      |
| Responsive props                   | Object syntax `{{ base, md, lg }}` — no media queries      |
| Reusable wrappers                  | Thin app-specific components extending Chakra primitives   |
| Business logic separate from UI    | Hooks for data; components purely presentational           |
| Toast via useToast                 | Chakra's built-in toast — no custom context needed         |
| Modals via useDisclosure           | Chakra's disclosure pattern for open/close state           |

### State Management Map

| State Type           | Solution                       |
|----------------------|--------------------------------|
| Server data (tickets)| TanStack Query                 |
| Filters & search     | URL search params              |
| Pagination           | URL search params (`?page=`)   |
| Form fields          | React Hook Form                |
| UI (modals, menus)   | Chakra `useDisclosure` + local `useState` |
| Toasts               | Chakra `useToast` (built-in)   |

### Pages & Routes

| Route            | Page Component     | Data Requirements                  |
|------------------|--------------------|------------------------------------|
| `/`              | TicketListPage     | GET /api/tickets (with params)     |
| `/tickets/new`   | CreateTicketPage   | POST /api/tickets                  |
| `/tickets/:id`   | TicketDetailPage   | GET /api/tickets/:id, PATCH        |

---

## 3. Backend Architecture

### Structure: Layered

```
backend/src/
├── server.ts              # App setup, middleware registration, listen
├── routes/tickets.ts      # Route definitions
├── controllers/ticketController.ts  # Parse request → call service → format response
├── services/ticketService.ts        # Business logic, Prisma queries, state machine
├── validators/ticketValidator.ts    # Zod schemas
├── middleware/
│   ├── errorHandler.ts    # Global error catch
│   ├── notFound.ts        # 404 fallback
│   └── contentType.ts     # Enforce application/json
├── utils/
│   ├── statusMachine.ts   # Transition map + validation function
│   └── apiResponse.ts     # success() and error() response helpers
└── types/index.ts
```

### Layer Responsibilities

| Layer        | Does                                  | Does NOT                    |
|--------------|---------------------------------------|-----------------------------|
| Routes       | Map HTTP methods to controllers       | Contain logic               |
| Controllers  | Parse req, call service, send res     | Query database directly     |
| Services     | Business rules, Prisma calls          | Know about HTTP/Express     |
| Validators   | Define & apply Zod schemas            | Throw HTTP errors           |
| Middleware   | Cross-cutting concerns                | Contain business logic      |

### API Response Contract

```typescript
// Success (single item)
{ data: Ticket }

// Success (list)
{ data: Ticket[], pagination: { page: number, limit: number, total: number, totalPages: number } }

// Error
{ status: number, error: string, message: string, details?: { field: string, message: string }[] }
```

---

## 4. Database Design

### Prisma Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")  // file:./dev.db
}

generator client {
  provider = "prisma-client-js"
}

model Ticket {
  id          String    @id @default(cuid())
  title       String
  description String
  status      Status    @default(OPEN)
  priority    Priority
  category    Category
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Status {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum Category {
  BUG
  FEATURE_REQUEST
  QUESTION
  OTHER
}
```

### Seed Data

A seed script creates 15–20 sample tickets across all statuses, priorities, and categories for development and demonstration.

---

## 5. Status State Machine

### Transition Map

```typescript
const VALID_TRANSITIONS: Record<Status, Status[]> = {
  OPEN: [Status.IN_PROGRESS],
  IN_PROGRESS: [Status.RESOLVED, Status.OPEN],
  RESOLVED: [Status.CLOSED, Status.OPEN],
  CLOSED: [],  // terminal state
}
```

### Enforcement Points

| Location            | Behavior                                               |
|---------------------|--------------------------------------------------------|
| Backend service     | Checks transition map, throws 400 if invalid           |
| Frontend utility    | `getValidTransitions(currentStatus)` returns options   |
| Frontend UI         | Only renders valid next-status buttons/options         |

---

## 6. Validation Strategy

### Zod Schemas (Backend)

| Schema              | Used For                                             |
|---------------------|------------------------------------------------------|
| createTicketSchema  | POST /api/tickets — title, description, priority, category required |
| updateTicketSchema  | PATCH /api/tickets/:id — all fields optional (partial), status validated via state machine |
| queryParamsSchema   | GET /api/tickets — optional filters, search, page, limit |

### React Hook Form (Frontend)

- Validation rules mirror backend constraints
- Mode: `onBlur` (validate individual fields on blur)
- Submit disabled until `formState.isValid === true`
- `isSubmitting` state drives button loading indicator

---

## 7. API Client Design

### Frontend API Client

- Thin wrapper around `fetch`
- Generic typed methods: `get<T>(url, params?)`, `post<T>(url, body)`, `patch<T>(url, body)`, `del(url)`
- Automatically prepends `VITE_API_URL` base
- Sets `Content-Type: application/json`
- Throws `ApiError` class for non-2xx responses (contains status, message, details)

### TanStack Query Integration

| Hook               | Query/Mutation | Key                          | Invalidates       |
|--------------------|----------------|------------------------------|-------------------|
| useTickets         | Query          | ['tickets', params]          | —                 |
| useTicket          | Query          | ['tickets', id]              | —                 |
| useCreateTicket    | Mutation       | —                            | ['tickets']       |
| useUpdateTicket    | Mutation       | —                            | ['tickets'], ['tickets', id] |
| useDeleteTicket    | Mutation       | —                            | ['tickets']       |

---

## 8. Component Design Principles

### Approach: Thin Wrappers on Chakra Primitives

Shared components are not built from scratch — they are thin, app-specific wrappers around Chakra UI components that:

1. Apply project-specific default props and variants from the theme.
2. Provide a simplified API tailored to this app's needs.
3. Keep Chakra's built-in accessibility intact.

### Shared Components (Built on Chakra)

| Component       | Built On                     | Custom Behavior                                 |
|-----------------|------------------------------|-------------------------------------------------|
| AppButton       | Chakra `Button`              | Maps app variants (primary/destructive) to colorSchemes |
| FormInput       | Chakra `FormControl` + `Input` | Bundles label + error + help text, integrates React Hook Form |
| FormTextarea    | Chakra `FormControl` + `Textarea` | Adds character count, integrates React Hook Form |
| FormSelect      | Chakra `FormControl` + `Select` | Accepts typed options array, shows placeholder |
| StatusBadge     | Chakra `Badge`               | Maps status enum to colorScheme + label text   |
| PriorityBadge   | Chakra `Badge`               | Maps priority enum to colorScheme + label text |
| ConfirmModal    | Chakra `Modal`               | Standardized confirm/cancel dialog pattern     |
| EmptyState      | Chakra `VStack` + `Icon` + `Text` + `Button` | Reusable empty state layout |
| ErrorState      | Chakra `Alert` + `Button`    | Error message + retry button                   |
| LoadingState    | Chakra `Spinner` or `Skeleton` | Consistent loading indicators                |
| AppPagination   | Chakra `HStack` + `Button`/`IconButton` | Page controls with boundary handling |

### Layout Primitives (Use Directly)

These Chakra components are used directly — no wrapping needed:

- `Box` — generic container with style props
- `Flex` — flexbox container
- `Stack` / `VStack` / `HStack` — directional stacking with spacing
- `Grid` / `SimpleGrid` — grid layouts
- `Container` — centered max-width container
- `Heading` / `Text` — typography
- `Divider` — visual separator

### Styling via Theme Variants

Component variants are defined in `theme/components/`:

```typescript
// theme/components/badge.ts
const Badge = {
  variants: {
    "status-open": { bg: "blue.100", color: "blue.800" },
    "status-in-progress": { bg: "yellow.100", color: "yellow.800" },
    "status-resolved": { bg: "green.100", color: "green.800" },
    "status-closed": { bg: "gray.100", color: "gray.800" },
    "priority-low": { bg: "gray.100", color: "gray.700" },
    "priority-medium": { bg: "blue.100", color: "blue.700" },
    "priority-high": { bg: "orange.100", color: "orange.800" },
    "priority-critical": { bg: "red.100", color: "red.800" },
  },
}
```

### Composition Pattern

```
Page (uses hooks for data + Chakra layout primitives)
  → Feature Components (presentational, receive data via props)
    → Shared Wrappers (thin wrappers on Chakra with app defaults)
      → Chakra Primitives (Box, Flex, Button, etc.)
```

- No prop drilling beyond 2 levels; hooks provide data access.
- Business logic lives in hooks; components are purely presentational.
- No custom CSS files — all styling via Chakra style props and theme tokens.

---

## 9. Error Handling Design

### Frontend Layers

1. **API Client** — catches non-2xx, throws typed `ApiError`
2. **TanStack Query** — surfaces error via `error` state in hooks
3. **Components** — render `ErrorState` when `isError === true`
4. **Error Boundary** — catches unexpected throws, shows fallback

### Backend Layers

1. **Middleware (contentType)** — rejects bad Content-Type → 415
2. **Middleware (validator)** — rejects bad body → 400 with details
3. **Service** — rejects bad transitions → 400, missing resources → 404
4. **Global errorHandler** — catches unhandled → 500 generic message

---

## 10. Responsive Design Implementation

### Chakra UI Breakpoint Strategy

- Responsive styles via prop objects: `{{ base: "mobile", md: "tablet", lg: "desktop" }}`
- Base (default) = mobile
- `md` = tablet (≥ 768px)
- `lg` = desktop (≥ 992px)
- No custom CSS media queries — all responsiveness via Chakra props

### Responsive Prop Examples

```tsx
<Stack direction={{ base: "column", md: "row" }}>
<Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }}>
<Box display={{ base: "none", md: "block" }}>
```

### Key Layout Decisions

| Viewport  | Navigation             | Filters              | Content             |
|-----------|------------------------|----------------------|---------------------|
| Mobile    | Drawer (hamburger)     | Collapsible Stack    | VStack full-width   |
| Tablet    | HStack nav bar         | Wrap row             | SimpleGrid 2-col    |
| Desktop   | HStack nav bar         | Grid sidebar         | Main content area   |

### Responsive Hooks

- `useBreakpointValue()` — for JS-level conditional rendering (e.g., pagination style)
- `useDisclosure()` — for mobile menu drawer open/close

---

## 11. Testing Architecture

### Frontend

- **Tool**: Vitest + @testing-library/react + msw (API mocking)
- **Co-located**: Tests live next to source files (`Component.test.tsx`)
- **Strategy**: Test user behavior (click, type, see), not implementation

### Backend

- **Tool**: Vitest + Supertest
- **Co-located**: Tests live next to source files (`service.test.ts`)
- **Strategy**: Test request→response contracts and business rule enforcement

### Coverage Priorities

1. Status state machine (all paths)
2. Validation schemas (boundary values)
3. API endpoint contracts (happy + error paths)
4. Shared UI components (render + interaction)
5. Page-level integration (loading → success flow)

---

## 12. Development Workflow

### Checkpoint-Based Implementation

Each checkpoint produces a verifiable deliverable:

| #  | Checkpoint                  | Verifiable By                              |
|----|-----------------------------|--------------------------------------------|
| 1  | Project scaffolding         | `npm run dev` starts frontend + backend    |
| 2  | Database & API              | REST client confirms all endpoints work    |
| 3  | Frontend foundation         | Shared components render in isolation      |
| 4  | Ticket list feature         | List page with filters, search, pagination |
| 5  | Create ticket feature       | Form with validation creates ticket        |
| 6  | Ticket detail & updates     | Status transitions work end-to-end         |
| 7  | Polish & quality            | All acceptance criteria pass               |

### AI Development Protocol

- Generate code for one checkpoint at a time
- Verify each checkpoint before moving to the next
- Run tests after each feature is complete
- Commit after each successful checkpoint
