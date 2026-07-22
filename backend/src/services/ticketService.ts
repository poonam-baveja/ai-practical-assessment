import { PrismaClient, Prisma } from '@prisma/client';
import type { CreateTicketInput, TicketQueryInput } from '../validators/ticketValidator';

const prisma = new PrismaClient();

/**
 * Fetches tickets with optional search and status filter.
 * If no filters provided, returns all tickets ordered by most recent first.
 */
export const getAllTickets = async (query?: TicketQueryInput) => {
  const where: Prisma.TicketWhereInput = {};

  // Status filter
  if (query?.status) {
    where.status = query.status;
  }

  // Search by title or description (case-insensitive)
  if (query?.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  return prisma.ticket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Creates a new ticket with status defaulting to OPEN.
 * Only accepts title and description — status is set server-side.
 */
export const createTicket = async (data: CreateTicketInput) => {
  return prisma.ticket.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      status: 'OPEN',
    },
  });
};

/**
 * Fetches a single ticket by ID.
 * Returns null if not found.
 */
export const getTicketById = async (id: number) => {
  return prisma.ticket.findUnique({
    where: { id },
  });
};

/**
 * Updates the status of an existing ticket.
 * Caller must ensure the transition is valid before calling.
 */
export const updateTicketStatus = async (id: number, status: string) => {
  return prisma.ticket.update({
    where: { id },
    data: { status: status as any },
  });
};
