import { useEffect } from 'react';
import { Box, Button, Flex, Heading, Input, Skeleton, Stack, Text, Textarea } from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '../hooks/useTicket';
import { useUpdateTicket } from '../hooks/useUpdateTicket';
import { useUsers } from '../hooks/useUsers';
import { toaster } from '../../../shared/utils/toaster';
import { NativeSelect } from '../../../components/common';

const editTicketFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or fewer'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be 2000 characters or fewer'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assignedToId: z.string().optional(),
});

type EditTicketFormData = z.infer<typeof editTicketFormSchema>;

export function EditTicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = Number(id);

  const { data: ticket, isLoading, isError } = useTicket(ticketId);
  const { mutateAsync, isPending } = useUpdateTicket(ticketId);
  const { data: users = [] } = useUsers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTicketFormData>({
    resolver: zodResolver(editTicketFormSchema),
    mode: 'onBlur',
  });

  // Pre-fill form when ticket data loads
  useEffect(() => {
    if (ticket) {
      reset({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        assignedToId: ticket.assignedTo?.id?.toString() ?? '',
      });
    }
  }, [ticket, reset]);

  const onSubmit = async (data: EditTicketFormData) => {
    try {
      await mutateAsync({
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignedToId: data.assignedToId ? Number(data.assignedToId) : null,
      });
      toaster.create({
        title: 'Ticket updated',
        description: 'Changes saved successfully.',
        type: 'success',
        duration: 4000,
      });
      setTimeout(() => navigate(`/tickets/${ticketId}`), 800);
    } catch {
      toaster.create({
        title: 'Failed to update ticket',
        description: 'Something went wrong. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={5} maxW="xl" mx="auto">
        <Skeleton height="28px" width="200px" borderRadius="md" />
        <Skeleton height="300px" borderRadius="md" />
      </Stack>
    );
  }

  // Error state
  if (isError || !ticket) {
    return (
      <Stack gap={5} maxW="xl" mx="auto">
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Alert.Title>Failed to load ticket.</Alert.Title>
        </Alert.Root>
        <Button size="sm" variant="outline" onClick={() => navigate('/tickets')}>
          ← Back to Tickets
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap={6} maxW="xl" mx="auto">
      {/* Page Header */}
      <Box>
        <Button variant="ghost" size="sm" mb={4} onClick={() => navigate(`/tickets/${ticketId}`)}>
          ← Back to Ticket
        </Button>
        <Heading as="h2" size="lg">
          Edit Ticket
        </Heading>
        <Text color="gray.500" fontSize="sm" mt={1}>
          Update the ticket details below.
        </Text>
      </Box>

      {/* Form */}
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
      >
        <Stack gap={5}>
          {/* Title */}
          <Box>
            <Text as="label" htmlFor="title" fontWeight="medium" fontSize="sm" mb={1} display="block">
              Title <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              id="title"
              placeholder="Brief summary of the issue"
              borderColor={errors.title ? 'red.500' : 'gray.200'}
              {...register('title')}
            />
            {errors.title && (
              <Text color="red.500" fontSize="xs" mt={1} role="alert">
                {errors.title.message}
              </Text>
            )}
          </Box>

          {/* Description */}
          <Box>
            <Text as="label" htmlFor="description" fontWeight="medium" fontSize="sm" mb={1} display="block">
              Description <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              rows={6}
              borderColor={errors.description ? 'red.500' : 'gray.200'}
              {...register('description')}
            />
            {errors.description && (
              <Text color="red.500" fontSize="xs" mt={1} role="alert">
                {errors.description.message}
              </Text>
            )}
          </Box>

          {/* Priority */}
          <Box>
            <Text as="label" htmlFor="priority" fontWeight="medium" fontSize="sm" mb={1} display="block">
              Priority
            </Text>
            <NativeSelect
              id="priority"
              {...register('priority')}
              aria-label="Select priority"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </NativeSelect>
          </Box>

          {/* Assigned To */}
          <Box>
            <Text as="label" htmlFor="assignedToId" fontWeight="medium" fontSize="sm" mb={1} display="block">
              Assign To
            </Text>
            <NativeSelect
              id="assignedToId"
              {...register('assignedToId')}
              aria-label="Select assignee"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </NativeSelect>
          </Box>

          {/* Actions */}
          <Flex gap={3} pt={2}>
            <Button
              type="submit"
              size="sm"
              colorPalette="blue"
              loading={isPending}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/tickets/${ticketId}`)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Stack>
  );
}
