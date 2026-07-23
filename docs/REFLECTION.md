# Reflection

## Overview

This project was my first end-to-end application developed using a structured AI-assisted workflow with **Kiro** and Spec-Driven Development (SDD). Rather than using AI to generate the entire application in a single step, I used it as a development assistant throughout the project lifecycle while retaining ownership of the architecture, implementation decisions, debugging, and validation.

---

# What Went Well

## 1. Spec-Driven Development

Following a spec-first approach kept development organized. Having requirements, acceptance criteria, and a design document before writing code reduced rework and kept the scope controlled.

## 2. Incremental Development

Building one feature at a time and validating before moving on kept the project stable:

1. Project Setup
2. Ticket List (GET)
3. Create Ticket (POST)
4. Ticket Detail (GET by ID)
5. Status Updates (PATCH + state machine)
6. Search & Filter
7. Priority & User Assignment
8. Comments
9. Edit Ticket (PUT)
10. Dashboard
11. Integration Tests
12. Documentation

## 3. Frontend-Focused Architecture

The project emphasizes frontend quality:

- Feature-based folder structure
- Chakra UI component library
- TanStack Query for server state with cache invalidation
- React Hook Form with Zod validation
- Loading, empty, and error states on every page
- Toast notifications for all actions
- Responsive layout

## 4. Comprehensive Testing

The project includes 90 automated tests (75 backend + 15 frontend) covering:

- All API endpoints (happy path + validation + edge cases)
- Status state machine (all valid + invalid transitions)
- Frontend components (TicketFilters interaction)
- Utility functions (formatDate, status machine)

---

# Challenges Encountered

## Chakra UI v3 Compatibility

The most significant challenge was Chakra UI v3's compound component pattern. Multiple components (`Field`, `NativeSelect`, `Toaster`) crashed at runtime with "children is not a function" errors.

**Resolution:** Replaced compound components with plain Chakra primitives (`Box`, `Text`, `Input`) and native HTML elements (`<select>`). Created a custom `ToasterComponent` with explicit render function.

**Lesson:** Always verify generated code against the actual installed library version.

## Prisma in Monorepo

Configuring Prisma in a separate `database/` workspace required careful setup of `DATABASE_URL` paths and a `postinstall` script for client generation.

## Zod v4 Breaking Changes

Zod v4 removed the `required_error` parameter. AI-generated code used the v3 API and failed to compile. Fixed by using `.min(1, 'message')` pattern instead.

## Test Isolation

Integration tests initially failed when run in parallel because `reseedDatabase()` in one file wiped data used by another. Fixed with `fileParallelism: false` and dynamic user ID fetching.

---

# Lessons Learned

## Small, Focused Prompts Produce Better Results

Requesting one endpoint, one page, or one component at a time produced more accurate code than broad requests. The AI performed best with clear, constrained tasks.

## Human Review Is Non-Negotiable

Every AI-generated file required at least one review pass. Common issues caught during review:

- Chakra v3 API incompatibilities
- Incorrect import paths
- Missing `Flex` import causing runtime crash
- Hardcoded test data that broke after database reseeds

## Clear Requirements Reduce Ambiguity

Having acceptance criteria before implementation made it easy to verify each feature. The Given-When-Then format mapped directly to test assertions.

---

# What I Would Improve

Given additional time:

- Pagination for large datasets
- Sorting (by date, priority, status)
- User authentication and role-based access
- Higher frontend test coverage (page-level integration tests with msw)
- Dark mode support
- Activity log / audit trail
- CI/CD pipeline
- Docker support

---

# Overall Experience

AI-assisted development with Kiro significantly reduced time spent on boilerplate, configuration, and repetitive code. The spec-driven approach ensured the AI worked within defined boundaries rather than generating unconstrained output.

The key insight: AI is most effective when given clear context, small tasks, and when its output is reviewed before acceptance. The quality of the final application depends on the developer's ability to guide the AI, catch errors, and make architectural decisions that keep the codebase simple and maintainable.
