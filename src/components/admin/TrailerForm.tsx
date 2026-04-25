// src/components/admin/TrailerForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Plus, Film, Link as LinkIcon, Save } from "lucide-react";

export default function TrailerForm() {
  const [movieId, setMovieId] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!movieId || !manualUrl) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("trailer_overrides")
        .upsert({ 
          movie_id: movieId, 
          manual_url: manualUrl 
        });

      if (error) throw error;

      setMessage({ type: 'success', text: "Trailer configurado com sucesso!" });
      setMovieId("");
      setManualUrl("");
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || "Erro ao salvar override." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#15192A]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-brand-yellow/10 text-brand-yellow">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Novo Override</h2>
          <p className="text-gray-500 text-sm font-medium">Priorize links manuais sobre a API do TMDB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Film className="w-3 h-3" /> ID do Filme (TMDB)
          </label>
          <input
            type="text"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-all text-white placeholder:text-gray-700 font-medium"
            placeholder="Ex: 12345"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <LinkIcon className="w-3 h-3" /> URL do Trailer (Youtube/Vimeo)
          </label>
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-yellow transition-all text-white placeholder:text-gray-700 font-medium"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-brand-green/10 text-brand-green' : 'bg-red-500/10 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand-yellow hover:bg-white text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-yellow/10"
        >
          {saving ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              SALVAR CONFIGURAÇÃO
            </>
          )}
        </button>
      </form>
    </div>
  );
}
