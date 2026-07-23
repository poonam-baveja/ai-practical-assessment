import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket, type UpdateTicketPayload } from '../api/ticketApi';

/**
 * Mutation hook for updating a ticket's editable fields.
 * On success, invalidates the ticket detail and ticket list queries.
 */
export function useUpdateTicket(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTicketPayload) => updateTicket(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
