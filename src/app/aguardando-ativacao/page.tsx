"use client";

import { Clock, MessageCircle, LogOut, RefreshCw } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AguardandoAtivacaoPage() {
  const router = useRouter();

  const handleRefresh = () => {
    // Recarrega a página para verificar o status isActive atualizado no servidor
    router.refresh();
  };

  const handleWhatsApp = () => {
    const phoneNumber = "351928485483";
    const message = encodeURIComponent("Olá! Já realizei o pagamento do SFL Stream e gostaria de acelerar minha ativação.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 selection:bg-brand-yellow selection:text-black">
      <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] text-center border-white/5 relative overflow-hidden">
        
        {/* Glow Effect Background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-yellow/10 blur-[80px] rounded-full" />
        
        <div className="mb-8 relative flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-yellow/20 blur-2xl rounded-full" />
            <div className="relative bg-black border border-brand-yellow/30 p-5 rounded-full shadow-[0_0_30px_rgba(248,231,28,0.2)]">
              <Clock className="w-12 h-12 text-brand-yellow" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white leading-tight">
          Sua diversão está <br />
          <span className="text-brand-yellow">quase pronta!</span>
        </h1>
        
        <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-[280px] mx-auto">
          Estamos confirmando seu pagamento. Assim que concluído, seu acesso será liberado automaticamente.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 w-full bg-brand-green hover:bg-brand-green/90 text-white font-black py-5 rounded-2xl transition-all transform active:scale-95 shadow-lg shadow-brand-green/20 animate-pulse"
          >
            <MessageCircle className="w-5 h-5" />
            ACELERAR MINHA ATIVAÇÃO
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-4 rounded-xl border border-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              VERIFICAR AGORA
            </button>

            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 text-xs font-bold py-4 rounded-xl border border-white/10 transition-all group"
            >
              <LogOut className="w-4 h-4" />
              SAIR DA CONTA
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-brand-green rounded-full opacity-50" />
            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full opacity-50" />
          </div>
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">
            SFL GRUPO • SISTEMA DE STREAMING
          </p>
        </div>
      </div>
    </div>
  );
}
