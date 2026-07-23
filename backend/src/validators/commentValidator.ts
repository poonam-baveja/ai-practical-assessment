import { z } from 'zod';

/**
 * Validation schema for creating a comment.
 *
 * Rules:
 * - message: required, 1–1000 characters
 * - createdById: optional, must be a positive integer if provided
 */
export const createCommentSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be 1000 characters or fewer'),
  createdById: z
    .number({ message: 'createdById must be a number' })
    .int('createdById must be an integer')
    .positive('createdById must be a positive integer')
    .optional()
    .nullable(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
