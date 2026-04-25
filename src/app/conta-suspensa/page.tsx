// src/app/conta-suspensa/page.tsx
"use client";

import { AlertOctagon, MessageCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function ContaSuspensaPage() {
  const { data: session } = useSession();

  const handleWhatsApp = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "5511999999999";
    const message = encodeURIComponent(`Olá, meu acesso foi suspenso e gostaria de regularizar meu plano SFL Stream. Usuário: ${session?.user?.name || "Cliente"}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-10 rounded-[3rem] text-center border-red-500/20 shadow-2xl shadow-red-500/5">
        <div className="mb-8 flex justify-center">
          <div className="bg-red-500/10 p-5 rounded-full border border-red-500/30">
            <AlertOctagon className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">
          Acesso <span className="text-red-500">Suspenso</span>
        </h1>
        
        <p className="text-gray-400 mb-10 text-sm leading-relaxed">
          Seu plano expirou ou sua conta foi bloqueada. <br />
          Fale com nosso suporte para regularizar agora e voltar a assistir.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 w-full bg-brand-green hover:bg-brand-green/90 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-brand-green/10"
          >
            <MessageCircle className="w-5 h-5" />
            FALAR COM SUPORTE
          </button>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-4 rounded-xl border border-white/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            SAIR DA CONTA
          </button>
        </div>
      </div>
    </div>
  );
}
