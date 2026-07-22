import { useState } from 'react';
import {
  Box,
  Badge,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '../hooks/useTicket';
import { useUpdateTicketStatus } from '../hooks/useUpdateTicketStatus';
import { formatDate } from '../../../shared/utils';
import { toaster } from '../../../shared/utils/toaster';
import { Status } from '../types';
import { getValidTransitions } from '../utils/statusMachine';

function getStatusColor(status: Status): string {
  switch (status) {
    case Status.OPEN:
      return 'blue';
    case Status.IN_PROGRESS:
      return 'yellow';
    case Status.RESOLVED:
      return 'green';
    case Status.CLOSED:
      return 'gray';
  }
}

function formatStatus(status: Status): string {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = Number(id);
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateTicketStatus();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={5} maxW="3xl" mx="auto">
        <Skeleton height="20px" width="120px" borderRadius="md" />
        <Skeleton height="32px" width="70%" borderRadius="md" />
        <Skeleton height="24px" width="90px" borderRadius="md" />
        <Skeleton height="140px" borderRadius="md" />
        <Skeleton height="80px" borderRadius="md" />
      </Stack>
    );
  }

  // Not found
  const is404 = isError && (error as any)?.response?.status === 404;
  if (is404) {
    return (
      <Stack gap={5} align="center" py={16} maxW="3xl" mx="auto">
        <Heading as="h2" size="lg" color="gray.600">
          Ticket Not Found
        </Heading>
        <Text color="gray.500" textAlign="center">
          The ticket you're looking for doesn't exist or has been removed.
        </Text>
        <Button size="sm" variant="outline" onClick={() => navigate('/tickets')}>
          ← Back to Tickets
        </Button>
      </Stack>
    );
  }

  // Generic error
  if (isError) {
    return (
      <Stack gap={5} maxW="3xl" mx="auto">
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Box>
            <Alert.Title fontWeight="semibold">Something went wrong</Alert.Title>
            <Text fontSize="sm" color="red.700" mt={1}>
              Failed to load ticket. Please try again later.
            </Text>
          </Box>
        </Alert.Root>
        <Button size="sm" variant="outline" onClick={() => navigate('/tickets')}>
          ← Back to Tickets
        </Button>
      </Stack>
    );
  }

  if (!ticket) return null;

  const validNextStatuses = getValidTransitions(ticket.status);
  const isClosed = ticket.status === Status.CLOSED;

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    try {
      await updateStatus({ id: ticketId, status: selectedStatus });
      setSelectedStatus('');
      toaster.create({
        title: 'Status updated',
        description: `Ticket status changed to ${formatStatus(selectedStatus as Status)}.`,
        type: 'success',
        duration: 4000,
      });
    } catch {
      toaster.create({
        title: 'Failed to update status',
        description: 'Something went wrong. Please try again.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Stack gap={6} maxW="3xl" mx="auto">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        alignSelf="flex-start"
        onClick={() => navigate('/tickets')}
      >
        ← Back to Tickets
      </Button>

      {/* Title + Status + Meta */}
      <Box>
        <Flex align="center" gap={3} mb={2} wrap="wrap">
          <Heading as="h2" size="lg">
            {ticket.title}
          </Heading>
          <Badge colorPalette={getStatusColor(ticket.status)} size="md">
            {formatStatus(ticket.status)}
          </Badge>
        </Flex>
        <Text fontSize="sm" color="gray.500">
          Created on {formatDate(ticket.createdAt)}
          {ticket.updatedAt !== ticket.createdAt && (
            <> · Updated {formatDate(ticket.updatedAt)}</>
          )}
        </Text>
      </Box>

      {/* Description */}
      <Box
        bg="white"
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
      >
        <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={2}>
          Description
        </Text>
        <Text whiteSpace="pre-wrap" fontSize="sm" lineHeight="tall">
          {ticket.description}
        </Text>
      </Box>

      {/* Status Update */}
      <Box
        bg="white"
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
      >
        <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={3}>
          Update Status
        </Text>

        {isClosed ? (
          <Text color="gray.500" fontSize="sm">
            This ticket is closed. No further status changes are allowed.
          </Text>
        ) : (
          <Flex gap={3} align="center" wrap="wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Select new status"
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                minWidth: '180px',
                backgroundColor: 'white',
              }}
            >
              <option value="">Select new status</option>
              {validNextStatuses.map((s) => (
                <option key={s} value={s}>
                  {formatStatus(s)}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              colorPalette="blue"
              onClick={handleStatusUpdate}
              loading={isUpdating}
              loadingText="Updating..."
              disabled={!selectedStatus || isUpdating}
            >
              Update Status
            </Button>
          </Flex>
        )}
      </Box>
    </Stack>
  );
}
