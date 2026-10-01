"use client";

import { useState } from "react";
import { updateApp } from "@/app/actions/apps";
import { Pencil, X } from "lucide-react";

type App = {
  id: string;
  name: string;
  platform: string;
  download_url: string;
  icon_url: string;
  description: string;
};

export default function EditAppModal({ app }: { app: App }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateApp(app.id, formData);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-xl transition-all"
        title="Editar Aplicativo"
      >
        <Pencil size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                <Pencil size={20} />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Editar Aplicativo</h2>
            </div>

            <form action={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Nome do App</label>
                <input
                  name="name"
                  defaultValue={app.name}
                  required
                  placeholder="Ex: SFL Stream Pro"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Plataforma</label>
                <select
                  name="platform"
                  defaultValue={app.platform}
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
                  defaultValue={app.icon_url}
                  placeholder="https://i.imgur.com/..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Link de Download</label>
                <input
                  name="download_url"
                  defaultValue={app.download_url}
                  required
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Descrição curta</label>
                <textarea
                  name="description"
                  defaultValue={app.description}
                  placeholder="Breve descrição do app..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors min-h-[100px]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-yellow text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] mt-4"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
