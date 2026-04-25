"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { ShoppingBag, Clock, CheckCircle, HelpCircle, MessageSquare, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import SupportModal from "@/components/dashboard/SupportModal";

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchRequests() {
    if (!session?.user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Erro ao buscar pedidos:", error);
    else setRequests(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, [session]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

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
              {/* Botão de Suporte Premium Reestilizado */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center gap-4 bg-gradient-to-r from-brand-blue to-brand-green p-[2px] rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,166,81,0.4)] active:scale-95 shadow-xl"
              >
                <div className="flex items-center gap-3 bg-black rounded-full px-6 py-3 transition-colors group-hover:bg-transparent">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors">
                    Central de Suporte
                  </span>
                  <div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center group-hover:bg-white transition-all shadow-inner">
                    <svg className="w-4 h-4 text-brand-green group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.969c0 2.112.551 4.173 1.595 5.987L0 24l6.191-1.622a11.851 11.851 0 005.854 1.536h.005c6.603 0 11.967-5.363 11.97-11.97a11.815 11.815 0 00-3.407-8.457z" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
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
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-brand-blue hover:underline text-xs font-bold uppercase"
                        >
                          Fazer meu primeiro pedido
                        </button>
                      </td>
                    </tr>
                  ) : requests.map((req) => (
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
                        <div className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all ${
                          req.status === 'PENDING' 
                            ? "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20" 
                            : "bg-brand-green/10 text-brand-green border-brand-green/20"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${req.status === 'PENDING' ? 'bg-brand-yellow' : 'bg-brand-green'}`} />
                          {req.status === 'PENDING' ? 'LANÇADO / AGUARDANDO' : 'CONCLUÍDO'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <a 
                          href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '5511928485483'}`}
                          target="_blank"
                          className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-white transition-all underline underline-offset-4"
                        >
                          Acompanhar
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-brand-blue/5 p-8 flex items-start gap-4 border-t border-white/5">
              <Clock className="text-brand-blue w-6 h-6 flex-shrink-0" />
              <div>
                <p className="text-xs font-black uppercase text-brand-blue mb-1">Processamento em Tempo Real</p>
                <p className="text-[10px] text-gray-400 font-bold max-w-2xl leading-relaxed uppercase tracking-wider">
                  Seus pedidos são processados manualmente pela nossa equipe. O status mudará para <span className="text-brand-green">VERDE</span> assim que for concluído.
                </p>
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

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[150px] -z-10 rounded-full" />
    </main>
  );
}

