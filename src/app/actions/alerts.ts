"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAlerts() {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return alerts.map((a) => ({
      id: a.id,
      sent_at: a.createdAt.toISOString(),
      user_id: a.userId || "",
      type: a.type,
      days_remaining: 3,
      User: a.user,
      title: a.title,
      message: a.message,
    }));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
}

export async function dismissAlert(id: string) {
  try {
    await prisma.alert.delete({
      where: { id },
    });
    revalidatePath("/admin/alerts");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
