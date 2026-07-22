import { useQuery } from '@tanstack/react-query';
import { getTickets, type GetTicketsParams } from '../api/ticketApi';

/**
 * Fetches tickets via TanStack Query with optional search and status filters.
 *
 * Query key includes the params so React Query refetches when filters change.
 * Returns loading, error, and data states.
 */
export function useTickets(params?: GetTicketsParams) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => getTickets(params),
  });
}
