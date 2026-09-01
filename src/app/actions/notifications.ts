"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const notifications: { title: string; text: string; type: string; link: string }[] = [];

  if (session.user.role !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { planExpiresAt: true },
    });

    if (user?.planExpiresAt) {
      const daysRemaining = Math.ceil(
        (new Date(user.planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysRemaining <= 7) {
        notifications.push({
          title: "Renovação Próxima",
          text: daysRemaining < 0 ? "Seu plano venceu! Renove agora." : `Seu plano vence em ${daysRemaining} dias.`,
          type: "expiry",
          link: "/dashboard/perfil",
        });
      }
    }
  } else {
    const pendingCount = await prisma.supportRequest.count({
      where: { status: "OPEN" },
    });

    if (pendingCount > 0) {
      notifications.push({
        title: "Suporte Pendente",
        text: `Você tem ${pendingCount} pedido(s) aguardando resposta.`,
        type: "support",
        link: "/admin/support",
      });
    }
  }

  return notifications;
}
