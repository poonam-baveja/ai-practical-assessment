import { PrismaClient } from '@prisma/client';

/**
 * Singleton PrismaClient instance shared across all services.
 * Prevents multiple connections to the database.
 */
const prisma = new PrismaClient();

export default prisma;
