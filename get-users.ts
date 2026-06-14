import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.update({
    where: { clerkId: 'user_3F4nrZMhzl5K9rkqppdX1Gw3AgE' },
    data: { role: 'CLINICIAN' }
  });
  console.log("Updated to clinician");
}
main().catch(console.error).finally(() => prisma.$disconnect());
