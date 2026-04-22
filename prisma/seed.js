const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

// Ajuste para Prisma 7 - Passando a URL manualmente se necessário
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Iniciando seed no Supabase...");

  await prisma.movie.deleteMany();
  await prisma.category.deleteMany();

  console.log("Banco limpo.");

  // Criar Categorias
  await prisma.category.create({ data: { name: "Esportes Ao Vivo" } });
  await prisma.category.create({ data: { name: "Documentários" } });
  await prisma.category.create({ data: { name: "Filmes de Esporte" } });

  console.log("Categorias criadas.");

  // Criar Filmes
  const movies = [
    {
      title: "Final Champions League 2026",
      description: "O maior espetáculo do futebol europeu.",
      thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "2h 45m",
      genre: "Futebol",
      rating: "99%",
      year: 2026,
      categoryName: "Esportes Ao Vivo"
    },
    {
      title: "NBA Finals: Game 7",
      description: "Tudo ou nada na quadra.",
      thumbnailUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "2h 15m",
      genre: "Basquete",
      rating: "95%",
      year: 2026,
      categoryName: "Esportes Ao Vivo"
    }
  ];

  for (const m of movies) {
    const { categoryName, ...movieData } = m;
    await prisma.movie.create({
      data: {
        ...movieData,
        categories: {
          connect: { name: categoryName },
        },
      },
    });
  }

  console.log("Seed finalizado!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
