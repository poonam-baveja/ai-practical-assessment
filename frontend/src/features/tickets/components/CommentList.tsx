import { Box, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useComments } from '../hooks/useComments';
import { formatDate } from '../../../shared/utils';

interface CommentListProps {
  ticketId: number;
}

/**
 * Displays the list of comments for a ticket.
 * Handles loading and empty states.
 */
export function CommentList({ ticketId }: CommentListProps) {
  const { data: comments, isLoading } = useComments(ticketId);

  if (isLoading) {
    return (
      <Stack gap={3}>
        <Skeleton height="60px" borderRadius="md" />
        <Skeleton height="60px" borderRadius="md" />
      </Stack>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <Text fontSize="sm" color="gray.500" py={4} textAlign="center">
        No comments yet. Be the first to add one.
      </Text>
    );
  }

  return (
    <Stack gap={3}>
      {comments.map((comment) => (
        <Box
          key={comment.id}
          p={4}
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <Text fontSize="sm" lineHeight="tall">
            {comment.message}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={2}>
            {comment.createdBy ? comment.createdBy.name : 'Unknown'} · {formatDate(comment.createdAt)}
          </Text>
        </Box>
      ))}
    </Stack>
  );
}
