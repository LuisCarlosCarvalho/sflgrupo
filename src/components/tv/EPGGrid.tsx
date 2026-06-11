"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { motion } from "framer-motion";

export interface Program {
  title: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  description?: string;
  isLive?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  logo_url?: string;
  programs: Program[];
}

export interface Category {
  name: string;
  channels: Channel[];
}

interface EPGGridProps {
  categories: Category[];
  onSelectProgram?: (program: Program, channel: Channel) => void;
  onSelectChannel?: (channel: Channel) => void;
  selectedProgramTitle?: string;
}

const PIXELS_PER_MINUTE = 8; 
const ROW_HEIGHT = 80;

const BORDER_COLORS = [
  'border-[#E81E63]', // Rosa
  'border-[#00BCD4]', // Ciano
  'border-[#FFEB3B]', // Amarelo
  'border-[#673AB7]', // Roxo
  'border-[#FF9800]', // Laranja
];

const TEXT_COLORS = [
  'text-[#E81E63]', 
  'text-[#00BCD4]', 
  'text-[#FFEB3B]', 
  'text-[#673AB7]', 
  'text-[#FF9800]', 
];

export default function EPGGrid({ categories, onSelectProgram, onSelectChannel, selectedProgramTitle }: EPGGridProps) {
  const allChannels = categories.flatMap(cat => cat.channels);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const nowPos = getNowMinutes() * PIXELS_PER_MINUTE;
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = Math.max(0, nowPos - 200);
        }
      }, 100);
    }
  }, []);

  // Handlers for drag-to-scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full bg-[#12141D] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl select-none relative" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
      
      {/* Container Principal com Scroll Horizontal */}
      <div 
        ref={scrollRef}
        className={`relative flex-1 overflow-x-auto overflow-y-auto no-scrollbar touch-pan-x touch-pan-y ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex min-w-max relative">
          
          {/* Coluna de Canais (Sticky Left) */}
          <div className="sticky left-0 w-[140px] flex-shrink-0 bg-[#0C0E14] border-r border-white/5 z-40 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            <div className="h-[50px] bg-[#0C0E14] border-b border-white/5 flex items-center justify-center sticky top-0 z-50">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Canais</span>
            </div>
            {categories.map((category) => (
              <div key={category.name}>
                <div className="h-[24px] bg-white/[0.02] border-b border-white/5 flex items-center px-3">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{category.name}</span>
                </div>
                {category.channels.map((channel) => {
                  const globalIdx = allChannels.findIndex(c => c.id === channel.id);
                  const colorClass = BORDER_COLORS[globalIdx % 5];
                  const textClass = TEXT_COLORS[globalIdx % 5];
                  const numberPad = (globalIdx + 1).toString().padStart(3, '0');

                  return (
                    <div 
                      key={channel.id} 
                      onClick={() => onSelectChannel && onSelectChannel(channel)}
                      className={`h-[80px] border-b border-white/5 flex items-center px-3 transition-colors hover:bg-white/[0.05] bg-[#0C0E14] border-l-[3px] cursor-pointer ${colorClass}`}
                    >
                      <span className={`text-[13px] font-bold w-8 mr-2 ${textClass}`}>{numberPad}</span>
                      <div className="w-10 h-10 rounded bg-white/5 p-1 flex items-center justify-center overflow-hidden">
                        {channel.logo_url ? (
                          <img src={channel.logo_url} alt={channel.name} className="max-w-full max-h-full object-contain drop-shadow-lg" draggable={false} />
                        ) : (
                          <Tv className="text-gray-500 w-5 h-5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Área de Programação */}
          <div className="flex-1 relative bg-[#12141D]">
            
            {/* Timeline (Top Bar) */}
            <div className="h-[50px] flex bg-[#0C0E14] border-b border-white/5 sticky top-0 z-30">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="flex-shrink-0 flex items-center relative h-full"
                  style={{ width: 60 * PIXELS_PER_MINUTE }}
                >
                  <span className="text-[12px] font-medium text-gray-400 absolute left-4">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                  <span className="text-[12px] font-medium text-gray-500/50 absolute left-1/2">
                     {hour.toString().padStart(2, "0")}:30
                  </span>
                </div>
              ))}
            </div>

            {/* Grid de Programas */}
            <div className="relative">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="h-[24px] bg-transparent border-b border-white/5" />
                  {category.channels.map((channel) => {
                    const globalIdx = allChannels.findIndex(c => c.id === channel.id);
                    const colorClass = BORDER_COLORS[globalIdx % 5];
                    const activeBgColor = colorClass.replace('border-', 'bg-').replace(']', '/10]'); // Simulate background

                    return (
                      <div key={channel.id} className="h-[80px] border-b border-white/5 relative group flex items-center">
                        {channel.programs.map((program, pIdx) => {
                          const startMin = timeToMinutes(program.start);
                          const endMin = timeToMinutes(program.end);
                          let duration = endMin < startMin ? (1440 - startMin + endMin) : (endMin - startMin);
                          if (duration === 0) duration = 60;
                          
                          const nowMin = getNowMinutes();
                          const isLive = program.isLive || (nowMin >= startMin && nowMin < endMin);
                          const isSelected = selectedProgramTitle === program.title;
                          const width = duration * PIXELS_PER_MINUTE;
                          
                          return (
                            <motion.div
                              onClick={() => onSelectProgram && onSelectProgram(program, channel)}
                              key={pIdx}
                              className={`absolute top-1 bottom-1 rounded-lg p-3 overflow-hidden flex flex-col justify-center transition-all ${isDragging ? 'pointer-events-none' : 'cursor-pointer'} ${
                                isSelected ? `border ${colorClass} ${activeBgColor} z-10 scale-[1.02] shadow-lg` : 
                                'bg-[#191A23] border border-transparent hover:bg-[#20222D] hover:border-white/10'
                              }`}
                              style={{ 
                                left: startMin * PIXELS_PER_MINUTE + 4, 
                                width: width - 8 
                              }}
                            >
                              <span className={`block w-full truncate text-[13px] font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {program.title}
                              </span>
                              
                              <div className="flex items-center gap-2">
                                {isLive && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-red-500 uppercase">Ao Vivo</span>
                                  </div>
                                )}
                                <span className="text-[11px] text-gray-500 font-medium">
                                  {program.start} - {program.end}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Linha AGORA (Redline) */}
              <div 
                className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-20 pointer-events-none"
                style={{ left: getNowMinutes() * PIXELS_PER_MINUTE }}
              >
                <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                    AGORA
                    {/* Seta para baixo */}
                    <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-red-500"></div>
                </div>
              </div>

            </div>
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
