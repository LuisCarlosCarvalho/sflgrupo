import { NextResponse } from 'next/server';
import { scrapeFutebol } from '@/lib/scrapers/futebol/globo';
import { scrapeSherdog } from '@/lib/scrapers/mma/sherdog';
import { scrapeUFC } from '@/lib/scrapers/mma/ufc';
import { scrapeOlympics } from '@/lib/scrapers/multisport/olympics';
import { scrapeNBA } from '@/lib/scrapers/basketball/nba';
import { scrapeNFL } from '@/lib/scrapers/american-football/nfl';
import { scrapeUEFA } from '@/lib/scrapers/futebol/uefa';
import { SportsEvent } from '@/lib/scrapers/types';

export const revalidate = 3600; // Cache de 1 hora

export async function GET() {
  try {
    // Roda os scrapers em paralelo
    const results = await Promise.allSettled([
      scrapeFutebol(),
      scrapeSherdog(),
      scrapeUFC(),
      scrapeOlympics(),
      scrapeNBA(),
      scrapeNFL(),
      scrapeUEFA()
    ]);

    let allEvents: SportsEvent[] = [];

    // Consolida resultados que deram sucesso
    results.forEach((result) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allEvents = allEvents.concat(result.value);
      } else if (result.status === 'rejected') {
        console.error('Um dos scrapers falhou:', result.reason);
      }
    });

    // Lógica de Filtro: Eventos >= hoje até +3 dias
    const now = new Date();
    // Normaliza para o início do dia no timezone local/utc dependendo de como é feito (simplificado aqui para string ISO base)
    const todayStr = now.toISOString().split('T')[0];
    
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 3);
    const limitDateStr = limitDate.toISOString().split('T')[0];

    const filteredEvents = allEvents.filter(event => {
       // Se o scraper não retornar date, por segurança descarta ou aceita.
       // O nosso formato é YYYY-MM-DD
       if (!event.date) return false;
       return event.date >= todayStr && event.date <= limitDateStr;
    });

    // Ordenação por data e hora crescente
    filteredEvents.sort((a, b) => {
       if (a.date === b.date) {
          return a.time.localeCompare(b.time);
       }
       return a.date.localeCompare(b.date);
    });

    return NextResponse.json(filteredEvents);

  } catch (error) {
    console.error('API Games Upcoming Error:', error);
    return NextResponse.json({ error: 'Falha ao buscar eventos' }, { status: 500 });
  }
}
