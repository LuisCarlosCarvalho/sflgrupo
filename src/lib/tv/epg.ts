// src/lib/tv/epg.ts
import { parseStringPromise } from 'xml2js';

const EPG_URL = 'https://iptv-org.github.io/epg/guides/pt.xml';

export interface EPGProgram {
  title: string;
  description: string;
  start: string;
  end: string;
  channelId: string;
}

export interface EPGChannel {
  id: string;
  name: string;
  logo?: string;
  programs: EPGProgram[];
}

// Cache em memória (Simples para demonstração, ideal usar Redis em prod)
let epgCache: { data: Record<string, EPGChannel>, timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export async function getEPGData() {
  const now = Date.now();

  if (epgCache && (now - epgCache.timestamp) < CACHE_DURATION) {
    return epgCache.data;
  }

  try {
    const response = await fetch(EPG_URL);
    if (!response.ok) throw new Error('Falha ao buscar EPG');
    
    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const channels: Record<string, EPGChannel> = {};

    // Mapear Canais
    if (result.tv && result.tv.channel) {
      result.tv.channel.forEach((ch: any) => {
        const id = ch.$.id;
        channels[id] = {
          id,
          name: ch['display-name'] ? ch['display-name'][0]._ || ch['display-name'][0] : id,
          logo: ch.icon ? ch.icon[0].$.src : undefined,
          programs: []
        };
      });
    }

    // Mapear Programas
    if (result.tv && result.tv.programme) {
      result.tv.programme.forEach((p: any) => {
        const channelId = p.$.channel;
        if (channels[channelId]) {
          channels[channelId].programs.push({
            title: p.title ? p.title[0]._ || p.title[0] : 'Sem título',
            description: p.desc ? p.desc[0]._ || p.desc[0] : '',
            start: p.$.start,
            end: p.$.stop,
            channelId
          });
        }
      });
    }

    epgCache = { data: channels, timestamp: now };
    return channels;
  } catch (error) {
    console.error('Erro ao processar EPG:', error);
    return epgCache?.data || {};
  }
}

/**
 * Retorna o programa que está passando agora em um determinado canal.
 */
export function getNowPlaying(channelEPGId: string, epgData: Record<string, EPGChannel>) {
  const channel = epgData[channelEPGId];
  if (!channel) return null;

  const nowStr = formatEPGDate(new Date());
  
  return channel.programs.find(p => {
    return nowStr >= p.start && nowStr <= p.end;
  }) || null;
}

/**
 * Converte Date para o formato XMLTV: YYYYMMDDHHMMSS +0000
 */
function formatEPGDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const Y = date.getUTCFullYear();
  const M = pad(date.getUTCMonth() + 1);
  const D = pad(date.getUTCDate());
  const h = pad(date.getUTCHours());
  const m = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  return `${Y}${M}${D}${h}${m}${s} +0000`;
}
