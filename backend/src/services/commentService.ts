import prisma from '../lib/prisma';
import type { CreateCommentInput } from '../validators/commentValidator';

/**
 * Shared include for comment queries — includes the author's name.
 */
const commentIncludes = {
  createdBy: {
    select: { id: true, name: true, email: true },
  },
} as const;

/**
 * Fetches all comments for a given ticket, ordered oldest first.
 * Includes the comment author's name.
 */
export const getCommentsByTicketId = async (ticketId: number) => {
  return prisma.comment.findMany({
    where: { ticketId },
    include: commentIncludes,
    orderBy: { createdAt: 'asc' },
  });
};

/**
 * Creates a comment on a ticket.
 * Returns the created comment with author info.
 */
export const createComment = async (ticketId: number, data: CreateCommentInput) => {
  return prisma.comment.create({
    data: {
      message: data.message.trim(),
      ticketId,
      createdById: data.createdById ?? null,
    },
    include: commentIncludes,
  });
};

/**
 * Checks if a ticket exists.
 */
export const ticketExists = async (ticketId: number): Promise<boolean> => {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  return ticket !== null;
};
