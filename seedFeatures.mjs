import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.siteFeature.count();
  if (c <= 1) {
    await prisma.siteFeature.deleteMany();
    await prisma.siteFeature.createMany({
      data: [
        {
          icon: "Tv",
          title: "TV Ao Vivo & Esportes",
          description: "Canais em alta definição com guia de programação interativo e sem travamentos.",
          order: 1
        },
        {
          icon: "Smartphone",
          title: "Multiplataforma",
          description: "Disponível em Android, Smart TV, TV Box, iOS e computadores Windows.",
          order: 2
        },
        {
          icon: "Globe",
          title: "Servidores Globais",
          description: "Infraestrutura de baixa latência distribuída para máxima estabilidade.",
          order: 3
        },
        {
          icon: "ShieldCheck",
          title: "Ativação Imediata",
          description: "Suporte dedicado com liberação rápida e teste sem compromisso.",
          order: 4
        }
      ]
    });
    console.log('Features seeded');
  } else {
    console.log('Features already exist');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
