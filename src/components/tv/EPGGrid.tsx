"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Tv } from "lucide-react";
import { motion } from "framer-motion";

interface Program {
  title: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  description?: string;
  isLive?: boolean;
}

interface Channel {
  id: string;
  name: string;
  logo_url?: string;
  programs: Program[];
}

interface Category {
  name: string;
  channels: Channel[];
}

interface EPGGridProps {
  categories: Category[];
}

const PIXELS_PER_MINUTE = 10; 
const ROW_HEIGHT = 120;
const CHANNEL_COLUMN_WIDTH = 140;

export default function EPGGrid({ categories }: EPGGridProps) {
  const allChannels = categories.flatMap(cat => cat.channels);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getNowMinutes = () => {
    return currentTime.getHours() * 60 + currentTime.getMinutes();
  };

  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 800;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const nowPos = getNowMinutes() * PIXELS_PER_MINUTE;
      // Pequeno delay para garantir que o layout renderizou
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = nowPos - 400;
        }
      }, 100);
    }
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.9)] select-none">
      
      {/* Container Principal com Scroll Horizontal */}
      <div 
        ref={scrollRef}
        className="relative flex-1 overflow-x-auto overflow-y-hidden no-scrollbar"
      >
        <div className="flex min-w-max relative">
          
          {/* Coluna de Canais (Sticky Left) */}
          <div className="sticky left-0 w-[140px] flex-shrink-0 bg-[#0F0F0F] border-r border-white/10 z-50 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
            <div className="h-[50px] bg-black border-b border-white/10 flex items-center justify-center">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Canais</span>
            </div>
            {categories.map((category) => (
              <div key={category.name}>
                <div className="h-[30px] bg-brand-green/20 border-b border-white/10 flex items-center px-3 backdrop-blur-md">
                  <span className="text-[8px] font-black text-brand-green uppercase tracking-widest">{category.name}</span>
                </div>
                {category.channels.map((channel) => (
                  <div key={channel.id} className="h-[120px] border-b border-white/5 flex flex-col items-center justify-center p-3 text-center transition-all hover:bg-white/[0.03] bg-[#0F0F0F]">
                    <div className="w-16 h-16 rounded-full bg-black border border-white/10 p-2 flex items-center justify-center mb-1.5 shadow-2xl overflow-hidden">
                      {channel.logo_url ? (
                        <img src={channel.logo_url} alt={channel.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Tv className="text-gray-800 w-6 h-6" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-300 uppercase tracking-tight truncate w-full px-2">{channel.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Área de Programação */}
          <div className="flex-1 relative bg-[#050505]">
            
            {/* Timeline (Top Bar) */}
            <div className="h-[50px] flex bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-40">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="flex-shrink-0 border-r border-white/5 flex items-center px-6 relative h-full"
                  style={{ width: 60 * PIXELS_PER_MINUTE }}
                >
                  <span className="text-[12px] font-medium text-gray-200 tracking-normal">
                    {hour.toString().padStart(2, "0")}:00hs
                  </span>
                  <span className="text-[10px] font-normal text-gray-600 absolute left-1/2 -translate-x-1/2 tracking-normal">
                     {hour.toString().padStart(2, "0")}:30hs
                  </span>
                </div>
              ))}
            </div>

            {/* Linha AGORA */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-brand-green/80 z-30 shadow-[0_0_20px_#00a651] pointer-events-none transition-all duration-1000"
              style={{ left: getNowMinutes() * PIXELS_PER_MINUTE }}
            >
               <div className="absolute top-[8px] left-1/2 -translate-x-1/2 bg-brand-green text-black text-[9px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_#00a651] whitespace-nowrap z-50">
                  AGORA {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
               </div>
            </div>

            {/* Grid de Programas */}
            <div className="relative">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="h-[30px] bg-brand-green/[0.03] border-b border-white/5" />
                  {category.channels.map((channel) => (
                    <div key={channel.id} className="h-[120px] border-b border-white/5 relative group">
                      {channel.programs.map((program, pIdx) => {
                        const startMin = timeToMinutes(program.start);
                        const endMin = timeToMinutes(program.end);
                        let duration = endMin < startMin ? (1440 - startMin + endMin) : (endMin - startMin);
                        if (duration === 0) duration = 60;
                        
                        const nowMin = getNowMinutes();
                        const isLive = program.isLive || (nowMin >= startMin && nowMin < endMin);
                        const elapsed = Math.max(0, nowMin - startMin);
                        const width = duration * PIXELS_PER_MINUTE;
                        
                        // Lógica de visibilidade baseada no espaço disponível
                        const showDetails = width > 150;
                        const showTimes = width > 80;
                        
                        return (
                          <motion.div
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)", zIndex: 10 }}
                            key={pIdx}
                            className={`absolute top-0 bottom-0 border-r border-white/5 p-3 overflow-hidden flex flex-col justify-center transition-all cursor-pointer group/item select-none min-w-[50px] ${
                              isLive ? 'bg-brand-green/[0.12] border-l-2 border-l-brand-green' : 'bg-[#121212]'
                            }`}
                            style={{ 
                              left: startMin * PIXELS_PER_MINUTE, 
                              width: width
                            }}
                          >
                            {/* Título com Truncate Rigoroso e Alinhamento à Width */}
                            <span className={`block w-full truncate text-[13px] font-semibold leading-tight mb-1 tracking-normal ${
                              isLive ? 'text-brand-green' : 'text-white'
                            }`}>
                              {program.title}
                            </span>
                            
                            {/* Horário e Porcentagem: Isolada para não encostar no título */}
                            {showTimes && (
                              <div className="flex items-center gap-2 mt-1 opacity-60">
                                 <span className="text-[10px] text-white whitespace-nowrap tracking-normal">
                                   {program.start} — {program.end}
                                 </span>
                                 {isLive && showDetails && (
                                   <span className="text-[9px] text-zinc-500 font-mono">
                                     {Math.round((elapsed / duration) * 100)}%
                                   </span>
                                 )}
                              </div>
                            )}

                            {/* Progress Bar: Fixada no fundo */}
                            {isLive && (
                               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${Math.min(100, (elapsed / duration) * 100)}%` }}
                                   className="h-full bg-brand-green shadow-[0_0_10px_#00a651]"
                                 />
                               </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Navegação */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-[100]">
        <button 
          onClick={() => scroll('left')}
          className="p-4 bg-black/80 border border-white/10 rounded-full text-white hover:bg-brand-green hover:text-black transition-all shadow-2xl backdrop-blur-xl"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="p-4 bg-black/80 border border-white/10 rounded-full text-white hover:bg-brand-green hover:text-black transition-all shadow-2xl backdrop-blur-xl"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
