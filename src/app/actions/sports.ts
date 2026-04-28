"use server";

import { revalidatePath } from "next/cache";

export async function refreshSportsGrid() {
  try {
    // Força a revalidação da rota do dashboard e da API
    revalidatePath("/dashboard");
    revalidatePath("/api/games/upcoming");
    
    // Simula um pequeno delay para o usuário sentir a ação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: "Grade de Sports atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar grade:", error);
    return { success: false, message: "Falha ao atualizar a grade." };
  }
}
