"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, Edit } from "lucide-react";
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

  async function activateAndRenew(userId: string) {
    setActionLoading(userId);
    try {
      await renewUserPlan(userId, 30, 0);
      await fetchUsers();
    } catch (error) {
      console.error("Erro ao renovar usuário:", error);
    } finally {
      setActionLoading(null);
    }
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
                    <span className="text-xs text-gray-400 font-medium">
                      {u.planExpiresAt
                        ? new Date(u.planExpiresAt).toLocaleDateString("pt-BR")
                        : u.expires_at
                        ? new Date(u.expires_at).toLocaleDateString("pt-BR")
                        : "Indeterminado"}
                    </span>
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
                        onClick={() => activateAndRenew(u.id)}
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
  );
}
