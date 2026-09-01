"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveTrailerOverride(mediaId: string, youtubeUrl: string, title: string = "Trailer") {
  const override = await prisma.trailerOverride.upsert({
    where: { mediaId },
    update: { youtubeUrl, title },
    create: { mediaId, youtubeUrl, title },
  });

  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
  return override;
}
