import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAndParseM3U, M3UChannel } from "@/lib/m3uParser";
import { fetchAndParseEPG } from "@/lib/epgParser";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel pro max duration

// Stream checking removed to improve sync speed

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
    m3uResults.forEach(res => {
      for (const channel of res) {
        allM3uChannels.push(channel);
      }
    });
    
    // 2. Parse EPG
    const epgData = await fetchAndParseEPG(epgUrl);
    const epgMap = new Map(epgData.map((c) => [c.id, c]));

    // Limpa banco de dados para nova sincronização
    await prisma.tVProgram.deleteMany();
    await prisma.tVChannel.deleteMany();

    let channelCounter = 1;

    // Remove duplicates based on URL to avoid testing same stream twice
    const uniqueStreams = new Map<string, M3UChannel>();
    for (const c of allM3uChannels) {
       if (c.url && c.name && !uniqueStreams.has(c.url)) {
           uniqueStreams.set(c.url, c);
       }
    }

    const uniqueChannels = Array.from(uniqueStreams.values());
    console.log(`Processando ${uniqueChannels.length} canais...`);

    const onlineChannels = uniqueChannels; // Bypass online check for speed and reliability

    console.log(`Inserindo ${onlineChannels.length} canais no banco...`);

    // Inserir os canais online no banco
    const channelData = [];
    const programData: any[] = [];
    const crypto = require('crypto');

    for (const m3u of onlineChannels) {
      const epgChannel = m3u.id ? epgMap.get(m3u.id) : null;
      const channelId = crypto.randomUUID();
      
      channelData.push({
        id: channelId,
        channelNum: channelCounter.toString().padStart(3, "0"),
        name: m3u.name,
        logoUrl: m3u.logo || epgChannel?.logo || "",
        streamUrl: m3u.url,
        category: m3u.group?.toUpperCase() || "GERAL",
      });

      channelCounter++;

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

          programData.push({
            channelId: channelId,
            title: prog.titulo || "Programa Sem Nome",
            description: prog.desc || "",
            startTime: parseEpgDate(prog.inicio),
            endTime: parseEpgDate(prog.fim),
            isLive: false,
            category: m3u.group?.toUpperCase() || "GERAL",
          });
        }
      }
    }

    // Insert em batch (5.000 por vez)
    const CHUNK_SIZE = 5000;
    
    console.log(`[SYNC] Fazendo bulk insert de ${channelData.length} canais...`);
    for (let i = 0; i < channelData.length; i += CHUNK_SIZE) {
      console.log(`[SYNC] Inserindo canais chunk ${i / CHUNK_SIZE + 1}...`);
      await prisma.tVChannel.createMany({
        data: channelData.slice(i, i + CHUNK_SIZE),
        skipDuplicates: true,
      });
    }

    console.log(`[SYNC] Fazendo bulk insert de ${programData.length} programas...`);
    for (let i = 0; i < programData.length; i += CHUNK_SIZE) {
      console.log(`[SYNC] Inserindo programas chunk ${i / CHUNK_SIZE + 1} de ${Math.ceil(programData.length / CHUNK_SIZE)}...`);
      await prisma.tVProgram.createMany({
        data: programData.slice(i, i + CHUNK_SIZE),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sincronização concluída com sucesso!",
      totalChannelsTested: uniqueChannels.length,
      totalChannelsOnline: channelData.length,
    });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
