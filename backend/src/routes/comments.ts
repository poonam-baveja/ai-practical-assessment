import { Router } from 'express';
import { getComments, postComment } from '../controllers/commentController';

const router = Router({ mergeParams: true });

// GET /api/tickets/:id/comments — Fetch all comments for a ticket
router.get('/', getComments);

// POST /api/tickets/:id/comments — Add a comment to a ticket
router.post('/', postComment);

export default router;
