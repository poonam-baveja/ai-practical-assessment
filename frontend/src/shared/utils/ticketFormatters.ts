import { Status, Priority } from '../../features/tickets/types';

/**
 * Maps ticket status to a Chakra colorPalette string for Badge components.
 */
export function getStatusColor(status: Status): string {
  switch (status) {
    case Status.OPEN:
      return 'blue';
    case Status.IN_PROGRESS:
      return 'yellow';
    case Status.RESOLVED:
      return 'green';
    case Status.CLOSED:
      return 'gray';
    case Status.CANCELLED:
      return 'red';
  }
}

/**
 * Maps ticket priority to a Chakra colorPalette string for Badge components.
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case Priority.LOW:
      return 'gray';
    case Priority.MEDIUM:
      return 'orange';
    case Priority.HIGH:
      return 'red';
  }
}

/**
 * Formats a status enum value for display.
 * e.g. "IN_PROGRESS" → "In Progress"
 */
export function formatStatus(status: Status): string {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
