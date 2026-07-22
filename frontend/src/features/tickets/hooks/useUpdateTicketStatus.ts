import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicketStatus, type UpdateTicketStatusPayload } from '../api/ticketApi';

/**
 * Mutation hook for updating a ticket's status.
 * On success, invalidates both the ticket detail and ticket list queries.
 */
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTicketStatusPayload) => updateTicketStatus(payload),
    onSuccess: (_data, variables) => {
      // Refresh the specific ticket detail
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      // Refresh the ticket list
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
