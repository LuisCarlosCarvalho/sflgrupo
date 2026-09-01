"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAvailableApps() {
  try {
    const apps = await prisma.availableApp.findMany({
      orderBy: { name: "asc" },
    });

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      platform: app.platform,
      download_url: app.downloadUrl,
      downloadUrl: app.downloadUrl,
      icon_url: app.iconUrl,
      iconUrl: app.iconUrl,
      description: app.description,
      createdAt: app.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
}

export async function addApp(formData: FormData) {
  const name = formData.get("name") as string;
  const platform = formData.get("platform") as string;
  const downloadUrl = (formData.get("download_url") || formData.get("downloadUrl")) as string;
  const iconUrl = (formData.get("icon_url") || formData.get("iconUrl")) as string;
  const description = (formData.get("description") as string) || "";

  await prisma.availableApp.create({
    data: {
      name,
      platform,
      downloadUrl,
      iconUrl,
      description,
    },
  });

  revalidatePath("/admin/apps");
  revalidatePath("/dashboard/perfil");
}

export async function deleteApp(id: string) {
  await prisma.availableApp.delete({
    where: { id },
  });

  revalidatePath("/admin/apps");
  revalidatePath("/dashboard/perfil");
}
