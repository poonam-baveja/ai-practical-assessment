import { describe, it, expect } from 'vitest';
import { isValidTransition, getValidTransitions } from './statusMachine';

describe('statusMachine', () => {
  describe('isValidTransition', () => {
    // Valid transitions
    it('allows OPEN → IN_PROGRESS', () => {
      expect(isValidTransition('OPEN', 'IN_PROGRESS')).toBe(true);
    });

    it('allows IN_PROGRESS → RESOLVED', () => {
      expect(isValidTransition('IN_PROGRESS', 'RESOLVED')).toBe(true);
    });

    it('allows RESOLVED → CLOSED', () => {
      expect(isValidTransition('RESOLVED', 'CLOSED')).toBe(true);
    });

    // Invalid transitions
    it('rejects OPEN → RESOLVED (skip)', () => {
      expect(isValidTransition('OPEN', 'RESOLVED')).toBe(false);
    });

    it('rejects OPEN → CLOSED (skip)', () => {
      expect(isValidTransition('OPEN', 'CLOSED')).toBe(false);
    });

    it('rejects CLOSED → anything (terminal state)', () => {
      expect(isValidTransition('CLOSED', 'OPEN')).toBe(false);
      expect(isValidTransition('CLOSED', 'IN_PROGRESS')).toBe(false);
      expect(isValidTransition('CLOSED', 'RESOLVED')).toBe(false);
      expect(isValidTransition('CLOSED', 'CANCELLED')).toBe(false);
    });

    it('rejects CANCELLED → anything (terminal state)', () => {
      expect(isValidTransition('CANCELLED', 'OPEN')).toBe(false);
      expect(isValidTransition('CANCELLED', 'IN_PROGRESS')).toBe(false);
      expect(isValidTransition('CANCELLED', 'RESOLVED')).toBe(false);
      expect(isValidTransition('CANCELLED', 'CLOSED')).toBe(false);
    });

    it('allows OPEN → CANCELLED', () => {
      expect(isValidTransition('OPEN', 'CANCELLED')).toBe(true);
    });

    it('allows IN_PROGRESS → CANCELLED', () => {
      expect(isValidTransition('IN_PROGRESS', 'CANCELLED')).toBe(true);
    });

    it('rejects RESOLVED → CANCELLED', () => {
      expect(isValidTransition('RESOLVED', 'CANCELLED')).toBe(false);
    });

    it('rejects IN_PROGRESS → CLOSED (must go through RESOLVED)', () => {
      expect(isValidTransition('IN_PROGRESS', 'CLOSED')).toBe(false);
    });

    it('rejects same-status transition', () => {
      expect(isValidTransition('OPEN', 'OPEN')).toBe(false);
    });
  });

  describe('getValidTransitions', () => {
    it('returns [IN_PROGRESS] for OPEN', () => {
      expect(getValidTransitions('OPEN')).toEqual(['IN_PROGRESS', 'CANCELLED']);
    });

    it('returns [RESOLVED] for IN_PROGRESS', () => {
      expect(getValidTransitions('IN_PROGRESS')).toEqual(['RESOLVED', 'CANCELLED']);
    });

    it('returns [CLOSED] for RESOLVED', () => {
      expect(getValidTransitions('RESOLVED')).toEqual(['CLOSED']);
    });

    it('returns [] for CLOSED (terminal)', () => {
      expect(getValidTransitions('CLOSED')).toEqual([]);
    });

    it('returns [] for CANCELLED (terminal)', () => {
      expect(getValidTransitions('CANCELLED')).toEqual([]);
    });
  });
});
