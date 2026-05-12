"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Rocket, CheckCircle2, Play, MonitorPlay, Smartphone, Tv, Star, Film, Baby, Heart, Clapperboard, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

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

  const series = [
    "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg", // Stranger Things
    "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg", // Breaking Bad
    "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg", // The Last of Us
    "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg", // Game of Thrones
  ];

  const animes = [
    "https://image.tmdb.org/t/p/w500/xppeysfvDKVx775MFuH8Z9BlpMk.jpg", // Naruto
    "https://image.tmdb.org/t/p/w500/blWCPEqDGLBuLB9u89CxP9ORQP4.jpg", // One Piece
    "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg", // Attack on Titan
    "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg", // Demon Slayer
  ];

  const channels = ["Tv Aberta", "SporT´s", "Canais Paperview", "Séries TV", "Canais 24h", "Documentários", "Ligas", "Notícias", "Infantis", "Música", "Rádio "];

  const testimonials = [
    {
      name: "Carlos Eduardo",
      text: "Melhor estabilidade que já testei. Assisto os jogos do meu time sem nenhum travamento!",
      img: "https://i.imgur.com/wCc7fY7.jpeg"
    },
    {
      name: "Mariana Silva",
      text: "A qualidade de imagem é surreal. Cancelei minha TV a cabo e não me arrependo nem um pouco.",
      img: "https://i.imgur.com/cmm7ZNC.jpeg"
    },
    {
      name: "Roberto Almeida",
      text: "O guia de TV (EPG) funciona muito bem, e a variedade de séries e animes é absurda. Recomendo!",
      img: "https://i.imgur.com/h4zNj80.jpeg"
    },
    {
      name: "Fernanda Costa",
      text: "Assinei para ver as novelas turcas e fiquei impressionada com o catálogo de filmes. É muito completo.",
      img: "https://i.imgur.com/F9LM7So.jpeg"
    },
    {
      name: "Lukinha784",
      text: "O aplicativo roda liso na minha Smart TV. Nunca mais perdi uma corrida de Fórmula 1.",
      img: "https://i.imgur.com/IhQ1BkC.jpeg"
    },
    {
      name: "Thiago S",
      text: "Assinei o serviço confesso que não tinha grandes expectativas, principalmente por já ter tido outras experiências no passado. No entanto, fui surpreendido pela positiva. Já estou há 5 meses e só tenho a elogiar: o atendimento é excelente, o suporte é rápido e eficiente, e até agora não tenho absolutamente nenhuma reclamação.",
      img: "https://i.imgur.com/ExGq7tb.jpeg"
    },
    {
      name: "JuliMarkes",
      text: "Fui muito bem atendida pelo suporte no WhatsApp. Resolveram minha dúvida em minutos. Nota 10!",
      img: "https://i.imgur.com/amHDysr.jpeg"
    },
    {
      name: "Beta",
      text: "Minha família inteira usa. A interface é bem parecida com as de plataformas grandes, muito fácil de usar.",
      img: "https://i.imgur.com/YeAcOm4.jpeg"
    },
    {
      name: "André Rocha",
      text: "O que mais gosto é da aplicação do cliente, que me mantém sempre atualizado com todas as novidades, especialmente na área esportiva. É prática, fácil de usar e faz toda a diferença no dia a dia.",
      img: "https://i.imgur.com/m5uIHcu.jpeg"
    },
    {
      name: "Camila Ribeiro",
      text: "Lançamentos de cinema que saíram ontem já estão disponíveis. Estou economizando muito com essa assinatura.",
      img: "https://i.imgur.com/amNieOq.jpeg"
    }
  ];

  const newLocal = "text-sm text-gray-300 italic font-bold-4";
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-yellow selection:text-black">
      
      {/* 1. Hero Section (Topo) */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-10 pb-16 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-blue via-brand-blue/80 to-[#1e003b] opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://i.imgur.com/YGdNhbX.jpeg')] bg-cover bg-center mix-blend-overlay opacity-50 z-0"></div>
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
        
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Logo com Efeitos */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative flex justify-center items-center group cursor-pointer"
          >
            {/* Glow Dinâmico atrás da Logo */}
            <div className="absolute w-3/4 h-3/4 bg-brand-yellow/20 blur-[50px] rounded-full group-hover:bg-brand-yellow/40 group-hover:blur-[60px] transition-all duration-700"></div>
            
            <motion.img 
              src="https://i.imgur.com/2ex0N3R.png" 
              alt="SFL Grupo Logo" 
              className="relative z-10 w-56 md:w-72 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              whileHover={{ 
                scale: 1.05,
                filter: "drop-shadow(0 0 25px rgba(248, 231, 28, 0.5))"
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

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
              <span className="relative">ASSINAR AGORA</span>
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
                  ASSINAR AGORA 🚀
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
              Uma experiência <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-brand-blue">completa</span> para Filmes e Séries
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
                ASSINAR AGORA 🚀
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

      {/* 3.1 Canais ao Vivo & EPG */}
      <section className="py-24 px-4 bg-brand-dark-blue/20 relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 bg-brand-blue/10 blur-[120px] z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Sua TV a cabo, <span className="text-brand-blue">onde você estiver.</span>
            </h2>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              Guia de Programação (EPG) completo para você não perder nada. Centenas de canais abertos e fechados na palma da sua mão.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            {channels.map((channel, i) => (
              <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 hover:scale-105 transition-all cursor-default flex items-center gap-2">
                <Tv className="w-5 h-5 text-brand-blue" />
                <span className="text-white font-bold tracking-wide">{channel}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-8">
            <a 
              href="https://wa.me/351928485483?text=Olá!%20Gostaria%20de%20testar%20os%20canais." 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-yellow text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(248,231,28,0.3)]"
            >
              <PlaySquare className="w-5 h-5" /> ASSINAR AGORA
            </a>
          </div>
        </div>
      </section>

      {/* 3.2 Séries e Animes */}
      <section className="py-24 px-4 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              As séries que todo mundo comenta e os melhores <span className="text-brand-yellow">Animes</span> da temporada.
            </h2>
            <p className="text-xl text-gray-400 font-medium">Lançamentos semanais e temporadas completas em alta definição.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Series */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-3 border-b border-white/10 pb-4">
                <Clapperboard className="text-brand-blue" /> SÉRIES DE SUCESSO
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {series.map((poster, i) => (
                  <div key={i} className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform">
                    <Image src={poster} alt="Série" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Animes */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-3 border-b border-white/10 pb-4">
                <Tv className="text-brand-yellow" /> ANIMES EM DESTAQUE
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {animes.map((poster, i) => (
                  <div key={i} className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform border border-brand-yellow/20">
                    <Image src={poster} alt="Anime" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.3 E Muito Mais */}
      <section className="py-20 px-4 bg-black border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">E muito mais...</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/10 transition-colors border border-white/5">
              <Film className="w-12 h-12 text-brand-blue" />
              <span className="text-white font-bold text-lg">Documentários</span>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/10 transition-colors border border-white/5">
              <Baby className="w-12 h-12 text-brand-yellow" />
              <span className="text-white font-bold text-lg">Conteúdo Kids</span>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/10 transition-colors border border-white/5">
              <Heart className="w-12 h-12 text-pink-500" />
              <span className="text-white font-bold text-lg">Novelas Turcas</span>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/10 transition-colors border border-white/5">
              <Smartphone className="w-12 h-12 text-brand-green" />
              <span className="text-white font-bold text-lg">Reels / Shorts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.4 Prova Social */}
      <section className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden flex justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-green/5 blur-[150px] pointer-events-none"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Quem assina, <span className="text-brand-green">recomenda.</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium">Veja o que dizem sobre a nossa qualidade e estabilidade.</p>
          </div>

          {/* Carrossel de Depoimentos (Marquee Auto-Scroll) */}
          <div className="flex overflow-hidden relative w-full pb-8">
            {/* Sombras nas bordas para fade out */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
            
            <motion.div 
              className="flex gap-6 w-max pr-6"
              animate={{ x: ["0%", "-25%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 120 }}
            >
              {[...testimonials, ...testimonials].map((testi, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative flex flex-col w-[320px] md:w-[400px] shrink-0 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-4 text-brand-yellow">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-gray-300 font-medium leading-relaxed italic mb-8 flex-1">
                    &quot;{testi.text}&quot;
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-green">
                      <Image src={testi.img} alt={testi.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{testi.name}</h4>
                      <span className="text-xs text-brand-green font-bold uppercase tracking-widest">Assinante VIP</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          <div className="mt-16 text-center">
            <a 
              href="https://wa.me/351928485483?text=Olá!%20Vi%20as%20recomendações%20e%20quero%20assinar." 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_15px_40px_rgba(255,255,255,0.2)]"
            >
              ASSINAR AGORA
            </a>
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
              ASSINAR AGORA 🚀
            </a>
          </div>
          <p className="text-sm text-white/70 font-bold pt-4">
            Cancele quando quiser. Sem taxas escondidas.
          </p>
          <p className={newLocal}>
            @ 2026 - Todos os direitos reservados a SFL Grupo!
          </p>
        </div>
      </section>

    </div>
  );
}
