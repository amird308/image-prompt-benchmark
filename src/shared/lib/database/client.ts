import { PrismaClient } from '@prisma/client';
import { env } from '@/shared/lib/env';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });
};

// Prevent multiple instances of Prisma Client in development
export const db = globalThis.__prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = db;
} 