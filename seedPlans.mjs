import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.pricingPlan.deleteMany();
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: 'MENSAL VIP',
        priceBrl: 40,
        priceEur: 9,
        interval: 'month',
        features: ['Todos os canais liberados', 'Filmes e Séries On-Demand', 'Guia de Programação (EPG)', '1 Tela Simultânea'],
        popular: false,
        active: true
      },
      {
        name: 'TRIMESTRAL VIP',
        priceBrl: 110,
        priceEur: 24,
        interval: 'month',
        features: ['Todos os canais liberados', 'Filmes e Séries On-Demand', 'Guia de Programação (EPG)', '2 Telas Simultâneas', 'Suporte Prioritário'],
        popular: true,
        active: true
      },
      {
        name: 'ANUAL VIP',
        priceBrl: 360,
        priceEur: 85,
        interval: 'month',
        features: ['Acesso Completo por 12 meses', 'Melhor Custo-Benefício', '3 Telas Simultâneas', 'Suporte VIP via WhatsApp'],
        popular: false,
        active: true
      }
    ]
  });
  console.log('Seed success');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
