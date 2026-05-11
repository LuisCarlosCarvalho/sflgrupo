"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAIntegration() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Registro do Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("SW registrado com sucesso:", registration.scope);
          },
          (err) => {
            console.log("SW falhou:", err);
          }
        );
      });
    }

    // Captura do evento de instalação
    window.addEventListener("beforeinstallprompt", (e) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      
      // Mostrar o banner após 5 segundos para não ser invasivo logo de cara
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    });

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      console.log("PWA instalado com sucesso!");
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  if (!showInstallBanner || pathname === '/cta') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-[400px] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#15192A] border border-brand-green/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
             <img src="https://i.imgur.com/nmbdN3f.png" alt="App Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
             <h4 className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Instalar Aplicativo</h4>
             <p className="text-sm font-bold text-white leading-tight mb-1">SFL Stream no seu dispositivo</p>
             <p className="text-[10px] text-gray-500 font-medium leading-tight">Tenha acesso rápido e notificações exclusivas.</p>
          </div>
          <button 
            onClick={() => setShowInstallBanner(false)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-5 flex gap-2">
           <button 
             onClick={handleInstallClick}
             className="flex-1 bg-brand-green text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95"
           >
             <Download size={14} />
             Instalar Agora
           </button>
           <button 
             onClick={() => setShowInstallBanner(false)}
             className="px-6 bg-white/5 text-gray-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
           >
             Depois
           </button>
        </div>
      </div>
    </div>
  );
}
