// src/components/dashboard/SupportModal.tsx
"use client";

import { useState } from "react";
import { X, Send, Loader2, Film, Tv, Cpu, Smartphone, User, Globe, Shield, CheckCircle, HelpCircle, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "next-auth/react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SERVICES = [
  { id: "filme", label: "Pedido de Filme", icon: <Film className="w-4 h-4" /> },
  { id: "serie", label: "Pedido de Série", icon: <Tv className="w-4 h-4" /> },
  { id: "sistema", label: "Suporte ao Sistema", icon: <Cpu className="w-4 h-4" /> },
  { id: "apk", label: "Suporte ao APK", icon: <Smartphone className="w-4 h-4" /> },
  { id: "usuario", label: "Suporte ao Usuário", icon: <User className="w-4 h-4" /> },
  { id: "dns_vpn", label: "DNS / VPN", icon: <Globe className="w-4 h-4" /> },
  { id: "ativacao", label: "Ativação", icon: <Shield className="w-4 h-4" /> },
  { id: "pagamento", label: "Confirmar Pagamento", icon: <CheckCircle className="w-4 h-4" /> },
  { id: "duvida", label: "Dúvidas", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "sugestao", label: "Sugestão", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "outros", label: "Outros", icon: <MessageSquare className="w-4 h-4" /> },
];

export default function SupportModal({ isOpen, onClose, onSuccess }: SupportModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !description) return;

    setLoading(true);
    const { error } = await supabase
      .from("support_requests")
      .insert([
        {
          user_id: session?.user?.id,
          service_type: selectedService,
          description: description,
          status: 'PENDING'
        }
      ]);

    if (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro ao enviar pedido. Tente novamente.");
    } else {
      onSuccess();
      onClose();
      setSelectedService("");
      setDescription("");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#15192A] border border-white/10 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-blue/10 to-transparent">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Novo <span className="text-brand-blue">Pedido</span></h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Como podemos te ajudar hoje?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Seleção de Serviço */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Selecione o Serviço</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedService(s.label)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    selectedService === s.label 
                      ? "bg-brand-blue/10 border-brand-blue text-white shadow-[0_0_15px_rgba(0,86,179,0.2)]" 
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className={selectedService === s.label ? "text-brand-blue" : "text-gray-500"}>{s.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Detalhes do Pedido</label>
            <textarea
              required
              placeholder="Descreva o que você precisa (Nome do filme, detalhes do erro, etc...)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-brand-blue min-h-[150px] transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedService}
            className="w-full bg-brand-blue hover:bg-white text-white hover:text-black p-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Pedido Agora
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
