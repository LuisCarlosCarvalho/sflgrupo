import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAndParseM3U, M3UChannel } from "@/lib/m3uParser";
import { fetchAndParseEPG } from "@/lib/epgParser";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel pro max duration

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
    const [m3uSetting, epgSetting] = await Promise.all([
      prisma.systemSetting.findUnique({ where: { key: "m3u_url" } }),
      prisma.systemSetting.findUnique({ where: { key: "epg_url" } })
    ]);

    const m3uText = m3uSetting?.value || "http://bit.ly/Will-Canais";
    const epgUrl = epgSetting?.value || "https://m3upt.com/epg";

    // Extrair URLs do texto separado por quebra de linha
    const m3uUrlsList = m3uText.split("\n").map(u => u.trim()).filter(u => u.length > 0);
    const m3uUrls = m3uUrlsList.map(url => {
        // Tentar inferir grupo pela URL (ex: Will-Filmes -> Filmes)
        const match = url.match(/-([A-Za-z]+)$/);
        const group = match ? match[1] : "GERAL";
        return { url, group };
    });

    const allM3uChannels: M3UChannel[] = [];
    
    // 1. Fetch todas as listas M3U em paralelo
    const m3uPromises = m3uUrls.map(async (list) => {
       const parsed = await fetchAndParseM3U(list.url);
       // Sobrescrever o grupo com o nome da lista se não vier no M3U
       return parsed.map(c => ({ ...c, group: c.group && c.group !== "GERAL" ? c.group : list.group }));
    });
    const m3uResults = await Promise.all(m3uPromises);
    m3uResults.forEach(res => allM3uChannels.push(...res));
    
    // 2. Parse EPG
    const epgData = await fetchAndParseEPG(epgUrl);
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
