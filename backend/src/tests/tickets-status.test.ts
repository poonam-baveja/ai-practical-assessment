import { describe, it, expect, afterAll } from 'vitest';
import { api, createTestTicket, advanceToStatus, reseedDatabase } from './setup';

describe('PATCH /api/tickets/:id/status', () => {
  afterAll(async () => {
    await reseedDatabase();
  });

  // ─── Valid Transitions ───────────────────────────────────────────────────────

  describe('valid transitions', () => {
    it('OPEN → IN_PROGRESS', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'IN_PROGRESS' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('IN_PROGRESS → RESOLVED', async () => {
      // Arrange
      const ticket = await createTestTicket();
      await advanceToStatus(ticket.id, ['IN_PROGRESS']);

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'RESOLVED' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('RESOLVED');
    });

    it('RESOLVED → CLOSED', async () => {
      // Arrange
      const ticket = await createTestTicket();
      await advanceToStatus(ticket.id, ['IN_PROGRESS', 'RESOLVED']);

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'CLOSED' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('CLOSED');
    });

    it('OPEN → CANCELLED', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'CANCELLED' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('CANCELLED');
    });

    it('IN_PROGRESS → CANCELLED', async () => {
      // Arrange
      const ticket = await createTestTicket();
      await advanceToStatus(ticket.id, ['IN_PROGRESS']);

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'CANCELLED' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('CANCELLED');
    });
  });

  // ─── Invalid Transitions ─────────────────────────────────────────────────────

  describe('invalid transitions', () => {
    it('OPEN → CLOSED (cannot skip steps)', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'CLOSED' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid Transition');
      expect(res.body.message).toContain('OPEN');
      expect(res.body.message).toContain('CLOSED');
    });

    it('RESOLVED → OPEN (no backwards transition)', async () => {
      // Arrange
      const ticket = await createTestTicket();
      await advanceToStatus(ticket.id, ['IN_PROGRESS', 'RESOLVED']);

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'OPEN' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid Transition');
    });

    it('CLOSED → OPEN (terminal state)', async () => {
      // Arrange
      const ticket = await createTestTicket();
      await advanceToStatus(ticket.id, ['IN_PROGRESS', 'RESOLVED', 'CLOSED']);

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'OPEN' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid Transition');
    });

    it('CANCELLED → OPEN (terminal state)', async () => {
      // Arrange
      const ticket = await createTestTicket();
      await advanceToStatus(ticket.id, ['CANCELLED']);

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'OPEN' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid Transition');
    });
  });

  // ─── Validation & Edge Cases ─────────────────────────────────────────────────

  describe('validation and edge cases', () => {
    it('invalid status value returns 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({ status: 'BANANA' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });

    it('missing status field returns 400', async () => {
      // Arrange
      const ticket = await createTestTicket();

      // Act
      const res = await api
        .patch(`/api/tickets/${ticket.id}/status`)
        .send({});

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });

    it('unknown ticket id returns 404', async () => {
      // Act
      const res = await api
        .patch('/api/tickets/99999/status')
        .send({ status: 'IN_PROGRESS' });

      // Assert
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });

    it('non-numeric ticket id returns 400', async () => {
      // Act
      const res = await api
        .patch('/api/tickets/abc/status')
        .send({ status: 'IN_PROGRESS' });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('number');
    });
  });
});
