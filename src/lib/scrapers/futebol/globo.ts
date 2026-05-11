import axios from 'axios';
import * as cheerio from 'cheerio';
import { SportsEvent } from '../types';

export async function scrapeFutebol(): Promise<SportsEvent[]> {
  try {
    // Para simplificar e evitar bloqueios severos da API do GE, 
    // faremos scraping de uma fonte HTML amigável como Gazeta ou Terra, 
    // ou usamos um endpoint aberto genérico (aqui simulamos o parsing)
    // Em produção real, recomenda-se consumir a API do api-football.com
    
    // Substituindo pelo ESPN calendário que é mais estruturado em HTML
    const { data } = await axios.get('https://www.espn.com.br/futebol/calendario/_/liga/bra.1', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    const events: SportsEvent[] = [];

    let currentDate = new Date().toISOString().split('T')[0];
    
    $('.Table__Title, .Table__TR--sm').each((_, el) => {
      const $el = $(el);
      
      // Se for um header de data
      if ($el.hasClass('Table__Title')) {
        const dateText = $el.text().trim(); // Ex: "segunda-feira, 28 de abril"
        // Tentar extrair dia e mês
        const matchDate = dateText.match(/(\d{1,2}) de (\w+)/);
        if (matchDate) {
          const day = parseInt(matchDate[1]);
          const monthStr = matchDate[2].toLowerCase();
          const months: Record<string, number> = {
            'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
            'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
          };
          const month = months[monthStr] ?? new Date().getMonth();
          const d = new Date();
          d.setMonth(month);
          d.setDate(day);
          currentDate = d.toISOString().split('T')[0];
        }
        return;
      }

      // Se for uma linha de jogo
      if ($el.hasClass('Table__TR--sm')) {
        const teams = $el.find('.Table__Team').toArray();
        if (teams.length < 2) return;

        const home = $(teams[0]).text().trim();
        const away = $(teams[1]).text().trim();
        
        let homeLogo, awayLogo;
        const homeLink = $(teams[0]).find('a').attr('href');
        const awayLink = $(teams[1]).find('a').attr('href');
        
        if (homeLink) {
          const m = homeLink.match(/\/id\/(\d+)\//);
          if (m) homeLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${m[1]}.png`;
        }
        if (awayLink) {
          const m = awayLink.match(/\/id\/(\d+)\//);
          if (m) awayLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${m[1]}.png`;
        }

        const timeText = $el.find('.date__col').text().trim();
        const timeMatch = timeText.match(/\d{2}:\d{2}/);
        
        if (!timeMatch || !home || !away) return; // Pula se não tiver horário (jogo já rolou ou cancelado)

        events.push({
          sport: 'futebol',
          league: 'Brasileirão Série A',
          home,
          away,
          homeLogo,
          awayLogo,
          date: currentDate,
          time: timeMatch[0],
          broadcast: ['Premiere', 'Globo', 'SporTV'],
        });
      }
    });

    return events;
  } catch {
    console.error('Futebol Scraper Error');
    return [];
  }
}
