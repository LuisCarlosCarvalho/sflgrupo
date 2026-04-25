// src/components/admin/AlertCard.tsx
"use client";

import { X, Bell, Calendar } from "lucide-react";

interface Alert {
  id: string;
  user_id: string;
  type: string;
  days_remaining: number;
  sent_at: string;
  User?: { email: string; name: string | null };
}

export default function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const getSeverityStyles = (days: number) => {
    if (days === 1) return "border-red-500 bg-red-500/10 text-red-500";
    if (days <= 3) return "border-brand-yellow bg-brand-yellow/10 text-brand-yellow";
    return "border-brand-blue bg-brand-blue/10 text-brand-blue";
  };

  return (
    <div className={`p-6 rounded-2xl border-l-4 shadow-xl backdrop-blur-md transition-all hover:scale-[1.01] flex items-center justify-between ${getSeverityStyles(alert.days_remaining)}`}>
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-xl bg-white/10`}>
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-lg uppercase tracking-tight">
            Vencimento em {alert.days_remaining} {alert.days_remaining === 1 ? 'dia' : 'dias'}
          </h3>
          <p className="opacity-70 text-sm font-medium">
            Usuário: {alert.User?.name || alert.User?.email || alert.user_id}
          </p>
          <div className="flex items-center gap-2 mt-2 opacity-50 text-[10px] font-bold uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            Gerado em {new Date(alert.sent_at).toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onDismiss(alert.id)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
