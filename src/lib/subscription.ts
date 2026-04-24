import { supabase } from "./supabase";

export async function getSubscription(userId: string) {
  const { data: user, error } = await supabase
    .from('User')
    .select('isActive, planType')
    .eq('id', userId)
    .single();

  if (error || !user) return null;

  return {
    isActive: user.isActive,
    planType: user.planType,
  };
}
