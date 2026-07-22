import { Button, Flex, Input } from '@chakra-ui/react';
import { Status } from '../types';

interface TicketFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Filter bar for the ticket list.
 * Controlled component — parent manages state and debouncing.
 * Accessible: inputs have aria-labels, native select for keyboard support.
 */
export function TicketFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: TicketFiltersProps) {
  const hasFilters = search !== '' || status !== '';

  return (
    <Flex
      gap={3}
      wrap="wrap"
      align="center"
      bg="white"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
    >
      {/* Search Input */}
      <Input
        placeholder="Search by title or description..."
        aria-label="Search tickets"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="sm"
        flex="1"
        minW="200px"
        maxW={{ base: '100%', md: '320px' }}
      />

      {/* Status Dropdown — native select for full keyboard/a11y support */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
        style={{
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid #E2E8F0',
          fontSize: '14px',
          minWidth: '160px',
          backgroundColor: 'white',
        }}
      >
        <option value="">All Statuses</option>
        <option value={Status.OPEN}>Open</option>
        <option value={Status.IN_PROGRESS}>In Progress</option>
        <option value={Status.RESOLVED}>Resolved</option>
        <option value={Status.CLOSED}>Closed</option>
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button size="sm" variant="outline" onClick={onClear}>
          Clear Filters
        </Button>
      )}
    </Flex>
  );
}
