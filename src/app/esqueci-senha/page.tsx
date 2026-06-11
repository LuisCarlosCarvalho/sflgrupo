"use client";

import { useState } from "react";
import Link from "next/link";
import { User as UserIcon, MessageCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    const message = encodeURIComponent(`Olá Suporte SFL Stream!\nEsqueci minha senha e preciso de ajuda para recuperar.\n\nMeu usuário/email é: ${identifier}`);
    const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "351928485483";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 md:p-6 selection:bg-brand-green selection:text-black">
      <div className="max-w-md w-full glass-panel p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border-white/5 relative overflow-hidden">
        
        {/* Logo Section */}
        <div className="text-center mb-8 md:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 md:mb-6">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">SFL <span className="text-brand-yellow">STREAM</span></span>
          </Link>
          <h2 className="text-lg md:text-xl font-bold text-gray-300">Recuperar Senha</h2>
          <p className="text-xs text-gray-500 mt-2">
            Informe seu usuário ou e-mail abaixo. Você será redirecionado para o nosso suporte no WhatsApp para redefinir sua senha com segurança.
          </p>
        </div>

        <form onSubmit={handleWhatsAppRedirect} className="space-y-5 md:space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Usuário ou E-mail</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500 group-focus-within:text-brand-green transition-colors" />
              <input 
                type="text" 
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: joao123 ou joao@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-10 md:px-12 py-3 md:py-4 focus:outline-none focus:border-brand-green transition-all placeholder:text-gray-700 text-sm md:text-base text-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/20 text-sm md:text-base mt-2"
          >
            <MessageCircle className="w-5 h-5" />
            RECUPERAR VIA WHATSAPP
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center space-y-3 md:space-y-4">
          <Link href="/login" className="text-[10px] md:text-xs text-brand-green font-bold hover:underline">
            Lembrei a senha! Voltar ao Login
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-brand-green/5 blur-[80px] rounded-full opacity-50" />
      </div>
    </div>
  );
}
