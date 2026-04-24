import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed final SFL Stream...");

  // Limpar dados existentes
  await prisma.movie.deleteMany();
  await prisma.category.deleteMany();

  // 1. Criar Categorias solicitadas
  const catLancamentos = await prisma.category.create({
    data: { name: "Lançamentos" },
  });

  const catCanaisAoVivo = await prisma.category.create({
    data: { name: "Canais ao Vivo" },
  });

  const catSeriesPremium = await prisma.category.create({
    data: { name: "Séries Premium" },
  });

  // 2. Criar Filmes/Eventos (2 por categoria)
  const movies = [
    // Lançamentos
    {
      title: "O Desafio SFL",
      description: "Um mergulho profundo no mundo dos esportes radicais.",
      thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e3adbb10c3?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "1h 30m",
      categoryId: catLancamentos.id,
      genre: "Ação",
      rating: "98%",
      year: 2026,
    },
    {
      title: "Rumo à Vitória",
      description: "A história de superação de um time desacreditado.",
      thumbnailUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "2h 05m",
      categoryId: catLancamentos.id,
      genre: "Drama",
      rating: "95%",
      year: 2026,
    },
    // Canais ao Vivo
    {
      title: "SFL Sports 24h",
      description: "O melhor do esporte mundial em tempo real.",
      thumbnailUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "Ao Vivo",
      categoryId: catCanaisAoVivo.id,
      genre: "Live",
      rating: "100%",
      year: 2026,
    },
    {
      title: "Arena SFL",
      description: "Debates e análises dos principais jogos da rodada.",
      thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "Ao Vivo",
      categoryId: catCanaisAoVivo.id,
      genre: "Talk Show",
      rating: "92%",
      year: 2026,
    },
    // Séries Premium
    {
      title: "Império do Futebol",
      description: "Os bastidores das maiores transações do futebol moderno.",
      thumbnailUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "10 Episódios",
      categoryId: catSeriesPremium.id,
      genre: "Documentário",
      rating: "97%",
      year: 2025,
    },
    {
      title: "Lendas das Pistas",
      description: "A vida e carreira dos pilotos que mudaram a história da F1.",
      thumbnailUrl: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "8 Episódios",
      categoryId: catSeriesPremium.id,
      genre: "Histórico",
      rating: "99%",
      year: 2025,
    },
  ];

  for (const m of movies) {
    const { categoryId, ...movieData } = m;
    await prisma.movie.create({
      data: {
        ...movieData,
        category: "Video", // Preenchendo o campo String obrigatório
        categories: {
          connect: { id: categoryId },
        },
      },
    });
  }

  console.log("Seed SFL Stream finalizado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
