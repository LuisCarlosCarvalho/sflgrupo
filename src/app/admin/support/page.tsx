// src/app/admin/support/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, MessageCircle, CheckCircle2, Ticket, Clock, User as UserIcon, MessageSquare } from "lucide-react";

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "5511928485483";

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_requests")
      .select("*, User(email, name, username, whatsapp)")
      .order("created_at", { ascending: false });

    if (error) console.error("Erro ao buscar pedidos:", error);
    else setRequests(data || []);
    setLoading(false);
  }

  async function completeRequest(id: string, user: any, serviceType: string) {
    setUpdating(id);
    const { error } = await supabase
      .from("support_requests")
      .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Erro ao concluir pedido:", error);
    } else {
      // Abrir WhatsApp com mensagem pronta
      const userPhone = user?.whatsapp || whatsappNumber;
      const message = `Olá ${user?.name || user?.username || 'Cliente'}! Aqui é do suporte SFL STREAM. Referente ao seu pedido de *${serviceType}*, informamos que ele foi concluído com sucesso. ✅`;
      const url = `https://wa.me/${userPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      await fetchRequests();
    }
    setUpdating(null);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Suporte & <span className="text-white">Pedidos</span>
        </h1>
        <p className="text-[10px] md:text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">Gerencie solicitações de serviços e suporte.</p>
      </header>

      <section>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-yellow w-12 h-12" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
            <Ticket className="w-16 h-16 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((r) => (
              <div key={r.id} className={`p-6 rounded-[2rem] border transition-all ${r.status === 'PENDING' ? 'bg-[#15192A]/50 border-brand-yellow/20' : 'bg-black/20 border-white/[0.02] opacity-60'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'PENDING' ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-brand-green/10 text-brand-green'}`}>
                    {r.service_type}
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${r.status === 'PENDING' ? 'text-brand-yellow' : 'text-brand-green'}`}>
                    {r.status === 'PENDING' ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" /> PENDENTE</>
                    ) : (
                      'CONCLUÍDO'
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tighter">{r.User?.name || r.User?.username || 'Usuário'}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{r.User?.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Descrição:</p>
                    <p className="text-xs text-gray-300 leading-relaxed italic">"{r.description}"</p>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Enviado em: {new Date(r.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>

                {r.status === 'PENDING' && (
                  <button
                    onClick={() => completeRequest(r.id, r.User, r.service_type)}
                    disabled={updating === r.id}
                    className="w-full bg-brand-green hover:bg-white text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-brand-green/10"
                  >
                    {updating === r.id ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        CONCLUIR E CHAMAR ZAP
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

