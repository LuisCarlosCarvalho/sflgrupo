"use client";

import { useState } from "react";
import { X, Send, Loader2, MessageSquare, User, Ticket } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface AdminReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    id: string;
    service_type: string;
    description: string;
    User?: {
      name?: string;
      username?: string;
    }
  } | null;
  onSuccess: () => void;
}

export default function AdminReplyModal({ isOpen, onClose, request, onSuccess }: AdminReplyModalProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  if (!isOpen || !request) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!response.trim() || !request) return;

    setLoading(true);

    // Buscar mensagens atuais primeiro
    const { data: currentData } = await supabase
      .from("support_requests")
      .select("messages")
      .eq("id", request.id)
      .single();

    const currentMessages = currentData?.messages || [];
    const newMessages = [
      ...currentMessages,
      {
        role: 'admin',
        text: response,
        date: new Date().toISOString()
      }
    ];

    const { error } = await supabase
      .from("support_requests")
      .update({ 
        admin_response: response,
        messages: newMessages,
        status: 'RESPONDED',
        updated_at: new Date().toISOString()
      })
      .eq("id", request.id);

    if (error) {
      console.error("Erro ao responder:", error);
      alert("Erro ao enviar resposta.");
    } else {
      onSuccess();
      onClose();
      setResponse("");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#15192A] border border-white/10 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-yellow/10 to-transparent">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Responder <span className="text-brand-yellow">Pedido</span></h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
              Cliente: {request.User?.name || request.User?.username || "Usuário"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-blue">
              <Ticket size={12} /> {request.service_type}
            </div>
            <p className="text-sm text-gray-400 italic">&quot;{request.description}&quot;</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Sua Resposta</label>
            <textarea
              required
              autoFocus
              placeholder="Digite sua resposta para o cliente..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-brand-yellow min-h-[150px] transition-all"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !response.trim()}
            className="w-full bg-brand-yellow hover:bg-white text-black p-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Resposta
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
