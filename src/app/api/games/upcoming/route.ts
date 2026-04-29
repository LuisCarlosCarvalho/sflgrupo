import { NextResponse } from 'next/server';
import { scrapeFutebol } from '@/lib/scrapers/futebol/globo';
import { scrapeSherdog } from '@/lib/scrapers/mma/sherdog';
import { scrapeUFC } from '@/lib/scrapers/mma/ufc';
import { scrapeOlympics } from '@/lib/scrapers/multisport/olympics';
import { scrapeUEFA } from '@/lib/scrapers/futebol/uefa';
import { fetchRapidAPISports } from '@/lib/scrapers/multisport/rapidapi';
import { SportsEvent } from '@/lib/scrapers/types';

export const revalidate = 60; // Cache de 1 minuto

export async function GET() {
  try {
    // Roda os scrapers em paralelo
    const results = await Promise.allSettled([
      scrapeFutebol(),
      scrapeSherdog(),
      scrapeUFC(),
      scrapeOlympics(),
      fetchRapidAPISports(), // Nova API que abrange NFL, NBA, MLB, NHL, etc.
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

    // --- LÓGICA DE DEDUPLICAÇÃO ---
    // Evita jogos repetidos de fontes diferentes (ex: Atlético vs Arsenal e Arsenal vs Atlético)
    const uniqueEventsMap = new Map<string, SportsEvent>();

    filteredEvents.forEach(event => {
      // Normaliza nomes para comparação
      const t1 = (event.home || "").toLowerCase().trim();
      const t2 = (event.away || "").toLowerCase().trim();
      
      // Ordena alfabeticamente para que "A vs B" e "B vs A" gerem a mesma chave
      const teams = [t1, t2].sort();
      
      // Chave única: Times + Data + Horário
      const key = `${teams[0]}|${teams[1]}|${event.date}|${event.time}`;
      
      if (!uniqueEventsMap.has(key)) {
        uniqueEventsMap.set(key, event);
      } else {
        // Mescla informações de transmissão
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
