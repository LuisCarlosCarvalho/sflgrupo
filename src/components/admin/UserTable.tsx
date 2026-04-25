// src/components/admin/UserTable.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, X, Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    // Nota: usando "User" (maiúsculo) que é a tabela do NextAuth/Prisma
    const { data, error } = await supabase
      .from("User")
      .select("id, email, name, role, isActive, createdAt")
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
  }, []);

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
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Cargo</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Criado em</th>
            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={6} className="py-12 text-center">
                <Loader2 className="animate-spin text-brand-yellow mx-auto" size={32} />
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-300">{u.email}</td>
                <td className="px-6 py-4 text-gray-400">{u.name || "-"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-brand-blue/10 text-brand-blue'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-2 text-xs font-bold ${u.isActive ? "text-brand-green" : "text-red-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-brand-green animate-pulse" : "bg-red-500"}`} />
                    {u.isActive ? "ATIVO" : "BLOQUEADO"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-center">
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => toggleStatus(u.id, u.isActive)}
                      disabled={actionLoading === u.id}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                        u.isActive 
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" 
                          : "bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black"
                      } disabled:opacity-50`}
                    >
                      {actionLoading === u.id ? (
                        <Loader2 className="animate-spin h-3 w-3" />
                      ) : u.isActive ? (
                        "BLOQUEAR"
                      ) : (
                        "ATIVAR"
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
