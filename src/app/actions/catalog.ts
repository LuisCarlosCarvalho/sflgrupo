"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Função Parser para extrair títulos do relatório.
 * Exemplo de entrada:
 * - A Última Ceia (2025) [LEG]
 * - Massacre no Bairro Japonês
 * Saída: ["A Última Ceia", "Massacre no Bairro Japonês"]
 */
function parseCatalogReport(text: string): string[] {
  const lines = text.split('\n');
  const titles: string[] = [];

  for (const line of lines) {
    // Regex para capturar o nome após o traço "-" ou no início da linha,
    // parando antes de parenteses (ano) ou colchetes [tags]
    const match = line.match(/^\s*-\s*([^(\n\[]+)/) || line.match(/^([^(\n\[]+)/);
    
    if (match && match[1]) {
      let title = match[1].trim();
      
      // Limpeza adicional: remover tags residuais e espaços extras
      title = title.replace(/\[.*\]/g, '').trim();
      
      if (title && title.length > 2 && !title.includes('Atualizações') && !title.includes('Relatório')) {
        titles.push(title);
      }
    }
  }

  return [...new Set(titles)]; // Remover duplicatas
}

export async function importCatalogUpdates(formData: FormData) {
  const raw_text = formData.get("report") as string;
  if (!raw_text) return;

  const parsed_titles = parseCatalogReport(raw_text);

  if (parsed_titles.length === 0) {
    throw new Error("Nenhum título identificado no texto.");
  }

  // Salvar no banco de dados (Upsert no único registro ou criar novo)
  // Como queremos apenas UM conjunto de "Adicionados Recentemente" ativo:
  const { data: existing } = await supabaseAdmin
    .from("recent_catalog_updates")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    await supabaseAdmin
      .from("recent_catalog_updates")
      .update({ raw_text, parsed_titles, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin
      .from("recent_catalog_updates")
      .insert([{ raw_text, parsed_titles }]);
  }

  revalidatePath("/admin/catalogo");
  revalidatePath("/dashboard");
}

export async function getRecentCatalogUpdates() {
  const { data, error } = await supabaseAdmin
    .from("recent_catalog_updates")
    .select("parsed_titles")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return [];
  return data.parsed_titles;
}
