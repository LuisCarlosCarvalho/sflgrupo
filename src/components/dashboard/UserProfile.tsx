// src/components/dashboard/UserProfile.tsx
"use client";

import { User, Mail, CreditCard, Calendar, MessageCircle, ShieldCheck, Monitor, Tv, LayoutGrid, Globe, Download, Plus } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
    planType?: string;
    expires_at?: string;
    notification_active?: boolean;
    connections?: number;
    app_name?: string;
    device_type?: string;
    location?: string;
  };
  plan?: {
    expires_at: string;
    plan_name: string;
  };
  apps?: any[];
}

export default function UserProfile({ user, plan, apps = [] }: UserProfileProps) {
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Info Card */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-8">
          <div className="grid grid-cols-1 gap-6">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-3 h-3" /> Plano
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
                <p className={`text-sm font-bold ${isExpired ? 'text-red-500' : 'text-white'}`}>{expirationDate}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> Localidade
              </label>
              <p className="text-lg font-bold text-white">{user.location || "Brasil"}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="w-3 h-3" /> Pontos
              </label>
              <p className="text-md font-bold text-white">{user.connections || 1} PONTO(S)</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Monitor className="w-3 h-3" /> Aplicativo
              </label>
              <p className="text-md font-bold text-white uppercase">{user.app_name || "SFL Stream"}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              className={`flex items-center justify-center gap-3 w-full ${isExpired ? 'bg-red-500 hover:bg-white text-white hover:text-black' : 'bg-brand-green hover:bg-brand-yellow text-black'} font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-green/10 text-xs`}
            >
              <MessageCircle className="w-5 h-5" />
              {isExpired ? 'REATIVAR ASSINATURA' : 'RENOVAR ASSINATURA'}
            </a>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
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

        {/* Applications Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col space-y-6 min-h-[400px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.2em] mb-1">Store</p>
              <h3 className="text-2xl font-black text-white uppercase italic">Aplicações</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <Download className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {apps.map((app) => (
              <a 
                key={app.id}
                href={app.download_url}
                target="_blank"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-yellow/30 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/5">
                  {app.icon_url ? (
                    <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                  ) : (
                    <Download className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-white uppercase group-hover:text-brand-yellow transition-colors">{app.name}</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{app.platform}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-black transition-all">
                  <Plus size={14} />
                </div>
              </a>
            ))}

            {apps.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                <Download className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-[9px] font-black uppercase tracking-widest">Nenhum app disponível</p>
              </div>
            )}
          </div>

          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center pt-4 border-t border-white/5">
            Clique no ícone para baixar e instalar em seu dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}
