import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
type GlobalWithPrisma = typeof globalThis & { prisma: PrismaClient };

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as GlobalWithPrisma;
  if (!globalWithPrisma.prisma) {
    (globalWithPrisma as any).prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
