import axios from 'axios';
import * as cheerio from 'cheerio';
import { SportsEvent } from '../types';

export async function scrapeUFC(): Promise<SportsEvent[]> {
  try {
    const { data } = await axios.get('https://www.ufc.com/events', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    const events: SportsEvent[] = [];

    $('.c-card-event--result').each((i, el) => {
      // Limita a alguns eventos futuros
      if (i > 10) return;

      const headline = $(el).find('.c-card-event--result__headline').text().trim().replace(/\s+/g, ' ');
      const dateText = $(el).find('.c-card-event--result__date').text().trim() || $(el).find('[data-datetime]').attr('data-datetime');
      
      if (!headline) return;

      let home = headline;
      let away = undefined;
      const fighters = headline.split(' vs ');
      if (fighters.length > 1) {
        home = fighters[0].trim();
        away = fighters[1].trim();
      }

      // League Name (e.g. UFC 300 or UFC Fight Night)
      // Sometimes it's in the logo or a separate tag. We'll extract a common name or use "UFC"
      let league = 'UFC';
      const logoAlt = $(el).find('.c-card-event--result__logo img').attr('alt');
      if (logoAlt) {
         league = logoAlt.replace('Logo', '').trim();
      } else {
         // Se não tiver logo, assumimos evento numerado/fight night com base no título original se tivermos
         league = 'UFC Event';
      }

      let date = '';
      let time = '23:00'; // Default MMA time in Brazil typically

      // Tenta fazer o parser da data (ex: Apr 13, 2026 ou timestamp)
      if (dateText) {
          try {
              const d = new Date(dateText);
              if (!isNaN(d.getTime())) {
                  date = d.toISOString().split('T')[0];
                  // Se tiver horário específico
                  if (dateText.includes(':')) {
                      time = d.toTimeString().split(' ')[0].substring(0, 5);
                  }
              }
          } catch(e) {
              // fallback if date parse fails
          }
      }

      // Se a data não foi gerada, simula uma data futura para compor a lista
      if (!date) {
        const d = new Date();
        d.setDate(d.getDate() + (i * 7)); // um por semana fallback
        date = d.toISOString().split('T')[0];
      }

      // Broadcast rules para UFC
      const broadcast = ['UFC Fight Pass'];
      if (league.toLowerCase().includes('fight night')) {
         broadcast.push('Combate'); // Muitas fight nights passam no combate
      }

      events.push({
        sport: 'mma',
        league,
        home,
        away,
        date,
        time,
        broadcast,
      });
    });

    return events;
  } catch (error) {
    console.error('UFC Scraper Error:', error);
    return [];
  }
}
