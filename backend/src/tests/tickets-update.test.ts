import { describe, it, expect, afterAll } from 'vitest';
import { api, createTestTicket, reseedDatabase } from './setup';

describe('PUT /api/tickets/:id', () => {
  afterAll(async () => {
    await reseedDatabase();
  });

  // ─── Successful Updates ────────────────────────────────────────────────────

  describe('successful updates', () => {
    it('updates title and returns 200', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ title: 'Updated title' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated title');
      expect(res.body.id).toBe(ticket.id);
    });

    it('updates description', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ description: 'Updated description content' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Updated description content');
    });

    it('updates priority', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ priority: 'HIGH' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.priority).toBe('HIGH');
    });

    it('updates assignedToId', async () => {
      // Arrange
      const ticket = await createTestTicket();
      const usersRes = await api.get('/api/users');
      const userId = usersRes.body[0].id;

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ assignedToId: userId });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.assignedTo).not.toBeNull();
      expect(res.body.assignedTo.id).toBe(userId);
    });

    it('can unassign a ticket by setting assignedToId to null', async () => {
      // Arrange
      const ticket = await createTestTicket();
      const usersRes = await api.get('/api/users');
      await api.put(`/api/tickets/${ticket.id}`).send({ assignedToId: usersRes.body[0].id });

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ assignedToId: null });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.assignedTo).toBeNull();
    });

    it('updates multiple fields at once', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({
          title: 'Multi-field update',
          description: 'New description',
          priority: 'LOW',
        });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Multi-field update');
      expect(res.body.description).toBe('New description');
      expect(res.body.priority).toBe('LOW');
    });

    it('trims whitespace from title and description', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ title: '  Padded  ', description: '  Spaced  ' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Padded');
      expect(res.body.description).toBe('Spaced');
    });
  });

  // ─── Validation Errors ───────────────────────────────────────────────────────

  describe('validation errors', () => {
    it('rejects empty title with 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ title: '' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'title' })])
      );
    });

    it('rejects title exceeding 200 characters', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ title: 'x'.repeat(201) });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title', message: expect.stringContaining('200') }),
        ])
      );
    });

    it('rejects empty description with 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ description: '' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'description' })])
      );
    });

    it('rejects description exceeding 2000 characters', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ description: 'x'.repeat(2001) });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'description', message: expect.stringContaining('2000') }),
        ])
      );
    });

    it('rejects invalid priority value', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ priority: 'URGENT' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  // ─── Status Cannot Be Updated ────────────────────────────────────────────────

  describe('status protection', () => {
    it('does not change status even if included in body', async () => {
      // Arrange
      const ticket = await createTestTicket();
      const originalStatus = ticket.status; // OPEN

      // Act — try to sneak status change through PUT
      const res = await api
        .put(`/api/tickets/${ticket.id}`)
        .send({ title: 'Sneaky update', status: 'CLOSED' });

      // Assert — title updates but status stays unchanged
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Sneaky update');
      expect(res.body.status).toBe(originalStatus);
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('returns 404 for unknown ticket id', async () => {
      // Act
      const res = await api
        .put('/api/tickets/99999')
        .send({ title: 'Ghost ticket' });

      // Assert
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });

    it('returns 400 for non-numeric ticket id', async () => {
      // Act
      const res = await api
        .put('/api/tickets/abc')
        .send({ title: 'Test' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('number');
    });
  });
});
