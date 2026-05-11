import axios from 'axios';
import * as cheerio from 'cheerio';
import { SportsEvent } from '../types';

export async function scrapeSherdog(): Promise<SportsEvent[]> {
  try {
    const { data } = await axios.get('https://www.sherdog.com/events', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    const events: SportsEvent[] = [];

    // Sherdog holds future events in a table
    $('#upcoming_tab table tr').each((i, el) => {
      if (i === 0) return; // skip header
      const dateStr = $(el).find('meta[itemprop="startDate"]').attr('content');
      const name = $(el).find('meta[itemprop="name"]').attr('content');
      
      if (!dateStr || !name) return;

      // name format typically: "UFC Fight Night 274 - Sterling vs. Zalal"
      const [leaguePart, fightPart] = name.split(' - ');
      const league = leaguePart ? leaguePart.trim() : name.trim();
      let home = name.trim();
      let away: string | undefined = undefined;

      if (fightPart) {
        const fighters = fightPart.split(' vs. ');
        home = fighters[0]?.trim();
        if (fighters.length > 1) {
          away = fighters[1]?.trim();
        }
      } else {
         home = league;
      }

      const d = new Date(dateStr);
      // Validate date
      if (isNaN(d.getTime())) return;

      const date = d.toISOString().split('T')[0];
      // Time is sometimes 00:00:00 on Sherdog for unconfirmed times, but let's extract it
      const time = d.toISOString().split('T')[1].substring(0, 5);

      // Simple broadcast detection based on event name
      const broadcast = [];
      const leagueLower = league.toLowerCase();
      if (leagueLower.includes('ufc')) {
        broadcast.push('UFC Fight Pass');
        broadcast.push('Combate'); // Brazil common
      } else if (leagueLower.includes('pfl')) {
        broadcast.push('Combate');
        broadcast.push('DAZN');
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
  } catch {
    console.error('Sherdog Scraper Error');
    return [];
  }
}
