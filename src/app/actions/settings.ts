"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettingsData() {
  const [plans, features, epgSetting, m3uSetting] = await Promise.all([
    prisma.pricingPlan.findMany({ orderBy: { name: "asc" } }),
    prisma.siteFeature.findMany({ orderBy: { order: "asc" } }),
    prisma.systemSetting.findUnique({ where: { key: "epg_url" } }),
    prisma.systemSetting.findUnique({ where: { key: "m3u_url" } }),
  ]);

  return {
    plans,
    features,
    epgUrl: epgSetting?.value || "",
    m3uUrl: m3uSetting?.value || "",
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

export async function createPricingPlan() {
  const plan = await prisma.pricingPlan.create({
    data: { name: "Novo Plano", priceEur: 0, priceBrl: 0, interval: "month", features: ["Recurso 1"] }
  });
  revalidatePath("/admin/settings");
  return plan;
}

export async function deletePricingPlan(id: string) {
  await prisma.pricingPlan.delete({ where: { id } });
  revalidatePath("/admin/settings");
}

export async function createSiteFeature() {
  const feature = await prisma.siteFeature.create({
    data: { title: "Novo Recurso", description: "Descrição do recurso", icon: "Star" }
  });
  revalidatePath("/admin/settings");
  return feature;
}

export async function deleteSiteFeature(id: string) {
  await prisma.siteFeature.delete({ where: { id } });
  revalidatePath("/admin/settings");
}
