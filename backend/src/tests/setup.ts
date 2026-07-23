import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

/**
 * Pre-configured Supertest agent bound to the Express app.
 * Does NOT start an HTTP server — requests go directly through Express's pipeline.
 */
export const api = request(app);

/**
 * Prisma client instance for direct database operations in tests.
 * Used for cleanup and verification — not for mocking.
 */
export const prisma = new PrismaClient();

// ─── Test Helpers ──────────────────────────────────────────────────────────────

/**
 * Creates a fresh ticket via the API and returns its id.
 * Each test that needs a ticket should call this for isolation.
 */
export async function createTestTicket(overrides?: {
  title?: string;
  description?: string;
}): Promise<{ id: number; title: string; description: string; status: string }> {
  const res = await api.post('/api/tickets').send({
    title: overrides?.title ?? 'Test ticket',
    description: overrides?.description ?? 'Test description for integration testing.',
  });
  return res.body;
}

/**
 * Advances a ticket through a sequence of status transitions.
 * Useful for setting up preconditions (e.g., get a ticket to RESOLVED state).
 */
export async function advanceToStatus(ticketId: number, statuses: string[]) {
  for (const status of statuses) {
    await api.patch(`/api/tickets/${ticketId}/status`).send({ status });
  }
}

/**
 * Deletes all tickets and comments created during tests.
 * Call in afterAll() to reset the database for the next suite.
 */
export async function cleanupTestData() {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
}

/**
 * Re-seeds the database with the standard sample data.
 * Call after cleanup to restore a known baseline.
 */
export async function reseedDatabase() {
  const { PrismaClient } = await import('@prisma/client');
  const seedPrisma = new PrismaClient();

  await seedPrisma.comment.deleteMany();
  await seedPrisma.ticket.deleteMany();

  const ticket1 = await seedPrisma.ticket.create({
    data: {
      title: 'Login page returns 500 error after password reset',
      description: 'After completing the password reset flow, attempting to log in results in a 500 error.',
      status: 'OPEN',
    },
  });

  const ticket2 = await seedPrisma.ticket.create({
    data: {
      title: 'Dashboard charts not loading on Safari',
      description: 'Charts render on Chrome and Firefox but show blank on Safari 17.',
      status: 'IN_PROGRESS',
    },
  });

  await seedPrisma.ticket.create({
    data: {
      title: 'Add CSV export to user management table',
      description: 'Need ability to export user list as CSV from admin page.',
      status: 'RESOLVED',
    },
  });

  await seedPrisma.ticket.create({
    data: {
      title: 'Email notifications arriving with 2-hour delay',
      description: 'Transactional emails are being delivered approximately 2 hours late.',
      status: 'CLOSED',
    },
  });

  await seedPrisma.ticket.create({
    data: {
      title: 'Mobile navigation menu overlaps page content',
      description: 'On screens narrower than 375px, the hamburger menu does not cover full viewport.',
      status: 'OPEN',
    },
  });

  await seedPrisma.comment.createMany({
    data: [
      { ticketId: ticket1.id, message: 'Confirmed this is reproducible.' },
      { ticketId: ticket1.id, message: 'Found the issue — token refresh endpoint bug.' },
      { ticketId: ticket2.id, message: 'Looks like a WebKit rendering bug.' },
    ],
  });

  await seedPrisma.$disconnect();
}
