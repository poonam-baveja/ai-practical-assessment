# Prompt History

## Overview

This project was developed using an iterative AI-assisted workflow with **Kiro**. Instead of asking AI to generate the complete application in one step, development was divided into small, focused prompts covering planning, design, implementation, debugging, and documentation.

Each AI response was reviewed manually before being accepted. Several generated solutions were refined or simplified to keep the project aligned with the assessment requirements.

---

# Phase 1 – Project Planning

## Objective

Define the project requirements before writing any code.

### Prompt

> I am building a Support Ticket Management System for an AI capability assessment. This project will be React + TypeScript frontend, Express + TypeScript backend, Prisma with SQLite database. I want to follow Spec-Driven Development. Help me create the project requirements first before generating any code.

### Outcome

Generated:

- Project requirements
- Functional requirements
- Non-functional requirements
- Initial data model
- API overview

### Manual Changes

Reduced the project scope by removing:

- Dashboard
- Activity Log
- Comments
- Advanced sorting

This kept the project focused on the assessment objectives.

---

# Phase 2 – System Design

## Objective

Create the architecture before implementation.

### Prompt

> Based on the approved requirements, create the technical design for the application without generating implementation code.

### Outcome

Generated:

- Frontend architecture
- Backend layered architecture
- Folder structure
- API contracts
- Component hierarchy
- State management strategy

### Manual Changes

- Switched from Tailwind CSS to Chakra UI.
- Simplified the architecture to avoid unnecessary abstraction.

---

# Phase 3 – Project Structure

## Objective

Generate the recommended project structure.

### Prompt

> Based on the approved design, generate the recommended frontend and backend folder structure only. Include folders, key files, and responsibilities. Do not generate implementation code.

### Outcome

Generated:

- Feature-based React structure
- Layered Express structure
- Theme directory
- Shared services
- Project organization

### Manual Changes

Removed unnecessary folders and kept the structure minimal.

---

# Phase 4 – Backend Development

## Objective

Build the REST API incrementally.

### Prompts

Examples included:

- Create the Express server entry point.
- Implement GET /api/tickets.
- Implement POST /api/tickets.
- Implement PATCH /api/tickets/:id/status.
- Add search and status filtering.

### Outcome

Implemented:

- Health endpoint
- Ticket CRUD (required endpoints)
- Status transition validation
- Search
- Filtering

### Manual Validation

Every endpoint was tested locally before moving to the next feature.

---

# Phase 5 – Frontend Development

## Objective

Implement each screen independently.

### Prompts

Examples included:

- Create the Ticket List page.
- Implement the Create Ticket page.
- Implement the Ticket Detail page.
- Implement Ticket Status Update.
- Add Search and Filter.

### Outcome

Implemented:

- Ticket List
- Create Ticket
- Ticket Details
- Status Update
- Search
- Filter

### Manual Changes

- Improved component organization.
- Simplified generated code.
- Replaced unsupported Chakra UI APIs with compatible components where required.

---

# Phase 6 – Debugging

## Objective

Resolve issues encountered during development.

### Issues Addressed

- Prisma configuration errors
- Prisma migration setup
- Workspace configuration
- Chakra UI compatibility issues
- React runtime errors
- API integration
- React Query cache invalidation

### Approach

AI was used to suggest possible solutions, while each fix was manually verified before being committed.

---

# Phase 7 – Documentation

## Objective

Document the project and development process.

### Prompts

Examples included:

- Generate the README.
- Create AI usage documentation.
- Create architecture documentation.
- Summarize the development journey.

### Outcome

Produced documentation describing:

- Project overview
- Architecture
- Development process
- AI usage
- Technical decisions

---

# AI Collaboration Approach

The following workflow was followed throughout the project:

1. Define requirements.
2. Review AI output.
3. Refine the scope if necessary.
4. Generate implementation for a single feature.
5. Review generated code.
6. Test locally.
7. Fix issues.
8. Commit changes.
9. Move to the next feature.

This iterative approach ensured that AI accelerated development without replacing manual engineering decisions.

---

# Key Lessons

- Breaking work into small prompts produced better quality results than requesting complete features.
- Reviewing every AI-generated change prevented unnecessary complexity.
- Keeping the project aligned with the original requirements resulted in a cleaner and more maintainable solution.
- Manual validation remained essential despite extensive AI assistance.