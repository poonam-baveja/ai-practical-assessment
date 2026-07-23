import api from '../../../services/api';
import type { Ticket } from '../types';

/**
 * Payload for creating a new ticket.
 */
export interface CreateTicketPayload {
  title: string;
  description: string;
  priority?: string;
  assignedToId?: number | null;
  createdById?: number | null;
}

/**
 * Optional filters for fetching tickets.
 */
export interface GetTicketsParams {
  search?: string;
  status?: string;
}

/**
 * Fetches tickets from the backend with optional filters.
 * GET /api/tickets?search=...&status=... → returns Ticket[]
 */
export async function getTickets(params?: GetTicketsParams): Promise<Ticket[]> {
  const queryParams: Record<string, string> = {};

  if (params?.search) {
    queryParams.search = params.search;
  }
  if (params?.status) {
    queryParams.status = params.status;
  }

  const response = await api.get<Ticket[]>('/api/tickets', { params: queryParams });
  return response.data;
}

/**
 * Creates a new ticket.
 * POST /api/tickets → returns the created Ticket
 */
export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const response = await api.post<Ticket>('/api/tickets', payload);
  return response.data;
}

/**
 * Fetches a single ticket by ID.
 * GET /api/tickets/:id → returns a Ticket
 */
export async function getTicketById(id: number): Promise<Ticket> {
  const response = await api.get<Ticket>(`/api/tickets/${id}`);
  return response.data;
}

/**
 * Payload for updating ticket status.
 */
export interface UpdateTicketStatusPayload {
  id: number;
  status: string;
}

/**
 * Updates the status of a ticket.
 * PATCH /api/tickets/:id/status → returns the updated Ticket
 */
export async function updateTicketStatus(payload: UpdateTicketStatusPayload): Promise<Ticket> {
  const response = await api.patch<Ticket>(`/api/tickets/${payload.id}/status`, {
    status: payload.status,
  });
  return response.data;
}

/**
 * Payload for updating a ticket's editable fields.
 */
export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  priority?: string;
  assignedToId?: number | null;
}

/**
 * Updates a ticket's editable fields.
 * PUT /api/tickets/:id → returns the updated Ticket
 */
export async function updateTicket(id: number, payload: UpdateTicketPayload): Promise<Ticket> {
  const response = await api.put<Ticket>(`/api/tickets/${id}`, payload);
  return response.data;
}
