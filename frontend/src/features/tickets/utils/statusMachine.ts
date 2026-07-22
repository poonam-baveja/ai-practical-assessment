import { Status } from '../types';

/**
 * Valid status transitions — mirrors the backend rules.
 * OPEN → IN_PROGRESS → RESOLVED → CLOSED
 */
const VALID_TRANSITIONS: Record<Status, Status[]> = {
  [Status.OPEN]: [Status.IN_PROGRESS],
  [Status.IN_PROGRESS]: [Status.RESOLVED],
  [Status.RESOLVED]: [Status.CLOSED],
  [Status.CLOSED]: [],
};

/**
 * Returns the list of valid next statuses for a given current status.
 */
export function getValidTransitions(currentStatus: Status): Status[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}
