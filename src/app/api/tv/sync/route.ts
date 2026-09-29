import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAndParseM3U } from "@/lib/m3uParser";
import { fetchAndParseEPG } from "@/lib/epgParser";

export const dynamic = "force-dynamic";

const M3U_URL = "https://github.com/iptv-com/iptv/raw/refs/heads/main/lists/brazil.m3u";
const EPG_URL = "https://m3upt.com/epg";

export async function GET() {
  try {
    // 1. Parse M3U
    const m3uChannels = await fetchAndParseM3U(M3U_URL);
    
    // 2. Parse EPG
    const epgData = await fetchAndParseEPG(EPG_URL);
    const epgMap = new Map(epgData.map((c) => [c.id, c]));

    // Limpa banco de dados para nova sincronização (Opcional, mas garante consistência na atualização)
    await prisma.tVProgram.deleteMany();
    await prisma.tVChannel.deleteMany();

    const resultChannels = [];
    let channelCounter = 1;

    for (const m3u of m3uChannels) {
      // Ignora canais sem URL ou Nome
      if (!m3u.url || !m3u.name) continue;

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
          // EPG dates format is usually YYYYMMDDHHMMSS ooo (e.g. 20241029100000 -0300)
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
        // Fallback program if no EPG is available
        const now = new Date();
        programsToInsert.push({
          channelId: dbChannel.id,
          title: `${dbChannel.name} - Ao Vivo`,
          description: "Programação contínua.",
          startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
          endTime: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours ahead
          isLive: true,
          category: dbChannel.category,
        });
      }

      // Batch insert programs
      if (programsToInsert.length > 0) {
        await prisma.tVProgram.createMany({
          data: programsToInsert,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sincronização concluída com sucesso!",
      totalChannelsSync: resultChannels.length,
    });
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
