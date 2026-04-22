"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/whatsapp";

interface LeadModalProps {
  planName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadModal({ planName, isOpen, onClose }: LeadModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = formatWhatsAppUrl(planName, name, email);
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md glass-panel p-8 rounded-3xl border-brand-green/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-black mb-2">QUASE LÁ!</h3>
          <p className="text-gray-400">
            Informe seus dados para prosseguirmos com a ativação do plano <span className="text-brand-green font-bold">{planName}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-green transition-colors"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-green transition-colors"
              placeholder="joao@exemplo.com"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-yellow text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-brand-green/20"
          >
            IR PARA O WHATSAPP
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-600 mt-6 uppercase tracking-widest">
          Seus dados estão seguros com o SFL Grupo.
        </p>
      </div>
    </div>
  );
}
