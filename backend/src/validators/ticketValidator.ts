import { z } from 'zod';

/**
 * Validation schema for creating a ticket.
 * Title and description are required with max length constraints.
 * Status is NOT accepted — always defaults to OPEN on the server.
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
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

/**
 * Validation schema for updating ticket status.
 * Status must be one of the valid enum values.
 */
export const updateStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
    message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED',
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
    .enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
      message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED',
    })
    .optional(),
});

export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
