/**
 * Formats an ISO date string to a human-readable format.
 * Example: "2026-07-22T05:27:53.960Z" → "Jul 22, 2026"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
