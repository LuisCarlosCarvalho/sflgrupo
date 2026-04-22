"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function activateUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true, planType: "PREMIUM" }, // Ativa com Premium por padrão na manual
    });
    
    revalidatePath("/sfl-admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao ativar usuário" };
  }
}

export async function deactivateUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    
    revalidatePath("/sfl-admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao desativar usuário" };
  }
}
