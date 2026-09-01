"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function parseCatalogReport(text: string): string[] {
  const lines = text.split("\n");
  const titles: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\s*-\s*([^(\n\[]+)/) || line.match(/^([^(\n\[]+)/);

    if (match && match[1]) {
      let title = match[1].trim();
      title = title.replace(/\[.*\]/g, "").trim();

      if (title && title.length > 2 && !title.includes("Atualizações") && !title.includes("Relatório")) {
        titles.push(title);
      }
    }
  }

  return [...new Set(titles)];
}

export async function importCatalogUpdates(formData: FormData) {
  const rawContent = formData.get("report") as string;
  if (!rawContent) return;

  const parsedTitles = parseCatalogReport(rawContent);

  if (parsedTitles.length === 0) {
    throw new Error("Nenhum título identificado no texto.");
  }

  try {
    await prisma.recentCatalogUpdate.create({
      data: {
        rawContent,
        period: new Date().toLocaleDateString("pt-BR"),
      },
    });

    revalidatePath("/admin/catalogo");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error importing catalog updates:", error);
  }
}

export async function getRecentCatalogUpdates() {
  try {
    const latest = await prisma.recentCatalogUpdate.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return [];
    return parseCatalogReport(latest.rawContent);
  } catch (error) {
    console.error("Error fetching recent catalog updates:", error);
    return [];
  }
}
