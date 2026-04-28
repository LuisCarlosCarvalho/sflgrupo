"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAvailableApps() {
  const { data, error } = await supabaseAdmin
    .from("available_apps")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
  return data;
}

export async function addApp(formData: FormData) {
  const name = formData.get("name") as string;
  const platform = formData.get("platform") as string;
  const download_url = formData.get("download_url") as string;
  const icon_url = formData.get("icon_url") as string;
  const description = formData.get("description") as string;

  const { error } = await supabaseAdmin
    .from("available_apps")
    .insert([{ name, platform, download_url, icon_url, description }]);

  if (error) throw error;

  revalidatePath("/admin/apps");
  revalidatePath("/dashboard/perfil");
}

export async function deleteApp(id: string) {
  const { error } = await supabaseAdmin
    .from("available_apps")
    .delete()
    .match({ id });

  if (error) throw error;

  revalidatePath("/admin/apps");
  revalidatePath("/dashboard/perfil");
}
