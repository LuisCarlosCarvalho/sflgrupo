// src/components/admin/UserTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  whatsapp: string | null;
  planType: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  expires_at?: string;
  notification_active?: boolean;
  plan_price?: number;
  location?: string;
}

export default function UserTable({ onEdit, refreshKey }: { onEdit: (user: User) => void; refreshKey?: number }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("User")
      .select("id, email, name, username, whatsapp, planType, role, isActive, createdAt, expires_at, notification_active, plan_price")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Erro ao buscar usuários:", error);
    } else {
      setUsers(data as User[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  async function activateAndRenew(userId: string) {
    setActionLoading(userId);
    const nextExpiry = new Date();
    nextExpiry.setDate(nextExpiry.getDate() + 30);

    // Pegar o preço do plano do usuário atual
    const user = users.find(u => u.id === userId);
    const amount = user?.plan_price || 0;

    // 1. Atualizar Usuário
    const { error: userError } = await supabase
      .from("User")
      .update({ 
        isActive: true, 
        expires_at: nextExpiry.toISOString(),
        notification_active: false 
      })
      .eq("id", userId);

    if (userError) {
      console.error("Erro ao renovar usuário:", userError);
      setActionLoading(null);
      return;
    }

    // 2. Registrar Receita
    if (amount > 0) {
      await supabase
        .from("transactions")
        .insert({
          type: 'INCOME',
          category: 'PLAN_RENEWAL',
          amount: amount,
          description: `Renovação: ${user?.email}`,
          user_id: userId
        });
    }

    await fetchUsers();
    setActionLoading(null);
  }

  async function toggleStatus(userId: string, currentIsActive: boolean) {
    setActionLoading(userId);
    const { error } = await supabase
      .from("User")
      .update({ isActive: !currentIsActive })
      .eq("id", userId);

    if (error) {
      console.error("Erro ao atualizar status:", error);
    } else {
      await fetchUsers();
    }
    setActionLoading(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#15192A]/50 backdrop-blur-md">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-black/40">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Email</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Nome</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Pontos</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Cargo</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Expira em</th>
            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Loader2 className="animate-spin text-brand-yellow mx-auto" size={32} />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Nenhum usuário encontrado</p>
                </td>
              </tr>
            ) : (
            users.map((u) => {
              const isExpired = u.expires_at ? new Date(u.expires_at) < new Date() : false;
              
              return (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-300">{u.email}</td>
                  <td className="px-6 py-4 text-gray-400">{u.name || "-"}</td>
                  <td className="px-6 py-4 font-bold text-gray-300 text-xs italic">{u.connections || 1} PTS</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-brand-blue/10 text-brand-blue'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!u.isActive ? (
                      <span className="flex items-center gap-2 text-xs font-bold text-red-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        BLOQUEADO
                      </span>
                    ) : isExpired ? (
                      <span className="flex items-center gap-2 text-xs font-bold text-orange-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        VENCIDO
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-xs font-bold text-brand-green">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        ATIVO
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-xs font-bold ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                    {u.expires_at ? new Date(u.expires_at).toLocaleDateString('pt-BR') : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(u)}
                        className="px-4 py-2 rounded-lg text-xs font-black bg-white/5 text-white hover:bg-white/10 transition-all"
                      >
                        EDITAR
                      </button>
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => (!u.isActive || isExpired) ? activateAndRenew(u.id) : toggleStatus(u.id, u.isActive)}
                          disabled={actionLoading === u.id}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            (!u.isActive || isExpired)
                              ? "bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black"
                              : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                          } disabled:opacity-50`}
                        >
                          {actionLoading === u.id ? (
                            <Loader2 className="animate-spin h-3 w-3" />
                          ) : (!u.isActive || isExpired) ? (
                            "ATIVAR"
                          ) : (
                            "BLOQUEAR"
                          )}
                        </button>
                      )}
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
