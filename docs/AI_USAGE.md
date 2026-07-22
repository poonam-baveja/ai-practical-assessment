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
- Remove unnecessary enterprise features.
- Limit the scope to assignment requirements.
- Keep the application simple and maintainable.

Examples of manual refinements:

- Removed Activity Log.
- Removed Dashboard.
- Removed Comments.
- Removed Sorting.
- Focused only on core ticket management features.

---

## 2. System Design

Kiro assisted in generating the technical design including:

- React feature-based architecture
- Express layered architecture
- API structure
- Folder organization
- Data model
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
- Prisma integration
- Zod validation

### Frontend

- React components
- React Query hooks
- API service layer
- Chakra UI forms
- Ticket pages
- Status update flow
- Search and filter implementation

Each generated implementation was reviewed and tested before being accepted.

---

## 4. Manual Technical Decisions

Several AI suggestions were intentionally modified or rejected.

Examples include:

### UI Library

AI initially suggested Tailwind CSS.

The project was changed to **Chakra UI** to match my frontend expertise and maintain consistency.

### Project Scope

The initial design included:

- Dashboard
- Activity Log
- Comments
- Advanced Sorting

These features were removed to keep the project focused on the assessment objectives.

### Architecture

The generated architecture was simplified by:

- Avoiding unnecessary abstraction layers
- Keeping controllers and services lightweight
- Avoiding over-engineering

---

## 5. Debugging

AI assisted in troubleshooting several implementation issues.

Examples include:

- Prisma configuration issues
- Prisma migration setup
- Workspace configuration
- Chakra UI version compatibility
- React runtime errors
- API integration
- React Query cache invalidation

All fixes were manually validated before being committed.

---

## 6. Validation

Generated code was verified by:

- Running the application locally
- Testing backend endpoints
- Verifying database operations
- Reviewing generated code
- Removing unnecessary complexity
- Ensuring feature completeness

AI-generated code was never accepted without review.

---

# Human Oversight

Although AI accelerated development, the following responsibilities remained manual:

- Requirement refinement
- Architecture decisions
- Technology selection
- Code review
- Debugging
- Testing
- Final implementation decisions
- UI/UX improvements

---

# Benefits of AI-Assisted Development

Using Kiro significantly improved development productivity by:

- Reducing boilerplate code
- Accelerating API development
- Generating initial project structure
- Assisting with documentation
- Providing implementation guidance
- Helping identify configuration issues

This allowed more time to focus on architecture, frontend implementation, and overall user experience.

---

# Conclusion

AI was used as a development assistant rather than an autonomous code generator. Every major architectural decision, implementation review, and debugging activity involved manual validation to ensure the final solution remained simple, maintainable, and aligned with the assessment requirements.