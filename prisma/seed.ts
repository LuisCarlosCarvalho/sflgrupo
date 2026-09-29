import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("S@l798412", 10);
  const testUserPasswordHash = await bcrypt.hash("User@SFL2026", 10);

  const admin = await prisma.user.upsert({
    where: { email: "brasilviptv@gmail.com" },
    update: {
      role: "ADMIN",
      status: "ACTIVE",
      plan: "VIP",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "brasilviptv@gmail.com",
      name: "Administrador SFL",
      role: "ADMIN",
      status: "ACTIVE",
      plan: "VIP",
      passwordHash: adminPasswordHash,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "teste@sflgrupo.store" },
    update: {
      status: "ACTIVE",
      plan: "PRO",
      passwordHash: testUserPasswordHash,
    },
    create: {
      email: "teste@sflgrupo.store",
      name: "Usuário Teste",
      role: "USER",
      status: "ACTIVE",
      plan: "PRO",
      passwordHash: testUserPasswordHash,
    },
  });

  console.log("Iniciando população de canais e programação...");

  // Limpeza de tabelas para inserção limpa
  await prisma.tVProgram.deleteMany();
  await prisma.tVChannel.deleteMany();

  const channelsData = [
    {
      channelNum: "001",
      name: "RECORD NEWS HD",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Record_News_2016.png/260px-Record_News_2016.png",
      streamUrl: "https://stream.recordnews.r7.com/live/recordnews.m3u8",
      category: "NOTÍCIAS",
    },
    {
      channelNum: "002",
      name: "TV BRASIL HD",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/TV_Brasil_logo_2019.png/300px-TV_Brasil_logo_2019.png",
      streamUrl: "https://ebc-tvbrasil-hls.staging.ebc.com.br/index.m3u8",
      category: "ABERTOS",
    },
    {
      channelNum: "003",
      name: "TV CULTURA HD",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/TV_Cultura_logo.png/260px-TV_Cultura_logo.png",
      streamUrl: "https://stream.tvcultura.com.br/live/tvcultura.m3u8",
      category: "ABERTOS",
    },
    {
      channelNum: "004",
      name: "CANAL GOV",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Canal_Gov_logo.png/260px-Canal_Gov_logo.png",
      streamUrl: "https://ebc-gov-hls.staging.ebc.com.br/index.m3u8",
      category: "DOCUMENTÁRIOS",
    },
    {
      channelNum: "005",
      name: "REDE VIDA",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rede_Vida_2018.png/260px-Rede_Vida_2018.png",
      streamUrl: "https://stream.redevida.com.br/live/redevida.m3u8",
      category: "TODOS",
    },
  ];

  const now = new Date();

  for (const c of channelsData) {
    const channel = await prisma.tVChannel.create({
      data: c,
    });

    // Programação em blocos contínuos cobrindo o dia
    const p1Start = new Date(now.getTime() - 45 * 60 * 1000);
    const p1End = new Date(now.getTime() + 45 * 60 * 1000);
    const p2End = new Date(p1End.getTime() + 90 * 60 * 1000);
    const p3End = new Date(p2End.getTime() + 60 * 60 * 1000);

    await prisma.tVProgram.createMany({
      data: [
        {
          channelId: channel.id,
          title: `${c.name} - Ao Vivo`,
          description: `Transmissão em tempo real do canal ${c.name} com cobertura completa e alta definição.`,
          startTime: p1Start,
          endTime: p1End,
          isLive: true,
          category: c.category,
        },
        {
          channelId: channel.id,
          title: `Edição Especial: ${c.name}`,
          description: "Programação exclusiva com debates, análises e as principais informações do momento.",
          startTime: p1End,
          endTime: p2End,
          isLive: false,
          category: c.category,
        },
        {
          channelId: channel.id,
          title: "Sessão Noturna",
          description: "Conteúdo especial noturno da grade oficial da emissora.",
          startTime: p2End,
          endTime: p3End,
          isLive: false,
          category: c.category,
        },
      ],
    });
  }

  console.log("Seed concluído com sucesso:", { admin: admin.email, test: testUser.email });
  console.log("População de canais e programação concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
