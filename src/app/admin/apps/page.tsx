"use server";

import { getAvailableApps, addApp, deleteApp } from "@/app/actions/apps";
import { Download, Plus, Trash2, Globe } from "lucide-react";

export default async function AdminAppsPage() {
  const apps = await getAvailableApps();

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Gerenciar Aplicativos</h1>
          <p className="text-gray-400 text-sm">Cadastre e gerencie os apps disponíveis para os clientes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form para Adicionar */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
              <Plus size={20} />
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Novo Aplicativo</h2>
          </div>

          <form action={addApp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Nome do App</label>
              <input
                name="name"
                required
                placeholder="Ex: SFL Stream Pro"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Plataforma</label>
              <select
                name="platform"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-yellow/50 transition-colors appearance-none"
              >
                <option value="ANDROID">ANDROID</option>
                <option value="IOS">IOS</option>
                <option value="SMART TV">SMART TV</option>
                <option value="WINDOWS">WINDOWS</option>
                <option value="LINUX">LINUX</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">URL do Ícone (Imgur/Opcional)</label>
              <input
                name="icon_url"
                placeholder="https://i.imgur.com/..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Link de Download</label>
              <input
                name="download_url"
                required
                placeholder="https://..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Descrição curta</label>
              <textarea
                name="description"
                placeholder="Breve descrição do app..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-yellow text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              Cadastrar Aplicativo
            </button>
          </form>
        </div>

        {/* Lista de Apps */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Aplicativos Cadastrados</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app) => (
              <div 
                key={app.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between group hover:border-brand-yellow/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/5">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                      ) : (
                        <Download className="text-gray-600 w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg leading-tight">{app.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black bg-brand-yellow/10 text-brand-yellow px-2 py-0.5 rounded-full border border-brand-yellow/20">
                          {app.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <form action={async () => { "use server"; await deleteApp(app.id); }}>
                    <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>

                <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {app.description || "Sem descrição disponível."}
                </p>

                <a 
                  href={app.download_url}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                >
                  <Globe size={14} />
                  Ver Link de Download
                </a>
              </div>
            ))}

            {apps.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-[2rem]">
                <Download size={40} className="mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Nenhum aplicativo cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
