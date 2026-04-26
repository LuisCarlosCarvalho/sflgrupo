// src/components/dashboard/UserProfile.tsx
"use client";

import { User, Mail, CreditCard, Calendar, MessageCircle, ShieldCheck } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
    planType?: string;
    expires_at?: string;
    notification_active?: boolean;
  };
  plan?: {
    expires_at: string;
    plan_name: string;
  };
}

export default function UserProfile({ user, plan }: UserProfileProps) {
  // Priorizar o vencimento do objeto user (que é o que o admin edita agora)
  const finalExpiryDate = user.expires_at || plan?.expires_at;

  const expirationDate = finalExpiryDate
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(finalExpiryDate))
    : "Não disponível";

  const isExpired = finalExpiryDate ? new Date(finalExpiryDate) < new Date() : false;
  const daysRemaining = finalExpiryDate 
    ? Math.ceil((new Date(finalExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 100;

  // Alerta pisca se o admin disparar OU se faltar menos de 7 dias
  const showAlarm = user.notification_active || (daysRemaining >= 0 && daysRemaining <= 7);

  const whatsappMessage = encodeURIComponent(
    `Olá, sou o ${user.name} e quero renovar meu plano ${user.planType || "SFL Stream"}`
  );

  const whatsappNumber = "351928485483";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className={`relative transition-all duration-500 ${showAlarm ? 'pt-24' : 'pt-0'}`}>
        {showAlarm && (
          <div className="absolute top-0 left-0 right-0 animate-in slide-in-from-top-4 duration-500 z-10">
            <div className="bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(255,193,7,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                  <Calendar className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-brand-yellow tracking-widest">Atenção! Renovação Próxima</p>
                  <p className="text-xs text-white font-bold">
                    Seu plano vence em <span className="text-brand-yellow">{daysRemaining} dias</span>. Renove agora para não perder o acesso!
                  </p>
                </div>
              </div>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                className="w-full md:w-auto text-center bg-brand-yellow text-black text-[10px] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest hover:bg-white transition-all shadow-lg"
              >
                Renovar Agora
              </a>
            </div>
          </div>
        )}
        
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
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  user.planType === 'VIP' ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20' : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                }`}>
                  {user.planType || "FREE"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Vencimento
              </label>
              <p className={`text-lg font-bold ${isExpired ? 'text-red-500' : 'text-white'}`}>{expirationDate}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              className={`flex items-center justify-center gap-3 w-full ${isExpired ? 'bg-red-500 hover:bg-white text-white hover:text-black' : 'bg-brand-green hover:bg-brand-yellow text-black'} font-black py-5 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-green/10`}
            >
              <MessageCircle className="w-5 h-5" />
              {isExpired ? 'REATIVAR MINHA ASSINATURA' : 'RENOVAR MINHA ASSINATURA'}
            </a>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center text-center space-y-4">
          <div className={`w-20 h-20 ${isExpired ? 'bg-red-500/10 text-red-500' : 'bg-brand-green/10 text-brand-green'} rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,166,81,0.1)]`}>
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <p className={`text-[10px] font-black ${isExpired ? 'text-red-500' : 'text-brand-green'} uppercase tracking-[0.2em] mb-1`}>Status da Conta</p>
            <p className="text-2xl font-black text-white">{isExpired ? 'VENCIDA' : 'ATIVA'}</p>
          </div>
          <p className="text-gray-500 text-xs font-medium px-4">
            {isExpired 
              ? "Sua conta está vencida. Renove para continuar assistindo!" 
              : "Sua conta está em dia. Aproveite o melhor do entretenimento!"}
          </p>
        </div>
      </div>
    </div>
  );
}
