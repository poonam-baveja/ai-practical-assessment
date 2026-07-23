import api from '../../../services/api';
import type { Comment } from '../types';

/**
 * Payload for creating a comment.
 */
export interface CreateCommentPayload {
  message: string;
  createdById?: number | null;
}

/**
 * Fetches all comments for a ticket.
 * GET /api/tickets/:id/comments → returns Comment[] (oldest first)
 */
export async function getComments(ticketId: number): Promise<Comment[]> {
  const response = await api.get<Comment[]>(`/api/tickets/${ticketId}/comments`);
  return response.data;
}

/**
 * Creates a comment on a ticket.
 * POST /api/tickets/:id/comments → returns the created Comment
 */
export async function createComment(ticketId: number, payload: CreateCommentPayload): Promise<Comment> {
  const response = await api.post<Comment>(`/api/tickets/${ticketId}/comments`, payload);
  return response.data;
}
