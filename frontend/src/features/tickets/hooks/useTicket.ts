import { useQuery } from '@tanstack/react-query';
import { getTicketById } from '../api/ticketApi';

/**
 * Fetches a single ticket by ID via TanStack Query.
 *
 * Query key: ['tickets', id] — unique per ticket.
 * Enabled only when id is a valid number.
 */
export function useTicket(id: number) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => getTicketById(id),
    enabled: !isNaN(id),
  });
}
