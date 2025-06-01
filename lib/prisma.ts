import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Ensure Prisma only runs on server-side
if (typeof window !== 'undefined') {
  throw new Error('Prisma Client should not be used in the browser');
}

