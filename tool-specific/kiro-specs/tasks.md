# Tasks — Support Ticket Management System

> Kiro Spec: Implementation tasks organized by checkpoint.
> Each task is small, reviewable, and traceable to requirements.
> Source: `tool-specific/kiro-specs/requirements.md`, `tool-specific/kiro-specs/design.md`

---

## Checkpoint 1: Project Scaffolding

### Task 1.1: Initialize monorepo structure
- **Traces to**: Design §1 (Architecture Overview)
- **Description**: Create the workspace structure with `frontend/`, `backend/`, and `database/` directories. Add root `package.json` with workspace scripts.
- **Deliverable**: Running `npm install` at root sets up all workspaces.
- **Verify**: Directory structure matches design; `package.json` has workspace config.

### Task 1.2: Configure frontend (Vite + React + TypeScript)
- **Traces to**: Design §2 (Frontend Architecture)
- **Description**: Initialize Vite with React-TS template. Configure `tsconfig.json` with strict mode. Set up path aliases (`@/` → `src/`).
- **Deliverable**: `npm run dev` in frontend starts dev server with empty App component.
- **Verify**: Browser shows React app; TypeScript strict mode is on; no errors.

### Task 1.3: Configure Chakra UI
- **Traces to**: Design §2 (Key Libraries)
- **Description**: Install Chakra UI and its peer dependencies (@emotion/react, @emotion/styled, framer-motion). Create a custom theme using `extendTheme` with project color tokens for status/priority badges. Wrap app in `ChakraProvider`.
- **Deliverable**: Chakra UI components render with custom theme.
- **Verify**: A component using Chakra's `<Button colorScheme="blue">` renders correctly.

### Task 1.4: Configure backend (Express + TypeScript)
- **Traces to**: Design §3 (Backend Architecture)
- **Description**: Initialize Express project with TypeScript. Configure `tsconfig.json` with strict mode. Set up `ts-node-dev` or `tsx` for dev server. Add CORS middleware.
- **Deliverable**: `npm run dev` in backend starts Express on port 3001.
- **Verify**: GET `/api/health` returns 200 OK.

### Task 1.5: Initialize Prisma with SQLite
- **Traces to**: Design §4 (Database Design)
- **Description**: Install Prisma, initialize with SQLite provider in `database/`. Configure `DATABASE_URL` pointing to `database/dev.db`. Prisma schema has the Ticket model with enums.
- **Deliverable**: `npx prisma migrate dev` creates the database and tables.
- **Verify**: `dev.db` file exists; Prisma Studio shows Ticket table with correct columns.

### Task 1.6: Configure ESLint + Prettier
- **Traces to**: REQ-9 (Maintainability, NFR-4)
- **Description**: Set up ESLint with TypeScript parser and React plugin for frontend. Set up Prettier with consistent config. Add lint/format scripts.
- **Deliverable**: `npm run lint` and `npm run format` work from root.
- **Verify**: No lint errors on initial codebase; formatting is consistent.

### Task 1.7: Set up dev scripts (concurrent frontend + backend)
- **Traces to**: Design §12 (Checkpoint 1)
- **Description**: Add root-level `npm run dev` script that starts both frontend (port 5173) and backend (port 3001) concurrently. Configure frontend proxy or CORS for API calls.
- **Deliverable**: Single command starts full development environment.
- **Verify**: Frontend loads; API calls from frontend reach backend.

---

## Checkpoint 2: Database & API Foundation

### Task 2.1: Define Prisma schema with Ticket model
- **Traces to**: REQ-1, REQ-4, Design §4
- **Description**: Create the full Prisma schema with Ticket model, Status/Priority/Category enums. Run migration to create tables.
- **Deliverable**: Migration applied; schema matches design document.
- **Verify**: `prisma db push` succeeds; Prisma Studio shows correct schema.

### Task 2.2: Create seed script
- **Traces to**: Design §4 (Seed Data)
- **Description**: Write a seed script (`database/seed.ts`) that creates 15-20 sample tickets across all status, priority, and category values. Configure in `package.json` prisma seed command.
- **Deliverable**: `npx prisma db seed` populates the database.
- **Verify**: Prisma Studio shows seeded tickets with varied statuses/priorities.

### Task 2.3: Implement status state machine utility
- **Traces to**: REQ-6 (Status State Machine), Design §5
- **Description**: Create `backend/src/utils/statusMachine.ts` with the transition map and `isValidTransition(from, to)` function. Export `getValidTransitions(current)`.
- **Deliverable**: Pure utility function with no dependencies.
- **Verify**: Unit test covers all valid transitions and rejects all invalid ones.

### Task 2.4: Implement Zod validation schemas
- **Traces to**: REQ-9 (Backend Consistency), Design §6
- **Description**: Create `ticketValidator.ts` with `createTicketSchema` (title, description, priority, category required), `updateTicketSchema` (all optional, partial), and `queryParamsSchema` (optional filters, search, page, limit).
- **Deliverable**: Schemas parse valid data and reject invalid data with field errors.
- **Verify**: Unit tests for boundary values (empty, max length, invalid enum).

### Task 2.5: Implement API response helpers
- **Traces to**: REQ-9 (BE-1), Design §3 (API Response Contract)
- **Description**: Create `apiResponse.ts` with `success(data, pagination?)` and `error(status, message, details?)` helper functions that enforce the response contract.
- **Deliverable**: Consistent response shape across all endpoints.
- **Verify**: Helper returns correct structure for success and error cases.

### Task 2.6: Implement middleware (errorHandler, contentType, notFound)
- **Traces to**: REQ-9 (BE-1, BE-4), Design §3
- **Description**: Create global error handler (catches thrown errors, formats response). Create content-type middleware (rejects non-JSON POST/PATCH with 415). Create 404 catch-all.
- **Deliverable**: Middleware chain handles all error scenarios.
- **Verify**: Integration test: POST without Content-Type → 415; unknown route → 404.

### Task 2.7: Implement ticket service (CRUD + state machine)
- **Traces to**: REQ-1, REQ-2, REQ-3, REQ-4, REQ-5, REQ-6
- **Description**: Create `ticketService.ts` with functions: `createTicket`, `getTickets` (with filters, search, pagination), `getTicketById`, `updateTicket` (with state machine check), `deleteTicket`. Uses Prisma client. Trims whitespace on string inputs. Ignores unknown fields. Forces status to OPEN on create.
- **Deliverable**: All business logic implemented at service layer.
- **Verify**: Unit tests for each function; state machine enforcement tested.

### Task 2.8: Implement ticket controller
- **Traces to**: Design §3 (Layer Responsibilities)
- **Description**: Create `ticketController.ts` with handler functions that: parse request params/body, call validator, call service, format response using helpers. Handle errors (not found, validation, invalid transition).
- **Deliverable**: Controllers are thin — no business logic.
- **Verify**: Each handler delegates to service and returns correct HTTP status.

### Task 2.9: Implement ticket routes
- **Traces to**: REQ-1–5, Design §3
- **Description**: Create `routes/tickets.ts` mapping: POST `/api/tickets`, GET `/api/tickets`, GET `/api/tickets/:id`, PATCH `/api/tickets/:id`, DELETE `/api/tickets/:id`.
- **Deliverable**: All routes registered and calling correct controllers.
- **Verify**: Integration tests (Supertest): all endpoints return expected responses for valid/invalid requests.

### Task 2.10: Write API integration tests
- **Traces to**: All REQs, Design §11
- **Description**: Write Supertest-based tests covering: create (valid + invalid), list (empty, paginated, filtered, searched), get by ID (found + not found), update (valid transition, invalid transition, invalid enum, not found), delete, content-type enforcement.
- **Deliverable**: Full test suite for backend API.
- **Verify**: All tests pass; covers acceptance criteria AC-1.8, AC-2.10, AC-3.9, AC-4.3, AC-4.6, AC-4.7, AC-5.8, SM-1–4, BE-1–4.

---

## Checkpoint 3: Frontend Foundation

### Task 3.1: Create custom Chakra theme
- **Traces to**: Design §2 (Chakra UI Best Practices), Design §8
- **Description**: Create `theme/` directory with `extendTheme()`. Define: semantic color tokens for status badges (open=blue, inProgress=yellow, resolved=green, closed=gray) and priority badges (low=gray, medium=blue, high=orange, critical=red). Define component variants for Badge, Button (primary/secondary/destructive mapped to colorSchemes). Set global styles (body font, focus ring style).
- **Deliverable**: Custom theme applied via `ChakraProvider`; all tokens accessible via props.
- **Verify**: `<Badge variant="status-open">` renders with correct colors; Button colorSchemes work.

### Task 3.2: Create FormInput and FormTextarea wrapper components
- **Traces to**: REQ-1 (validation UX), Design §8
- **Description**: Build thin wrappers around Chakra's `FormControl` + `Input` / `Textarea`. Props: `label`, `error`, `helperText`, plus React Hook Form `register` compatibility via `forwardRef`. `FormTextarea` adds character count. `FormControl isInvalid` toggles error styling and `aria-describedby` automatically.
- **Deliverable**: Form field components with built-in label, error, and accessibility wiring.
- **Verify**: Error shown when `isInvalid`; character count updates; screen reader announces error via `aria-describedby`.

### Task 3.3: Create FormSelect wrapper component
- **Traces to**: REQ-1, REQ-3, Design §8
- **Description**: Build wrapper around Chakra's `FormControl` + `Select`. Accepts typed `options` array, placeholder, error. Integrates with React Hook Form via `forwardRef`.
- **Deliverable**: Accessible dropdown with label and error handling.
- **Verify**: Native keyboard support; label associated; error displays via `FormErrorMessage`.

### Task 3.4: Create StatusBadge and PriorityBadge components
- **Traces to**: REQ-2 (display), REQ-8 (accessibility), Design §8
- **Description**: Build components using Chakra `Badge` with theme-defined variants. Map enum values to variant names. Always render text label alongside color — no color-only meaning.
- **Deliverable**: Color-coded badges that are accessible.
- **Verify**: Text always visible; correct variant applied per enum value; sufficient contrast.

### Task 3.5: Create ConfirmModal component
- **Traces to**: REQ-8 (accessibility), Design §8
- **Description**: Build using Chakra's `Modal` + `ModalOverlay` + `ModalContent` + `ModalHeader` + `ModalBody` + `ModalFooter`. Uses `useDisclosure` pattern for open/close. Focus trap, Escape to close, and return focus are built-in via Chakra.
- **Deliverable**: Reusable confirmation dialog with confirm/cancel actions.
- **Verify**: Focus trapped inside; Escape closes; focus returns to trigger on close.

### Task 3.6: Configure Chakra useToast for notifications
- **Traces to**: REQ-7 (UI-7), Design §2 (State Management)
- **Description**: Create a custom `useAppToast()` hook that wraps Chakra's `useToast` with project defaults: success variant (auto-dismiss 5s, position top-right), error variant (persistent until dismissed). No custom toast context or provider needed — Chakra handles it.
- **Deliverable**: `useAppToast()` hook for triggering toasts from anywhere.
- **Verify**: Success toast auto-dismisses; error toast persists; screen reader announces via built-in `role="status"`.

### Task 3.7: Create Pagination component
- **Traces to**: REQ-2 (AC-2.5, AC-2.6), Design §8
- **Description**: Build using Chakra `HStack` + `IconButton` (prev/next) + `Button` (page numbers). Disabled states at boundaries via `isDisabled`. Responsive: use `useBreakpointValue` to show prev/next only on mobile, full page numbers on desktop.
- **Deliverable**: Pagination controls with boundary handling and responsive behavior.
- **Verify**: Previous disabled on page 1; Next disabled on last page; simplified on mobile.

### Task 3.8: Create EmptyState, ErrorState, LoadingState components
- **Traces to**: REQ-7 (UI-1, UI-2, UI-3), Design §8
- **Description**: `EmptyState`: Chakra `VStack` with `Icon`, `Text`, `Button` (action CTA). `ErrorState`: Chakra `Alert` (status="error") + `Button` (retry). `LoadingState`: Chakra `Spinner` or `Skeleton` stack. Parent uses `aria-busy="true"` during loading.
- **Deliverable**: State-indicator components for all data views.
- **Verify**: Each renders correctly; retry calls callback; empty state CTA navigates; loading sets aria-busy.

### Task 3.9: Create MainLayout with responsive navigation
- **Traces to**: REQ-7 (responsive), REQ-8, Design §10
- **Description**: Build using Chakra `Container` (maxW="container.xl"), `Flex` for header, `Box as="main"` for content. Mobile nav: Chakra `Drawer` triggered by `IconButton` (hamburger). Desktop nav: `HStack` with nav links. Use `display={{ base: "none", md: "flex" }}` for responsive toggle. Semantic: `<Box as="nav" aria-label="Main navigation">`.
- **Deliverable**: Layout shell for all pages with responsive navigation.
- **Verify**: Drawer opens on mobile; HStack nav on desktop; semantic landmarks correct.

### Task 3.10: Configure React Router with routes
- **Traces to**: Design §2 (Pages & Routes)
- **Description**: Set up React Router v6 with routes: `/` → TicketListPage, `/tickets/new` → CreateTicketPage, `/tickets/:id` → TicketDetailPage. Add 404 catch-all route.
- **Deliverable**: Navigation between pages works; URL reflects current page.
- **Verify**: Each route renders correct placeholder page; 404 route shows not-found message.

### Task 3.11: Configure TanStack Query provider
- **Traces to**: Design §2 (Provider Hierarchy), Design §7
- **Description**: Install TanStack Query. Add `QueryClientProvider` inside `ChakraProvider` in `providers.tsx` with default options (stale time, retry config). Set up React Query DevTools for development.
- **Deliverable**: Query client available app-wide, inside Chakra provider tree.
- **Verify**: DevTools visible in development; queries register when hooks are used.

### Task 3.12: Create API client utility
- **Traces to**: Design §7 (API Client Design)
- **Description**: Build typed API client with `get<T>`, `post<T>`, `patch<T>`, `del` methods. Reads `VITE_API_URL` from environment. Sets headers. Throws `ApiError` on non-2xx. Parses JSON.
- **Deliverable**: Single API client used by all service functions.
- **Verify**: Correctly constructs URLs; throws typed errors; headers set.

### Task 3.13: Write shared component tests
- **Traces to**: Design §11 (Testing Architecture)
- **Description**: Write render and interaction tests for: FormInput/FormTextarea (label, error, aria-describedby), FormSelect (options, change), StatusBadge/PriorityBadge (variants, text content), Pagination (boundary states, click handlers), EmptyState/ErrorState (render, callbacks). Wrap tests in `ChakraProvider` for theme context.
- **Deliverable**: Test suite for shared components.
- **Verify**: All tests pass; components render within Chakra provider; accessibility assertions pass.

---

## Checkpoint 4: Ticket List Feature

### Task 4.1: Create ticket API service functions
- **Traces to**: Design §7 (Service Functions)
- **Description**: Create `features/tickets/services/ticketApi.ts` with `getTickets(params)`, `getTicket(id)`, `createTicket(data)`, `updateTicket(id, data)`, `deleteTicket(id)`. Uses the shared API client. Types all params and responses.
- **Deliverable**: Typed service layer for ticket API calls.
- **Verify**: Functions construct correct URLs and params; types match API contract.

### Task 4.2: Create TanStack Query hooks for tickets
- **Traces to**: Design §7 (TanStack Query Integration)
- **Description**: Create `features/tickets/hooks/`: `useTickets(params)` query, `useTicket(id)` query, `useCreateTicket()` mutation, `useUpdateTicket()` mutation, `useDeleteTicket()` mutation. Mutations invalidate relevant query keys.
- **Deliverable**: Data-fetching hooks with cache management.
- **Verify**: Hooks return loading/error/data states; mutations invalidate list cache.

### Task 4.3: Create TicketCard component
- **Traces to**: REQ-2 (AC-2.2), Design §5
- **Description**: Build `TicketCard` using Chakra `Box` with `p={4}`, `borderWidth="1px"`, `borderRadius="md"`, `_hover={{ shadow: "md" }}`. Contains: `HStack` with StatusBadge + PriorityBadge, `Heading as="h2" size="sm"` (title), `HStack` with `Text` (category) + `Text` (formatted date). Entire card clickable via `onClick` → `navigate`. Use `Box as="article"` for semantic meaning within a `Box as="ul"` list.
- **Deliverable**: Single ticket display component styled via Chakra props.
- **Verify**: All fields render; click navigates; accessible as list item; hover state works.

### Task 4.4: Create FilterBar and SearchInput components
- **Traces to**: REQ-3, REQ-5, Design §5
- **Description**: Build `FilterBar` using Chakra `Flex` with `wrap="wrap"` and `gap={3}`, containing `FormSelect` dropdowns (status, priority, category) + `Button variant="ghost"` for "Clear All". Build `SearchInput` using Chakra `InputGroup` + `InputLeftElement` (search icon) with debounced input (300ms via `useDebounce`). Both read/write URL search params via `useSearchParams`.
- **Deliverable**: Filter and search controls that sync with URL.
- **Verify**: Selecting a filter updates URL params; search debounces; clearing works.

### Task 4.5: Create useFilters hook
- **Traces to**: REQ-3 (AC-3.5, AC-3.6, AC-3.8), Design §6
- **Description**: Create `features/filters/hooks/useFilters.ts` that reads filters/search/page from URL params, provides setters that reset page to 1 on filter/search change, and provides clearAll function.
- **Deliverable**: Centralized filter state management via URL.
- **Verify**: Setting filter resets page; clearing removes all params; state persists on refresh.

### Task 4.6: Create TicketListPage
- **Traces to**: REQ-2, REQ-3, REQ-5, REQ-7, Design §5
- **Description**: Compose TicketListPage using Chakra `VStack` with `spacing={6}`. Contains: `Flex` PageHeader (Heading + "Create Ticket" Button/Link), SearchInput, FilterBar, ticket list area (conditionally renders LoadingState, EmptyState, ErrorState, or `VStack` of TicketCards), Pagination at bottom. Uses `useTickets` hook with params from `useFilters`.
- **Deliverable**: Fully functional ticket list page.
- **Verify**: Shows tickets; pagination works; filters work; search works; loading/empty/error states display correctly.

### Task 4.7: Implement responsive layout for TicketListPage
- **Traces to**: REQ-7 (UI-4), Design §10
- **Description**: Apply Chakra UI responsive props: mobile = `Stack` with full-width cards, collapsible filter drawer; desktop = `Grid` with sidebar filters. Pagination simplified on mobile using `useBreakpointValue`.
- **Deliverable**: List page responsive across all breakpoints.
- **Verify**: Mobile shows single column; desktop shows sidebar; no horizontal scroll.

### Task 4.8: Write ticket list feature tests
- **Traces to**: Design §11
- **Description**: Test TicketListPage with mocked API (msw): renders ticket cards, handles empty state, handles error state with retry, pagination changes page, filters update results, search returns matches.
- **Deliverable**: Integration tests for list feature.
- **Verify**: All tests pass; covers AC-2.1 through AC-2.9, AC-3.1 through AC-3.8, AC-5.1 through AC-5.7.

---

## Checkpoint 5: Create Ticket Feature

### Task 5.1: Create frontend status machine utility
- **Traces to**: REQ-6, Design §5
- **Description**: Create `features/tickets/utils/statusMachine.ts` with `getValidTransitions(currentStatus)` returning array of valid next statuses. Mirror backend logic.
- **Deliverable**: Frontend utility for state machine display logic.
- **Verify**: Unit test: Open→[InProgress], InProgress→[Resolved,Open], Resolved→[Closed,Open], Closed→[].

### Task 5.2: Create TicketForm component
- **Traces to**: REQ-1, Design §5, Design §8
- **Description**: Build `TicketForm` using React Hook Form + Chakra `FormControl` components. Layout: `VStack as="form" spacing={5}`. Contains: `FormInput` (title, maxLength 200), `FormTextarea` (description, maxLength 2000 + character count), `FormSelect` (priority), `FormSelect` (category), `Button` (type="submit", `isLoading={isSubmitting}`, `isDisabled={!isValid}`). Mode `onBlur` for field-level validation.
- **Deliverable**: Complete creation form with validation and Chakra styling.
- **Verify**: Empty fields show errors on blur; max length enforced; submit disabled when invalid; loading state on submit.

### Task 5.3: Create CreateTicketPage
- **Traces to**: REQ-1 (AC-1.1, AC-1.9, AC-1.10), Design §5
- **Description**: Compose using Chakra `Container maxW="container.md"`. Contains: `Heading` + back link (`Button` as `Link`), and `TicketForm`. On submit: call `useCreateTicket` mutation, show success toast via `useAppToast()`, redirect to `/`. Handle API errors (error toast or map field errors to form). Prevent double submission via `isSubmitting` state.
- **Deliverable**: Full create ticket flow.
- **Verify**: Valid submission creates ticket and redirects; errors display correctly; double-click prevented.

### Task 5.4: Write create ticket feature tests
- **Traces to**: Design §11
- **Description**: Test CreateTicketPage: renders form, validates required fields on blur, validates max length, submits valid form (mocked API), shows toast and redirects, handles API error (400), prevents double submission.
- **Deliverable**: Test suite for create feature.
- **Verify**: All tests pass; covers AC-1.1 through AC-1.10.

---

## Checkpoint 6: Ticket Detail & Updates

### Task 6.1: Create StatusTransitionControl component
- **Traces to**: REQ-4 (AC-4.2), REQ-6, Design §5
- **Description**: Build using Chakra `ButtonGroup` with `Button` for each valid next status (from `getValidTransitions`). Hidden/disabled for Closed tickets. Uses `ConfirmModal` (Chakra Modal) before executing status change. `Button isLoading` during mutation.
- **Deliverable**: Status update control with state machine enforcement.
- **Verify**: Only valid transitions shown; Closed shows nothing; confirmation required; loading state works.

### Task 6.2: Create TicketDetailPage
- **Traces to**: REQ-2 (AC-2.3, AC-2.4), REQ-4, Design §5
- **Description**: Compose using Chakra `Stack direction={{ base: "column", lg: "row" }}`. Main content (`Box flex={1}`): `Heading` (title), `Text` (description), StatusTransitionControl. Sidebar (`Box w={{ base: "100%", lg: "300px" }}`): StatusBadge, PrioritySelect, CategorySelect, metadata texts (dates). Uses `useTicket(id)` + `useUpdateTicket()`. Handles loading (Skeleton), error (ErrorState), and 404 states.
- **Deliverable**: Full ticket detail page with responsive two-column layout and inline editing.
- **Verify**: All fields display; status change works; priority/category editable; 404 handled; toasts shown.

### Task 6.3: Handle 404 / ticket not found
- **Traces to**: REQ-2 (AC-2.10), REQ-4 (AC-4.7)
- **Description**: When `useTicket` returns 404, display a "Ticket not found" message with a link back to the list. Style consistently with ErrorState component.
- **Deliverable**: Graceful not-found handling on detail page.
- **Verify**: Navigating to `/tickets/nonexistent` shows not-found message.

### Task 6.4: Write ticket detail feature tests
- **Traces to**: Design §11
- **Description**: Test TicketDetailPage with mocked API: renders ticket details, shows correct status transition options per state, updates status on click (after confirm), handles invalid transition error, updates priority/category, handles 404, shows loading state.
- **Deliverable**: Test suite for detail/update feature.
- **Verify**: All tests pass; covers AC-2.3, AC-2.4, AC-4.1 through AC-4.8.

---

## Checkpoint 7: Polish & Quality

### Task 7.1: Add React Error Boundary
- **Traces to**: Design §9 (Error Boundary)
- **Description**: Add top-level Error Boundary component wrapping the app. Shows friendly fallback with "Something went wrong" message and "Reload" button. Catches unexpected React rendering errors.
- **Deliverable**: No more white-screen crashes.
- **Verify**: Simulating a throw in a component shows fallback; reload button works.

### Task 7.2: Accessibility audit and fixes
- **Traces to**: REQ-8, Design §11
- **Description**: Review all pages for: heading hierarchy, ARIA labels, focus management on route change, color contrast, touch targets, keyboard-only navigation flow. Fix any issues found.
- **Deliverable**: App meets WCAG 2.1 AA baseline checks.
- **Verify**: Tab through entire app; all controls reachable; focus visible; no contrast failures.

### Task 7.3: Responsive testing and fixes
- **Traces to**: REQ-7 (UI-4), Design §10
- **Description**: Test all pages at mobile (375px), tablet (768px), and desktop (1024px+) widths. Fix any layout breaks, overflow, or touch target issues.
- **Deliverable**: App works cleanly across all breakpoints.
- **Verify**: No horizontal scroll; content readable; touch targets adequate on mobile.

### Task 7.4: Run full test suite and fix failures
- **Traces to**: Design §11
- **Description**: Run all frontend and backend tests. Fix any failures. Ensure coverage meets priorities (state machine, validation, API contracts, components).
- **Deliverable**: Green test suite.
- **Verify**: `npm run test` passes in both frontend and backend.

### Task 7.5: Lint, format, and final cleanup
- **Traces to**: REQ-9 (NFR-4), Design §12
- **Description**: Run ESLint and Prettier across entire codebase. Fix any warnings/errors. Remove unused imports, dead code, and TODO comments. Ensure no `console.log` in production code.
- **Deliverable**: Clean, production-ready codebase.
- **Verify**: `npm run lint` shows zero errors/warnings; `npm run format:check` passes.

### Task 7.6: Verify all acceptance criteria
- **Traces to**: All REQs, `docs/acceptance-criteria.md`
- **Description**: Walk through every acceptance criterion in `docs/acceptance-criteria.md` and verify it passes. Document any deviations or known limitations.
- **Deliverable**: Acceptance criteria checklist complete.
- **Verify**: All 12 top-level criteria from requirements met; Given-When-Then scenarios confirmed.

### Task 7.7: Update README with setup instructions
- **Traces to**: Project documentation
- **Description**: Update `README.md` with: project description, tech stack, prerequisites (Node.js version), installation steps, how to run dev environment, how to run tests, project structure overview.
- **Deliverable**: New developer can set up the project from README alone.
- **Verify**: Follow README steps from scratch on clean environment; app runs.
