# AI Usage Summary

## Overview

This project was developed using an AI-assisted workflow with **Kiro** as the primary development tool. Rather than generating the complete application at once, I followed a **Spec-Driven Development** approach where requirements, design, implementation, and validation were completed in incremental phases.

The AI was used to accelerate development, generate boilerplate code, and assist with documentation, while all architectural decisions, code reviews, debugging, and final validation were performed manually.

---

# AI Tool Used

- **Primary Tool:** Kiro (Licensed Desktop Version)
- **Development Style:** Spec-Driven Development
- **AI Usage:** Planning, implementation, debugging assistance, documentation, and code review

---

# Development Workflow

The project was built in the following sequence:

1. Requirement Analysis
2. Acceptance Criteria
3. Technical Design
4. Project Structure
5. Backend Development
6. Frontend Development
7. Testing & Debugging
8. Documentation

Each phase was completed before moving to the next to keep the implementation aligned with the original requirements.

---

# How AI Was Used

## 1. Requirement Analysis

Kiro was used to create the initial project requirements document based on the assessment.

The generated requirements were manually refined to:

- Keep the project frontend-focused.
- Limit the scope to assignment requirements.
- Keep the application simple and maintainable.
- Start with core features, then incrementally add extras (comments, dashboard).

Examples of manual refinements:

- Removed Activity Log.
- Removed Advanced Sorting.
- Simplified the initial scope to core ticket CRUD + status workflow.
- Added Comments and Dashboard as the project progressed.

---

## 2. System Design

Kiro assisted in generating the technical design including:

- React feature-based architecture
- Express layered architecture
- API structure
- Folder organization
- Data model (User, Ticket, Comment)
- UI flow

The design was reviewed manually before implementation.

---

## 3. Code Generation

AI was used to generate boilerplate code for:

### Backend

- Express server setup
- Route structure
- Controllers
- Services
- Prisma integration (User, Ticket, Comment models)
- Zod validation
- Status state machine
- Integration tests (Supertest)

### Frontend

- React components
- React Query hooks
- API service layer
- Chakra UI forms
- Ticket pages (Dashboard, List, Create, Detail, Edit)
- Status update flow
- Search and filter implementation
- Comment section
- Frontend unit tests

Each generated implementation was reviewed and tested before being accepted.

---

## 4. Manual Technical Decisions

Several AI suggestions were intentionally modified or rejected.

Examples include:

### UI Library

AI initially suggested Tailwind CSS.

The project was changed to **Chakra UI** to match my frontend expertise and maintain consistency.

### Architecture

The generated architecture was simplified by:

- Avoiding unnecessary abstraction layers
- Keeping controllers and services lightweight
- Avoiding over-engineering
- Using native `<select>` elements instead of Chakra compound components (due to runtime bugs)

### Chakra UI v3 Issues

Multiple Chakra v3 compound components crashed at runtime. These were manually replaced with simpler alternatives:

- `Field.Root` / `Field.Label` → plain `Box` + `Text`
- `NativeSelect` → native `<select>` elements
- `Toaster` → custom component with explicit render function

---

## 5. Debugging

AI assisted in troubleshooting several implementation issues.

Examples include:

- Prisma configuration in monorepo
- Zod v4 API changes (removed `required_error`)
- Chakra UI v3 "children is not a function" errors
- Toast notification rendering
- React Query cache invalidation
- Test parallelism race conditions

All fixes were manually validated before being committed.

---

## 6. Testing

AI generated the test suite:

- **Backend:** 75 integration tests using Vitest + Supertest
- **Frontend:** 15 unit/component tests using Vitest + React Testing Library

Tests were reviewed, run, and debugged iteratively (e.g., fixing hardcoded user IDs, adding sequential file execution).

---

# Human Oversight

Although AI accelerated development, the following responsibilities remained manual:

- Requirement refinement
- Architecture decisions
- Technology selection (Chakra UI over Tailwind)
- Code review
- Debugging Chakra v3 runtime issues
- Testing
- Final implementation decisions
- UI/UX improvements

---

# Conclusion

AI was used as a development assistant rather than an autonomous code generator. Every major architectural decision, implementation review, and debugging activity involved manual validation to ensure the final solution remained simple, maintainable, and aligned with the assessment requirements.
