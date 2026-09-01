"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function activateUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "ACTIVE", plan: "VIP" },
    });

    revalidatePath("/sfl-admin");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao ativar usuário" };
  }
}

export async function deactivateUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED" },
    });

    revalidatePath("/sfl-admin");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao desativar usuário" };
  }
}
