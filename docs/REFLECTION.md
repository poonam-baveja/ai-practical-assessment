# Reflection

## Overview

This project was my first end-to-end application developed using a structured AI-assisted workflow with **Kiro** and Spec-Driven Development (SDD). Rather than using AI to generate the entire application in a single step, I used it as a development assistant throughout the project lifecycle while retaining ownership of the architecture, implementation decisions, debugging, and validation.

The project demonstrates how AI can improve developer productivity while still requiring engineering judgement to produce a maintainable solution.

---

# What Went Well

## 1. Spec-Driven Development

One of the biggest successes of this project was following a Spec-Driven Development approach.

Instead of immediately writing code, I first created:

- Requirements
- Acceptance Criteria
- Design Document
- Folder Structure
- Implementation Tasks

Having these documents available before implementation made development much more organized and reduced unnecessary rework.

---

## 2. Incremental Development

Rather than generating large portions of the application, I implemented one feature at a time.

The development order was:

1. Project Setup
2. Ticket List
3. Create Ticket
4. Ticket Details
5. Update Ticket Status
6. Search & Filter

Completing and validating each feature before moving to the next helped keep the project stable throughout development.

---

## 3. Frontend-Focused Architecture

Since my professional experience is primarily in frontend development, I intentionally designed the project to emphasize frontend architecture and user experience.

Key frontend decisions included:

- Feature-based folder structure
- Chakra UI component library
- TanStack Query for server state
- React Hook Form with Zod validation
- Reusable UI components
- Responsive layouts
- Loading and error states

This approach aligns with my experience while still providing a complete full-stack solution.

---

# Challenges Encountered

## Prisma Configuration

One of the first challenges was configuring Prisma within a separate database workspace.

I encountered issues related to:

- Prisma configuration
- Client generation
- Database migration
- Workspace setup

Resolving these issues improved my understanding of how Prisma integrates into a monorepo project.

---

## Chakra UI Compatibility

During frontend implementation, I encountered compatibility issues between generated code and the installed version of Chakra UI.

Examples included:

- Unsupported `toaster` API
- Component usage differences
- Runtime rendering errors

Rather than accepting generated code blindly, I reviewed the implementation and replaced unsupported patterns with compatible Chakra UI components.

---

## Keeping the Project Simple

AI often suggested additional features such as:

- Dashboard
- Comments
- Activity Log
- Advanced Sorting
- Complex abstractions

While these ideas were technically valid, they were outside the scope of the assessment.

A conscious decision was made to keep the application focused on the required functionality instead of adding unnecessary complexity.

---

# Lessons Learned

## AI Is Most Effective with Small Prompts

The quality of AI-generated output improved significantly when requests were broken into small, focused tasks.

Instead of asking AI to build an entire application, I requested:

- One API endpoint
- One React page
- One feature
- One document

This resulted in more accurate and maintainable code.

---

## Human Review Is Essential

AI accelerated development considerably, but every generated solution still required manual review.

Examples included:

- Reviewing architecture decisions
- Simplifying generated code
- Fixing compatibility issues
- Validating business rules
- Testing functionality

This reinforced that AI works best as an assistant rather than a replacement for engineering judgement.

---

## Importance of Clear Requirements

The project highlighted the value of spending time on requirements and design before implementation.

Having clear requirements reduced ambiguity and made implementation more predictable.

---

# What I Would Improve

Given additional time, I would extend the project with:

- Pagination for large datasets
- Automated unit and integration tests
- Authentication and authorization
- Ticket comments
- Activity history
- CI/CD pipeline
- Docker support
- Deployment to a cloud platform

These improvements would make the application more production-ready while preserving the existing architecture.

---

# Overall Experience

This project provided practical experience in combining AI-assisted development with traditional software engineering practices.

Using Kiro significantly reduced the time required for project scaffolding, repetitive implementation tasks, and documentation. However, the quality of the final application depended on careful planning, continuous validation, and iterative refinement.

The experience reinforced that successful AI-assisted development is not about generating large amounts of code quickly, but about collaborating with AI effectively while maintaining responsibility for technical decisions and software quality.