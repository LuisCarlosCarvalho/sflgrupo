"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, Edit, MessageCircle } from "lucide-react";
import { getUsers, renewUserPlan, updateUserStatus } from "@/app/actions/admin";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username?: string | null;
  whatsapp?: string | null;
  plan?: string | null;
  planType?: string | null;
  role: string;
  status?: string;
  isActive?: boolean;
  createdAt: Date | string;
  planExpiresAt?: Date | string | null;
  expires_at?: string;
  notification_active?: boolean;
  plan_price?: number;
  location?: string;
  connections?: number;
  app_name?: string;
  device_type?: string;
  currency?: string;
  plainPassword?: string | null;
}

export default function UserTable({
  onEdit,
  refreshKey,
}: {
  onEdit: (user: User) => void;
  refreshKey?: number;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    const data = await getUsers();
    setUsers(
      data.map((u) => ({
        ...u,
        isActive: u.status === "ACTIVE",
        planType: u.plan,
        expires_at: u.planExpiresAt ? new Date(u.planExpiresAt).toISOString() : undefined,
        app_name: (u as any).appName,
        device_type: (u as any).deviceType,
        plan_price: (u as any).planPrice,
        currency: (u as any).currency,
        notification_active: (u as any).notificationActive,
        plainPassword: (u as any).plainPassword,
      })) as User[]
    );
    setLoading(false);
  }

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchUsers();
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  async function activateAndRenew(user: User) {
    // Agora sempre abre o modal para confirmar o valor, ao invés de lançar o valor zero "escondido"
    setRenewModalUser(user);
  }

  const [renewModalUser, setRenewModalUser] = useState<User | null>(null);

  async function handleRenew(user: User) {
    setActionLoading(user.id);
    try {
      await renewUserPlan(user.id, 30, user.plan_price || 0, user.currency);
      await fetchUsers();
      setRenewModalUser(null);
      
      if (user.whatsapp) {
        const msg = encodeURIComponent(`Olá ${user.name || ''}, sua assinatura do SFL STREAM foi renovada com sucesso por mais 30 dias! Agradecemos a preferência!`);
        window.open(`https://wa.me/${user.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
      } else {
        alert("Assinatura renovada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao renovar usuário:", error);
      alert("Erro ao renovar assinatura.");
    } finally {
      setActionLoading(null);
    }
  }

  function getDaysLeft(date?: string | Date | null) {
    if (!date) return null;
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  function getExpirationColor(daysLeft: number | null) {
    if (daysLeft === null) return "text-gray-400";
    if (daysLeft > 7) return "text-brand-green";
    if (daysLeft >= 5 && daysLeft <= 7) return "text-brand-yellow";
    return "text-red-500";
  }

  function handleSendWelcomeMessage(user: User) {
    if (!user.whatsapp) {
      alert("Este usuário não possui WhatsApp cadastrado.");
      return;
    }
    const cleanNumber = user.whatsapp.replace(/\D/g, "");
    const msg = `\uD83D\uDD10 Bem-vindo ao SFL miTV \u2013 Central do Cliente!

Acesse o seu aplicativo do cliente:
\uD83D\uDCF2 Acesso: sflgrupo.store
\uD83D\uDC64 Utilizador: ${user.username || user.email}
\uD83D\uDD11 Senha: ${user.plainPassword || '(Sua senha cadastrada)'}

\uD83C\uDFAC Acompanhe lançamentos de filmes e séries, jogos do dia e novidades do entretenimento.

\u26BD Cadastre o seu time do coração e fique ainda mais próximo das principais notícias, jogos e novidades da sua equipa!

\uD83D\uDD0E Pesquise conteúdos, crie a sua playlist e envie listas de filmes, séries e jogos diretamente para o seu WhatsApp.

\u26A0\uFE0F Mantenha os seus dados de acesso em segurança e não os partilhe com terceiros.

\u2728 SFL miTV \u2014 entretenimento e informação mais perto de você.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function toggleStatus(userId: string, currentIsActive: boolean) {
    setActionLoading(userId);
    try {
      await updateUserStatus(userId, currentIsActive ? "SUSPENDED" : "ACTIVE");
      await fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <>
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#15192A]/50 backdrop-blur-md">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead>
          <tr className="bg-white/5 text-left text-xs font-black uppercase tracking-wider text-gray-400">
            <th className="px-6 py-4">Usuário</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Plano</th>
            <th className="px-6 py-4">Vencimento</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-gray-300">
          {loading ? (
            <tr>
              <td colSpan={5} className="py-12 text-center">
                <Loader2 className="animate-spin text-brand-yellow mx-auto" size={28} />
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center font-bold text-gray-500 uppercase tracking-widest">
                Nenhum usuário cadastrado.
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const isActive = u.status === "ACTIVE" || u.isActive === true;
              const daysLeft = getDaysLeft(u.planExpiresAt || u.expires_at);
              const dateColor = getExpirationColor(daysLeft);
              
              return (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{u.name || "Sem Nome"}</span>
                      <span className="text-xs text-gray-500">{u.email}</span>
                      {u.whatsapp && <span className="text-[10px] text-brand-green font-bold">{u.whatsapp}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        isActive
                          ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {isActive ? "Ativo" : "Suspenso"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-black uppercase text-brand-yellow">{u.plan || u.planType || "FREE"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setRenewModalUser(u)}
                        className={`text-xs font-medium hover:underline flex flex-col items-start ${dateColor}`}
                        title="Clique para renovar"
                      >
                        {u.planExpiresAt
                          ? new Date(u.planExpiresAt).toLocaleDateString("pt-BR")
                          : u.expires_at
                          ? new Date(u.expires_at).toLocaleDateString("pt-BR")
                          : "Indeterminado"}
                        {daysLeft !== null && (
                          <span className="text-[10px] opacity-70">
                            {daysLeft < 0 ? `Vencido há ${Math.abs(daysLeft)} dias` : `Faltam ${daysLeft} dias`}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => handleSendWelcomeMessage(u)}
                        className="p-1.5 bg-brand-green/10 text-brand-green rounded-full hover:bg-brand-green hover:text-black transition-colors"
                        title="Enviar mensagem de boas vindas"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(u)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Editar Usuário"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => activateAndRenew(u)}
                        disabled={actionLoading === u.id}
                        className="p-2 hover:bg-brand-green/20 rounded-lg text-brand-green transition-colors"
                        title="Renovar +30 Dias"
                      >
                        {actionLoading === u.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => toggleStatus(u.id, isActive)}
                        disabled={actionLoading === u.id}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                        title={isActive ? "Suspender Acesso" : "Ativar Acesso"}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

    {renewModalUser && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRenewModalUser(null)} />
        <div className="relative bg-[#15192A] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Renovar Assinatura</h3>
          <p className="text-sm text-gray-400 mb-6">
            Deseja renovar o plano de <strong className="text-brand-yellow font-black">{renewModalUser.name}</strong> por mais 30 dias?
            {renewModalUser.whatsapp && (
              <span className="block mt-2 text-xs text-brand-green/80">O WhatsApp abrirá automaticamente após confirmar.</span>
            )}
          </p>
          
          <div className="mb-6">
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Valor da Renovação (R$)</label>
            <input 
              type="number" 
              id="renewAmount"
              defaultValue={renewModalUser.plan_price || 35}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={() => setRenewModalUser(null)} 
              className="px-5 py-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              CANCELAR
            </button>
            <button 
              onClick={() => {
                const val = parseFloat((document.getElementById("renewAmount") as HTMLInputElement).value);
                const amt = isNaN(val) ? (renewModalUser.plan_price || 35) : val;
                const updatedUser = { ...renewModalUser, plan_price: amt };
                handleRenew(updatedUser);
              }}
              disabled={actionLoading === renewModalUser.id}
              className="bg-brand-green hover:bg-brand-yellow text-black px-6 py-3 rounded-xl text-xs font-black transition-all transform active:scale-95 flex items-center gap-2"
            >
              {actionLoading === renewModalUser.id ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> RENOVANDO...</>
              ) : "CONFIRMAR"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
