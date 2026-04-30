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
  if (timeStr.length >= 20) {
    const rawOffset = timeStr.substring(15, 20);
    offset = rawOffset.replace(/(\d{2})(\d{2})/, '$1:$2');
  }

  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}${offset}`;
  const date = new Date(iso);
  
  // Ajuste de fuso horário (epg.pw vem com 8 horas de atraso para o Brasil)
  date.setHours(date.getHours() - 8);
  
  return date;
}

function parseXMLTVTime(timeStr: string) {
  const date = getXMLTVDate(timeStr);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
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
    
    // Tentar buscar EPG com Timeout
    let epgCanais = [];
    try {
      const epgResponse = await fetch(EPG_SERVICE_URL, { cache: 'no-store' });
      const json = await epgResponse.json();
      epgCanais = json.canais || [];
      console.log(`[Actions] Sucesso! ${epgCanais.length} canais carregados do XMLTV.`);
    } catch (e) {
      console.warn("[Actions] Serviço de EPG Offline. Usando fallback.");
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

        // Filtrar programas duplicados ou com horários idênticos
        const uniquePrograms: any[] = [];
        const seen = new Set();
        programs.forEach((p: any) => {
          const key = `${p.start}-${p.end}-${p.title}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniquePrograms.push(p);
          }
        });
        programs = uniquePrograms;

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
