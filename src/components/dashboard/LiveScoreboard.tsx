"use client";

import { useEffect, useState } from "react";
import { Play, Tv } from "lucide-react";
import { SportsEvent } from "@/lib/scrapers/types";

// Categorias disponíveis no topo com ícones
const CATEGORIES = [
  { id: "All", label: "All", icon: "🏆" },
  { id: "Football", label: "Football", icon: "⚽" },
  { id: "American Football", label: "American Football", icon: "🏈" },
  { id: "Basketball", label: "Basketball", icon: "🏀" },
  { id: "Baseball", label: "Baseball", icon: "⚾" },
  { id: "Ice Hockey", label: "Ice Hockey", icon: "🏒" },
  { id: "Fighting", label: "Fighting", icon: "🥊" },
  { id: "Motorsport", label: "Motorsport", icon: "🏎️" },
  { id: "Cricket", label: "Cricket", icon: "🏏" },
  { id: "Rugby", label: "Rugby", icon: "🏉" },
  { id: "Golf", label: "Golf", icon: "⛳" },
  { id: "Tennis", label: "Tennis", icon: "🎾" }
];

// Helper para deduzir código de país com base na liga/nome (usado na API do flagcdn)
function getCountryCode(league: string): string {
  const l = league.toLowerCase();
  if (l.includes("brasileir") || l.includes("copa do brasil") || l.includes("paulista") || l.includes("série")) return "br";
  if (l.includes("ufc") || l.includes("nba") || l.includes("nfl") || l.includes("mls")) return "us";
  if (l.includes("premier league") || l.includes("ingl")) return "gb";
  if (l.includes("la liga") || l.includes("espanhol")) return "es";
  if (l.includes("serie a") || l.includes("italiano")) return "it";
  if (l.includes("bundesliga") || l.includes("alemão")) return "de";
  if (l.includes("ligue 1") || l.includes("francês")) return "fr";
  if (l.includes("champions") || l.includes("euro")) return "eu";
  return "un"; // Bandeira da ONU/Global fallback
}

// Helper para gerar avatar se não tiver logo
function getAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;
}

export default function LiveScoreboard() {
  const [events, setEvents] = useState<SportsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchScores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games/upcoming');
      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error("Erro ao carregar os eventos esportivos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // Filtro de Categorias
  const filteredEvents = events.filter(e => {
    if (selectedCategory === "All") return true;
    const cat = selectedCategory.toLowerCase();
    const sport = e.sport.toLowerCase();
    
    // Mapeamento de nomes de categoria para esportes
    if (cat === "football" && sport === "futebol") return true;
    if (cat === "american football" && sport === "american-football") return true;
    if (cat === "fighting" && sport === "mma") return true;
    if (cat === "basketball" && sport === "basketball") return true;
    if (cat === "ice hockey" && sport === "ice-hockey") return true;
    
    return sport.includes(cat.replace(' ', '-'));
  });

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-20">
      
      {/* Estilos Globais para a Animação de Flutuação */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatCategory {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float-category {
          animation: floatCategory 4s ease-in-out infinite;
        }
      `}} />

      {/* Top Section: Categorias (Espalhadas e Animadas) */}
      <div className="flex justify-center gap-2 md:gap-3 flex-wrap mb-6 md:mb-10 mt-2 md:mt-4 w-full px-2 max-w-4xl mx-auto">
        {CATEGORIES.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ animationDelay: `${index * 0.2}s` }}
            className={`animate-float-category flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold transition-all border shadow-lg ${
              selectedCategory === cat.id 
                ? "bg-[#254EDb] text-white border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105" 
                : "bg-[#15192A] text-gray-300 border-[#1E293B] hover:border-[#3B82F6] hover:text-white"
            }`}
          >
            <span className="text-xs md:text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="w-full space-y-4 animate-pulse">
           <div className="h-12 w-full bg-white/5 border-y border-brand-green/50" />
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="h-16 w-full rounded bg-white/5" />
           ))}
        </div>
      )}

      {!isLoading && filteredEvents.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Nenhuma partida encontrada nesta categoria.
          </p>
        </div>
      )}

      {/* Table Section */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[800px]">
            <thead>
              {/* Green thick borders imitating the mockup */}
              <tr className="border-y-[3px] border-brand-green bg-black/40">
                <th className="py-4 px-4 font-black uppercase tracking-wider text-sm text-white w-1/5">Leagues</th>
                <th className="py-4 px-4 font-black uppercase tracking-wider text-sm text-center text-white w-[10%]">Countries</th>
                <th className="py-4 px-4 font-black uppercase tracking-wider text-sm text-center text-white w-[35%]">Campeonato</th>
                <th className="py-4 px-4 font-black uppercase tracking-wider text-sm text-center text-white w-[15%]">Data/Horário</th>
                <th className="py-4 px-4 font-black uppercase tracking-wider text-sm text-center text-white w-1/5">Canal Transmissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#050505]">
              {filteredEvents.map((match, idx) => {
                const countryCode = match.countryCode || getCountryCode(match.league);
                const isToday = new Date().toISOString().split('T')[0] === match.date;

                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    {/* LEAGUES */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-green uppercase tracking-wider">{match.sport}</span>
                        <span className="text-sm font-bold text-white line-clamp-1">{match.league}</span>
                      </div>
                    </td>

                    {/* COUNTRIES */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex justify-center items-center">
                        {countryCode !== "un" ? (
                          <img 
                            src={`https://flagcdn.com/w40/${countryCode}.png`} 
                            alt={countryCode} 
                            className="w-8 h-auto object-contain rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" 
                          />
                        ) : (
                          <div className="w-8 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold">UN</div>
                        )}
                      </div>
                    </td>

                    {/* CAMPEONATO (MATCHUP) */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center justify-center gap-4 w-full">
                        {/* HOME */}
                        <div className="flex items-center gap-3 w-[45%] justify-end">
                          <span className="text-sm font-bold text-white text-right line-clamp-1">{match.home}</span>
                          <img 
                            src={match.homeLogo || getAvatarUrl(match.home)} 
                            alt={match.home} 
                            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 object-cover"
                          />
                        </div>

                        {/* VS */}
                        <div className="w-[10%] text-center text-xs font-black text-gray-600 italic">
                          {match.away ? "VS" : ""}
                        </div>

                        {/* AWAY */}
                        <div className="flex items-center gap-3 w-[45%] justify-start">
                          {match.away ? (
                            <>
                              <img 
                                src={match.awayLogo || getAvatarUrl(match.away)} 
                                alt={match.away} 
                                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 object-cover"
                              />
                              <span className="text-sm font-bold text-white text-left line-clamp-1">{match.away}</span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-600 font-bold">EVENTO SOLO</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* DATA / HORÁRIO */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex flex-col items-center gap-1">
                         {isToday && (
                           <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">
                             Hoje
                           </span>
                         )}
                         <span className="text-xs font-bold text-gray-300">{match.date.split('-').reverse().join('/')}</span>
                         <span className="text-xs font-black text-white">{match.time}</span>
                      </div>
                    </td>

                    {/* CANAL TRANSMISSÃO */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {match.broadcast && match.broadcast.length > 0 ? (
                          match.broadcast.map((channel, i) => (
                            <span key={i} className="text-[10px] font-black uppercase text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                              <Tv className="w-3 h-3" />
                              {channel}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-600 font-bold uppercase">A DEFINIR</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

