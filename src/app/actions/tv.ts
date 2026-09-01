"use server";

import { prisma } from "@/lib/prisma";
import { fetchAndParseEPG } from "@/lib/epgParser";

export interface Program {
  title: string;
  start: string;
  end: string;
  isLive: boolean;
}

export interface Channel {
  id: string;
  name: string;
  number?: number;
  logo_url?: string;
  programs: Program[];
}

export interface Category {
  name: string;
  channels: Channel[];
}

function timeToMinutes(timeStr: string) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export async function getTVChannels(category?: string) {
  try {
    const where =
      category && category !== "TODOS"
        ? { category: { equals: category, mode: "insensitive" as const } }
        : {};
    const channels = await prisma.tVChannel.findMany({
      where: { ...where, active: true },
      include: {
        programs: {
          orderBy: { startTime: "asc" },
        },
      },
      orderBy: { channelNum: "asc" },
    });
    return { success: true, data: channels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLiveTVHome(): Promise<Category[]> {
  try {
    const channels = await prisma.tVChannel.findMany({
      where: { active: true },
      include: {
        programs: {
          orderBy: { startTime: "asc" },
        },
      },
      orderBy: { channelNum: "asc" },
    });

    if (channels.length === 0) {
      // Fallback default channels
      return [
        {
          name: "Abertos",
          channels: [
            {
              id: "1",
              name: "RECORD SP HD",
              number: 1,
              logo_url: "https://upload.wikimedia.org/wikipedia/pt/7/77/RecordTV_2016.png",
              programs: [
                {
                  title: "Jornal da Record",
                  start: "20:00",
                  end: "21:00",
                  isLive: true,
                },
              ],
            },
          ],
        },
      ];
    }

    const categoriesMap: Record<string, Channel[]> = {};

    channels.forEach((ch) => {
      const catName = ch.category || "Gerais";
      if (!categoriesMap[catName]) categoriesMap[catName] = [];

      const programs: Program[] = ch.programs.map((p) => {
        const start = p.startTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const end = p.endTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        return {
          title: p.title,
          start,
          end,
          isLive: p.isLive,
        };
      });

      if (programs.length === 0) {
        programs.push({
          title: "Programação Especial",
          start: "00:00",
          end: "23:59",
          isLive: true,
        });
      }

      categoriesMap[catName].push({
        id: ch.id,
        name: ch.name,
        number: parseInt(ch.channelNum, 10) || 1,
        logo_url: ch.logoUrl,
        programs,
      });
    });

    return Object.entries(categoriesMap).map(([name, channelsList]) => ({
      name,
      channels: channelsList,
    }));
  } catch (error) {
    console.error("Error in getLiveTVHome:", error);
    return [];
  }
}
