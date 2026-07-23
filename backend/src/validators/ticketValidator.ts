import { z } from 'zod';

/**
 * Validation schema for creating a ticket.
 *
 * Rules:
 * - title: required, 1–200 characters
 * - description: required, 1–2000 characters
 * - priority: optional, defaults to MEDIUM if not provided; must be LOW, MEDIUM, or HIGH
 * - assignedToId: optional, must be a positive integer if provided
 * - createdById: optional, must be a positive integer if provided
 * - status: NOT accepted — always forced to OPEN server-side
 */
export const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or fewer'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be 2000 characters or fewer'),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      message: 'Priority must be one of: LOW, MEDIUM, HIGH',
    })
    .optional(),
  assignedToId: z
    .number({ message: 'assignedToId must be a number' })
    .int('assignedToId must be an integer')
    .positive('assignedToId must be a positive integer')
    .optional()
    .nullable(),
  createdById: z
    .number({ message: 'createdById must be a number' })
    .int('createdById must be an integer')
    .positive('createdById must be a positive integer')
    .optional()
    .nullable(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

/**
 * Validation schema for updating ticket status.
 * Status must be one of the valid enum values.
 */
export const updateStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'], {
    message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED',
  }),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

/**
 * Validation schema for GET /api/tickets query parameters.
 * All fields are optional.
 */
export const ticketQuerySchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'], {
      message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED',
    })
    .optional(),
});

export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;

/**
 * Validation schema for updating a ticket (PUT /api/tickets/:id).
 *
 * Rules:
 * - title: optional, 1–200 characters if provided
 * - description: optional, 1–2000 characters if provided
 * - priority: optional, must be LOW, MEDIUM, or HIGH
 * - assignedToId: optional, must be a positive integer or null (unassign)
 *
 * NOT allowed: status, createdById, createdAt — these are managed by dedicated endpoints/system.
 */
export const updateTicketSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or fewer')
    .optional(),
  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .max(2000, 'Description must be 2000 characters or fewer')
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      message: 'Priority must be one of: LOW, MEDIUM, HIGH',
    })
    .optional(),
  assignedToId: z
    .number({ message: 'assignedToId must be a number' })
    .int('assignedToId must be an integer')
    .positive('assignedToId must be a positive integer')
    .optional()
    .nullable(),
});

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
