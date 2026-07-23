import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateComment } from '../hooks/useCreateComment';
import { useUsers } from '../hooks/useUsers';
import { toaster } from '../../../shared/utils/toaster';

const commentFormSchema = z.object({
  message: z
    .string()
    .min(1, 'Comment is required')
    .max(1000, 'Comment must be 1000 characters or fewer'),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

interface AddCommentFormProps {
  ticketId: number;
}

/**
 * Form for adding a comment to a ticket.
 * createdBy defaults to the first seeded user (simulates logged-in user).
 */
export function AddCommentForm({ ticketId }: AddCommentFormProps) {
  const { mutateAsync, isPending } = useCreateComment(ticketId);
  const { data: users = [] } = useUsers();
  const defaultAuthor = users.length > 0 ? users[0] : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      await mutateAsync({
        message: data.message,
        createdById: defaultAuthor?.id ?? null,
      });
      reset();
      toaster.create({
        title: 'Comment added',
        type: 'success',
        duration: 3000,
      });
    } catch {
      toaster.create({
        title: 'Failed to add comment',
        description: 'Something went wrong. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={2}>
        Add a Comment
      </Text>

      <Textarea
        placeholder="Write a comment..."
        rows={3}
        borderColor={errors.message ? 'red.500' : 'gray.200'}
        {...register('message')}
      />
      {errors.message && (
        <Text color="red.500" fontSize="xs" mt={1} role="alert">
          {errors.message.message}
        </Text>
      )}

      <Flex align="center" justify="space-between" mt={3}>
        <Text fontSize="xs" color="gray.500">
          Posting as: {defaultAuthor ? defaultAuthor.name : 'Loading...'}
        </Text>
        <Button
          type="submit"
          size="sm"
          colorPalette="blue"
          loading={isPending}
          loadingText="Posting..."
          disabled={!isValid || isPending}
        >
          Add Comment
        </Button>
      </Flex>
    </Box>
  );
}
