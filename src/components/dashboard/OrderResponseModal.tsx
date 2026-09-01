"use client";

import { useState } from "react";
import { X, CheckCircle2, MessageSquare, Loader2, User, ShieldCheck } from "lucide-react";
import { finalizeSupportRequest, createSupportRequest } from "@/app/actions/support";

interface OrderResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    service_type: string;
    description: string;
    admin_response?: string | null;
    status: string;
  } | null;
  onSuccess: () => void;
}

export default function OrderResponseModal({ isOpen, onClose, order, onSuccess }: OrderResponseModalProps) {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  if (!isOpen || !order) return null;

  async function handleFinalize() {
    if (!order) return;
    setLoading(true);
    try {
      await finalizeSupportRequest(order.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao finalizar:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !order) return;

    setLoading(true);
    try {
      await createSupportRequest({
        subject: `Réplica: ${order.service_type}`,
        message: reply.trim(),
      });
      onSuccess();
      onClose();
      setReply("");
      setIsReplying(false);
    } catch (error) {
      console.error("Erro ao responder:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#15192A] border border-white/10 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-green/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                Resposta do <span className="text-brand-green">Suporte</span>
              </h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                ID: #{order.id.slice(0, 8)} • {order.service_type}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
              <User size={12} className="text-brand-blue" /> Seu Pedido Original
            </label>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-300 italic">
              &quot;{order.description}&quot;
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green flex items-center gap-1.5">
              <MessageSquare size={12} /> Resposta Oficial SFL
            </label>
            <div className="p-5 bg-brand-green/10 rounded-2xl border border-brand-green/20 text-sm text-brand-green font-medium leading-relaxed">
              {order.admin_response || "Seu pedido foi processado pela nossa equipe de suporte."}
            </div>
          </div>

          {isReplying && (
            <form onSubmit={handleReply} className="space-y-3 pt-2">
              <textarea
                required
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Digite sua dúvida ou mensagem de resposta..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-brand-green min-h-[100px]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-green text-black font-black py-3 rounded-xl uppercase text-xs tracking-widest transition-all hover:bg-white"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Enviar Resposta"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 bg-white/5 text-gray-400 font-black py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-white/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
          {!isReplying && order.status !== "CLOSED" && order.status !== "FINISHED" && (
            <button
              onClick={() => setIsReplying(true)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all border border-white/5"
            >
              Responder Suporte
            </button>
          )}
          {order.status !== "CLOSED" && order.status !== "FINISHED" && (
            <button
              onClick={handleFinalize}
              disabled={loading}
              className="flex-1 bg-brand-green hover:bg-white text-black font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-green/10"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Concluir Atendimento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
