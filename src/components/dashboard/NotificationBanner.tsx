// src/components/dashboard/NotificationBanner.tsx
"use client";

import { AlertTriangle, Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationBannerProps {
  expiresAt: string;
}

export default function NotificationBanner({ expiresAt }: NotificationBannerProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysRemaining(diffDays);
  }, [expiresAt]);

  if (daysRemaining === null || daysRemaining > 5 || daysRemaining < 0) {
    return null;
  }

  // Banner Vermelho: 1 dia ou menos
  if (daysRemaining <= 1) {
    return (
      <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-center gap-3 animate-pulse">
        <AlertTriangle className="w-5 h-5" />
        <p className="text-xs md:text-sm font-black uppercase tracking-widest text-center">
          ÚLTIMO DIA! Renove para não perder o acesso ao SFL STREAM.
        </p>
        <button className="hidden md:block bg-white text-red-600 px-4 py-1 rounded-full text-[10px] font-black hover:bg-gray-100 transition-all">
          RENOVAR AGORA
        </button>
      </div>
    );
  }

  // Banner Amarelo: 5 a 2 dias
  return (
    <div className="bg-brand-yellow text-black px-6 py-3 flex items-center justify-center gap-3">
      <Clock className="w-5 h-5" />
      <p className="text-xs md:text-sm font-black uppercase tracking-widest text-center">
        Seu plano vence em {daysRemaining} dias! Renove antecipado e evite interrupções.
      </p>
      <button className="hidden md:block bg-black text-brand-yellow px-4 py-1 rounded-full text-[10px] font-black hover:bg-white/10 transition-all">
        VER PLANOS
      </button>
    </div>
  );
}
