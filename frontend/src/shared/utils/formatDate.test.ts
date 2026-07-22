import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO date string to readable format', () => {
    const result = formatDate('2026-07-22T05:27:53.960Z');
    expect(result).toBe('Jul 22, 2026');
  });

  it('handles different months', () => {
    const result = formatDate('2025-01-15T12:00:00.000Z');
    expect(result).toBe('Jan 15, 2025');
  });

  it('handles December correctly', () => {
    const result = formatDate('2024-12-25T00:00:00.000Z');
    expect(result).toBe('Dec 25, 2024');
  });
});
