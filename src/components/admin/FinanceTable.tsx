// src/components/admin/FinanceTable.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";

export interface Plan {
  id: string;
  user_id: string;
  plan_name: string;
  activated_at: string;
  expires_at: string;
  created_at: string;
  User?: { email: string; name: string | null };
}

export default function FinanceTable() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchPlans() {
    setLoading(true);
    const { data, error } = await supabase
      .from("plans")
      .select("id, user_id, plan_name, activated_at, expires_at, created_at, User(email, name)")
      .order("expires_at", { ascending: true });
    
    if (error) {
      console.error("Erro ao buscar planos:", error);
    } else {
      setPlans(data as any[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  async function renew(planId: string) {
    setActionLoading(planId);
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 30);
    
    const { error } = await supabase
      .from("plans")
      .update({ activated_at: now.toISOString(), expires_at: expires.toISOString() })
      .eq("id", planId);

    if (error) {
      console.error("Erro ao renovar plano:", error);
    } else {
      await fetchPlans();
    }
    setActionLoading(null);
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#15192A]/50 backdrop-blur-md">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-black/40">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Usuário</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Plano</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Ativado em</th>
            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Vence em</th>
            <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={5} className="py-12 text-center">
                <Loader2 className="animate-spin text-brand-yellow mx-auto" size={32} />
              </td>
            </tr>
          ) : (
            plans.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-medium">{p.User?.name || "Sem nome"}</span>
                    <span className="text-gray-500 text-xs">{p.User?.email || p.user_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-brand-green/10 text-brand-green text-[10px] font-bold uppercase">
                    {p.plan_name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{formatDate(p.activated_at)}</td>
                <td className="px-6 py-4 font-bold text-gray-300">{formatDate(p.expires_at)}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => renew(p.id)}
                    disabled={actionLoading === p.id}
                    className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      actionLoading === p.id 
                        ? "bg-gray-800 text-gray-500" 
                        : "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white"
                    } disabled:opacity-50`}
                  >
                    {actionLoading === p.id ? (
                      <Loader2 className="animate-spin h-3 w-3" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    RENOVAR
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
