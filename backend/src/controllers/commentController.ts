import { Request, Response } from 'express';
import { getCommentsByTicketId, createComment, ticketExists } from '../services/commentService';
import { createCommentSchema } from '../validators/commentValidator';

/**
 * Handles GET /api/tickets/:id/comments
 * Returns all comments for a ticket, ordered oldest first.
 */
export const getComments = async (req: Request, res: Response) => {
  const ticketId = Number(req.params.id);

  if (isNaN(ticketId)) {
    res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Ticket ID must be a number',
    });
    return;
  }

  try {
    // Check ticket exists
    const exists = await ticketExists(ticketId);
    if (!exists) {
      res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: `Ticket with ID ${ticketId} not found`,
      });
      return;
    }

    const comments = await getCommentsByTicketId(ticketId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch comments',
    });
  }
};

/**
 * Handles POST /api/tickets/:id/comments
 * Validates request body, creates comment, returns the created comment with author.
 */
export const postComment = async (req: Request, res: Response) => {
  const ticketId = Number(req.params.id);

  if (isNaN(ticketId)) {
    res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Ticket ID must be a number',
    });
    return;
  }

  // Validate body (synchronous — no DB call)
  const result = createCommentSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Invalid request body',
      details: errors,
    });
    return;
  }

  try {
    // Check ticket exists
    const exists = await ticketExists(ticketId);
    if (!exists) {
      res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: `Ticket with ID ${ticketId} not found`,
      });
      return;
    }

    const comment = await createComment(ticketId, result.data);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to create comment',
    });
  }
};
