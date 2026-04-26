"use client";

import { useState } from "react";
import { X, CheckCircle2, MessageSquare, Loader2, User, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface OrderResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    service_type: string;
    description: string;
    admin_response: string;
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
    setLoading(true);
    const { error } = await supabase
      .from("support_requests")
      .update({ 
        status: 'FINISHED',
        updated_at: new Date().toISOString()
      })
      .eq("id", order?.id);

    if (error) {
      console.error("Erro ao finalizar:", error);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;

    setLoading(true);

    // Buscar mensagens atuais primeiro
    const { data: currentData } = await supabase
      .from("support_requests")
      .select("messages")
      .eq("id", order?.id)
      .single();

    const currentMessages = currentData?.messages || [];
    const newMessages = [
      ...currentMessages,
      {
        role: 'user',
        text: reply,
        date: new Date().toISOString()
      }
    ];

    const { error } = await supabase
      .from("support_requests")
      .update({ 
        description: reply, // Mantém a última para o admin ver fácil na lista
        messages: newMessages,
        status: 'PENDING',
        admin_response: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", order?.id);

    if (error) {
      console.error("Erro ao responder:", error);
    } else {
      onSuccess();
      onClose();
      setReply("");
      setIsReplying(false);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#15192A] border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-green/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center border border-brand-green/30">
              <MessageSquare className="text-brand-green w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Histórico do <span className="text-brand-green">Pedido</span></h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Chat de Suporte SFL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Conversa */}
          <div className="space-y-8">
            {(order as any).messages?.map((msg: any, i: number) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${msg.role === 'user' ? 'text-gray-500 mr-2' : 'text-brand-green ml-2'}`}>
                  {msg.role === 'user' ? (
                    <>Você <User size={12} /></>
                  ) : (
                    <><ShieldCheck size={12} /> Suporte SFL</>
                  )}
                </div>
                <div className={`p-5 rounded-2xl max-w-[85%] shadow-xl border ${
                  msg.role === 'user' 
                    ? 'bg-brand-blue/10 border-brand-blue/20 rounded-tr-none' 
                    : 'bg-white/5 border-white/10 rounded-tl-none italic'
                }`}>
                  <p className="text-sm text-gray-200 leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest px-2">
                  {new Date(msg.date).toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>

          {/* Ações */}
          {order.status !== 'FINISHED' && (
            <div className="pt-6 border-t border-white/5">
              {!isReplying ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsReplying(true)}
                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-white/5"
                  >
                    <MessageSquare size={16} />
                    Responder ao Suporte
                  </button>
                  <button
                    onClick={handleFinalize}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-brand-green hover:bg-white text-black p-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-brand-green/20"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Finalizar Pedido
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReply} className="space-y-4 animate-in slide-in-from-bottom-4">
                  <textarea
                    required
                    placeholder="Sua resposta..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-brand-blue min-h-[120px] transition-all"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReplying(false)}
                      className="flex-1 bg-white/5 text-gray-400 p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-brand-blue text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                      Enviar Resposta
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {order.status === 'FINISHED' && (
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Este pedido foi finalizado e não aceita mais respostas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
