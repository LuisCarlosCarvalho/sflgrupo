import prisma from "./prisma";

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("Success! Found users:", users.length);
  } catch (error) {
    console.error("Prisma Connection Test Failed:", error);
  } finally {
    process.exit();
  }
}

test();
