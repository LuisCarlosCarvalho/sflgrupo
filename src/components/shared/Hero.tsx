"use client";

import { Play, Info } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
        
        {/* Simulating a Video Background */}
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1540747913346-19e3adbb10c3?q=80&w=2000')] bg-cover bg-center animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-20 mt-20">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            Ao Vivo: Final da Champions League
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            A EMOÇÃO DO ESPORTE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-green to-brand-dark-blue">
              EM ALTA DEFINIÇÃO.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
            Assista aos melhores jogos, eventos e conteúdos exclusivos em qualquer lugar. O streaming que entende o torcedor.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="/register"
              className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-green text-black px-8 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-yellow/20"
            >
              <Play className="fill-current w-5 h-5" />
              COMEÇAR AGORA
            </Link>
            
            <button className="flex items-center gap-2 glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
              <Info className="w-5 h-5" />
              Saiba Mais
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute right-0 bottom-0 p-10 hidden lg:block opacity-50">
        <div className="flex gap-4">
          <div className="w-1 h-16 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1 h-16 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 h-16 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </section>
  );
}
