"use client"; // Note: This will be used in client components but we want server actions or just fetch?
// Actually, I'll use API routes for easier client-side calling from buttons
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function addToWatchlist(media: {
  id: string;
  title: string;
  posterPath: string;
  type: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  await prisma.watchlist.upsert({
    where: {
      userId_mediaId: {
        userId: user.id,
        mediaId: media.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      mediaId: media.id,
      title: media.title,
      posterPath: media.posterPath,
      type: media.type,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeFromWatchlist(mediaId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  await prisma.watchlist.delete({
    where: {
      userId_mediaId: {
        userId: user.id,
        mediaId: mediaId,
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getWatchlist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { watchlist: true },
  });

  return user?.watchlist || [];
}
