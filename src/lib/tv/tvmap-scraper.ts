import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'scratch', 'tvmap_cache');
const CACHE_DURATION = 1000 * 60 * 60 * 2; // 2 horas

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

interface TVMapProgram {
  title: string;
  description: string;
  start: string;
  end: string;
  image: string;
}

interface TVMapChannel {
  id: string;
  name: string;
  programs: TVMapProgram[];
}

export async function fetchTVMapChannel(slug: string): Promise<TVMapChannel | null> {
  const cacheFile = path.join(CACHE_DIR, `${slug}.json`);

  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    if (Date.now() - stats.mtimeMs < CACHE_DURATION) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        if (cached.programs && cached.programs.length > 0) return cached;
      } catch { /* Ignora erro de cache */ }
    }
  }

  try {
    // Normalizar slug para TVMap (ex: Globo, Animal-Planet)
    const formattedSlug = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
    const url = `https://tvmap.com.br/${formattedSlug}`;
    console.log(`[TVMap Scraper] Buscando: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const programs: TVMapProgram[] = [];
    const now = new Date();
    const dateCompact = now.toISOString().split('T')[0].replace(/-/g, '');

    // O TVMap usa div.exhibition-card para cada programa na página do canal
    $('div.exhibition-card').each((_i, el) => {
      const title = $(el).find('strong.exhibition-title').text().trim();
      const timeStr = $(el).find('span.label-time').text().replace('h', '').trim();
      const description = $(el).find('p.exhibition-description').text().trim();
      const image = $(el).find('img.exhibition-card-image').attr('src') || '';

      if (title && timeStr) {
        // Formato timeStr: "15:40"
        const formattedStart = `${dateCompact}${timeStr.replace(':', '')}00 +0000`;
        programs.push({
          title,
          description,
          start: formattedStart,
          end: '',
          image
        });
      }
    });

    if (programs.length === 0) {
      console.warn(`[TVMap Scraper] Nenhum programa encontrado para ${formattedSlug}`);
      return null;
    }

    // Ordenar e calcular términos
    programs.sort((a, b) => a.start.localeCompare(b.start));

    for (let i = 0; i < programs.length; i++) {
      if (i < programs.length - 1) {
        programs[i].end = programs[i + 1].start;
      } else {
        const hour = parseInt(programs[i].start.substring(8, 10));
        programs[i].end = programs[i].start.substring(0, 8) + ((hour + 2) % 24).toString().padStart(2, '0') + programs[i].start.substring(10);
      }
    }

    const channelData: TVMapChannel = {
      id: slug,
      name: formattedSlug.replace(/-/g, ' '),
      programs
    };

    fs.writeFileSync(cacheFile, JSON.stringify(channelData));
    return channelData;
  } catch (error) {
    const err = error as Error;
    console.error(`[TVMap Scraper] Erro (${slug}):`, err.message);
    return null;
  }
}
