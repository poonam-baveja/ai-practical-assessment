/**
 * Ticket feature types.
 * Shared across components, hooks, and services within this feature.
 */

export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  ticketId: number;
  message: string;
  createdAt: string;
}
