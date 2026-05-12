"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { ShoppingBag, Clock, Plus, Loader2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import SupportModal from "@/components/dashboard/SupportModal";
import OrderResponseModal from "@/components/dashboard/OrderResponseModal";

interface SupportRequest {
  id: string;
  created_at: string;
  updated_at: string;
  service_type: string;
  description: string;
  status: string;
  admin_response?: string;
  user_id: string;
}

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SupportRequest | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false });

    if (error) console.error("Erro ao buscar pedidos:", error);
    else setRequests(data || []);
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => {
    let isMounted = true;
    fetchRequests().then(() => {
      // The state updates inside fetchRequests handle loading
    });
    return () => { isMounted = false; };
  }, [fetchRequests]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'AGUARDANDO', color: 'brand-yellow', bg: 'brand-yellow/10', border: 'brand-yellow/20' };
      case 'RESPONDED':
        return { label: 'RESPONDIDO', color: 'brand-green', bg: 'brand-green/10', border: 'brand-green/20' };
      case 'FINISHED':
        return { label: 'FINALIZADO', color: 'gray-500', bg: 'white/5', border: 'white/10' };
      default:
        return { label: status, color: 'brand-blue', bg: 'brand-blue/10', border: 'brand-blue/20' };
    }
  };

  const handleOpenResponse = (req: SupportRequest) => {
    setSelectedOrder(req);
    setIsResponseModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
      <DashboardNavbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                <ShoppingBag className="text-brand-blue w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">MEUS <span className="text-brand-blue">PEDIDOS</span></h1>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Histórico de transações e solicitações</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center gap-4 bg-gradient-to-r from-brand-blue to-brand-green p-[2px] rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,166,81,0.4)] active:scale-95 shadow-xl"
              >
                <div className="flex items-center gap-3 bg-black rounded-full px-6 py-3 transition-colors group-hover:bg-transparent">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                    Fazer Novo Pedido
                  </span>
                  <div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center group-hover:bg-white transition-all shadow-inner">
                    <Plus className="w-4 h-4 text-brand-green group-hover:text-black transition-colors" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border-white/5 overflow-hidden shadow-2xl">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6">ID Pedido</th>
                    <th className="px-8 py-6">Data</th>
                    <th className="px-8 py-6">Serviço / Item</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <Loader2 className="animate-spin text-brand-blue mx-auto" size={32} />
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <p className="text-gray-500 font-black uppercase tracking-widest">Nenhum pedido encontrado.</p>
                      </td>
                    </tr>
                  ) : requests.map((req) => {
                    const statusInfo = getStatusInfo(req.status);
                    return (
                      <tr key={req.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-6 font-mono text-[10px] text-brand-blue uppercase">#{req.id.slice(0,8)}</td>
                        <td className="px-8 py-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">{formatDate(req.created_at)}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-tight text-white">{req.service_type}</span>
                            <span className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">{req.description}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all bg-${statusInfo.bg} text-${statusInfo.color} border-${statusInfo.border}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${req.status !== 'FINISHED' ? 'animate-pulse' : ''} bg-${statusInfo.color}`} />
                            {statusInfo.label}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {(req.status === 'RESPONDED' || req.status === 'FINISHED' || req.admin_response) ? (
                            <button 
                              onClick={() => handleOpenResponse(req)}
                              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-white transition-all underline underline-offset-4"
                            >
                              <Eye size={12} />
                              Ver Resposta
                            </button>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                              Aguardando...
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-white/5">
              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="animate-spin text-brand-blue mx-auto" size={32} />
                </div>
              ) : requests.length === 0 ? (
                <div className="py-20 text-center">
                   <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Nenhum pedido encontrado.</p>
                </div>
              ) : requests.map((req) => {
                const statusInfo = getStatusInfo(req.status);
                return (
                  <div key={req.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-mono text-brand-blue uppercase mb-1">#{req.id.slice(0,8)}</p>
                        <h3 className="text-sm font-black uppercase tracking-tight text-white">{req.service_type}</h3>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{formatDate(req.created_at)}</p>
                      </div>
                      <div className={`inline-flex items-center gap-2 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border bg-${statusInfo.bg} text-${statusInfo.color} border-${statusInfo.border}`}>
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">&quot;{req.description}&quot;</p>
                    </div>

                    {(req.status === 'RESPONDED' || req.status === 'FINISHED' || req.admin_response) ? (
                      <button 
                        onClick={() => handleOpenResponse(req)}
                        className="flex items-center justify-center gap-2 w-full bg-brand-green/10 text-brand-green font-black py-4 rounded-xl uppercase text-[10px] tracking-widest border border-brand-green/20 active:scale-95 transition-all"
                      >
                        <Eye size={14} />
                        Ver Resposta do Suporte
                      </button>
                    ) : (
                      <div className="text-center py-2 bg-white/5 rounded-xl">
                        <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Pedido em análise...</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-brand-blue/5 p-6 md:p-8 flex items-start gap-4 border-t border-white/5">
              <Clock className="text-brand-blue w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              <div>
                <p className="text-[10px] md:text-xs font-black uppercase text-brand-blue mb-1">Sistema de Acompanhamento</p>
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
                    <span className="text-brand-yellow">AMARELO:</span> PEDIDO ENVIADO / EM ANÁLISE.
                  </p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
                    <span className="text-brand-green">VERDE:</span> PEDIDO RESPONDIDO - CLIQUE PARA VER.
                  </p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
                    <span className="text-gray-500">CINZA:</span> PEDIDO FINALIZADO E CONCLUÍDO.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SupportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRequests} 
      />

      <OrderResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        order={selectedOrder}
        onSuccess={fetchRequests}
      />

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[150px] -z-10 rounded-full" />
    </main>
  );
}

