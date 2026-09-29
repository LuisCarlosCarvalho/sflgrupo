"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateFavoriteTeam(country: string, team: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Não autorizado");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      favoriteCountry: country,
      favoriteTeam: team,
    },
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
}
