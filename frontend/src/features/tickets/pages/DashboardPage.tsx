import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { Status } from '../types';

/**
 * Computes ticket counts grouped by status.
 */
function computeStats(tickets: { status: Status }[]) {
  const counts: Record<Status, number> = {
    [Status.OPEN]: 0,
    [Status.IN_PROGRESS]: 0,
    [Status.RESOLVED]: 0,
    [Status.CLOSED]: 0,
    [Status.CANCELLED]: 0,
  };

  for (const ticket of tickets) {
    counts[ticket.status]++;
  }

  return counts;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Box
      bg="white"
      p={5}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      borderLeftWidth="4px"
      borderLeftColor={color}
    >
      <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="semibold">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mt={1}>
        {value}
      </Text>
    </Box>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: tickets, isLoading, isError } = useTickets();

  // Loading state
  if (isLoading) {
    return (
      <Stack gap={5}>
        <Heading as="h2" size="lg">Dashboard</Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={4}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="90px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  // Error state
  if (isError) {
    return (
      <Stack gap={5}>
        <Heading as="h2" size="lg">Dashboard</Heading>
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Alert.Title>Failed to load dashboard data.</Alert.Title>
        </Alert.Root>
      </Stack>
    );
  }

  const stats = computeStats(tickets || []);
  const total = tickets?.length || 0;

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center">
        <Heading as="h2" size="lg">Dashboard</Heading>
        <Text
          fontSize="sm"
          color="blue.600"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={() => navigate('/tickets')}
        >
          View all tickets →
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={4}>
        <StatCard label="Total" value={total} color="purple.500" />
        <StatCard label="Open" value={stats[Status.OPEN]} color="blue.500" />
        <StatCard label="In Progress" value={stats[Status.IN_PROGRESS]} color="yellow.500" />
        <StatCard label="Resolved" value={stats[Status.RESOLVED]} color="green.500" />
        <StatCard label="Closed" value={stats[Status.CLOSED]} color="gray.500" />
        <StatCard label="Cancelled" value={stats[Status.CANCELLED]} color="red.500" />
      </SimpleGrid>
    </Stack>
  );
}
