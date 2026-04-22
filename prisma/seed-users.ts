import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Criando usuários de acesso...");

  // 1. Criar Admin
  const adminPassword = await bcrypt.hash("S@l798412", 10);
  await prisma.user.upsert({
    where: { email: "brasilviptv@gmail.com" },
    update: {
      password: adminPassword,
      isActive: true,
      planType: "PREMIUM",
    },
    create: {
      name: "Admin",
      email: "brasilviptv@gmail.com",
      password: adminPassword,
      isActive: true,
      planType: "PREMIUM",
    },
  });

  // 2. Criar Usuário Teste
  const userPassword = await bcrypt.hash("1234", 10);
  await prisma.user.upsert({
    where: { email: "user@teste.com" },
    update: {
      password: userPassword,
      isActive: false, 
      planType: "FREE",
    },
    create: {
      name: "User Teste",
      email: "user@teste.com",
      password: userPassword,
      isActive: false,
      planType: "FREE",
    },
  });

  console.log("Usuários criados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
