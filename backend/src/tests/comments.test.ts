import { describe, it, expect, afterAll } from 'vitest';
import { api, createTestTicket, reseedDatabase } from './setup';

describe('Ticket Comments API', () => {
  afterAll(async () => {
    await reseedDatabase();
  });

  // ─── GET /api/tickets/:id/comments ───────────────────────────────────────────

  describe('GET /api/tickets/:id/comments', () => {
    it('returns 200 with an array', async () => {
      // Arrange — use a seeded ticket that has comments
      const tickets = await api.get('/api/tickets');
      const ticketWithComments = tickets.body[0];

      // Act
      const res = await api.get(`/api/tickets/${ticketWithComments.id}/comments`);

      // Assert
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns comments in oldest-first order', async () => {
      // Arrange — create a ticket and add multiple comments
      const ticket = await createTestTicket();

      await api.post(`/api/tickets/${ticket.id}/comments`).send({ message: 'First comment' });
      await api.post(`/api/tickets/${ticket.id}/comments`).send({ message: 'Second comment' });
      await api.post(`/api/tickets/${ticket.id}/comments`).send({ message: 'Third comment' });

      // Act
      const res = await api.get(`/api/tickets/${ticket.id}/comments`);

      // Assert — oldest first means first created appears at index 0
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].message).toBe('First comment');
      expect(res.body[1].message).toBe('Second comment');
      expect(res.body[2].message).toBe('Third comment');
    });

    it('includes author information in each comment', async () => {
      // Arrange — get a real user id first
      const usersRes = await api.get('/api/users');
      const userId = usersRes.body[0].id;

      const ticket = await createTestTicket();
      await api.post(`/api/tickets/${ticket.id}/comments`).send({
        message: 'Comment with author',
        createdById: userId,
      });

      // Act
      const res = await api.get(`/api/tickets/${ticket.id}/comments`);

      // Assert
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].createdBy).toBeDefined();
      expect(res.body[0].createdBy).toHaveProperty('id');
      expect(res.body[0].createdBy).toHaveProperty('name');
      expect(res.body[0].createdBy).toHaveProperty('email');
    });

    it('returns empty array for ticket with no comments', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api.get(`/api/tickets/${ticket.id}/comments`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 404 for unknown ticket', async () => {
      // Act
      const res = await api.get('/api/tickets/99999/comments');

      // Assert
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });

    it('returns 400 for non-numeric ticket id', async () => {
      // Act
      const res = await api.get('/api/tickets/abc/comments');

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('number');
    });
  });

  // ─── POST /api/tickets/:id/comments ──────────────────────────────────────────

  describe('POST /api/tickets/:id/comments', () => {
    it('creates a comment and returns 201', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({ message: 'This is a test comment' });

      // Assert
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.message).toBe('This is a test comment');
      expect(res.body.ticketId).toBe(ticket.id);
      expect(res.body.createdAt).toBeDefined();
    });

    it('returns the created comment with author when createdById is provided', async () => {
      // Arrange — get a real user id
      const usersRes = await api.get('/api/users');
      const userId = usersRes.body[0].id;
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({ message: 'Comment by user', createdById: userId });

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.createdById).toBe(userId);
      expect(res.body.createdBy).toHaveProperty('name');
    });

    it('trims whitespace from message', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({ message: '  Padded message  ' });

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Padded message');
    });

    it('rejects empty message with 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({ message: '' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'message' })])
      );
    });

    it('rejects missing message with 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({});

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });

    it('rejects message exceeding 1000 characters with 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .post(`/api/tickets/${ticket.id}/comments`)
        .send({ message: 'x'.repeat(1001) });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'message', message: expect.stringContaining('1000') }),
        ])
      );
    });

    it('returns 404 for unknown ticket', async () => {
      // Act
      const res = await api
        .post('/api/tickets/99999/comments')
        .send({ message: 'Ghost comment' });

      // Assert
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });

    it('returns 400 for non-numeric ticket id', async () => {
      // Act
      const res = await api
        .post('/api/tickets/abc/comments')
        .send({ message: 'Test' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('number');
    });
  });
});
