// src/app/actions/tv.ts
"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EPG_SERVICE_URL = "http://localhost:3001/api/programacao";

// Função para converter timestamp XMLTV (20260429180000) para HH:mm
interface XMLProgram {
  titulo: string;
  inicio: string;
  fim: string;
  logo?: string;
  desc?: string;
}

interface XMLChannel {
  nome: string;
  logo?: string;
  programas: XMLProgram[];
}

interface TVProgram {
  title: string;
  start: string;
  end: string;
  isLive: boolean;
}

interface EnrichedChannel {
  id: string;
  name: string;
  number: number;
  logo_url: string;
  category: string;
  nowPlaying: TVProgram | null;
  programs: TVProgram[];
}

// Função para converter timestamp XMLTV (20260429180000 +0000) para data real
function getXMLTVDate(timeStr: string) {
  if (!timeStr || timeStr.length < 14) return new Date();
  
  const y = timeStr.substring(0, 4);
  const mo = timeStr.substring(4, 6);
  const d = timeStr.substring(6, 8);
  const h = timeStr.substring(8, 10);
  const mi = timeStr.substring(10, 12);
  const s = timeStr.substring(12, 14);
  
  // Extrair offset se existir (ex: +0000)
  const offsetPart = timeStr.substring(15).trim();
  let dateStr = `${y}-${mo}-${d}T${h}:${mi}:${s}`;
  
  if (offsetPart && offsetPart.length >= 5) {
    const sign = offsetPart.substring(0, 1);
    const oh = offsetPart.substring(1, 3);
    const om = offsetPart.substring(3, 5);
    dateStr += `${sign}${oh}:${om}`;
  } else {
    // Se não houver offset, assumimos que é UTC para consistência
    dateStr += "Z";
  }

  return new Date(dateStr);
}

function parseXMLTVTime(timeStr: string) {
  const date = getXMLTVDate(timeStr);
  // Forçamos o timezone de Brasília (America/Sao_Paulo) para consistência no servidor e cliente
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  });
}

function timeToMinutes(timeStr: string) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export async function getTVChannels() {
  const { data, error } = await supabaseAdmin
    .from('tv_channels')
    .select('*')
    .order('number', { ascending: true });

  if (error) return [];
  return data;
}

export async function getLiveTVHome() {
  console.log("[Actions] Sincronizando com Guia XMLTV Profissional...");
  
  try {
    const channels = await getTVChannels();
    
    // Tentar buscar EPG com Timeout de 15 segundos
    let epgCanais: XMLChannel[] = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const epgResponse = await fetch(process.env.EPG_SERVICE_URL || EPG_SERVICE_URL, { 
        cache: 'no-store',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      const json = await epgResponse.json();
      epgCanais = json.canais || [];
      console.log(`[Actions] Sucesso! ${epgCanais.length} canais carregados do XMLTV.`);
    } catch (e) {
      const error = e as Error;
      console.warn(`[Actions] Erro no EPG Service (${error.message}). Usando fallback.`);
    }

    // "now" deve estar no mesmo timezone de Brasília para comparar corretamente
    const now = new Date();

    const enrichedChannels: EnrichedChannel[] = channels.map((ch) => {
      const channelNameClean = ch.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Localizar canal no JSON do serviço
      const xmlChannel = epgCanais.find((c: XMLChannel) => {
        const sourceNameClean = c.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return sourceNameClean.includes(channelNameClean) || channelNameClean.includes(sourceNameClean);
      });

      let programs: TVProgram[] = [];
      let nowPlaying: TVProgram | null = null;

      if (xmlChannel && xmlChannel.programas) {
        programs = xmlChannel.programas.map((p: XMLProgram) => {
          const startDate = getXMLTVDate(p.inicio);
          const endDate = getXMLTVDate(p.fim);
          const isLive = now >= startDate && now <= endDate;

          return {
            title: p.titulo,
            start: parseXMLTVTime(p.inicio),
            end: parseXMLTVTime(p.fim),
            isLive
          };
        });

        // 1. Ordenar por horário de início
        programs.sort((a: TVProgram, b: TVProgram) => {
          const startA = timeToMinutes(a.start);
          const startB = timeToMinutes(b.start);
          return startA - startB;
        });

        // 2. Remover duplicatas exatas e sanitizar sobreposições
        const sanitizedPrograms: TVProgram[] = [];
        for (let i = 0; i < programs.length; i++) {
          const current = programs[i];
          const next = programs[i + 1];

          const currentStartMin = timeToMinutes(current.start);
          let currentEndMin = timeToMinutes(current.end);

          // Ajuste para programas que passam da meia-noite
          if (currentEndMin < currentStartMin) currentEndMin += 1440;

          // Se houver um próximo programa que começa ANTES deste terminar, cortamos o fim deste
          if (next) {
            const nextStartMin = timeToMinutes(next.start);
            if (currentEndMin > nextStartMin && nextStartMin >= currentStartMin) {
              current.end = next.start;
              currentEndMin = nextStartMin;
            }
          }

          // Só adicionamos se tiver duração válida
          if (currentStartMin !== currentEndMin) {
            sanitizedPrograms.push(current);
          }
        }
        programs = sanitizedPrograms;

        nowPlaying = programs.find((p: TVProgram) => p.isLive) || programs[0] || null;
      } else {
        const brTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
        const [h, m] = brTime.split(':').map(Number);
        const start = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const end = `${((h + 1) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        nowPlaying = { title: `${ch.name} - Programação SFL`, start, end, isLive: true };
        programs = [nowPlaying];
      }

      return {
        ...ch,
        logo_url: xmlChannel?.logo || ch.logo_url,
        nowPlaying,
        programs
      };
    });

    const categories: Record<string, EnrichedChannel[]> = {};
    enrichedChannels.forEach(ch => {
      const cat = ch.category || 'Geral';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(ch);
    });

    return Object.entries(categories).map(([name, channels]) => ({ name, channels }));

  } catch (error) {
    console.error("[Actions] Erro no Guia TV:", error);
    return [];
  }
}
