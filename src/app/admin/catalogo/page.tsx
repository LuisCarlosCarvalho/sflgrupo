import { importCatalogUpdates, getRecentCatalogUpdates } from "@/app/actions/catalog";
import { ListPlus, Search, Info, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const currentTitles = await getRecentCatalogUpdates();

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-yellow/10 flex items-center justify-center">
            <ListPlus className="text-brand-yellow w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Importar <span className="text-brand-yellow italic">Catálogo</span>
          </h1>
        </div>
        <p className="text-[10px] md:text-sm text-gray-500 font-medium uppercase tracking-widest">Atualize a seção &quot;Adicionados Recentemente&quot; do Dashboard.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-[#15192A]/50">
            <form action={importCatalogUpdates} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Search size={12} /> Relatório de Atualizações
                </label>
                <textarea 
                  name="report"
                  required
                  rows={15}
                  placeholder="- Filme Exemplo (2025) [LEG]&#10;- Série Exemplo 2"
                  className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-yellow/50 transition-all resize-none font-mono"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-yellow text-black font-black py-5 rounded-2xl shadow-[0_10px_20px_rgba(255,221,0,0.1)] hover:shadow-[0_10px_30px_rgba(255,221,0,0.2)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                Atualizar Adicionados Recentemente
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-white/5 bg-brand-yellow/5">
            <h3 className="text-[10px] font-black text-brand-yellow uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} /> Como funciona?
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-[11px] text-gray-400 leading-relaxed font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1.5 shrink-0" />
                Cole o relatório de atualizações no campo ao lado.
              </li>
              <li className="flex gap-3 text-[11px] text-gray-400 leading-relaxed font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1.5 shrink-0" />
                O sistema vai identificar os nomes dos filmes e séries automaticamente.
              </li>
              <li className="flex gap-3 text-[11px] text-gray-400 leading-relaxed font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1.5 shrink-0" />
                Eles aparecerão na grade principal para todos os clientes.
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border-white/5">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-brand-green" /> Títulos Ativos ({currentTitles.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {currentTitles.map((title: string, i: number) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 truncate">
                  {title}
                </div>
              ))}
              {currentTitles.length === 0 && (
                <p className="text-[10px] text-gray-600 italic">Nenhum título importado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
