import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';
import path from 'path';

const EPG_URL = 'https://iptv-org.github.io/epg/guides/pt.xml';
const CACHE_FILE = path.join(process.cwd(), 'scratch', 'epg_cache.json');
const XML_FILE = path.join(process.cwd(), 'scratch', 'epg_data.xml');
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 horas

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

export async function getEPGData(): Promise<Record<string, EPGChannel>> {
  const scratchDir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  // 1. Tentar ler do cache JSON processado
  if (fs.existsSync(CACHE_FILE)) {
    const stats = fs.statSync(CACHE_FILE);
    if (Date.now() - stats.mtimeMs < CACHE_DURATION) {
      try {
        return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch (e) { console.error(e); }
    }
  }

  // 2. Tentar baixar o XML se necessário
  try {
    console.log("Iniciando download do EPG...");
    const response = await axios({
      method: 'get',
      url: EPG_URL,
      responseType: 'stream',
      timeout: 60000
    });

    const writer = fs.createWriteStream(XML_FILE);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', () => resolve());
      writer.on('error', reject);
    });

    console.log("Download concluído. Iniciando Parse...");
    const xml = fs.readFileSync(XML_FILE, 'utf-8');
    const result = await parseStringPromise(xml);
    const channels: Record<string, EPGChannel> = {};

    if (result.tv) {
      if (result.tv.channel) {
        result.tv.channel.forEach((ch: any) => {
          const id = ch.$.id;
          channels[id] = {
            id,
            name: ch['display-name'] ? (ch['display-name'][0]._ || ch['display-name'][0]) : id,
            logo: ch.icon ? ch.icon[0].$.src : undefined,
            programs: []
          };
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const limit = new Date(today);
      limit.setDate(limit.getDate() + 2);

      if (result.tv.programme) {
        result.tv.programme.forEach((p: any) => {
          const channelId = p.$.channel;
          if (channels[channelId]) {
            const start = p.$.start;
            // Parse simples de data XMLTV para verificar se é recente
            const year = parseInt(start.substring(0, 4));
            const month = parseInt(start.substring(4, 6)) - 1;
            const day = parseInt(start.substring(6, 8));
            const startTime = new Date(Date.UTC(year, month, day));

            if (startTime >= today && startTime <= limit) {
              channels[channelId].programs.push({
                title: p.title ? (p.title[0]._ || p.title[0]) : 'Sem título',
                description: p.desc ? (p.desc[0]._ || p.desc[0]) : '',
                start: p.$.start,
                end: p.$.stop,
                channelId
              });
            }
          }
        });
      }
    }

    // Ordenar e Salvar
    Object.values(channels).forEach(ch => ch.programs.sort((a, b) => a.start.localeCompare(b.start)));
    fs.writeFileSync(CACHE_FILE, JSON.stringify(channels));
    return channels;

  } catch (error: any) {
    console.error("Erro EPG Service:", error.message);
    
    // Fallback: Gerar dados fictícios se TUDO falhar, para não deixar a tela vazia
    return generateMockEPG();
  }
}

function generateMockEPG(): Record<string, EPGChannel> {
  const mock: Record<string, EPGChannel> = {};
  const channels = ["Globo.br", "SporTV.br", "GloboRJ.br"];
  
  channels.forEach(id => {
    const programs: EPGProgram[] = [];
    const now = new Date();
    for (let i = -2; i < 10; i++) {
      const start = new Date(now.getTime() + i * 3600000);
      const end = new Date(start.getTime() + 3600000);
      programs.push({
        title: `Programa Especial ${i + 3}`,
        description: "Conteúdo exclusivo SFL Stream em alta definição.",
        start: formatToXMLTV(start),
        end: formatToXMLTV(end),
        channelId: id
      });
    }
    mock[id] = { id, name: id.split('.')[0], programs };
  });
  
  return mock;
}

function formatToXMLTV(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth()+1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00 +0000`;
}

export function getNowPlaying(channelEPGId: string, epgData: Record<string, EPGChannel>) {
  const channel = epgData[channelEPGId];
  if (!channel) return null;
  const nowStr = formatToXMLTV(new Date());
  return channel.programs.find(p => nowStr >= p.start && nowStr <= p.end) || null;
}
