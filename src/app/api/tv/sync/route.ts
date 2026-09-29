import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const channelCount = await prisma.tVChannel.count();

    if (channelCount === 0) {
      // Injeção automática caso a tabela esteja vazia
      const defaultChannel = await prisma.tVChannel.create({
        data: {
          channelNum: "001",
          name: "RECORD NEWS HD",
          logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Record_News_2016.png/260px-Record_News_2016.png",
          streamUrl: "https://stream.recordnews.r7.com/live/recordnews.m3u8",
          category: "NOTÍCIAS",
        },
      });

      const now = new Date();
      await prisma.tVProgram.create({
        data: {
          channelId: defaultChannel.id,
          title: "Record News Ao Vivo",
          description: "Jornalismo 24 horas por dia com notícias do Brasil e do mundo.",
          startTime: new Date(now.getTime() - 30 * 60 * 1000),
          endTime: new Date(now.getTime() + 60 * 60 * 1000),
          isLive: true,
        },
      });
    }

    const channels = await prisma.tVChannel.findMany({
      include: { programs: true },
      orderBy: { channelNum: "asc" },
    });

    return NextResponse.json({
      success: true,
      totalChannels: channels.length,
      channels,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
