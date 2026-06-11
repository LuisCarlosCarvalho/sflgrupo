import { NextResponse } from 'next/server';
import { fetchESPNScraper } from '@/lib/scrapers/multisport/espnApi';
import { SportsEvent } from '@/lib/scrapers/types';

export const revalidate = 60; // Cache de 1 minuto

export async function GET() {
  try {
    // Roda os scrapers em paralelo (neste caso, apenas o nosso ESPN API que já lida com múltiplas ligas)
    const results = await Promise.allSettled([
      fetchESPNScraper()
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

    // Lógica de Filtro: Eventos >= hoje até +7 dias
    const now = new Date();
    // Normaliza para o início do dia no timezone local/utc dependendo de como é feito (simplificado aqui para string ISO base)
    const todayStr = now.toISOString().split('T')[0];
    
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 7);
    const limitDateStr = limitDate.toISOString().split('T')[0];

    const filteredEvents = allEvents.filter(event => {
       if (!event.date) return false;
       return event.date >= todayStr && event.date <= limitDateStr;
    });

    // --- LÓGICA DE DEDUPLICAÇÃO ---
    const uniqueEventsMap = new Map<string, SportsEvent>();

    filteredEvents.forEach(event => {
      const t1 = (event.home || "").toLowerCase().trim();
      const t2 = (event.away || "").toLowerCase().trim();
      
      const teams = [t1, t2].sort();
      
      const key = `${teams[0]}|${teams[1]}|${event.date}|${event.time}`;
      
      if (!uniqueEventsMap.has(key)) {
        uniqueEventsMap.set(key, event);
      } else {
        const existing = uniqueEventsMap.get(key)!;
        const mergedBroadcast = Array.from(new Set([...(existing.broadcast || []), ...(event.broadcast || [])]));
        uniqueEventsMap.set(key, { ...existing, broadcast: mergedBroadcast });
      }
    });

    const dedupedEvents = Array.from(uniqueEventsMap.values());

    // Ordenação por data e hora crescente
    dedupedEvents.sort((a, b) => {
       if (a.date === b.date) {
          return a.time.localeCompare(b.time);
       }
       return a.date.localeCompare(b.date);
    });

    return NextResponse.json(dedupedEvents);

  } catch (error) {
    console.error('API Games Upcoming Error:', error);
    return NextResponse.json({ error: 'Falha ao buscar eventos' }, { status: 500 });
  }
}
