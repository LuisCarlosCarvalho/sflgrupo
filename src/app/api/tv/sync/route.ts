import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAndParseM3U, M3UChannel } from "@/lib/m3uParser";
import { fetchAndParseEPG } from "@/lib/epgParser";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel pro max duration

const M3U_URLS = [
  { url: "http://bit.ly/Will-Canais", group: "Canais" },
  { url: "http://bit.ly/Will-Filmes", group: "Filmes" },
  { url: "http://bit.ly/Will-Sports", group: "Esportes" },
  { url: "http://bit.ly/Will-Series", group: "Séries" },
  { url: "http://bit.ly/Will-Desenhos", group: "Desenhos" },
  { url: "http://bit.ly/Will-Adultos", group: "Adultos" },
  { url: "http://bit.ly/Will-Simpsons", group: "Simpsons" },
  { url: "http://bit.ly/Will-PicaPau", group: "Pica-Pau" },
  { url: "http://bit.ly/Will-ChavesDesenhos", group: "Chaves Desenho" },
  { url: "http://bit.ly/Will-DesenhosBiblico", group: "Desenhos Bíblicos" },
  { url: "http://bit.ly/Will-TomGerry", group: "Tom e Jerry" }
];

const EPG_URL = "https://m3upt.com/epg";

// Função para testar se o stream está online (timeout de 2 segundos)
async function isStreamOnline(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { 
        method: 'HEAD', 
        signal: controller.signal,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    clearTimeout(timeoutId);
    return res.ok || res.status === 403 || res.status === 401; // Aceitamos 403/401 pois pode requerer tokens, mas o servidor existe.
  } catch (e) {
    return false;
  }
}

export async function GET() {
  try {
    const allM3uChannels: M3UChannel[] = [];
    
    // 1. Fetch todas as listas M3U em paralelo
    const m3uPromises = M3U_URLS.map(async (list) => {
       const parsed = await fetchAndParseM3U(list.url);
       // Sobrescrever o grupo com o nome da lista se não vier no M3U
       return parsed.map(c => ({ ...c, group: c.group && c.group !== "GERAL" ? c.group : list.group }));
    });
    const m3uResults = await Promise.all(m3uPromises);
    m3uResults.forEach(res => allM3uChannels.push(...res));
    
    // 2. Parse EPG
    const epgData = await fetchAndParseEPG(EPG_URL);
    const epgMap = new Map(epgData.map((c) => [c.id, c]));

    // Limpa banco de dados para nova sincronização
    await prisma.tVProgram.deleteMany();
    await prisma.tVChannel.deleteMany();

    const resultChannels = [];
    let channelCounter = 1;

    // Remove duplicates based on URL to avoid testing same stream twice
    const uniqueStreams = new Map<string, M3UChannel>();
    for (const c of allM3uChannels) {
       if (c.url && c.name && !uniqueStreams.has(c.url)) {
           uniqueStreams.set(c.url, c);
       }
    }

    const uniqueChannels = Array.from(uniqueStreams.values());
    console.log(`Testando ${uniqueChannels.length} canais... isso pode demorar.`);

    // Batch test streams to avoid exhausting connection pools (test in chunks of 50)
    const BATCH_SIZE = 50;
    const onlineChannels: M3UChannel[] = [];
    
    for (let i = 0; i < uniqueChannels.length; i += BATCH_SIZE) {
        const batch = uniqueChannels.slice(i, i + BATCH_SIZE);
        const testPromises = batch.map(async (channel) => {
            const isOnline = await isStreamOnline(channel.url);
            if (isOnline) {
                onlineChannels.push(channel);
            }
        });
        await Promise.all(testPromises);
    }
    
    console.log(`Canais online encontrados: ${onlineChannels.length} de ${uniqueChannels.length}`);

    // Inserir os canais online no banco
    for (const m3u of onlineChannels) {
      const epgChannel = m3u.id ? epgMap.get(m3u.id) : null;
      
      const dbChannel = await prisma.tVChannel.create({
        data: {
          channelNum: channelCounter.toString().padStart(3, "0"),
          name: m3u.name,
          logoUrl: m3u.logo || epgChannel?.logo || "",
          streamUrl: m3u.url,
          category: m3u.group?.toUpperCase() || "GERAL",
        },
      });

      channelCounter++;
      resultChannels.push(dbChannel);

      const programsToInsert = [];

      if (epgChannel && epgChannel.programas && epgChannel.programas.length > 0) {
        for (const prog of epgChannel.programas) {
          const parseEpgDate = (dateStr: string) => {
             const year = parseInt(dateStr.substring(0, 4));
             const month = parseInt(dateStr.substring(4, 6)) - 1;
             const day = parseInt(dateStr.substring(6, 8));
             const hour = parseInt(dateStr.substring(8, 10));
             const min = parseInt(dateStr.substring(10, 12));
             const sec = parseInt(dateStr.substring(12, 14));
             return new Date(year, month, day, hour, min, sec);
          };

          programsToInsert.push({
            channelId: dbChannel.id,
            title: prog.titulo || "Programa Sem Nome",
            description: prog.desc || "",
            startTime: parseEpgDate(prog.inicio),
            endTime: parseEpgDate(prog.fim),
            isLive: false,
            category: dbChannel.category,
          });
        }
      } else {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        programsToInsert.push({
          channelId: dbChannel.id,
          title: `${dbChannel.name} - Ao Vivo`,
          description: "Programação contínua.",
          startTime: startOfDay,
          endTime: endOfDay,
          isLive: true,
          category: dbChannel.category,
        });
      }

      if (programsToInsert.length > 0) {
        await prisma.tVProgram.createMany({
          data: programsToInsert,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sincronização concluída com sucesso!",
      totalChannelsTested: uniqueChannels.length,
      totalChannelsOnline: resultChannels.length,
    });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
