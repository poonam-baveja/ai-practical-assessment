import { useQuery } from '@tanstack/react-query';
import { getComments } from '../api/commentApi';

/**
 * Fetches comments for a ticket via TanStack Query.
 *
 * Query key: ['comments', ticketId] — scoped per ticket.
 * Enabled only when ticketId is a valid number.
 */
export function useComments(ticketId: number) {
  return useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => getComments(ticketId),
    enabled: !isNaN(ticketId) && ticketId > 0,
  });
}
