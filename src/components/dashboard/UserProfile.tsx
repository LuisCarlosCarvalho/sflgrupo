// src/components/dashboard/UserProfile.tsx
"use client";

import { User, Mail, CreditCard, Calendar, MessageCircle, ShieldCheck } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
    planType?: string;
  };
  plan?: {
    expires_at: string;
    plan_name: string;
  };
}

export default function UserProfile({ user, plan }: UserProfileProps) {
  const expirationDate = plan?.expires_at 
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(plan.expires_at))
    : "Não disponível";

  const whatsappMessage = encodeURIComponent(
    `Olá, sou o ${user.name} e quero renovar meu plano ${plan?.plan_name || "SFL Stream"}`
  );

  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "5511999999999";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
          Central do <span className="text-brand-green">Assinante</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Gerencie seu plano e informações de conta.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="md:col-span-2 glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Nome
              </label>
              <p className="text-lg font-bold text-white">{user.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> E-mail
              </label>
              <p className="text-lg font-bold text-white truncate">{user.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Plano Atual
              </label>
              <div className="flex items-center gap-2">
                <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black px-3 py-1 rounded-full border border-brand-blue/20">
                  {plan?.plan_name || "FREE"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Vencimento
              </label>
              <p className="text-lg font-bold text-white">{expirationDate}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              className="flex items-center justify-center gap-3 w-full bg-brand-green hover:bg-brand-yellow text-black font-black py-5 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-green/10"
            >
              <MessageCircle className="w-5 h-5" />
              RENOVAR MINHA ASSINATURA
            </a>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green shadow-[0_0_40px_rgba(0,166,81,0.1)]">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] mb-1">Status da Conta</p>
            <p className="text-2xl font-black text-white">ATIVA</p>
          </div>
          <p className="text-gray-500 text-xs font-medium px-4">
            Sua conta está em dia. Aproveite o melhor do entretenimento!
          </p>
        </div>
      </div>
    </div>
  );
}
