// src/app/actions/tv.ts
"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EPG_SERVICE_URL = "http://localhost:3001/api/programacao";

// Função para converter timestamp XMLTV (20260429180000) para HH:mm
// Função para converter timestamp XMLTV (20260429180000 +0000) para data real
function getXMLTVDate(timeStr: string) {
  if (!timeStr || timeStr.length < 14) return new Date();
  
  const y = timeStr.substring(0, 4);
  const mo = timeStr.substring(4, 6);
  const d = timeStr.substring(6, 8);
  const h = timeStr.substring(8, 10);
  const mi = timeStr.substring(10, 12);
  const s = timeStr.substring(12, 14);
  
  // Formata o offset de +HHMM para +HH:MM para o construtor Date
  let offset = "+00:00";
  const year = parseInt(y, 10);
  const month = parseInt(mo, 10) - 1;
  const day = parseInt(d, 10);
  const hour = parseInt(h, 10);
  const min = parseInt(mi, 10);
  const sec = parseInt(s, 10);

  const xmltvDate = new Date(year, month, day, hour, min, sec);
  return xmltvDate;
}

function parseXMLTVTime(timeStr: string) {
  const date = getXMLTVDate(timeStr);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
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
    let epgCanais = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const epgResponse = await fetch(EPG_SERVICE_URL, { 
        cache: 'no-store',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      const json = await epgResponse.json();
      epgCanais = json.canais || [];
      console.log(`[Actions] Sucesso! ${epgCanais.length} canais carregados do XMLTV.`);
    } catch (e: any) {
      console.warn(`[Actions] Erro no EPG Service (${e.message}). Usando fallback.`);
    }

    const now = new Date();

    const enrichedChannels = channels.map((ch) => {
      const channelNameClean = ch.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Localizar canal no JSON do serviço
      const xmlChannel = epgCanais.find((c: any) => {
        const sourceNameClean = c.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return sourceNameClean.includes(channelNameClean) || channelNameClean.includes(sourceNameClean);
      });

      let programs = [];
      let nowPlaying = null;

      if (xmlChannel && xmlChannel.programas) {
        programs = xmlChannel.programas.map((p: any) => {
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
        programs.sort((a: any, b: any) => {
          const startA = timeToMinutes(a.start);
          const startB = timeToMinutes(b.start);
          return startA - startB;
        });

  // 2. Remover duplicatas exatas e sanitizar sobreposições
  const sanitizedPrograms: any[] = [];
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
      // Se o próximo programa também passou da meia-noite, precisamos ajustar o cálculo dele também se necessário
      // mas aqui simplificamos: se o início do próximo é menor que o fim do atual, pode ser sobreposição
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

        nowPlaying = programs.find((p: any) => p.isLive) || programs[0];
      } else {
        const start = `${now.getHours()}:00`;
        const end = `${(now.getHours() + 1) % 24}:00`;
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

    const categories: Record<string, any[]> = {};
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
