import { Box, Button, Flex, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { useUsers } from '../hooks/useUsers';
import { toaster } from '../../../shared/utils/toaster';
import { NativeSelect } from '../../../components/common';

/**
 * Zod schema for the create ticket form.
 * - title: required, 1–200 chars
 * - description: required, 1–2000 chars
 * - priority: required, one of LOW/MEDIUM/HIGH
 * - assignedToId: optional, numeric string from select (coerced to number)
 */
const createTicketFormSchema = z.object({
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

type CreateTicketFormData = z.infer<typeof createTicketFormSchema>;

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateTicket();
  const { data: users = [] } = useUsers();

  // Default createdBy is the first user in the list
  const defaultCreator = users.length > 0 ? users[0] : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketFormSchema),
    mode: 'onBlur',
    defaultValues: {
      priority: 'MEDIUM',
      assignedToId: '',
    },
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      await mutateAsync({
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignedToId: data.assignedToId ? Number(data.assignedToId) : null,
        createdById: defaultCreator?.id ?? null,
      });
      toaster.create({
        title: 'Ticket created',
        description: 'Your support ticket has been submitted successfully.',
        type: 'success',
        duration: 4000,
      });
      setTimeout(() => navigate('/tickets'), 1000);
    } catch {
      toaster.create({
        title: 'Failed to create ticket',
        description: 'Something went wrong. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Stack gap={6} maxW="xl" mx="auto">
      {/* Page Header */}
      <Box>
        <Button variant="ghost" size="sm" mb={4} onClick={() => navigate('/tickets')}>
          ← Back to Tickets
        </Button>
        <Heading as="h2" size="lg">
          Create New Ticket
        </Heading>
        <Text color="gray.500" fontSize="sm" mt={1}>
          Fill in the details below to submit a support request.
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

          {/* Created By (read-only) */}
          <Box>
            <Text fontWeight="medium" fontSize="sm" mb={1} color="gray.600">
              Created By
            </Text>
            <Text fontSize="sm" color="gray.700" bg="gray.50" px={3} py={2} borderRadius="md">
              {defaultCreator ? defaultCreator.name : 'Loading...'}
            </Text>
          </Box>

          {/* Actions */}
          <Flex gap={3} pt={2}>
            <Button
              type="submit"
              size="sm"
              colorPalette="blue"
              loading={isPending}
              loadingText="Creating..."
            >
              Create Ticket
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/tickets')}
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
