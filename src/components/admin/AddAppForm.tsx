"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addApp } from "@/app/actions/apps";

export const APP_PLATFORMS = [
  "TV Box Android",
  "Fire TV",
  "Ios",
  "Smart TV LG",
  "Smart TV Samsung",
  "Roku",
  "Windows",
  "MacOS",
  "Ferramentas",
];

export default function AddAppForm() {
  const [platform, setPlatform] = useState(APP_PLATFORMS[0]);

  const isInstructionPlatform = platform === "Smart TV LG" || platform === "Smart TV Samsung";

  return (
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
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-yellow/50 transition-colors appearance-none"
          >
            {APP_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
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
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">
            {isInstructionPlatform ? "Instrução de Instalação" : "Link de Download"}
          </label>
          {isInstructionPlatform ? (
            <textarea
              name="download_url"
              required
              placeholder="Digite o passo a passo para instalar na TV..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors min-h-[100px]"
            />
          ) : (
            <input
              name="download_url"
              required
              placeholder="https://..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors"
            />
          )}
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
  );
}
