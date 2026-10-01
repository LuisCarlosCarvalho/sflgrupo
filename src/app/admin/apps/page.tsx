import { getAvailableApps, addApp, deleteApp } from "@/app/actions/apps";
import { Download, Plus, Trash2, Globe } from "lucide-react";

import EditAppModal from "@/components/admin/EditAppModal";
import AddAppForm from "@/components/admin/AddAppForm";

export const dynamic = "force-dynamic";

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
        <AddAppForm />

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
                  
                  <div className="flex items-center gap-2">
                    <EditAppModal app={{
                      id: app.id,
                      name: app.name,
                      platform: app.platform,
                      download_url: app.download_url,
                      icon_url: app.icon_url,
                      description: app.description
                    }} />
                    <form action={async () => { "use server"; await deleteApp(app.id); }}>
                      <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
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
