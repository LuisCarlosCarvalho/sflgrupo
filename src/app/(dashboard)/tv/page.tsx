"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import EPGGrid from "@/components/tv/EPGGrid";
import { getLiveTVHome } from "@/app/actions/tv";
import { Search, RefreshCw, Tv, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function TVPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const staticCategories = [
    "Todos", "Abertos", "Esportes", "Filmes/Séries", "Infantil", "Documentários", "Notícias", "Música", "Internacionais"
  ];

  async function loadData() {
    setIsRefreshing(true);
    const data = await getLiveTVHome();
    setCategories(data);
    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  const allChannelsForEPG = categories.flatMap(cat => cat.channels)
    .filter(ch => ch.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(ch => ({
      id: ch.id,
      name: ch.name,
      logo_url: ch.logo_url,
      programs: ch.programs || []
    }));

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

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-brand-green selection:text-black">
      <DashboardNavbar />
      
      <div className="pt-24 md:pt-28 px-4 md:px-8 pb-10 max-w-[1920px] mx-auto">
        
        {/* Top Bar (Busca e Refresh) */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                 <Calendar size={14} className="text-brand-green" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-green transition-colors" size={18} />
                 <input 
                   type="text" 
                   placeholder="Pesquisar canais..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-12 pr-6 py-3 bg-black border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all w-64 md:w-80"
                 />
              </div>
              <button 
                onClick={loadData}
                disabled={isRefreshing}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''} text-gray-400 group-hover:text-brand-green`} />
              </button>
           </div>
        </div>

        {/* Category Tabs (Fidelidade ao Print) */}
        <div className="flex items-center gap-6 mb-8 overflow-x-auto no-scrollbar pb-2 border-b border-white/5">
           {staticCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all relative pb-4 ${
                  activeCategory === cat ? 'text-brand-green' : 'text-gray-500 hover:text-white'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green shadow-[0_0_10px_#00a651]"
                  />
                )}
              </button>
           ))}
        </div>

        {/* Guia Container */}
        <div className="space-y-6">
           <div className="bg-[#0A0A0A] p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <EPGGrid categories={categories
                .filter(cat => activeCategory === "Todos" || cat.name === activeCategory)
                .map(cat => ({
                  name: cat.name,
                  channels: cat.channels
                    .filter((ch: any) => ch.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((ch: any) => ({
                       id: ch.id,
                       name: ch.name,
                       logo_url: ch.logo_url,
                       programs: ch.programs || []
                    }))
              })).filter(cat => cat.channels.length > 0)} />
           </div>
        </div>

        {/* Footer Informativo */}
        <div className="mt-10 px-8 flex items-center justify-between opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">
           <p>SFL STREAM PROFISSIONAL GUIDE SYSTEM</p>
           <div className="flex items-center gap-8">
              <span>PROVEDOR: MI.TV</span>
              <span>SERVIÇO ONLINE</span>
           </div>
        </div>
      </div>
    </main>
  );
}
