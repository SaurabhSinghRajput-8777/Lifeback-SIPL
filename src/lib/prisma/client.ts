import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!globalForPrisma.prisma) {
      const connectionString = `${process.env.DATABASE_URL}`;
      const pool = new Pool({ connectionString });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = new PrismaPg(pool as any);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return globalForPrisma.prisma[prop as keyof PrismaClient];
  },
});
