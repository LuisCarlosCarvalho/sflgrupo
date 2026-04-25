import axios from 'axios';
import * as cheerio from 'cheerio';
import { SportsEvent } from '../types';

export async function scrapeNFL(): Promise<SportsEvent[]> {
  try {
    const { data } = await axios.get('https://www.espn.com.br/nfl/calendario', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    const events: SportsEvent[] = [];

    $('.Table__TR--sm').each((i, el) => {
      if (i > 10) return;
      const teams = $(el).find('.Table__Team').toArray();
      if (teams.length < 2) return;

      const awayElement = $(teams[0]);
      const homeElement = $(teams[1]);

      const away = awayElement.text().trim();
      const home = homeElement.text().trim();
      
      let homeLogo, awayLogo;
      const homeLink = homeElement.find('a').attr('href');
      const awayLink = awayElement.find('a').attr('href');
      
      if (homeLink) {
        const match = homeLink.match(/\/nome\/([^\/]+)\//);
        if (match) homeLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${match[1]}.png`;
      }
      if (awayLink) {
        const match = awayLink.match(/\/nome\/([^\/]+)\//);
        if (match) awayLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${match[1]}.png`;
      }

      let time = $(el).find('.date__col').text().trim() || '14:00'; 
      
      if (!home || !away) return;

      const timeMatch = time.match(/\d{2}:\d{2}/);
      if (timeMatch) {
          time = timeMatch[0];
      } else {
          time = '17:25'; 
      }

      // NFL events usually happen weekly
      const d = new Date();
      d.setDate(d.getDate() + Math.floor(i / 2));
      const date = d.toISOString().split('T')[0];

      events.push({
        sport: 'american-football',
        league: 'NFL',
        home,
        away,
        homeLogo,
        awayLogo,
        date,
        time,
        broadcast: ['ESPN'],
        countryCode: 'us'
      });
    });

    return events;
  } catch (error) {
    console.error('NFL Scraper Error:', error);
    return [];
  }
}
