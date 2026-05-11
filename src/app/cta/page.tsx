"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Rocket, CheckCircle2, Play, MonitorPlay, Smartphone, Tv } from "lucide-react";

export default function CTA() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const sportsBenefits = [
    "Aqui o futebol não para",
    "Sinta a emoção de cada jogo",
    "Sem travamentos, estabilidade garantida",
    "Transmissões em Full HD e 4K"
  ];

  const movies = [
    "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", // Deadpool
    "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", // Avengers
    "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg", // FNAF
    "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", // Fight Club
    "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // The Dark Knight
    "https://image.tmdb.org/t/p/w500/rweIrveL43TaxUN0akQEaAXL6x0.jpg"  // Spider-Man: No Way Home
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-yellow selection:text-black">
      
      {/* 1. Hero Section (Topo) */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-10 pb-16 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-blue via-brand-blue/80 to-[#1e003b] opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://i.imgur.com/YGdNhbX.jpeg')] bg-cover bg-center mix-blend-overlay opacity-50 z-0"></div>
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
        
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-brand-yellow mb-4">
              A Revolução do Entretenimento
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] w-full max-w-4xl mx-auto text-balance">
              <span className="md:whitespace-nowrap">Tudo o que você quer assistir,</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-400 block md:inline mt-2 md:mt-0">em um único lugar.</span>
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto drop-shadow-md">
              Filmes, séries, esportes e muito mais – sem complicação e sem limites.
            </p>
          </div>

          <div className="animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
            <a 
              href="https://wa.me/351928485483?text=Olá!%20Gostaria%20de%20conhecer%20a%20SFL%20Stream." 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-yellow text-black font-black text-lg md:text-xl rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(248,231,28,0.4)] animate-pulse"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
              <Rocket className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              <span className="relative">EU QUERO CONHECER</span>
            </a>
            <p className="mt-4 text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-green" /> Acesso imediato após ativação
            </p>
          </div>

          {/* Hero Devices Showcase */}
          <div className="mt-12 w-full max-w-5xl mx-auto relative h-[300px] md:h-[450px] animate-in zoom-in-95 fade-in duration-1000 delay-300">
            <div className="absolute left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20 bg-black">
              <iframe
                src="https://www.youtube.com/embed/dGtXujDdU_A?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
                title="SFL Stream Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Seção de Oferta (Pricing) */}
      <section className="py-20 px-4 bg-black relative flex justify-center">
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-brand-yellow/5 blur-[100px] z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Card Pricing */}
          <div className="relative w-full md:w-3/4 bg-[#0a0a0a] rounded-[2.5rem] p-8 md:p-12 text-center border border-white/5 shadow-2xl">
            {/* Animated Neon Border using absolute div */}
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-brand-yellow/50 shadow-[0_0_30px_rgba(248,231,28,0.3)] animate-pulse pointer-events-none"></div>

            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-black px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,166,81,0.5)] whitespace-nowrap">
              Ativação Imediata
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tighter">
              Passe VIP Mensal
            </h2>

            <div className="mt-8 flex flex-col items-center justify-center">
              <span className="text-gray-500 text-xl font-bold line-through">De 15€</span>
              <div className="text-6xl md:text-8xl font-black text-brand-yellow drop-shadow-[0_0_20px_rgba(248,231,28,0.4)] mt-2 italic tracking-tighter flex items-start justify-center gap-2">
                <span className="text-2xl md:text-3xl mt-2 not-italic font-bold text-white tracking-normal">Por apenas</span>
                <span>9€</span>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-6">Pagamento mensal.</p>
            </div>

            <div className="mt-10 bg-red-500/10 border border-red-500/20 rounded-3xl p-6 w-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
              <p className="relative text-red-500 font-black text-sm md:text-base flex justify-center items-center gap-2 uppercase tracking-wide">
                <span className="animate-bounce text-xl">⚠️</span> Restam apenas 15 vagas com este valor!
              </p>
              <div className="relative mt-4 inline-block bg-black/50 border border-red-500/30 px-6 py-3 rounded-2xl">
                <p className="text-white font-black text-xl md:text-3xl font-mono tracking-widest">
                  A oferta expira em: <span className="text-red-500">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>

            <div className="mt-12">
              <a 
                href="https://wa.me/351928485483?text=Olá!%20QUERO%20MEU%20ACESSO%20AGORA%20na%20SFL%20Stream." 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center w-full px-8 py-6 bg-brand-yellow text-black font-black text-xl rounded-full overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(248,231,28,0.5)]"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-20"></span>
                <span className="relative flex items-center gap-3">
                  QUERO MEU ACESSO AGORA 🚀
                </span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Seção de Esportes */}
      <section className="py-24 px-4 bg-black relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Todos os esportes. <br />
                <span className="text-brand-blue">Um só lugar.</span>
              </h2>
              <p className="mt-6 text-lg text-gray-400 leading-relaxed">
                Acompanhe o seu time do coração, assista aos principais campeonatos de basquete, lutas e automobilismo com a máxima qualidade e estabilidade. Sem quedas na hora do gol.
              </p>
            </div>

            <ul className="space-y-4">
              {sportsBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="bg-brand-green/20 p-2 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                  </div>
                  <span className="text-white font-bold text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[400px] md:h-[600px] w-full rounded-[2rem] overflow-hidden order-1 md:order-2 group">
            <Image 
              src="https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop" 
              alt="Câmera de Transmissão Esportiva" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex gap-4">
                <Tv className="w-8 h-8 text-brand-blue" />
                <div>
                  <h4 className="text-white font-black uppercase tracking-wider text-sm">Transmissão</h4>
                  <p className="text-brand-blue font-bold text-xl">Ao Vivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Seção de Filmes & Maratona */}
      <section className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-dark-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          
          {/* Grid de Filmes */}
          <div className="w-full md:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {movies.map((poster, i) => (
              <div 
                key={i} 
                className={`relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-[0_0_30px_rgba(74,144,226,0.3)]
                  ${i % 3 === 1 ? 'md:translate-y-8' : ''}
                  ${i % 3 === 2 ? 'md:translate-y-16' : ''}
                `}
              >
                <Image 
                  src={poster} 
                  alt="Poster Filme" 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="w-full md:w-1/2 space-y-8 mt-16 md:mt-0 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Uma experiência <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-brand-blue">completa</span> para quem ama filmes
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              Prepare-se para horas e horas de maratona com os últimos lançamentos do cinema, clássicos inesquecíveis e as séries mais comentadas do momento.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a 
                href="https://wa.me/351928485483?text=Olá!%20Gostaria%20de%20testar%20a%20SFL%20Stream." 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-lg rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg"
              >
                EU QUERO TESTAR AGORA
              </a>
            </div>
            
            <div className="pt-8 flex items-center justify-center md:justify-start gap-8 border-t border-white/10">
              <div className="flex flex-col items-center gap-2">
                <MonitorPlay className="w-8 h-8 text-gray-500" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Smart TV</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Smartphone className="w-8 h-8 text-gray-500" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Mobile</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Seção Final (Fechamento) */}
      <section className="py-20 px-4 relative flex items-center justify-center min-h-[40vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2e3192] to-[#4a90e2] opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 z-0"></div>
        
        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">
            Comece Hoje Mesmo
          </h2>
          <p className="text-xl text-white/90 font-medium">
            Junte-se a milhares de assinantes e transforme sua sala em um verdadeiro cinema.
          </p>
          <div className="pt-4">
            <a 
              href="https://wa.me/351928485483?text=Olá!%20Quero%20começar%20hoje%20mesmo%20na%20SFL%20Stream." 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-brand-yellow text-black font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_15px_40px_rgba(248,231,28,0.5)]"
            >
              COMEÇAR AGORA 🚀
            </a>
          </div>
          <p className="text-sm text-white/70 font-bold pt-4">
            Cancele quando quiser. Sem taxas escondidas.
          </p>
        </div>
      </section>

    </div>
  );
}
