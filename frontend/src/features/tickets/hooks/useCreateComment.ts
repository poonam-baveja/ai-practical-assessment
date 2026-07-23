import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, type CreateCommentPayload } from '../api/commentApi';

/**
 * Mutation hook for creating a comment on a ticket.
 * On success, invalidates only the comments query for that ticket.
 */
export function useCreateComment(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    },
  });
}
