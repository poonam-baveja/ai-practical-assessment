import { describe, it, expect, afterAll } from 'vitest';
import { api, createTestTicket, reseedDatabase } from './setup';

const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];

describe('GET /api/tickets', () => {
  afterAll(async () => {
    await reseedDatabase();
  });

  it('returns 200 with a non-null array', async () => {
    // Act
    const res = await api.get('/api/tickets');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).not.toBeNull();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns seeded tickets with correct shape', async () => {
    // Act
    const res = await api.get('/api/tickets');

    // Assert — at least one ticket from seed data
    expect(res.body.length).toBeGreaterThan(0);

    // Assert — every ticket has the expected fields and types
    for (const ticket of res.body) {
      expect(typeof ticket.id).toBe('number');
      expect(typeof ticket.title).toBe('string');
      expect(ticket.title.length).toBeGreaterThan(0);
      expect(typeof ticket.description).toBe('string');
      expect(ticket.description.length).toBeGreaterThan(0);
      expect(VALID_STATUSES).toContain(ticket.status);
      expect(new Date(ticket.createdAt).getTime()).not.toBeNaN();
    }
  });

  it('supports filtering by status', async () => {
    // Act
    const res = await api.get('/api/tickets?status=OPEN');

    // Assert
    expect(res.status).toBe(200);
    for (const ticket of res.body) {
      expect(ticket.status).toBe('OPEN');
    }
  });

  it('supports search by title', async () => {
    // Arrange
    await createTestTicket({ title: 'Unique searchable title xyz' });

    // Act
    const res = await api.get('/api/tickets?search=xyz');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toContain('xyz');
  });

  it('returns empty array when no tickets match filters', async () => {
    // Act
    const res = await api.get('/api/tickets?search=nonexistentquery12345');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects invalid status filter with 400', async () => {
    // Act
    const res = await api.get('/api/tickets?status=INVALID');

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
