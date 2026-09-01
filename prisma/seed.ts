import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@SFL2026", 10);
  const testUserPasswordHash = await bcrypt.hash("User@SFL2026", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sflgrupo.store" },
    update: {},
    create: {
      email: "admin@sflgrupo.store",
      name: "Administrador SFL",
      role: "ADMIN",
      status: "ACTIVE",
      plan: "VIP",
      passwordHash: adminPasswordHash,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "teste@sflgrupo.store" },
    update: {},
    create: {
      email: "teste@sflgrupo.store",
      name: "Usuário Teste",
      role: "USER",
      status: "ACTIVE",
      plan: "PRO",
      passwordHash: testUserPasswordHash,
    },
  });

  const channelCount = await prisma.tVChannel.count();
  if (channelCount === 0) {
    const channel1 = await prisma.tVChannel.create({
      data: {
        channelNum: "001",
        name: "RECORD SP HD¹",
        logoUrl: "https://upload.wikimedia.org/wikipedia/pt/7/77/RecordTV_2016.png",
        streamUrl: "https://stream.sflgrupo.store/live/record.m3u8",
        category: "ABERTOS",
      },
    });

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    await prisma.tVProgram.create({
      data: {
        channelId: channel1.id,
        title: "Jornal da Record",
        description: "Noticiário nacional e internacional com reportagens exclusivas.",
        startTime: now,
        endTime: oneHourLater,
        isLive: true,
      },
    });
  }

  console.log("Seed concluído com sucesso:", { admin: admin.email, test: testUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
