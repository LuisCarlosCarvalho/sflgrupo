"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import EPGGrid, { Program, Channel } from "@/components/tv/EPGGrid";
import { getLiveTVHome } from "@/app/actions/tv";
import { Search, RefreshCw, ChevronDown, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface TVChannel extends Channel {}
interface TVCategory {
  name: string;
  channels: TVChannel[];
}

export default function TVPage() {
  const [categories, setCategories] = useState<TVCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("HOJE");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [selectedProgram, setSelectedProgram] = useState<{ program: Program, channel: Channel } | null>(null);

  // Extrair categorias dinamicamente dos dados (mantendo "Todos" fixo na frente)
  const availableCategories = ["TODOS", ...Array.from(new Set(categories.map(c => c.name.toUpperCase())))].sort();

  async function loadData() {
    setIsRefreshing(true);
    const data = await getLiveTVHome();
    setCategories(data);
    setIsLoading(false);
    setIsRefreshing(false);
    
    // Auto-selecionar o primeiro programa ao vivo que encontrar
    if (!selectedProgram && data.length > 0) {
      const firstChannel = data[0].channels[0];
      if (firstChannel && firstChannel.programs.length > 0) {
        const liveProg = firstChannel.programs.find((p: Program) => p.isLive) || firstChannel.programs[0];
        setSelectedProgram({ program: liveProg, channel: firstChannel });
      }
    }
  }

  useEffect(() => {
    let isMounted = true;
    const initialLoad = async () => {
      if (isMounted) await loadData();
    };
    initialLoad();

    const interval = setInterval(async () => {
      if (isMounted) await loadData();
    }, 300000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSelectProgram = (program: Program, channel: Channel) => {
    setSelectedProgram({ program, channel });
  };

  const handleSelectChannel = (channel: TVChannel) => {
    if (!channel.programs || channel.programs.length === 0) {
      const dummyProgram: Program = {
        title: "Programação não disponível",
        start: "00:00",
        end: "23:59",
        description: "Sem guia de programação disponível para este canal no momento.",
        isLive: false
      };
      setSelectedProgram({ program: dummyProgram, channel });
      return;
    }

    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const timeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const liveProg = channel.programs.find((p) => {
      const startMin = timeToMinutes(p.start);
      const endMin = timeToMinutes(p.end);
      let duration = endMin < startMin ? (1440 - startMin + endMin) : (endMin - startMin);
      if (duration === 0) duration = 60;
      const actualEndMin = startMin + duration;
      return p.isLive || (nowMin >= startMin && nowMin < actualEndMin);
    }) || channel.programs[0];

    setSelectedProgram({ program: liveProg, channel });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Sintonizando Guia Premium</p>
        </div>
      </div>
    );
  }

  // Calculate duration string
  const getDurationString = (start: string, end: string) => {
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    let durationMins = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (durationMins < 0) durationMins += 1440; // pass midnight
    return `${durationMins} min`;
  };

  const filteredCategories = categories
    .filter(cat => activeCategory === "TODOS" || cat.name.toUpperCase() === activeCategory)
    .map(cat => ({
      name: cat.name,
      channels: cat.channels
        .filter((ch: TVChannel) => {
           const term = searchTerm.toLowerCase();
           return ch.name.toLowerCase().includes(term) || (ch.programs && ch.programs.some((p: Program) => p.title.toLowerCase().includes(term)));
        })
        .map((ch: TVChannel) => ({
           id: ch.id,
           name: ch.name,
           logo_url: ch.logo_url,
           programs: ch.programs || []
        }))
    })).filter(cat => cat.channels.length > 0);

  const hasChannels = filteredCategories.some(cat => cat.channels.length > 0);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-brand-green selection:text-black pb-[180px]">
      <DashboardNavbar />
      
      <div className="pt-20 md:pt-24 px-4 md:px-8 max-w-[1920px] mx-auto flex flex-col h-full">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
           <div className="flex items-center gap-6">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">Guia de Programação</h1>
              
              {/* Dropdown Hoje */}
              <div className="relative">
                <button 
                  onClick={() => setIsDateOpen(!isDateOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                >
                   <span className="text-sm font-medium">{selectedDate}</span>
                   <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDateOpen && (
                   <div className="absolute top-full left-0 mt-2 w-40 bg-[#0C0E14] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                      {['HOJE', 'AMANHÃ', 'DEPOIS'].map(dateOption => (
                         <button 
                           key={dateOption}
                           onClick={() => { setSelectedDate(dateOption); setIsDateOpen(false); }}
                           className={`block w-full text-left px-4 py-3 text-sm transition-colors ${selectedDate === dateOption ? 'bg-brand-green/10 text-brand-green font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                         >
                           {dateOption}
                         </button>
                      ))}
                   </div>
                )}
              </div>
           </div>

           <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative group flex-1 md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
                 <input 
                   type="text" 
                   placeholder="Buscar canais ou programas..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium focus:outline-none focus:border-brand-green/50 transition-all w-full placeholder:text-gray-600"
                 />
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-full transition-colors ${isFilterOpen ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              >
                 <Filter size={16} className={isFilterOpen ? 'text-brand-green' : 'text-gray-400'} />
                 <span className="text-sm font-medium hidden md:block">Filtros</span>
              </button>

              <button 
                onClick={loadData}
                disabled={isRefreshing}
                className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
              >
                <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-brand-green' : 'text-gray-400'} group-hover:text-white`} />
              </button>
           </div>
        </div>

        {/* Filters Side Panel (Mockup) */}
        {isFilterOpen && (
           <div className="mb-6 p-4 bg-[#0C0E14] border border-white/10 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
              <span className="text-sm font-medium text-gray-400">Opções Avançadas:</span>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 text-white transition-colors">Apenas Favoritos</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 text-white transition-colors">Ordem Alfabética</button>
           </div>
        )}

        {/* Category Tabs Bar */}
        <div className="flex items-center gap-6 mb-6 overflow-x-auto no-scrollbar pb-2 border-b border-white/5">
           {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap pb-2 text-[11px] font-bold tracking-widest uppercase transition-all ${
                  activeCategory === cat 
                    ? "text-brand-green border-b-2 border-brand-green" 
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
           ))}
        </div>

        {/* Grid Block */}
        <div className="flex-1 w-full">
           {hasChannels ? (
             <EPGGrid 
               categories={filteredCategories} 
               onSelectProgram={handleSelectProgram}
               onSelectChannel={handleSelectChannel}
               selectedProgramTitle={selectedProgram?.program.title}
             />
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-[#12141D] rounded-2xl border border-white/5" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
                <Search className="w-16 h-16 text-gray-700 mb-6" />
                <h3 className="text-2xl font-bold text-gray-300 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-500 text-sm max-w-md text-center leading-relaxed">
                  Não encontramos canais ou programas correspondentes à sua busca por <span className="text-brand-green font-bold">"{searchTerm}"</span> ou filtros aplicados. Tente usar termos diferentes ou limpar os filtros.
                </p>
             </div>
           )}
        </div>
      </div>

      {/* Footer Details Panel */}
      {selectedProgram && (
        <div className="fixed bottom-0 left-0 right-0 h-[160px] bg-[#0C0E14] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-50 flex items-center px-6 md:px-12">
           <div className="flex items-center gap-8 md:gap-12 w-full max-w-[1920px] mx-auto">
              
              {/* Canal Logo Expandido */}
              <div className="hidden md:flex w-[240px] h-[120px] bg-[#050505] rounded-xl border border-white/5 items-center justify-center p-4 shadow-inner">
                 {selectedProgram.channel.logo_url ? (
                   <img src={selectedProgram.channel.logo_url} alt={selectedProgram.channel.name} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                 ) : (
                   <span className="text-2xl font-black text-white/20 uppercase">{selectedProgram.channel.name}</span>
                 )}
              </div>

              {/* Informações do Programa */}
              <div className="flex flex-col flex-1">
                 <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedProgram.program.title}</h2>
                    {selectedProgram.program.isLive && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        Ao Vivo
                      </span>
                    )}
                 </div>

                 <div className="flex items-center gap-3 text-sm text-gray-400 font-medium mb-3">
                    <span>{selectedProgram.program.start} - {selectedProgram.program.end}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{getDurationString(selectedProgram.program.start, selectedProgram.program.end)}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{selectedProgram.channel.name}</span>
                 </div>

                 <p className="text-sm text-gray-500 max-w-4xl line-clamp-2 leading-relaxed">
                    {selectedProgram.program.description || "Sem sinopse disponível para este evento."}
                 </p>
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
