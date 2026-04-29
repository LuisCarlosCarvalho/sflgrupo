import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'scratch', 'mitv_cache');
const CACHE_DURATION = 1000 * 60 * 60 * 2; // 2 horas

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export async function fetchMiTVChannel(slug: string) {
  const cacheFile = path.join(CACHE_DIR, `${slug}.json`);

  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    if (Date.now() - stats.mtimeMs < CACHE_DURATION) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        if (cached.programs && cached.programs.length > 0) return cached;
      } catch (e) {}
    }
  }

  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-CA');
    const url = `https://mi.tv/br/async/channel/${slug}/${dateStr}/-180`;
    console.log(`[MiTV Scraper] Buscando Canal: ${slug}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const programs: any[] = [];
    const dateCompact = dateStr.replace(/-/g, '');

    // Capturar Logo do Canal se disponível no cabeçalho do async
    const channelLogo = $('.channel-info img').attr('src') || '';

    $('ul.broadcasts li').each((i, el) => {
      const link = $(el).find('a.program-link');
      if (link.length === 0) return;

      const time = link.find('span.time').text().trim();
      let titleNode = link.find('h2').clone();
      titleNode.find('img').remove();
      const title = titleNode.text().trim();
      
      const description = link.find('p.synopsis').text().trim();
      const imageStyle = link.find('.image').attr('style') || '';
      const imageMatch = imageStyle.match(/url\('(.+?)'\)/);
      const image = imageMatch ? imageMatch[1] : '';

      if (time && title) {
        const formattedStart = `${dateCompact}${time.replace(':', '')}00 +0000`;
        programs.push({
          title,
          description,
          start: formattedStart,
          end: '',
          image
        });
      }
    });

    if (programs.length === 0) return null;

    // Ordenar e calcular términos
    programs.sort((a, b) => a.start.localeCompare(b.start));

    for (let i = 0; i < programs.length; i++) {
      if (i < programs.length - 1) {
        programs[i].end = programs[i + 1].start;
      } else {
        const h = parseInt(programs[i].start.substring(8, 10));
        programs[i].end = programs[i].start.substring(0, 8) + ((h + 2) % 24).toString().padStart(2, '0') + programs[i].start.substring(10);
      }
    }

    const channelData = {
      id: slug,
      name: slug.toUpperCase(),
      logo_url: channelLogo,
      programs
    };

    fs.writeFileSync(cacheFile, JSON.stringify(channelData));
    return channelData;
  } catch (error: any) {
    console.error(`[MiTV Scraper] Erro (${slug}):`, error.message);
    return null;
  }
}
