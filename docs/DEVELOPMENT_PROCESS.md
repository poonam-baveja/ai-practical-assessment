# Development Process

## Overview

The Support Ticket Management System was developed using an iterative, AI-assisted workflow with **Kiro** following a **Spec-Driven Development (SDD)** approach.

Instead of generating the complete application at once, the project was built incrementally through well-defined phases. Each phase was completed, reviewed, and validated before moving to the next, ensuring the implementation remained aligned with the project requirements.

---

# Development Journey

## Phase 1: Requirement Analysis

The project began by analyzing the assessment requirements and identifying the core functionality needed for a Support Ticket Management System.

### Activities

- Reviewed assessment objectives.
- Defined project scope.
- Identified core user flows.
- Removed non-essential features to keep the project focused.

### Scope Decisions

Included:

- Create Ticket
- View Ticket List
- Ticket Details
- Update Ticket Status
- Search Tickets
- Filter by Status

Excluded:

- Authentication
- Comments
- Activity Log
- Dashboard
- Notifications
- File Uploads
- Advanced Sorting

---

## Phase 2: Acceptance Criteria

Detailed acceptance criteria were created for every functional requirement using the Given–When–Then format.

This helped define expected behaviour before implementation began.

Examples included:

- Ticket creation validation
- Status transition rules
- Search behaviour
- Filtering behaviour
- Error handling

---

## Phase 3: System Design

A technical design document was prepared before writing any implementation code.

The design included:

- Overall architecture
- Folder structure
- API contracts
- Data model
- Component hierarchy
- State management strategy
- Validation approach

### Key Architectural Decisions

Frontend:

- React
- TypeScript
- Chakra UI
- TanStack Query
- React Hook Form
- Zod

Backend:

- Express
- TypeScript
- Prisma
- SQLite

---

## Phase 4: Project Setup

The repository was initialized using a monorepo structure.

### Setup Activities

- Created frontend workspace
- Created backend workspace
- Created database workspace
- Configured Vite
- Configured Express
- Configured Prisma
- Configured SQLite
- Installed project dependencies

---

## Phase 5: Backend Development

The backend was implemented using a layered architecture.

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Prisma
```

### Completed Features

- Health endpoint
- Ticket listing
- Create ticket
- Ticket details
- Update ticket status
- Search
- Status filtering

### Validation

- Zod request validation
- HTTP status handling
- Error responses
- Business rule validation

---

## Phase 6: Database Development

Prisma ORM was used with SQLite.

### Database Model

Ticket

- Id
- Title
- Description
- Status
- CreatedAt
- UpdatedAt

### Additional Work

- Database migration
- Seed data
- Prisma Client generation

---

## Phase 7: Frontend Development

The frontend followed a feature-based architecture.

```
features/
    tickets/
        components/
        hooks/
        pages/
        services/
```

### Completed Screens

- Ticket List
- Create Ticket
- Ticket Details

### Shared Features

- React Query
- Axios API layer
- Chakra UI theme
- Loading states
- Error states
- Toast notifications

---

## Phase 8: Status Management

Ticket lifecycle rules were implemented to ensure valid state transitions.

Allowed transitions:

```
OPEN
   ↓
IN_PROGRESS
   ↓
RESOLVED
   ↓
CLOSED
```

Invalid transitions are rejected by the backend and surfaced to the user with appropriate error messages.

---

## Phase 9: Search & Filtering

Search and filtering were implemented using server-side queries.

### Features

- Search by title
- Search by description
- Filter by status
- Debounced search input
- Backend filtering using Prisma

The frontend delegates filtering to the backend rather than performing client-side filtering.

---

## Phase 10: Testing & Validation

Each feature was manually verified after implementation.

Validation included:

- API endpoint testing
- Database verification
- Form validation
- Error scenarios
- Status transitions
- Search behaviour
- Filter behaviour

Frontend functionality was verified using browser testing and backend endpoints were tested through the running application.

---

# Development Timeline

```
Requirement Analysis
        ↓
Acceptance Criteria
        ↓
System Design
        ↓
Project Setup
        ↓
Backend Development
        ↓
Database Integration
        ↓
Frontend Development
        ↓
Status Update
        ↓
Search & Filtering
        ↓
Testing & Validation
        ↓
Documentation
```

---

# Challenges Encountered

During development several technical issues were identified and resolved.

Examples include:

- Prisma configuration issues
- Workspace setup
- Database migration configuration
- Chakra UI compatibility issues
- React runtime errors
- API integration
- React Query cache invalidation

Each issue was resolved through iterative debugging and manual verification before continuing development.

---

# Outcome

Following a phased development process resulted in:

- A clean and maintainable architecture
- Incremental feature delivery
- Easier debugging
- Better alignment with requirements
- Continuous validation throughout the project

The final application satisfies the core functional requirements while maintaining a simple, frontend-focused implementation suitable for the assessment.