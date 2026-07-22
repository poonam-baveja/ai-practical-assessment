import { Router } from 'express';
import { getTickets, getTicket, postTicket, patchTicketStatus } from '../controllers/ticketController';

const router = Router();

// GET /api/tickets — Fetch all tickets
router.get('/', getTickets);

// GET /api/tickets/:id — Fetch a single ticket
router.get('/:id', getTicket);

// POST /api/tickets — Create a new ticket
router.post('/', postTicket);

// PATCH /api/tickets/:id/status — Update ticket status
router.patch('/:id/status', patchTicketStatus);

export default router;
