// src/lib/supabase/admin.ts
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/supabase"; // assume you have generated types, else ignore

/**
 * Busca todos os planos com informações de usuário.
 */
export async function fetchPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("id, user_id, plan_name, activated_at, expires_at, created_at, users(email, name)")
    .order("expires_at", { ascending: true });
  if (error) throw error;
  return data as any[]; // tipo simplificado
}

/**
 * Renova um plano: define `activated_at` como agora e recalcula `expires_at` (+30 dias).
 */
export async function renewPlan(planId: string) {
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 30);

  const { error } = await supabase
    .from("plans")
    .update({ activated_at: now.toISOString(), expires_at: expires.toISOString() })
    .eq("id", planId);
  if (error) throw error;
  return true;
}
