/**
 * Defines the valid status transitions for tickets.
 *
 * Allowed transitions:
 *   OPEN → IN_PROGRESS, CANCELLED
 *   IN_PROGRESS → RESOLVED, CANCELLED
 *   RESOLVED → CLOSED
 *
 * Terminal states (no outgoing transitions):
 *   CLOSED
 *   CANCELLED
 */

type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';

const VALID_TRANSITIONS: Record<Status, Status[]> = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

/**
 * Checks whether transitioning from `currentStatus` to `newStatus` is allowed.
 */
export function isValidTransition(currentStatus: string, newStatus: string): boolean {
  const allowed = VALID_TRANSITIONS[currentStatus as Status];
  if (!allowed) return false;
  return allowed.includes(newStatus as Status);
}

/**
 * Returns the list of valid next statuses for a given current status.
 */
export function getValidTransitions(currentStatus: string): string[] {
  return VALID_TRANSITIONS[currentStatus as Status] || [];
}
