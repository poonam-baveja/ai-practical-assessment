import { Box, Button, Flex, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { toaster } from '../../../shared/utils/toaster';

const createTicketFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or fewer'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be 2000 characters or fewer'),
});

type CreateTicketFormData = z.infer<typeof createTicketFormSchema>;

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateTicket();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      await mutateAsync(data);
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
        <Button
          variant="ghost"
          size="sm"
          mb={4}
          onClick={() => navigate('/tickets')}
        >
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
          {/* Title Field */}
          <Box>
            <Text as="label" htmlFor="title" fontWeight="medium" fontSize="sm" mb={1} display="block">
              Title <Text as="span" color="red.500">*</Text>
            </Text>
            <Input
              id="title"
              placeholder="Brief summary of the issue"
              borderColor={errors.title ? 'red.500' : 'gray.200'}
              _focus={{ borderColor: errors.title ? 'red.500' : 'blue.500', boxShadow: 'outline' }}
              {...register('title')}
            />
            {errors.title && (
              <Text color="red.500" fontSize="xs" mt={1} role="alert">
                {errors.title.message}
              </Text>
            )}
          </Box>

          {/* Description Field */}
          <Box>
            <Text as="label" htmlFor="description" fontWeight="medium" fontSize="sm" mb={1} display="block">
              Description <Text as="span" color="red.500">*</Text>
            </Text>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              rows={6}
              borderColor={errors.description ? 'red.500' : 'gray.200'}
              _focus={{ borderColor: errors.description ? 'red.500' : 'blue.500', boxShadow: 'outline' }}
              {...register('description')}
            />
            {errors.description && (
              <Text color="red.500" fontSize="xs" mt={1} role="alert">
                {errors.description.message}
              </Text>
            )}
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
