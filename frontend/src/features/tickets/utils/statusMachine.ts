import { Status } from '../types';

/**
 * Valid status transitions — mirrors the backend rules.
 * OPEN → IN_PROGRESS or CANCELLED
 * IN_PROGRESS → RESOLVED or CANCELLED
 * RESOLVED → CLOSED
 * CLOSED → (terminal)
 * CANCELLED → (terminal)
 */
const VALID_TRANSITIONS: Record<Status, Status[]> = {
  [Status.OPEN]: [Status.IN_PROGRESS, Status.CANCELLED],
  [Status.IN_PROGRESS]: [Status.RESOLVED, Status.CANCELLED],
  [Status.RESOLVED]: [Status.CLOSED],
  [Status.CLOSED]: [],
  [Status.CANCELLED]: [],
};

/**
 * Returns the list of valid next statuses for a given current status.
 */
export function getValidTransitions(currentStatus: Status): Status[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}
