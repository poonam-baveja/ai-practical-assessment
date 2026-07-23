import { describe, it, expect } from 'vitest';
import { api } from './setup';

describe('GET /health', () => {
  it('returns 200 with status ok and a valid timestamp', async () => {
    // Act
    const res = await api.get('/health');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
