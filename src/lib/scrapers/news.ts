import { NewsArticle } from "./types";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

async function fetchFromRapidAPI(hostname: string, path: string) {
  if (!RAPIDAPI_KEY) return null;

  try {
    const response = await fetch(`https://${hostname}${path}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": hostname,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro News API (${hostname}): ${response.status} - ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro News API (${hostname}${path}):`, error);
    return null;
  }
}

// Notícias de Fallback para quando a API falhar (ex: falta de assinatura)
const fallbackNews = [
  {
    id: "fb-1",
    title: "Mercado da Bola: Grandes movimentações agitam a Europa",
    summary: "Clubes da Premier League e La Liga iniciam conversas para as próximas janelas de transferências. Nomes de peso estão no radar.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070",
    date: new Date().toISOString(),
    category: "Transferências",
    source: "SFL Stream News",
    url: "#"
  },
  {
    id: "fb-2",
    title: "NFL: Preparativos para a nova temporada a todo vapor",
    summary: "Equipes iniciam treinamentos e o draft promete revelar grandes talentos para o futebol americano este ano.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2026",
    date: new Date().toISOString(),
    category: "NFL",
    source: "SFL Stream News",
    url: "#"
  },
  {
    id: "fb-3",
    title: "Futebol: As promessas que podem brilhar no Brasileirão",
    summary: "Analistas apontam jovens talentos das categorias de base que devem ganhar espaço nos times principais este mês.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093",
    date: new Date().toISOString(),
    category: "Futebol",
    source: "SFL Stream News",
    url: "#"
  }
];

export async function fetchSportsNews(): Promise<NewsArticle[]> {
  const [soccerNews, soccerTransfers, nflNews] = await Promise.all([
    fetchFromRapidAPI("sports-information.p.rapidapi.com", "/soccer/news"),
    fetchFromRapidAPI("sports-information.p.rapidapi.com", "/soccer/transfers"),
    fetchFromRapidAPI("nfl-api-data.p.rapidapi.com", "/nfl-team-listing/v1/data") 
  ]);

  const articles: NewsArticle[] = [];

  // Mapear Notícias de Futebol
  if (soccerNews?.articles) {
    soccerNews.articles.forEach((art: { id: string | number; title: string; description?: string; teaser?: string; images?: { url: string }[]; published: string; links?: { web?: { href: string } } }) => {
      articles.push({
        id: `soccer-news-${art.id || Math.random()}`,
        title: art.title,
        summary: art.description || art.teaser || "",
        image: art.images?.[0]?.url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093",
        date: art.published,
        category: "Futebol",
        source: "ESPN / Sports Info",
        url: art.links?.web?.href || "#"
      });
    });
  }

  // Mapear Transferências
  if (soccerTransfers?.transfers) {
    soccerTransfers.transfers.slice(0, 10).forEach((tr: { id: string | number; player?: { name: string; image: string }; teamTo?: { name: string }; teamFrom?: { name: string }; value?: string }) => {
      articles.push({
        id: `transfer-${tr.id || Math.random()}`,
        title: `${tr.player?.name} vai para ${tr.teamTo?.name}`,
        summary: `Mercado da Bola: O jogador ${tr.player?.name} deixou o ${tr.teamFrom?.name} para reforçar o ${tr.teamTo?.name}. Valor estimado: ${tr.value || 'Não divulgado'}.`,
        image: tr.player?.image || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070",
        date: new Date().toISOString(),
        category: "Transferências",
        source: "Mercado da Bola",
        url: "#"
      });
    });
  }

  // Mapear NFL
  if (nflNews?.sports?.[0]?.leagues?.[0]?.teams) {
    nflNews.sports[0].leagues[0].teams.slice(0, 10).forEach((t: { team: { id: string; displayName: string; logos?: { href: string }[]; links?: { href: string }[] } }) => {
      const team = t.team;
      articles.push({
        id: `nfl-team-${team.id}`,
        title: `NFL: Tudo sobre o ${team.displayName}`,
        summary: `Confira as últimas atualizações, estatísticas e o elenco completo do ${team.displayName} para a próxima temporada da NFL.`,
        image: team.logos?.[0]?.href || "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2026",
        date: new Date().toISOString(),
        category: "NFL",
        source: "NFL Data",
        url: team.links?.[0]?.href || "#"
      });
    });
  }

  // Se não houver notícias reais (erro de assinatura ou API vazia), retorna as de fallback
  if (articles.length === 0) {
    return fallbackNews;
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
