import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTicket, type CreateTicketPayload } from '../api/ticketApi';

/**
 * Mutation hook for creating a ticket.
 * On success, invalidates the ['tickets'] query to refresh the list.
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
