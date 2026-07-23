/**
 * Ticket feature types.
 * Shared across components, hooks, and services within this feature.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  createdBy: User | null;
  assignedTo: User | null;
}

export interface Comment {
  id: number;
  ticketId: number;
  message: string;
  createdAt: string;
  createdById: number | null;
  createdBy: User | null;
}
