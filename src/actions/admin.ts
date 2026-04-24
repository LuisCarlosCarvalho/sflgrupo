"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function activateUser(userId: string) {
  try {
    const { error } = await supabase
      .from('User')
      .update({ isActive: true, planType: "PREMIUM" })
      .eq('id', userId);

    if (error) throw error;
    
    revalidatePath("/sfl-admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao ativar usuário" };
  }
}

export async function deactivateUser(userId: string) {
  try {
    const { error } = await supabase
      .from('User')
      .update({ isActive: false })
      .eq('id', userId);

    if (error) throw error;
    
    revalidatePath("/sfl-admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao desativar usuário" };
  }
}
