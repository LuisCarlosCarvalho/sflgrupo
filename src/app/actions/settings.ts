"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettingsData() {
  const [plans, features, epgSetting] = await Promise.all([
    prisma.pricingPlan.findMany({ orderBy: { name: "asc" } }),
    prisma.siteFeature.findMany({ orderBy: { order: "asc" } }),
    prisma.systemSetting.findUnique({ where: { key: "epg_url" } }),
  ]);

  return {
    plans,
    features,
    epgUrl: epgSetting?.value || "",
  };
}

export async function updatePricingPlan(id: string, data: { name?: string; priceEur?: number; priceBrl?: number; features?: string[]; popular?: boolean }) {
  const updated = await prisma.pricingPlan.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/settings");
  revalidatePath("/cta");
  revalidatePath("/");
  return updated;
}

export async function updateSiteFeature(id: string, data: { title?: string; description?: string }) {
  const updated = await prisma.siteFeature.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return updated;
}

export async function saveSystemSetting(key: string, value: string) {
  const updated = await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/admin/settings");
  return updated;
}
