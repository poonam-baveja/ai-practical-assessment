import { describe, it, expect, afterAll } from 'vitest';
import { api, reseedDatabase } from './setup';

describe('POST /api/tickets', () => {
  afterAll(async () => {
    await reseedDatabase();
  });

  // ─── Happy Path ──────────────────────────────────────────────────────────────

  describe('successful creation', () => {
    const validPayload = {
      title: 'Integration test ticket',
      description: 'Detailed description for testing purposes.',
    };

    it('returns 201 with the created ticket', async () => {
      // Act
      const res = await api.post('/api/tickets').send(validPayload);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: validPayload.title,
        description: validPayload.description,
        status: 'OPEN',
      });
      expect(typeof res.body.id).toBe('number');
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();
    });

    it('always defaults status to OPEN even if body includes status', async () => {
      // Act
      const res = await api.post('/api/tickets').send({
        ...validPayload,
        status: 'CLOSED',
      });

      // Assert
      expect(res.body.status).toBe('OPEN');
    });

    it('trims whitespace from title and description', async () => {
      // Act
      const res = await api.post('/api/tickets').send({
        title: '  Padded title  ',
        description: '  Padded description  ',
      });

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Padded title');
      expect(res.body.description).toBe('Padded description');
    });
  });

  // ─── Validation Errors ───────────────────────────────────────────────────────

  describe('validation errors', () => {
    it('rejects empty title', async () => {
      // Act
      const res = await api.post('/api/tickets').send({
        title: '',
        description: 'Valid description',
      });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'title' })])
      );
    });

    it('rejects missing title', async () => {
      // Act
      const res = await api.post('/api/tickets').send({
        description: 'Valid description',
      });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'title' })])
      );
    });

    it('rejects empty description', async () => {
      // Act
      const res = await api.post('/api/tickets').send({
        title: 'Valid title',
        description: '',
      });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'description' })])
      );
    });

    it('rejects missing description', async () => {
      // Act
      const res = await api.post('/api/tickets').send({
        title: 'Valid title',
      });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'description' })])
      );
    });

    it('rejects title exceeding 200 characters', async () => {
      // Arrange
      const longTitle = 'x'.repeat(201);

      // Act
      const res = await api.post('/api/tickets').send({
        title: longTitle,
        description: 'Valid description',
      });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title', message: expect.stringContaining('200') }),
        ])
      );
    });

    it('rejects description exceeding 2000 characters', async () => {
      // Arrange
      const longDescription = 'x'.repeat(2001);

      // Act
      const res = await api.post('/api/tickets').send({
        title: 'Valid title',
        description: longDescription,
      });

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'description', message: expect.stringContaining('2000') }),
        ])
      );
    });
  });
});
