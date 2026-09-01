"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSupportRequest(data: {
  subject: string;
  message: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const request = await prisma.supportRequest.create({
    data: {
      userId: session.user.id,
      subject: data.subject,
      message: data.message,
      status: "OPEN",
    },
  });

  revalidatePath("/dashboard/meus-pedidos");
  revalidatePath("/admin/support");
  return request;
}

export async function getUserSupportRequests() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.supportRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllSupportRequests() {
  return await prisma.supportRequest.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          whatsapp: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function respondSupportRequest(id: string, response: string) {
  const updated = await prisma.supportRequest.update({
    where: { id },
    data: {
      response,
      status: "ANSWERED",
    },
  });

  revalidatePath("/admin/support");
  revalidatePath("/dashboard/meus-pedidos");
  return updated;
}

export async function finalizeSupportRequest(id: string) {
  const updated = await prisma.supportRequest.update({
    where: { id },
    data: {
      status: "CLOSED",
    },
  });

  revalidatePath("/admin/support");
  revalidatePath("/dashboard/meus-pedidos");
  return updated;
}
