"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { refreshSportsGrid } from "@/app/actions/sports";

export default function RefreshSportsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const handleRefresh = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const result = await refreshSportsGrid();
      if (result.success) {
        setStatus({ type: 'success', message: "Grade atualizada com sucesso! Jogos antigos removidos." });
        // Limpa a mensagem após 3 segundos
        setTimeout(() => setStatus({ type: null, message: "" }), 3000);
      } else {
        setStatus({ type: 'error', message: "Falha ao atualizar. Tente novamente." });
      }
    } catch (_error) {
      setStatus({ type: 'error', message: "Erro de conexão." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className={`
          flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
          ${isLoading 
            ? "bg-white/5 text-gray-500 cursor-wait" 
            : "bg-brand-yellow text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95"
          }
        `}
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Atualizando..." : "Atualizar Grade de Sports"}
      </button>

      {/* Toast Simples */}
      {status.type && (
        <div className={`
          fixed bottom-8 right-8 z-[1000] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300
          ${status.type === 'success' 
            ? "bg-brand-green/10 border-brand-green/20 text-brand-green" 
            : "bg-red-500/10 border-red-500/20 text-red-500"
          }
        `}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[11px] font-black uppercase tracking-wider">{status.message}</span>
        </div>
      )}
    </div>
  );
}
