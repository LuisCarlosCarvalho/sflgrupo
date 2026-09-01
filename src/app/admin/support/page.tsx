"use client";

import { useEffect, useState } from "react";
import { getAllSupportRequests, respondSupportRequest } from "@/app/actions/support";
import { Loader2, Ticket, Clock, User as UserIcon, Reply, CheckCircle } from "lucide-react";
import AdminReplyModal from "@/components/admin/AdminReplyModal";

interface SupportRequest {
  id: string;
  subject: string;
  status: string;
  message: string;
  response?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    email: string;
    name?: string | null;
    whatsapp?: string | null;
  } | null;
}

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  async function fetchRequests() {
    setLoading(true);
    const data = await getAllSupportRequests();
    setRequests(data as any);
    setLoading(false);
  }

  async function completeRequest(id: string) {
    if (!confirm("Deseja finalizar este pedido? O cliente não poderá mais responder.")) return;

    setUpdating(id);
    await respondSupportRequest(id, "Atendimento finalizado pela equipe de suporte.");
    await fetchRequests();
    setUpdating(null);
  }

  const handleOpenReply = (req: SupportRequest) => {
    setSelectedRequest({
      id: req.id,
      service_type: req.subject,
      description: req.message,
      admin_response: req.response || "",
      User: req.user,
    });
    setIsReplyModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchRequests();
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
      case "OPEN":
        return "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20";
      case "ANSWERED":
      case "RESPONDED":
        return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case "CLOSED":
      case "FINISHED":
        return "bg-white/5 text-gray-500 border-white/10";
      default:
        return "bg-brand-blue/10 text-brand-blue border-brand-blue/20";
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Suporte & <span className="text-white">Pedidos</span>
        </h1>
        <p className="text-[10px] md:text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">
          Gerencie solicitações de serviços e suporte.
        </p>
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
              <div
                key={r.id}
                className={`p-6 rounded-[2rem] border transition-all ${
                  r.status === "OPEN" || r.status === "PENDING"
                    ? "bg-[#15192A]/50 border-brand-yellow/20 shadow-[0_0_20px_rgba(255,193,7,0.05)]"
                    : "bg-black/20 border-white/[0.02]"
                } ${r.status === "CLOSED" || r.status === "FINISHED" ? "opacity-50" : ""}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(r.status)}`}>
                    {r.subject}
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                      r.status === "OPEN" || r.status === "PENDING"
                        ? "text-brand-yellow"
                        : r.status === "ANSWERED"
                        ? "text-brand-green"
                        : "text-gray-500"
                    }`}
                  >
                    {(r.status === "OPEN" || r.status === "PENDING") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                    )}
                    {r.status === "ANSWERED" && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
                    {r.status === "OPEN" || r.status === "PENDING"
                      ? "PENDENTE"
                      : r.status === "ANSWERED"
                      ? "RESPONDIDO"
                      : "FINALIZADO"}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tighter">{r.user?.name || "Usuário"}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{r.user?.email}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl text-xs border bg-black/40 border-white/5">
                    {r.message}
                  </div>

                  {r.response && (
                    <div className="p-4 rounded-2xl text-xs border bg-brand-green/5 border-brand-green/10 italic text-brand-green">
                      Resposta: {r.response}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Atualizado em: {new Date(r.updatedAt || r.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>

                {r.status !== "CLOSED" && r.status !== "FINISHED" && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleOpenReply(r)}
                      className="w-full bg-brand-yellow hover:bg-white text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-brand-yellow/10"
                    >
                      <Reply className="w-4 h-4" />
                      {r.response ? "ALTERAR RESPOSTA" : "RESPONDER"}
                    </button>

                    <button
                      onClick={() => completeRequest(r.id)}
                      disabled={updating === r.id}
                      className="w-full bg-white/5 hover:bg-brand-green text-gray-400 hover:text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest border border-white/5"
                    >
                      {updating === r.id ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-3 h-3" />}
                      FINALIZAR PEDIDO
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <AdminReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        request={selectedRequest}
        onSuccess={fetchRequests}
      />
    </div>
  );
}
