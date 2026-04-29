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

interface EPGGridProps {
  channels: Channel[];
}

const PIXELS_PER_MINUTE = 6; 
const ROW_HEIGHT = 100;
const CHANNEL_COLUMN_WIDTH = 130;

export default function EPGGrid({ channels }: EPGGridProps) {
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
      scrollRef.current.scrollLeft = nowPos - 200;
    }
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.9)] select-none">
      
      <div className="relative flex flex-1 min-h-[650px]">
        
        {/* Coluna de Canais */}
        <div className="w-[130px] flex-shrink-0 bg-[#0F0F0F] border-r border-white/5 z-40">
          <div className="h-[50px] bg-black/50 border-b border-white/10 flex items-center justify-center">
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Canais</span>
          </div>
          {channels.map((channel) => (
            <div key={channel.id} className="h-[100px] border-b border-white/5 flex flex-col items-center justify-center p-3 text-center transition-all hover:bg-white/[0.03]">
              <div className="w-14 h-14 rounded-full bg-black border border-white/10 p-2.5 flex items-center justify-center mb-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
                {channel.logo_url ? (
                  <img src={channel.logo_url} alt={channel.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <Tv className="text-gray-800 w-6 h-6" />
                )}
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase leading-none tracking-tighter truncate w-full px-1">{channel.name}</span>
            </div>
          ))}
        </div>

        {/* Grade de Programação */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-x-auto relative no-scrollbar bg-[#050505]"
        >
          {/* Timeline */}
          <div className="h-[50px] flex bg-[#0F0F0F] border-b border-white/10 sticky top-0 z-20 backdrop-blur-3xl">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-0 bottom-0 px-4 bg-[#0F0F0F]/90 text-gray-500 hover:text-brand-green z-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            {hours.map((hour) => (
              <div 
                key={hour} 
                className="flex-shrink-0 border-r border-white/5 flex items-center px-6 relative"
                style={{ width: 60 * PIXELS_PER_MINUTE }}
              >
                <span className="text-[11px] font-black text-gray-400">
                  {hour.toString().padStart(2, "0")}:00hs
                </span>
                <span className="text-[10px] font-bold text-gray-700 absolute left-1/2 -translate-x-1/2">
                   {hour.toString().padStart(2, "0")}:30hs
                </span>
              </div>
            ))}

            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 px-4 bg-[#0F0F0F]/90 text-gray-500 hover:text-brand-green z-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Linha AGORA */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-brand-green/80 z-30 shadow-[0_0_20px_#00a651] pointer-events-none transition-all duration-1000"
            style={{ left: getNowMinutes() * PIXELS_PER_MINUTE }}
          >
             <div className="absolute top-[0px] left-1/2 -translate-x-1/2 bg-brand-green text-black text-[8px] font-black px-2.5 py-1 rounded-full shadow-[0_0_15px_#00a651] whitespace-nowrap">
                AGORA {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
             </div>
          </div>

          {/* Programas */}
          <div className="relative">
            {channels.map((channel) => (
              <div key={channel.id} className="h-[100px] border-b border-white/5 relative">
                {channel.programs.map((program, pIdx) => {
                  const startMin = timeToMinutes(program.start);
                  const endMin = timeToMinutes(program.end);
                  let duration = endMin < startMin ? (1440 - startMin + endMin) : (endMin - startMin);
                  if (duration === 0) duration = 60;
                  
                  const nowMin = getNowMinutes();
                  const isLive = program.isLive || (nowMin >= startMin && nowMin < endMin);
                  const elapsed = Math.max(0, nowMin - startMin);
                  
                  return (
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      key={pIdx}
                      className={`absolute top-0 bottom-0 border-r border-white/5 flex flex-col justify-center px-6 transition-all cursor-pointer overflow-hidden ${
                        isLive ? 'bg-brand-green/[0.03]' : 'bg-transparent'
                      }`}
                      style={{ 
                        left: startMin * PIXELS_PER_MINUTE, 
                        width: duration * PIXELS_PER_MINUTE
                      }}
                    >
                      <h4 className={`text-[12px] font-black uppercase tracking-tighter truncate mb-1 ${isLive ? 'text-brand-green' : 'text-gray-200'}`}>
                        {program.title}
                      </h4>
                      
                      <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">
                              {program.start} — {program.end}
                            </span>
                            {isLive && (
                              <span className="text-[9px] font-black text-white/40 uppercase">{elapsed}min/{duration}min</span>
                            )}
                         </div>

                         {isLive && (
                           <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(100, (elapsed / duration) * 100)}%` }}
                               className="h-full bg-brand-green shadow-[0_0_10px_#00a651]"
                             />
                           </div>
                         )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
