"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface WatchlistItem {
  userId: string;
  mediaId: string;
  title: string;
  posterPath: string;
  type: string;
  metadata?: string;
  created_at?: string;
}

export async function toggleWatchlist(media: {
  id: string;
  title: string;
  posterPath: string;
  type?: string;
  metadata?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.watchlistItem.findUnique({
    where: {
      userId_tmdbId: {
        userId: session.user.id,
        tmdbId: media.id,
      },
    },
  });

  if (existing) {
    await prisma.watchlistItem.delete({
      where: { id: existing.id },
    });
    revalidatePath("/dashboard", "layout");
    return { success: true, added: false };
  } else {
    await prisma.watchlistItem.create({
      data: {
        userId: session.user.id,
        tmdbId: media.id,
        title: media.title,
        poster: media.posterPath,
      },
    });
    revalidatePath("/dashboard", "layout");
    return { success: true, added: true };
  }
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const items = await prisma.watchlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => ({
    userId: item.userId,
    mediaId: item.tmdbId,
    title: item.title,
    posterPath: item.poster,
    type: "movie",
    metadata: "",
    created_at: item.createdAt.toISOString(),
  }));
}

export async function clearWatchlist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.watchlistItem.deleteMany({
    where: { userId: session.user.id },
  });

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
