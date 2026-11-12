"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export interface HomePlatformItem {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  status: string; // "AVAILABLE" | "COMING_SOON" | "HOW_TO_INSTALL"
  fileUrl: string | null;
  shortCode: string | null;
  gradient: string;
  order: number;
  active: boolean;
}

const DEFAULT_PLATFORMS: Omit<HomePlatformItem, "id">[] = [
  {
    name: "LG",
    logoUrl: "https://i.imgur.com/G4ZMzBi.png",
    description: "Aplicativo oficial SFL Stream para Smart TVs LG (webOS). Em breve disponível na loja oficial.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
    order: 1,
    active: true,
  },
  {
    name: "Android TV",
    logoUrl: "https://i.imgur.com/wpqj69Z.png",
    description: "Aplicativo oficial para Android TV, Google TV e TV Box Android com suporte a controle remoto e 4K.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    order: 2,
    active: true,
  },
  {
    name: "Fire TV",
    logoUrl: "https://i.imgur.com/fx6NBrJ.png",
    description: "Versão otimizada para Amazon Fire TV Stick. Instale facilmente usando nosso link encurtado.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-pink-400 via-rose-400 to-amber-300",
    order: 3,
    active: true,
  },
  {
    name: "Samsung",
    logoUrl: "https://i.imgur.com/XByJBt5.png",
    description: "Aplicativo nativo para Smart TVs Samsung (Tizen). Em desenvolvimento para liberação na loja oficial.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-indigo-400 via-purple-400 to-cyan-400",
    order: 4,
    active: true,
  },
  {
    name: "Roku",
    logoUrl: "https://i.imgur.com/GN6KzIF.png",
    description: "Aplicativo SFL Stream para dispositivos e TVs com sistema Roku.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-purple-500 via-violet-500 to-indigo-600",
    order: 5,
    active: true,
  },
  {
    name: "Vega OS",
    logoUrl: "https://i.imgur.com/8zNAJ6L.png",
    description: "Compatibilidade SFL Stream para dispositivos com sistema Vega OS.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    order: 6,
    active: true,
  },
  {
    name: "Vidaa OS",
    logoUrl: "https://i.imgur.com/0xVI3Tw.png",
    description: "Aplicativo SFL Stream para Smart TVs com sistema Vidaa OS.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
    order: 7,
    active: true,
  },
  {
    name: "Microsoft Store",
    logoUrl: "https://i.imgur.com/ddW2ZBO.png",
    description: "Versão para Windows disponível via Microsoft Store ou instalador direto.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    order: 8,
    active: true,
  },
  {
    name: "Xbox",
    logoUrl: "https://i.imgur.com/lRPZZlH.png",
    description: "Assista ao SFL Stream diretamente no seu console Xbox.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-emerald-500 via-green-500 to-teal-600",
    order: 9,
    active: true,
  },
  {
    name: "Downloader",
    logoUrl: "https://i.imgur.com/FlWEF8E.png",
    description: "Baixe e instale rapidamente usando o código/link encurtado no aplicativo Downloader.",
    status: "COMING_SOON",
    fileUrl: null,
    shortCode: null,
    gradient: "from-red-500 via-rose-500 to-pink-500",
    order: 10,
    active: true,
  },
];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Acesso não autorizado.");
  }
}

async function generateUniqueShortCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = crypto.randomBytes(4).toString("base64url").slice(0, 6);
    const existing = await prisma.homePlatform.findUnique({
      where: { shortCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

export async function getHomePlatforms(): Promise<HomePlatformItem[]> {
  try {
    const items = await prisma.homePlatform.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    if (items.length === 0) {
      return DEFAULT_PLATFORMS.map((item, idx) => ({
        ...item,
        id: `default-${idx + 1}`,
      }));
    }

    return items;
  } catch (error) {
    console.error("Error fetching home platforms:", error);
    return DEFAULT_PLATFORMS.map((item, idx) => ({
      ...item,
      id: `default-${idx + 1}`,
    }));
  }
}

export async function getAllHomePlatformsAdmin() {
  await requireAdmin();
  return prisma.homePlatform.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function createHomePlatform(input: {
  name: string;
  logoUrl: string;
  description: string;
  status: string;
  fileUrl?: string | null;
  gradient?: string;
  order?: number;
  active?: boolean;
}) {
  await requireAdmin();

  const cleanFileUrl = input.fileUrl?.trim() || null;
  const shortCode = cleanFileUrl ? await generateUniqueShortCode() : null;
  const normalizedStatus =
    input.status === "AVAILABLE" || input.status === "HOW_TO_INSTALL"
      ? input.status
      : "COMING_SOON";

  const created = await prisma.homePlatform.create({
    data: {
      name: input.name.trim(),
      logoUrl: input.logoUrl.trim(),
      description: input.description.trim(),
      status: normalizedStatus,
      fileUrl: cleanFileUrl,
      shortCode,
      gradient: input.gradient || "from-emerald-400 via-teal-400 to-cyan-500",
      order: Number(input.order) || 0,
      active: input.active ?? true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/platforms");
  return created;
}

export async function updateHomePlatform(
  id: string,
  input: {
    name: string;
    logoUrl: string;
    description: string;
    status: string;
    fileUrl?: string | null;
    gradient?: string;
    order?: number;
    active?: boolean;
  }
) {
  await requireAdmin();

  const existing = await prisma.homePlatform.findUnique({ where: { id } });
  if (!existing) throw new Error("Item não encontrado.");

  const cleanFileUrl = input.fileUrl?.trim() || null;
  let shortCode = existing.shortCode;

  if (cleanFileUrl && !shortCode) {
    shortCode = await generateUniqueShortCode();
  } else if (!cleanFileUrl) {
    shortCode = null;
  }

  const normalizedStatus =
    input.status === "AVAILABLE" || input.status === "HOW_TO_INSTALL"
      ? input.status
      : "COMING_SOON";

  const updated = await prisma.homePlatform.update({
    where: { id },
    data: {
      name: input.name.trim(),
      logoUrl: input.logoUrl.trim(),
      description: input.description.trim(),
      status: normalizedStatus,
      fileUrl: cleanFileUrl,
      shortCode,
      gradient: input.gradient || existing.gradient,
      order: Number(input.order) || 0,
      active: input.active ?? true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/platforms");
  return updated;
}

export async function deleteHomePlatform(id: string) {
  await requireAdmin();
  await prisma.homePlatform.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/platforms");
}

export async function seedDefaultHomePlatforms() {
  await requireAdmin();
  const count = await prisma.homePlatform.count();
  if (count > 0) return;

  for (const item of DEFAULT_PLATFORMS) {
    await prisma.homePlatform.create({
      data: item,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/platforms");
}

