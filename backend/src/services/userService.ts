import prisma from '../lib/prisma';

/**
 * Fetches all users. Returns id, name, email only.
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
};
