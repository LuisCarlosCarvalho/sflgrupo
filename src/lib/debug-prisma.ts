import { PrismaClient } from '@prisma/client';

console.log("Environment DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");

try {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl: process.env.DATABASE_URL
  });
  console.log("PrismaClient initialized with datasourceUrl");
} catch (e) {
  console.log("Failed with datasourceUrl:", e.message);
}

try {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  console.log("PrismaClient initialized with datasources");
} catch (e) {
  console.log("Failed with datasources:", e.message);
}

try {
  const prisma = new PrismaClient();
  console.log("PrismaClient initialized with no options");
} catch (e) {
  console.log("Failed with no options:", e.message);
}
