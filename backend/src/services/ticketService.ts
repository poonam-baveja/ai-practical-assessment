import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import type { CreateTicketInput, TicketQueryInput, UpdateTicketInput } from '../validators/ticketValidator';

/**
 * Shared include config for ticket queries.
 * Returns only id, name, email for related users — no unnecessary fields.
 */
const ticketIncludes = {
  createdBy: {
    select: { id: true, name: true, email: true },
  },
  assignedTo: {
    select: { id: true, name: true, email: true },
  },
} as const;

/**
 * Fetches tickets with optional search and status filter.
 * Includes priority, createdBy, and assignedTo in the response.
 */
export const getAllTickets = async (query?: TicketQueryInput) => {
  const where: Prisma.TicketWhereInput = {};

  if (query?.status) {
    where.status = query.status;
  }

  if (query?.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  return prisma.ticket.findMany({
    where,
    include: ticketIncludes,
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Creates a new ticket with status defaulting to OPEN.
 * Accepts title, description, priority, assignedToId, createdById.
 * Priority defaults to MEDIUM if not provided.
 */
export const createTicket = async (data: CreateTicketInput) => {
  return prisma.ticket.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      status: 'OPEN',
      priority: data.priority ?? 'MEDIUM',
      assignedToId: data.assignedToId ?? null,
      createdById: data.createdById ?? null,
    },
    include: ticketIncludes,
  });
};

/**
 * Fetches a single ticket by ID.
 * Includes priority, createdBy, assignedTo, and comments.
 * Returns null if not found.
 */
export const getTicketById = async (id: number) => {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      ...ticketIncludes,
      comments: {
        orderBy: { createdAt: 'asc' },
      },
    },
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
    include: ticketIncludes,
  });
};

/**
 * Updates a ticket's editable fields (title, description, priority, assignedToId).
 * Only updates fields that are provided in the input.
 * Does NOT allow updating status or createdBy.
 */
export const updateTicket = async (id: number, data: UpdateTicketInput) => {
  const updateData: Prisma.TicketUpdateInput = {};

  if (data.title !== undefined) {
    updateData.title = data.title.trim();
  }
  if (data.description !== undefined) {
    updateData.description = data.description.trim();
  }
  if (data.priority !== undefined) {
    updateData.priority = data.priority;
  }
  if (data.assignedToId !== undefined) {
    if (data.assignedToId === null) {
      updateData.assignedTo = { disconnect: true };
    } else {
      updateData.assignedTo = { connect: { id: data.assignedToId } };
    }
  }

  return prisma.ticket.update({
    where: { id },
    data: updateData,
    include: ticketIncludes,
  });
};
