"use server";

import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function toggleWatchlist(media: {
  id: string;
  title: string;
  posterPath: string;
  type: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // First check if it exists
  const { data: existing, error: fetchError } = await supabase
    .from('Watchlist')
    .select('userId')
    .match({ userId: session.user.id, mediaId: media.id })
    .maybeSingle();

  if (existing) {
    // Exists, so remove it
    const { error: deleteError } = await supabase
      .from('Watchlist')
      .delete()
      .match({ userId: session.user.id, mediaId: media.id });
      
    if (deleteError) throw deleteError;
    revalidatePath("/dashboard", "layout");
    return { success: true, added: false };
  } else {
    // Doesn't exist, so add it
    const { error: insertError } = await supabase
      .from('Watchlist')
      .insert({
        id: crypto.randomUUID(),
        userId: session.user.id,
        mediaId: media.id,
        title: media.title,
        posterPath: media.posterPath,
        type: media.type,
      });

    if (insertError) {
      console.error("Watchlist Insert Error:", insertError);
      throw insertError;
    }
    revalidatePath("/dashboard", "layout");
    return { success: true, added: true };
  }
}

export async function getWatchlist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const { data, error } = await supabase
    .from('Watchlist')
    .select('*')
    .eq('userId', session.user.id);

  if (error) {
    console.error("GetWatchlist Error:", error);
    return [];
  }

  return data || [];
}
