"use client";

import { activateUser, deactivateUser } from "@/actions/admin";
import { Check, X, ShieldAlert, User as UserIcon } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  planType: string | null;
  createdAt: Date;
}

export default function AdminUserTable({ users }: { users: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setLoading(userId);
    if (currentStatus) {
      await deactivateUser(userId);
    } else {
      await activateUser(userId);
    }
    setLoading(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-500">
          <tr>
            <li className="px-8 py-5">Usuário</li>
            <li className="px-8 py-5 text-center">Status</li>
            <li className="px-8 py-5 text-center">Plano</li>
            <li className="px-8 py-5 text-right">Ações</li>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
                    {user.image ? <img src={user.image} className="rounded-full" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold">{user.name || "Sem Nome"}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                {user.isActive ? (
                  <span className="bg-brand-green/10 text-brand-green text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-brand-green/20">
                    Ativo
                  </span>
                ) : (
                  <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/20">
                    Inativo
                  </span>
                )}
              </td>
              <td className="px-8 py-6 text-center">
                <span className="text-xs font-bold text-gray-400">
                  {user.planType || "NENHUM"}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <button
                  disabled={loading === user.id}
                  onClick={() => handleToggleActive(user.id, user.isActive)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95
                    ${user.isActive 
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" 
                      : "bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black"
                    }
                    ${loading === user.id ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {loading === user.id ? "PROCESSANDO..." : user.isActive ? "REMOVER ACESSO" : "ATIVAR ACESSO"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <ShieldAlert className="text-gray-700 w-12 h-12" />
          <p className="text-gray-500 font-bold uppercase tracking-widest">Nenhum usuário registrado no momento.</p>
        </div>
      )}
    </div>
  );
}
