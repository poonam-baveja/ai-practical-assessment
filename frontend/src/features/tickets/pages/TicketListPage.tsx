import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Table,
  Text,
  Badge,
  Button,
  Skeleton,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { TicketFilters } from '../components/TicketFilters';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { formatDate, getStatusColor, getPriorityColor, formatStatus } from '../../../shared/utils';
import { Status, Priority } from '../types';

function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      {...props}
    >
      <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v0a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3v0a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v0a3 3 0 0 0 3-3v0a3 3 0 0 0-3-3Z" />
    </svg>
  );
}

export function TicketListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const params = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status && { status }),
  };

  const { data: tickets, isLoading, isError, isFetching } = useTickets(
    Object.keys(params).length > 0 ? params : undefined
  );

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
  };

  // Loading state — initial load
  if (isLoading) {
    return (
      <Stack gap={5}>
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="lg">All Tickets</Heading>
          <Skeleton height="36px" width="130px" borderRadius="md" />
        </Flex>
        <Skeleton height="56px" borderRadius="md" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="52px" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  // Error state
  if (isError) {
    return (
      <Stack gap={5}>
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="lg">All Tickets</Heading>
        </Flex>
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Box>
            <Alert.Title fontWeight="semibold">Something went wrong</Alert.Title>
            <Text fontSize="sm" color="red.700" mt={1}>
              Failed to load tickets. Please try again later.
            </Text>
          </Box>
        </Alert.Root>
      </Stack>
    );
  }

  const hasResults = tickets && tickets.length > 0;
  const hasActiveFilters = debouncedSearch !== '' || status !== '';

  return (
    <Stack gap={5}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Heading as="h2" size="lg">
          All Tickets
        </Heading>
        <Button
          size="sm"
          colorPalette="blue"
          onClick={() => navigate('/tickets/new')}
        >
          + Create Ticket
        </Button>
      </Flex>

      {/* Filters */}
      <TicketFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={handleClearFilters}
      />

      {/* Background refetch indicator */}
      {isFetching && !isLoading && (
        <Skeleton height="3px" borderRadius="full" />
      )}

      {/* Empty state */}
      {!hasResults && (
        <Box
          textAlign="center"
          py={16}
          bg="white"
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
        >
          <Icon asChild boxSize={10} color="gray.300" mb={3}>
            <TicketIcon />
          </Icon>
          <Text color="gray.600" fontSize="md" fontWeight="medium">
            {hasActiveFilters ? 'No tickets match your filters' : 'No tickets yet'}
          </Text>
          <Text color="gray.400" fontSize="sm" mt={1} mb={4}>
            {hasActiveFilters
              ? 'Try adjusting your search or status filter.'
              : 'Create your first support ticket to get started.'}
          </Text>
          {!hasActiveFilters && (
            <Button size="sm" colorPalette="blue" onClick={() => navigate('/tickets/new')}>
              + Create Ticket
            </Button>
          )}
        </Box>
      )}

      {/* Ticket Table */}
      {hasResults && (
        <Box
          overflowX="auto"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          borderColor="gray.200"
        >
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader py={3} fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.600">
                  Title
                </Table.ColumnHeader>
                <Table.ColumnHeader py={3} fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.600" width="110px">
                  Priority
                </Table.ColumnHeader>
                <Table.ColumnHeader py={3} fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.600" width="130px">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader py={3} fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.600" width="140px" display={{ base: 'none', md: 'table-cell' }}>
                  Assigned To
                </Table.ColumnHeader>
                <Table.ColumnHeader py={3} fontWeight="semibold" fontSize="xs" textTransform="uppercase" color="gray.600" width="110px" display={{ base: 'none', md: 'table-cell' }}>
                  Created
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tickets.map((ticket) => (
                <Table.Row
                  key={ticket.id}
                  cursor="pointer"
                  transition="background 0.15s"
                  _hover={{ bg: 'blue.50' }}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/tickets/${ticket.id}`);
                    }
                  }}
                >
                  <Table.Cell py={3} fontWeight="medium" fontSize="sm">
                    {ticket.title}
                  </Table.Cell>
                  <Table.Cell py={3}>
                    <Badge colorPalette={getPriorityColor(ticket.priority)} size="sm">
                      {ticket.priority}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell py={3}>
                    <Badge colorPalette={getStatusColor(ticket.status)} size="sm">
                      {formatStatus(ticket.status)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell py={3} color="gray.600" fontSize="sm" display={{ base: 'none', md: 'table-cell' }}>
                    {ticket.assignedTo ? ticket.assignedTo.name : '—'}
                  </Table.Cell>
                  <Table.Cell py={3} color="gray.500" fontSize="sm" display={{ base: 'none', md: 'table-cell' }}>
                    {formatDate(ticket.createdAt)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Stack>
  );
}
