import { PrismaClient } from '@prisma/client';

const props = ["url", "datasourceUrl", "datasourceURL", "databaseUrl", "dbUrl", "connectionString"];

for (const prop of props) {
  try {
    const opts = { [prop]: process.env.DATABASE_URL };
    // @ts-ignore
    const prisma = new PrismaClient(opts);
    console.log(`Success with ${prop}`);
    process.exit(0);
  } catch (e) {
    console.log(`Failed with ${prop}: ${e.message.split('\n')[0]}`);
  }
}
