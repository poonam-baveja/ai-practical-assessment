import { describe, it, expect } from 'vitest';
import { getValidTransitions } from './statusMachine';
import { Status } from '../types';

describe('getValidTransitions (frontend)', () => {
  it('OPEN can transition to IN_PROGRESS or CANCELLED', () => {
    expect(getValidTransitions(Status.OPEN)).toEqual([Status.IN_PROGRESS, Status.CANCELLED]);
  });

  it('IN_PROGRESS can transition to RESOLVED or CANCELLED', () => {
    expect(getValidTransitions(Status.IN_PROGRESS)).toEqual([Status.RESOLVED, Status.CANCELLED]);
  });

  it('RESOLVED can transition to CLOSED only', () => {
    expect(getValidTransitions(Status.RESOLVED)).toEqual([Status.CLOSED]);
  });

  it('CLOSED has no valid transitions (terminal)', () => {
    expect(getValidTransitions(Status.CLOSED)).toEqual([]);
  });

  it('CANCELLED has no valid transitions (terminal)', () => {
    expect(getValidTransitions(Status.CANCELLED)).toEqual([]);
  });
});
