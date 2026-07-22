# Support Ticket Management System — Design Document

## 1. Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                     │
│  React + TypeScript + Vite + Chakra UI + React Router    │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP (REST / JSON)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Express + TS)                  │
│         Validation │ Routes │ Controllers │ Services      │
└────────────────────────────┬────────────────────────────┘
                             │ Prisma Client
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    SQLite (file-based)                    │
└─────────────────────────────────────────────────────────┘
```

### Why this architecture

- **Monorepo with separate packages** — keeps frontend and backend deployable independently while sharing types in a common package.
- **SQLite via Prisma** — zero infrastructure, single-file database, ideal for an assessment project with no ops overhead.
- **REST over GraphQL** — simpler to implement, test, and demonstrate for a CRUD-dominant app.
- **Frontend-first emphasis** — the frontend is the primary deliverable; the backend exists as a thin data layer.

### Monorepo Structure

```
/
├── frontend/          # React application
├── backend/           # Express API server
├── database/          # Prisma schema and migrations
├── docs/              # Requirements, acceptance criteria, design
├── tests/             # End-to-end or cross-cutting tests
├── ai-prompts/        # Prompt logs for AI-assisted dev
└── tool-specific/     # Kiro specs and tool artifacts
```

---

## 2. Frontend Architecture

### 2.1 Feature-Based Folder Structure

```
frontend/src/
├── app/
│   ├── App.tsx                 # Root component: ChakraProvider → QueryProvider → Router
│   ├── routes.tsx              # Route definitions
│   └── providers.tsx           # Provider composition (Chakra, Query, Toast)
├── features/
│   ├── tickets/
│   │   ├── components/         # TicketCard, TicketForm, StatusBadge, etc.
│   │   ├── hooks/              # useTickets, useTicket, useCreateTicket
│   │   ├── pages/              # TicketListPage, TicketDetailPage, CreateTicketPage
│   │   ├── services/           # ticketApi.ts (API call functions)
│   │   ├── types/              # Ticket-specific TypeScript types
│   │   ├── utils/              # statusMachine.ts, validators.ts
│   │   └── index.ts            # Public barrel export
│   └── filters/
│       ├── components/         # FilterBar, FilterChip, SearchInput
│       ├── hooks/              # useFilters, useSearchParams
│       └── index.ts
├── shared/
│   ├── components/             # App-specific wrappers built on Chakra primitives
│   ├── hooks/                  # useApi, useDebounce
│   ├── layouts/                # MainLayout, PageHeader
│   ├── types/                  # Shared enums, API response types
│   └── utils/                  # formatDate, constants
├── theme/
│   ├── index.ts                # extendTheme() — exports the custom theme
│   ├── foundations/
│   │   ├── colors.ts           # Semantic color tokens (status, priority, ui)
│   │   ├── typography.ts       # Font families, sizes, weights
│   │   └── spacing.ts          # Custom spacing scale (if needed)
│   ├── components/
│   │   ├── button.ts           # Button component variants & sizes
│   │   ├── badge.ts            # Badge variants for status/priority
│   │   ├── input.ts            # Input/Textarea default styles
│   │   └── select.ts           # Select default styles
│   └── styles.ts               # Global style overrides
├── main.tsx                    # Entry point
└── vite-env.d.ts
```

### 2.2 Provider Hierarchy

```
<ChakraProvider theme={customTheme}>
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </QueryClientProvider>
</ChakraProvider>
```

`ChakraProvider` is the outermost wrapper. It provides the theme context, color mode, and CSS reset to the entire component tree.

### 2.3 Chakra UI Best Practices

| Principle                          | Application                                                |
|------------------------------------|------------------------------------------------------------|
| ChakraProvider at root             | Wraps entire app; provides theme, color mode, CSS reset    |
| Custom theme for design tokens     | Colors, typography, spacing, component variants defined centrally |
| Prefer Chakra primitives           | Use `Box`, `Flex`, `Grid`, `Stack`, `Container` for layout |
| Style via props, not CSS files     | Inline style props (`p`, `bg`, `borderRadius`) on Chakra components |
| Responsive props over media queries| `{{ base: "column", md: "row" }}` object syntax            |
| Reusable wrappers on Chakra        | Thin app-specific components wrapping Chakra primitives    |
| Business logic separate from UI    | Hooks contain data logic; components are purely presentational |

### 2.4 Styling Strategy

**No custom CSS files.** All styling is done via:

1. **Theme tokens** — defined in `theme/` and consumed automatically by Chakra components.
2. **Style props** — applied directly on Chakra components (`<Box bg="gray.50" p={4} borderRadius="md">`).
3. **Responsive props** — object syntax for breakpoint-specific values (`<Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }}>`).
4. **Component variants** — defined in theme component styles and applied via `variant` prop (`<Badge variant="status-open">`).
5. **`sx` prop** — escape hatch for rare cases needing pseudo-selectors or complex selectors.

### Why feature-based structure

- **Colocation** — related components, hooks, and services live together, making features easy to find and modify.
- **Encapsulation** — each feature exposes only what others need via barrel exports.
- **Scalability** — adding a new feature means adding a new folder, not touching existing code.

### Why Chakra UI

- **Built-in accessibility** — all components follow WAI-ARIA standards out of the box (focus management, ARIA attributes, keyboard interactions).
- **Responsive props** — responsive styles via object syntax without writing any media queries.
- **Theme-able** — centralized design tokens (colors, spacing, typography, component variants) via `extendTheme`.
- **Prop-based styling** — keeps styles colocated with components, eliminating context-switching to separate CSS files.
- **Component-first** — provides pre-built, composable UI primitives (`Box`, `Flex`, `Stack`, `Grid`) that cover 95% of layout needs.
- **TypeScript-first** — full type safety for style props and theme tokens with autocompletion.

---

## 3. Backend Architecture

### 3.1 Folder Structure

```
backend/src/
├── server.ts                   # Express app setup, middleware, listen
├── routes/
│   └── tickets.ts              # All /api/tickets routes
├── controllers/
│   └── ticketController.ts     # Request parsing, response formatting
├── services/
│   └── ticketService.ts        # Business logic, state machine enforcement
├── validators/
│   └── ticketValidator.ts      # Zod schemas for request validation
├── middleware/
│   ├── errorHandler.ts         # Global error handler
│   ├── notFound.ts             # 404 catch-all
│   └── contentType.ts          # Content-Type enforcement
├── utils/
│   ├── statusMachine.ts        # Valid transitions map
│   └── apiResponse.ts          # Consistent response helpers
└── types/
    └── index.ts                # Shared backend types
```

### 3.2 Layer Responsibilities

| Layer        | Responsibility                                     |
|--------------|----------------------------------------------------|
| Routes       | HTTP method binding, path definitions              |
| Controllers  | Parse request, call service, format response       |
| Services     | Business logic, state machine, Prisma queries      |
| Validators   | Input validation via Zod schemas                   |
| Middleware   | Cross-cutting: errors, content-type, CORS, logging |

### Why this structure

- **Separation of concerns** — controllers don't contain business logic; services don't know about HTTP.
- **Testability** — services can be unit-tested without spinning up Express.
- **Intentionally simple** — no repository pattern or DI framework; Prisma is called directly in services. Appropriate for the project's scale.

---

## 4. Database Design

### 4.1 Prisma Schema

```
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

### Why these decisions

- **Single table** — matches the simplified requirements (no comments, no activity log).
- **Enums** — enforced at the database level for data integrity; maps cleanly to TypeScript union types.
- **cuid IDs** — collision-resistant, URL-friendly, no sequential guessing.
- **updatedAt with @updatedAt** — Prisma auto-manages this on every write.

---

## 5. Component Hierarchy

### 5.1 Layout (Chakra Primitives)

```
App
├── ChakraProvider (theme={customTheme})
│   └── MainLayout (Container maxW="container.xl")
│       ├── Header (Flex, justify="space-between")
│       │   ├── Logo / App Name (Heading)
│       │   ├── Nav Links (HStack, display={{ base: "none", md: "flex" }})
│       │   └── Mobile Menu (IconButton + Drawer, display={{ base: "flex", md: "none" }})
│       └── Main Content (Box as="main")
│           └── Routes
└── ToastContainer (Chakra useToast, portal-rendered)
```

### 5.2 Page Compositions

```
TicketListPage (VStack spacing={6})
├── PageHeader (Flex, justify="space-between")
│   ├── Heading as="h1"
│   └── Button → navigate("/tickets/new")
├── SearchInput (InputGroup with InputLeftElement)
├── FilterBar (Flex wrap="wrap" gap={3})
│   ├── Select (status)
│   ├── Select (priority)
│   ├── Select (category)
│   └── Button "Clear All" (variant="ghost")
├── TicketList (VStack | SimpleGrid)
│   ├── TicketCard (Card/Box with onClick → navigate) ×N
│   │   ├── HStack: StatusBadge + PriorityBadge
│   │   ├── Heading as="h2" (title)
│   │   └── HStack: Text (category) + Text (date)
│   ├── EmptyState (VStack: Icon + Text + Button)
│   ├── LoadingState (Skeleton / Spinner)
│   └── ErrorState (Alert + Button "Retry")
└── Pagination (HStack justify="center")

TicketDetailPage (Stack direction={{ base: "column", lg: "row" }})
├── Box flex={1} (main content)
│   ├── Heading (title)
│   ├── Text (description)
│   └── StatusTransitionControl (ButtonGroup)
├── Box w={{ base: "100%", lg: "300px" }} (sidebar metadata)
│   ├── Stat: Status (Badge)
│   ├── Select: Priority
│   ├── Select: Category
│   ├── Text: Created date
│   └── Text: Updated date
├── LoadingState
└── ErrorState / NotFoundState

CreateTicketPage (Container maxW="container.md")
├── PageHeader (Heading + back link)
└── TicketForm (VStack as="form" spacing={5})
    ├── FormControl (title) → Input
    ├── FormControl (description) → Textarea
    ├── FormControl (priority) → Select
    ├── FormControl (category) → Select
    └── Button (type="submit", isLoading, isDisabled)
```

### 5.3 Design Principles

- **Chakra primitives for layout** — `Box`, `Flex`, `Stack`, `Grid`, `Container` handle all spacing and alignment.
- **No raw HTML divs for layout** — every layout element is a Chakra primitive with style props.
- **Composition over configuration** — pages compose small, focused components rather than passing complex config objects.
- **Business logic in hooks** — page components only orchestrate; data fetching and state live in custom hooks.
- **Flat prop interface** — components accept data props and callbacks; no deep nesting of config objects.

---

## 6. State Management Strategy

### Approach: React Query (TanStack Query) + URL State

| Concern             | Solution                                           |
|---------------------|----------------------------------------------------|
| Server data cache   | TanStack Query (queries, mutations, cache invalidation) |
| Filter/search state | URL search params via `useSearchParams`            |
| Pagination state    | URL search params (`?page=2`)                      |
| UI state (modals)   | Local component state (`useState`) + Chakra `useDisclosure` |
| Toast notifications | Chakra UI `useToast` hook (built-in, no custom context needed) |
| Form state          | React Hook Form                                    |

### Why these choices

- **TanStack Query** — handles caching, background refetching, loading/error states, and optimistic updates out of the box. Eliminates manual `useEffect` + `useState` data fetching patterns.
- **URL-based filter/pagination** — makes the app shareable and bookmarkable; browser back/forward works naturally.
- **No global store (Redux/Zustand)** — unnecessary for this app's complexity. Server state is the primary state, and TanStack Query manages it.
- **React Hook Form** — performant form handling with built-in validation integration, avoids re-rendering the entire form on every keystroke.

### Data Flow

```
User Action → Hook (useMutation) → API Service → Backend
                                                     │
Backend Response ← Cache Invalidation ← onSuccess ←─┘
                                             │
                              UI Re-renders ←─┘
```

---

## 7. API Communication Strategy

### 7.1 API Client

A thin wrapper around `fetch` (or axios) that:

- Sets base URL from environment variable
- Sets `Content-Type: application/json` header
- Parses JSON responses
- Throws structured errors for non-2xx responses
- Provides typed generic functions: `get<T>`, `post<T>`, `patch<T>`, `del<T>`

### 7.2 Service Functions

Each feature has a `services/` file that maps to API endpoints:

- `getTickets(params)` → GET `/api/tickets` with query params
- `getTicket(id)` → GET `/api/tickets/:id`
- `createTicket(data)` → POST `/api/tickets`
- `updateTicket(id, data)` → PATCH `/api/tickets/:id`
- `deleteTicket(id)` → DELETE `/api/tickets/:id`

### 7.3 Response Types

```
// Success
{ data: T }

// Success (list)
{ data: T[], pagination: { page, limit, total, totalPages } }

// Error
{ status: number, error: string, message: string, details?: FieldError[] }
```

### Why this approach

- **Typed end-to-end** — response types shared between API client and components.
- **Single responsibility** — API client handles transport; service functions handle endpoint mapping; hooks handle caching.
- **Easy to mock** — service functions are simple async functions, trivially mockable in tests.

---

## 8. Validation Strategy

### 8.1 Shared Validation Rules

Validation rules defined once and applied in two places:

| Rule                    | Frontend (React Hook Form) | Backend (Zod)            |
|-------------------------|----------------------------|--------------------------|
| Title required          | ✓ required                 | ✓ z.string().min(1)      |
| Title max 200 chars     | ✓ maxLength: 200           | ✓ z.string().max(200)    |
| Description required    | ✓ required                 | ✓ z.string().min(1)      |
| Description max 2000    | ✓ maxLength: 2000          | ✓ z.string().max(2000)   |
| Priority in enum        | ✓ select options           | ✓ z.nativeEnum(Priority) |
| Category in enum        | ✓ select options           | ✓ z.nativeEnum(Category) |
| Status transition valid | ✓ UI only shows valid opts | ✓ service-layer check    |

### 8.2 Frontend Validation UX

- Validate on blur (field-level) via React Hook Form `mode: "onBlur"`
- Use Chakra's `FormControl` + `FormErrorMessage` for inline error display beneath each field
- `FormControl isInvalid={!!error}` toggles error styling and `aria-describedby` automatically
- Disable submit via `Button isDisabled` until `formState.isValid`
- Show loading indicator via `Button isLoading` on submit

### 8.3 Backend Validation

- Zod schema validated in middleware before controller executes
- On failure: return 400 with field-level error details
- Trim whitespace on string inputs before validation

### Why Zod

- Single library for parsing and validation
- First-class TypeScript inference (`z.infer<typeof schema>`)
- Composable schemas (partial for PATCH, pick/omit for different operations)

---

## 9. Error Handling Strategy

### 9.1 Frontend Error Handling

| Error Type          | Handling                                          |
|---------------------|---------------------------------------------------|
| Network failure     | ErrorState component with retry button            |
| 4xx (validation)    | Map to inline form errors or toast                |
| 4xx (not found)     | Redirect to not-found view                        |
| 5xx (server error)  | Generic error toast + ErrorState                  |
| Unexpected throw    | React Error Boundary catches and shows fallback   |

### 9.2 Backend Error Handling

| Scenario               | Response                                        |
|------------------------|-------------------------------------------------|
| Validation failure     | 400 + field errors                              |
| Resource not found     | 404 + message                                   |
| Invalid state transition | 400 + descriptive message                     |
| Invalid Content-Type   | 415 + message                                   |
| Unhandled error        | 500 + generic message (details logged, not sent)|

### 9.3 Error Boundary

- A top-level React Error Boundary wraps the app
- Displays a friendly fallback UI with a "Reload" button
- Prevents white-screen crashes

### Why this approach

- **Graceful degradation** — users always see something actionable, never a blank screen.
- **Security** — backend never leaks stack traces or internal details in responses.
- **Retry-friendly** — transient errors can be recovered without page reload.

---

## 10. Responsive UI Strategy

### 10.1 Breakpoint System (Chakra UI Defaults)

| Token | Min Width | Usage                                 |
|-------|-----------|---------------------------------------|
| base  | 0px       | Mobile — single column, stacked       |
| sm    | 480px     | Large phones                          |
| md    | 768px     | Tablets — two-column where helpful    |
| lg    | 992px     | Desktop — full layout, sidebar filters|
| xl    | 1280px    | Wide desktop                          |

### 10.2 Responsive Prop Syntax

All responsive behavior is expressed via Chakra's object prop syntax:

```tsx
// Layout switches from column to row at md breakpoint
<Stack direction={{ base: "column", md: "row" }} spacing={4}>

// Grid columns adapt by breakpoint
<Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap={6}>

// Element visibility by breakpoint
<Box display={{ base: "none", md: "block" }}>  // hidden on mobile
<Box display={{ base: "block", md: "none" }}>  // visible only on mobile
```

No custom media queries or CSS files are used. All responsiveness is achieved through Chakra's responsive prop system.

### 10.3 Layout Adaptations

| Component       | Mobile (base)                 | Desktop (lg+)                   |
|-----------------|-------------------------------|----------------------------------|
| Navigation      | Drawer (hamburger trigger)    | HStack nav in Header             |
| Filters         | Collapsible Stack above list  | Sidebar (Grid column)            |
| Ticket cards    | VStack full-width             | SimpleGrid columns={2}           |
| Ticket detail   | VStack single column          | HStack (content + aside)         |
| Create form     | Container full-width          | Container maxW="container.md"    |
| Pagination      | HStack (prev/next only)       | HStack with page numbers         |

### 10.4 Chakra Hooks for Responsive Logic

- `useBreakpointValue({ base: "simple", lg: "full" })` — for conditional rendering logic (e.g., pagination style).
- `useMediaQuery("(min-width: 768px)")` — rare escape hatch when prop-based responsive isn't enough.

### 10.5 Mobile-First Implementation

- Base styles represent mobile; larger breakpoints add complexity.
- Touch targets: Chakra `Button` defaults meet 44×44px minimum; `minH="44px"` enforced on custom interactive elements.
- No hover-only interactions — all hover effects paired with focus/active states.

### Why this approach

- **Zero CSS files** — all responsive logic lives in component props, close to the markup.
- **Readable** — object syntax makes breakpoint behavior immediately visible.
- **Consistent** — uses Chakra's built-in breakpoints; no custom values to maintain.
- **Mobile-first** — Chakra's system is mobile-first by default; `base` is always the starting point.

---

## 11. Accessibility Considerations

### 11.1 Chakra UI Built-in Accessibility

Chakra UI provides WCAG-compliant behavior out of the box for most components:

| Chakra Component    | Built-in a11y                                       |
|---------------------|-----------------------------------------------------|
| Button              | `role="button"`, keyboard activation, focus ring    |
| Modal               | Focus trap, Escape to close, `aria-modal`, return focus |
| FormControl         | Auto-links `label`, `error`, `helpText` via `aria-describedby` |
| Toast               | `role="status"`, `aria-live="polite"`               |
| Drawer              | Focus trap, Escape to close, ARIA attributes        |
| Select              | Native `<select>` — full keyboard/screen reader support |
| Alert               | `role="alert"`, semantic meaning                    |
| Skeleton            | `aria-busy="true"` on parent                        |

### 11.2 Application-Level Accessibility (Manual)

These are not automatic and must be implemented explicitly:

- **Heading hierarchy** — use `Heading as="h1"` for page titles, `as="h2"` for sections (Chakra does not enforce order).
- **Navigation landmark** — wrap nav in `<Box as="nav" aria-label="Main navigation">`.
- **Focus on route change** — programmatically focus the main heading after navigation.
- **List semantics** — use `<Box as="ul">` / `<Box as="li">` or `UnorderedList`/`ListItem` for ticket lists.
- **Color + text pairing** — badges use both color and text label (Chakra Badge has color; we add visible text).

### 11.3 Keyboard Navigation

- Chakra provides built-in focus ring (`_focusVisible` style) on all interactive elements.
- Tab order follows DOM order (Chakra does not rearrange).
- Modal/Drawer trap focus automatically.
- Escape closes overlays (built-in).
- Custom components must ensure `tabIndex`, `onKeyDown` handlers where needed.

### 11.4 Form Accessibility Pattern

```
FormControl isInvalid={!!error}
├── FormLabel               → <label for="...">
├── Input / Select          → linked via id
├── FormHelperText          → aria-describedby (when no error)
└── FormErrorMessage        → aria-describedby (when invalid)
```

This pattern is automatic when using Chakra's `FormControl`. No manual `aria-describedby` wiring needed.

### Why these considerations

- Chakra handles ~80% of accessibility concerns automatically.
- The remaining ~20% (heading order, landmarks, route focus) must be handled at the application level.
- WCAG 2.1 AA is a stated non-functional requirement.
- Demonstrates understanding of what the library handles vs. what the developer must ensure.

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
         ┌───────────┐
         │    E2E    │  (minimal — happy paths only)
        ─┼───────────┼─
        │ Integration │  (API endpoints, hook + component)
       ─┼─────────────┼─
      │    Unit Tests    │  (validators, state machine, utils, components)
     ─┼───────────────────┼─
```

### 12.2 Frontend Testing

| What                     | Tool                      | Focus                           |
|--------------------------|---------------------------|---------------------------------|
| Shared components        | Vitest + Testing Library  | Render, props, interaction      |
| Feature components       | Vitest + Testing Library  | Integration with hooks (mocked API) |
| Hooks                    | Vitest + renderHook       | State transitions, error cases  |
| Utils (validators, etc.) | Vitest                    | Pure function unit tests        |
| Pages                    | Vitest + Testing Library  | Route rendering, state handling |

### 12.3 Backend Testing

| What              | Tool           | Focus                                 |
|-------------------|----------------|---------------------------------------|
| Validators        | Vitest         | Schema acceptance/rejection           |
| Services          | Vitest         | Business logic, state machine         |
| API endpoints     | Vitest + Supertest | Full request/response cycle       |
| Error handling    | Vitest + Supertest | 400, 404, 415, 500 scenarios      |

### 12.4 What to Test (Priority Order)

1. Status state machine transitions (all valid + all invalid paths)
2. Form validation (boundary values: 0, 1, 200, 201 chars)
3. API request/response contracts
4. Filter and search query construction
5. Loading → Success / Error state transitions in UI
6. Pagination boundary conditions
7. Responsive layout breakpoint behavior

### Why this strategy

- **Unit-heavy** — fast feedback, easy to maintain, high coverage of logic.
- **Integration for confidence** — ensures layers work together.
- **Minimal E2E** — avoids flakiness; happy-path smoke tests only.

---

## 13. AI-Assisted Development Checkpoints

Each checkpoint represents a deliverable milestone where progress should be verified before continuing.

### Checkpoint 1: Project Scaffolding

- [ ] Monorepo structure created (frontend + backend + database)
- [ ] Vite + React + TypeScript configured
- [ ] Express + TypeScript configured
- [ ] Prisma initialized with SQLite
- [ ] Chakra UI configured with custom theme
- [ ] ESLint + Prettier configured
- [ ] Dev scripts working (`npm run dev` starts both)

### Checkpoint 2: Database & API Foundation

- [ ] Prisma schema defined and migrated
- [ ] Seed script creates sample tickets
- [ ] All CRUD endpoints functional (tested via REST client)
- [ ] Validation middleware working (Zod)
- [ ] Status state machine enforced on PATCH
- [ ] Consistent error response format

### Checkpoint 3: Frontend Foundation

- [ ] Shared UI components built (Button, Input, Select, Badge, etc.)
- [ ] Layout component with responsive navigation
- [ ] React Router configured with 3 routes
- [ ] TanStack Query provider set up
- [ ] API client configured
- [ ] Toast notification system working

### Checkpoint 4: Ticket List Feature

- [ ] TicketListPage renders paginated tickets
- [ ] Loading, empty, and error states working
- [ ] Filter bar functional (status, priority, category)
- [ ] Search input functional
- [ ] Pagination controls working
- [ ] URL state reflects filters/search/page
- [ ] Responsive layout (mobile + desktop)

### Checkpoint 5: Create Ticket Feature

- [ ] CreateTicketPage with form
- [ ] Inline validation on blur
- [ ] Submit with loading state
- [ ] Success redirect + toast
- [ ] Backend validation rejects invalid data
- [ ] Form prevents double submission

### Checkpoint 6: Ticket Detail & Updates

- [ ] TicketDetailPage renders full ticket
- [ ] Status transition control shows only valid options
- [ ] Priority and category updatable
- [ ] Invalid transitions rejected with feedback
- [ ] Success toasts on update
- [ ] 404 handling for bad ticket IDs

### Checkpoint 7: Polish & Quality

- [ ] Accessibility audit (keyboard, screen reader, contrast)
- [ ] Responsive testing across breakpoints
- [ ] Error boundary in place
- [ ] All acceptance criteria verified
- [ ] Test suite passing
- [ ] Code formatted and linted clean

---

## Design Decisions Summary

| Decision                    | Rationale                                              |
|-----------------------------|--------------------------------------------------------|
| Feature-based folder structure | Colocation improves discoverability and encapsulation |
| TanStack Query over useEffect | Built-in caching, loading states, refetch, mutations |
| URL state for filters        | Shareable, bookmarkable, browser history compatible   |
| React Hook Form              | Performant, minimal re-renders, validation integration |
| Zod for backend validation   | TypeScript-first, composable, shared type inference   |
| Chakra UI                    | Built-in a11y, theming, responsive props, no custom CSS |
| ChakraProvider at root       | Provides theme, color mode, CSS reset to entire app   |
| Style via props, no CSS files| Colocation of style + markup; eliminates context switching |
| Responsive object props      | Readable, mobile-first, no media query boilerplate    |
| Custom theme with variants   | Centralized tokens; component variants for consistency |
| Thin wrappers on Chakra      | App-specific defaults without losing Chakra a11y      |
| useToast over custom context | Chakra's built-in toast eliminates custom state mgmt  |
| Single Prisma model          | Matches simplified requirements, no over-engineering  |
| Status machine in service layer | Central enforcement, testable, UI and API consistent |
| Mobile-first responsive      | Aligns with Chakra UI defaults, forces simplicity     |
| Testing Library over Enzyme  | Tests user behavior not implementation details        |
| Checkpoints for AI workflow  | Verifiable milestones for incremental AI-assisted dev |
