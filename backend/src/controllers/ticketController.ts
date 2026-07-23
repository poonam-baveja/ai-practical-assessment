import { Request, Response } from 'express';
import { getAllTickets, createTicket, getTicketById, updateTicketStatus, updateTicket } from '../services/ticketService';
import { createTicketSchema, updateStatusSchema, ticketQuerySchema, updateTicketSchema } from '../validators/ticketValidator';
import { isValidTransition } from '../utils/statusMachine';

/**
 * Handles GET /api/tickets
 * Supports optional query params: ?search=text&status=OPEN
 * Returns filtered tickets as a flat array.
 */
export const getTickets = async (req: Request, res: Response) => {
  // Validate query parameters
  const result = ticketQuerySchema.safeParse(req.query);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Invalid query parameters',
      details: errors,
    });
    return;
  }

  try {
    const tickets = await getAllTickets(result.data);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch tickets',
    });
  }
};

/**
 * Handles GET /api/tickets/:id
 * Validates that id is a number. Returns 404 if ticket does not exist.
 */
export const getTicket = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Ticket ID must be a number',
    });
    return;
  }

  try {
    const ticket = await getTicketById(id);

    if (!ticket) {
      res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: `Ticket with ID ${id} not found`,
      });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch ticket',
    });
  }
};

/**
 * Handles POST /api/tickets
 * Validates request body, creates ticket with status OPEN, returns created ticket object.
 */
export const postTicket = async (req: Request, res: Response) => {
  const result = createTicketSchema.safeParse(req.body);

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
    const ticket = await createTicket(result.data);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to create ticket',
    });
  }
};

/**
 * Handles PATCH /api/tickets/:id/status
 * Validates id and status. Enforces valid transitions. Returns updated ticket.
 */
export const patchTicketStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Ticket ID must be a number',
    });
    return;
  }

  // Validate request body
  const result = updateStatusSchema.safeParse(req.body);

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
    const ticket = await getTicketById(id);

    if (!ticket) {
      res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: `Ticket with ID ${id} not found`,
      });
      return;
    }

    // Enforce status transition rules
    const newStatus = result.data.status;

    if (!isValidTransition(ticket.status, newStatus)) {
      res.status(400).json({
        status: 400,
        error: 'Invalid Transition',
        message: `Cannot transition from ${ticket.status} to ${newStatus}`,
      });
      return;
    }

    // Apply update
    const updatedTicket = await updateTicketStatus(id, newStatus);
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to update ticket status',
    });
  }
};

/**
 * Handles PUT /api/tickets/:id
 * Updates editable fields: title, description, priority, assignedToId.
 * Does NOT allow updating status or createdBy.
 * Returns the updated ticket.
 */
export const putTicket = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      status: 400,
      error: 'Bad Request',
      message: 'Ticket ID must be a number',
    });
    return;
  }

  // Validate request body
  const result = updateTicketSchema.safeParse(req.body);

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
    const ticket = await getTicketById(id);

    if (!ticket) {
      res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: `Ticket with ID ${id} not found`,
      });
      return;
    }

    // Apply update
    const updatedTicket = await updateTicket(id, result.data);
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to update ticket',
    });
  }
};
