import * as cheerio from 'cheerio';
import axios from 'axios';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  source: string;
  url: string;
}

export async function fetchWebNews(): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = [];

  // 1. ESPN API (NFL, NBA, MLB, NHL, Soccer) - Fontes Oficiais e Públicas
  const espnSports = [
    { name: 'NFL', path: 'football/nfl' },
    { name: 'NBA', path: 'basketball/nba' },
    { name: 'MLB', path: 'baseball/mlb' },
    { name: 'NHL', path: 'hockey/nhl' },
    { name: 'Futebol', path: 'soccer' }
  ];

  try {
    const espnPromises = espnSports.map(async (sport) => {
      try {
        const res = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/${sport.path}/news?limit=10`);
        return res.data.articles.map((art: any) => ({
          id: `espn-${art.dataSourceIdentifier || Math.random()}`,
          title: art.headline,
          summary: art.description || art.teaser,
          image: art.images?.[0]?.url || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070",
          date: art.published,
          category: sport.name,
          source: 'ESPN',
          url: art.links?.web?.href || "#"
        }));
      } catch (err) {
        return [];
      }
    });

    const espnResults = await Promise.all(espnPromises);
    articles.push(...espnResults.flat());
  } catch (err) {
    console.error('Erro ESPN Scraper:', err);
  }

  // 2. GE (Globo Esporte) via Scaping / RSS Alternativo (Futebol Brasileiro e Geral)
  try {
    const geRes = await axios.get('https://ge.globo.com/futebol/');
    const $ = cheerio.load(geRes.data);
    
    $('.feed-post-body').each((i, el) => {
      if (i > 15) return; // Limite de 15 posts
      
      const title = $(el).find('.feed-post-link').text().trim();
      const summary = $(el).find('.feed-post-body-resumo').text().trim();
      const url = $(el).find('.feed-post-link').attr('href');
      const image = $(el).closest('.feed-post').find('.feed-media-wrapper img').attr('src');
      const cat = $(el).find('.feed-post-metadata-section').text().trim() || 'Brasil';

      if (title && url) {
        articles.push({
          id: `ge-${i}-${Math.random()}`,
          title,
          summary: summary || "Confira os detalhes desta notícia no GE Globo.",
          image: image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093",
          date: new Date().toISOString(),
          category: cat,
          source: 'GE Globo',
          url
        });
      }
    });
  } catch (err) {
    console.error('Erro GE Scraper:', err);
  }

  // 3. A Bola (Campeonato Português e Europa)
  try {
    const abolaRes = await axios.get('https://www.abola.pt/futebol/noticias');
    const $ = cheerio.load(abolaRes.data);
    
    $('.noticia-item').each((i, el) => {
      if (i > 10) return;
      const title = $(el).find('.titulo').text().trim();
      const url = 'https://www.abola.pt' + $(el).find('a').attr('href');
      const image = $(el).find('img').attr('src');

      if (title && url) {
        articles.push({
          id: `abola-${i}`,
          title,
          summary: "Acompanhe as últimas do futebol português e internacional.",
          image: image || "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070",
          date: new Date().toISOString(),
          category: 'Português',
          source: 'A Bola',
          url
        });
      }
    });
  } catch (err) {
    console.error('Erro A Bola Scraper:', err);
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
