import axios from 'axios';
import * as cheerio from 'cheerio';
import { SportsEvent } from '../types';

export async function scrapeUEFA(): Promise<SportsEvent[]> {
  try {
    const { data } = await axios.get('https://www.espn.com.br/futebol/calendario/_/liga/uefa.champions', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    const events: SportsEvent[] = [];

    $('.Table__TR--sm').each((i, el) => {
      if (i > 8) return;
      const teams = $(el).find('.Table__Team').toArray();
      if (teams.length < 2) return;

      const homeElement = $(teams[0]);
      const awayElement = $(teams[1]);

      const home = homeElement.text().trim();
      const away = awayElement.text().trim();
      
      let homeLogo, awayLogo;
      const homeLink = homeElement.find('a').attr('href');
      const awayLink = awayElement.find('a').attr('href');
      
      if (homeLink) {
        const match = homeLink.match(/\/id\/(\d+)\//);
        if (match) homeLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${match[1]}.png`;
      }
      if (awayLink) {
        const match = awayLink.match(/\/id\/(\d+)\//);
        if (match) awayLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${match[1]}.png`;
      }

      let time = $(el).find('.date__col').text().trim() || '16:00'; 
      
      if (!home || !away) return;

      const timeMatch = time.match(/\d{2}:\d{2}/);
      if (timeMatch) {
          time = timeMatch[0];
      } else {
          time = '16:00'; 
      }

      const d = new Date();
      d.setDate(d.getDate() + Math.floor(i / 3));
      const date = d.toISOString().split('T')[0];

      events.push({
        sport: 'futebol',
        league: 'UEFA Champions League',
        home,
        away,
        homeLogo,
        awayLogo,
        date,
        time,
        broadcast: ['TNT Sports', 'Max', 'SBT'],
        countryCode: 'eu'
      });
    });

    return events;
  } catch (error) {
    console.error('UEFA Scraper Error:', error);
    return [];
  }
}
