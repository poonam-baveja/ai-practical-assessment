# Prompt History — AI-Assisted Development Log

Chronological record of every AI interaction used to build this project. Documents what was prompted, what worked, what failed, and what required human intervention.

---

## 1. Project Initialization

**Prompt:** "initialize my new repo with README.md and .gitignore"

- **AI Response:** Created README.md with project template and .gitignore covering Node, Python, IDE files, OS files.
- **Issues:** None.
- **Accepted:** Both files as-is.
- **Outcome:** Clean repo foundation.

---

## 2. Folder Structure

**Prompt:** "add folders at the top level: frontend/ backend/ database/ docs/ ai-prompts/ tool-specific/ tests/"

- **AI Response:** Created all 7 directories with .gitkeep files.
- **Accepted:** All folders.
- **Outcome:** Monorepo structure established.

---

## 3. Requirements Document

**Prompt:** "I am building a Support Ticket Management System for an AI capability assessment..."

- **AI Response:** Generated comprehensive requirements.md with FR-1 through FR-6, NFR-1 through NFR-4, data model, API endpoints, and acceptance criteria.
- **Refinement Prompt:** "Review the current requirements document and simplify it to align with the assessment's Core requirements. Remove unnecessary features like ActivityLog..."
- **Changes:** Removed ActivityLog, moved sorting/dashboard to Future Enhancements, expanded frontend UX requirements, added status state machine section.
- **Outcome:** Focused, assessment-appropriate requirements.

---

## 4. Acceptance Criteria

**Prompt:** "Based on the approved requirements, generate a detailed acceptance-criteria.md..."

- **AI Response:** Generated Given-When-Then format criteria for all FRs plus cross-cutting UI/backend/testing sections.
- **Accepted:** As-is.
- **Outcome:** 12 top-level criteria with detailed sub-criteria.

---

## 5. Design Document

**Prompt:** "Based on the approved requirements and acceptance criteria, act as a Senior Software Architect. Create a comprehensive design document..."

- **AI Response:** Generated 13-section design document with architecture, component hierarchy, state management, etc.
- **Refinement:** User requested Tailwind → Chakra UI replacement.
- **Further Refinement:** "Update the frontend architecture to use Chakra UI instead of Tailwind CSS. Follow Chakra UI best practices..."
- **Changes:** Complete rewrite of styling strategy, responsive approach, component patterns to align with Chakra UI v3.
- **Outcome:** Chakra UI-native design with ChakraProvider, responsive props, theme tokens approach.

---

## 6. Kiro Specs

**Prompt:** "Based on the approved requirements, acceptance criteria, and design documents, generate Kiro spec documents..."

- **AI Response:** Created requirements.md, design.md, and tasks.md in tool-specific/kiro-specs/.
- **Accepted:** All three files.
- **Outcome:** 37 tasks across 7 checkpoints with traceability.

---

## 7. Folder Structure Refinements

**Prompt:** "Make few changes: Don't Create a Separate filters Feature... Keep the Project Small... 3 screens... 2 tables"

- **AI Response:** Simplified to single `features/tickets/` module with all components, removed separate filters feature, reduced to Ticket + Comment tables.
- **Further Refinements:** "rename services to api" → renamed `features/tickets/services/` to `features/tickets/api/`.
- **Outcome:** Lean feature-based structure.

---

## 8. Backend Setup

**Prompt:** "Help me configure an Express TypeScript backend... create only the minimal files needed..."

- **AI Response:** Created package.json, tsconfig.json, app.ts, server.ts, .env.
- **Refinement:** "Create this folder structure under backend..." — separated app.ts from server.ts for testability.
- **Further:** "I don't need timestamps, so remove from health check" → simplified to `{ status: 'ok' }`.
- **Outcome:** Minimal Express server with health endpoint.

---

## 9. Prisma Schema

**Prompt:** "Help me design only the Prisma schema... Only two models: Ticket, Comment..."

- **AI Response:** Created schema with Status enum, Ticket and Comment models.
- **Issue:** Generated `String @id @default(cuid())` initially.
- **Refinement:** "I want id Int @id @default(autoincrement())" → switched to integer IDs.
- **Outcome:** Clean 2-table schema with autoincrement IDs.

---

## 10. Seed Script

**Prompt:** "Help me create a simple Prisma seed script. Create 5 sample tickets..."

- **AI Response:** Created seed.ts with 5 tickets across all statuses and 3 comments.
- **Accepted:** As-is, ran successfully.
- **Outcome:** Idempotent seed with realistic data.

---

## 11. Frontend Shell

**Prompt:** "Help me implement the frontend application shell..."

- **AI Response:** Created theme, providers, layout components, placeholder pages, routes.
- **Refinements Applied:**
  - "features/tickets/ expand to components/, hooks/, pages/, services/, types.ts, index.ts"
  - "change shared/layouts/ to components/layout/"
  - "Keep shared only for reusable utilities"
  - "Remove default Vite assets"
  - "Add API layer: src/services/api.ts"
- **Outcome:** Clean feature-based frontend shell.

---

## 12. Ticket API Layer + Hook

**Prompt:** "Help me implement only the Ticket API layer... only one function: getTickets()"

- **AI Response:** Created ticketApi.ts with typed getTickets().
- **Next Prompt:** "Help me implement only the useTickets hook..."
- **AI Response:** Created useTickets.ts with TanStack Query.
- **Accepted:** Both as-is.
- **Outcome:** Clean API → Hook → Component data flow.

---

## 13. Ticket List Page

**Prompt:** "Help me implement only the TicketListPage..."

- **AI Response:** Table with loading/empty/error states.
- **Refinement Prompt:** "Do small improvements: increase page width, add Create Ticket button, make rows clickable, add hover, add empty state icon"
- **Accepted:** All improvements applied.
- **Outcome:** Responsive table with all UI states.

---

## 14. POST /api/tickets

**Prompt:** "Help me implement only POST /api/tickets... Validate request using Zod..."

- **AI Response:** Created validator, service, controller, route.
- **Issue:** Zod v4 doesn't support `required_error` parameter — TypeScript compilation failed.
- **Fix:** AI detected the error and switched to `.min(1, 'Title is required')` pattern.
- **Outcome:** Working ticket creation with validation.

---

## 15. Create Ticket Page

**Prompt:** "Help me implement the Create Ticket page... React Hook Form, Zod, Chakra UI..."

- **AI Response:** Created form with validation, toast, navigation.
- **Issue:** `toaster` import from `@chakra-ui/react` caused runtime error: "does not provide an export named 'toaster'"
- **Refinement:** "Update CreateTicketPage to use the correct toast API for Chakra UI 3.36.1"
- **Fix:** Created `createToaster()` instance + `<Toaster>` component with render function.
- **Further Issue:** Blank page with "children is not a function" error.
- **Root Cause:** Chakra v3's `<Toaster>` requires a render-prop pattern for toast content.
- **Fix:** Created `ToasterComponent.tsx` with explicit `{(toast) => <ToastRoot>...` render function.
- **Further Issue:** Toast stuck to top-right, cut off.
- **Fix:** Added `offsets` to createToaster config.
- **Manual Change:** User requested "submit → button loading → success toast → navigate" flow (added setTimeout before navigate).
- **Outcome:** Working form with proper toast notifications.

---

## 16. Chakra UI v3 Compatibility Issues

**Recurring Issue:** Multiple Chakra v3 compound components crashed at runtime with "children is not a function":
- `Field.Root` / `Field.Label` / `Field.ErrorText`
- `NativeSelect.Root` / `NativeSelect.Field`
- `Toaster` (without render function)

**Resolution Pattern:** Replaced all compound components with:
- Plain `<Box>` + `<Text>` for form fields
- Native `<select>` elements for dropdowns
- Custom `ToasterComponent` with explicit render function

**Lesson:** Chakra UI v3's compound component API is unstable in this version. Basic primitives (`Box`, `Flex`, `Stack`, `Input`, `Button`, `Badge`) work reliably.

---

## 17. Backend Response Format

**Prompt (User Suggestion):** "instead of { data: {...} } keep responses consistent... flat arrays and objects"

- **AI Response:** Updated controller to return flat `[...]` for lists and `{...}` for singles.
- **Updated:** Frontend API layer to use `response.data` directly instead of `response.data.data`.
- **Outcome:** Simpler, consistent API contract.

---

## 18. Status State Machine

**Prompt:** "Help me implement only the PATCH /api/tickets/:id/status endpoint..."

- **AI Response:** Created statusMachine.ts, validator, service, controller, route.
- **Later Refinement:** "add cancelled status" → added CANCELLED to both backend and frontend state machines.
- **Transition Rules:** OPEN→[IN_PROGRESS, CANCELLED], IN_PROGRESS→[RESOLVED, CANCELLED], RESOLVED→[CLOSED], CLOSED→[], CANCELLED→[]
- **Outcome:** Enforced lifecycle with terminal states.

---

## 19. Search & Filtering

**Prompt:** "Help me implement search and status filtering for GET /api/tickets..."

- **AI Response:** Added Zod query validation, Prisma WHERE clause builder, controller parsing.
- **Frontend Prompt:** "Help me implement search and status filtering on the Ticket List page..."
- **AI Response:** Created TicketFilters component, useDebounce hook, updated useTickets to accept params.
- **Accepted:** All as-is.
- **Outcome:** Server-side search + status filter with 400ms debounce.

---

## 20. User Model & Priority

**Prompt:** "Help me extend the Prisma schema... Add User model, Priority enum, assignedTo, createdBy"

- **AI Response:** Extended schema, ran migration, updated seed.
- **Subsequent Prompts:** Updated backend to include relations in responses, updated frontend types, updated list/detail pages to show priority + assignee.
- **Outcome:** Full relational data model with 3 users, priority levels, assignment.

---

## 21. Comments Feature

**Prompt:** "Help me implement the Ticket Comments backend... GET and POST /api/tickets/:id/comments"

- **AI Response:** Created validator, service, controller, route, registered in app.ts.
- **Frontend:** API layer, hooks (useComments, useCreateComment), CommentList component, AddCommentForm.
- **Integration:** Added comments section to Ticket Detail page.
- **Outcome:** Full comment thread with author attribution.

---

## 22. Edit Ticket

**Prompt:** "Help me implement Update Ticket. PUT /api/tickets/:id..."

- **AI Response:** Backend validator (partial update), service, controller, route.
- **Frontend:** "Help me build the Edit Ticket page..." → API function, mutation hook, form page with pre-filled values.
- **Accepted:** All as-is.
- **Outcome:** Editable tickets with navigation from detail page.

---

## 23. Dashboard

**Prompt:** "Help me implement a lightweight dashboard... Total, Open, In Progress, Resolved, Closed, Cancelled"

- **AI Response:** Created DashboardPage with StatCard components, responsive grid, reusing existing useTickets hook.
- **Route Change:** Made `/` the dashboard, moved ticket list to `/tickets`.
- **Accepted:** As-is.
- **Outcome:** Overview page with status counts.

---

## 24. Integration Tests

**Prompt:** "Help me set up integration testing for the Express backend..."

- **AI Response:** Installed Vitest + Supertest, created setup.ts with reusable helpers, health smoke test.
- **Subsequent Test Prompts:**
  - "Create integration tests for GET /api/tickets" → 9 tests
  - "Create integration tests for POST /api/tickets" → 11 tests
  - "Create integration tests for PATCH /api/tickets/:id/status" → 13 tests
  - "Create Supertest integration tests for Ticket Comments" → 14 tests
  - "Create Supertest integration tests for PUT /api/tickets/:id" → 15 tests
- **Issue:** Tests failed when run in parallel due to `reseedDatabase()` race conditions.
- **Fix:** Set `fileParallelism: false` in vitest.config.ts.
- **Issue:** Tests using hardcoded `createdById: 1` failed after reseeds (autoincrement doesn't reset).
- **Fix:** Tests now fetch real user IDs via `GET /api/users` dynamically.
- **Refinement Prompt:** "Improve the integration test suite... eliminate duplicated setup, extract helpers, Arrange-Act-Assert"
- **Outcome:** 75 backend tests, all passing.

---

## 25. Frontend Tests

**Prompt:** "Help me add a minimal but meaningful test suite..."

- **AI Response:** Created vitest config, test setup, renderWithProviders utility.
- **Tests:** TicketFilters (7), statusMachine (5), formatDate (3) = 15 frontend tests.
- **Issue:** TicketFilters test needed ChakraProvider wrapper → created renderWithProviders.tsx.
- **Outcome:** 15 frontend tests passing.

---

## 26. UX Polish

**Prompt:** "Help me review the frontend UI and improve the overall user experience..."

- **AI Response:** Improved spacing, visual hierarchy, table responsiveness, hover effects, loading states, form accessibility, button consistency.
- **Issue:** `Flex` not imported in CreateTicketPage → fixed.
- **Outcome:** Production-quality UI across all pages.

---

## 27. Cleanup

**Prompt:** "Remove unused code, file and folder and make it a clean project"

- **AI Response:** Removed 10 .gitkeep files, Vite boilerplate README, empty directories (tests/, ai-prompts/, middleware/, types/). Added root `test` script.
- **Outcome:** Every file has a purpose. Zero dead code.

---

## Summary

| Metric | Count |
|--------|-------|
| Total prompts to AI | ~45 |
| Features implemented | 12 |
| Backend tests | 75 |
| Frontend tests | 15 |
| Runtime issues debugged | 4 (all Chakra v3 related) |
| Files AI-generated | ~60 |
| Manual code changes | ~5 (mostly import fixes) |
| Rejected AI output | 0 files rejected entirely |
| Refined after first attempt | ~8 features |
