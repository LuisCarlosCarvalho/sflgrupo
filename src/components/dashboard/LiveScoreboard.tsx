"use client";

import { useEffect, useState } from "react";
import { Play, Trophy, Clock, Tv } from "lucide-react";

interface ISportsEvent {
  matchId: string;
  leagueName: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  status: number; 
  matchTime: number; 
}

export default function LiveScoreboard() {
  const [events, setEvents] = useState<ISportsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"football" | "basketball">("football");

  const TABS = [
    { id: "football", label: "FUTEBOL", icon: "⚽" },
    { id: "basketball", label: "BASQUETE", icon: "🏀" },
  ] as const;

  const fetchScores = async (sport: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://api.isportsapi.com/sport/${sport}/livescores?api_key=T7QRzvqwikX5eRRq`);
      const json = await res.json();
      
      if (json.code === 0 && json.data) {
        setEvents(json.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Erro ao buscar placares da iSportsAPI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(activeTab);
    const interval = setInterval(() => fetchScores(activeTab), 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const groupedEvents = events.reduce((acc, event) => {
    const league = event.leagueName || "Campeonatos Diversos";
    if (!acc[league]) acc[league] = [];
    acc[league].push(event);
    return acc;
  }, {} as Record<string, ISportsEvent[]>);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black tracking-tighter text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-brand-green text-black"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-white/5 border border-white/10" />
          ))}
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
          <Trophy className="w-12 h-12 text-white/10" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-md">
            Nenhuma partida encontrada para hoje.
          </p>
        </div>
      )}

      {!isLoading && Object.entries(groupedEvents).map(([league, matches]) => (
        <div key={league} className="space-y-4">
          <h2 className="text-lg font-black uppercase tracking-widest text-brand-green border-b border-white/10 pb-2">
            {league}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => {
              const isLive = match.status > 0;
              const isFinished = match.status === -1;
              const isPre = match.status === 0;
              const isCancelledOrPostponed = match.status < -1;

              const matchDate = new Date(match.matchTime * 1000);
              const matchTimeStr = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={match.matchId} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-brand-green transition-all shadow-xl">
                  {isLive && (
                    <div className="absolute inset-0 bg-brand-green/5 blur-2xl pointer-events-none" />
                  )}

                  <div className="relative p-6 flex flex-col h-full justify-between">
                    <div className="flex justify-end items-start mb-6">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <div className="flex items-center gap-1.5 bg-red-500/20 px-2 py-1 rounded-md border border-red-500/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-wider">
                              AO VIVO
                            </span>
                          </div>
                        ) : isFinished ? (
                          <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                            ENCERRADO
                          </span>
                        ) : isCancelledOrPostponed ? (
                          <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                            ADIADO
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Hoje, {matchTimeStr}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center gap-3 w-1/3">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center p-1.5">
                          <Trophy className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tighter text-center line-clamp-1">{match.homeName}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center w-1/3">
                        <div className="text-3xl font-black tracking-tighter flex items-center gap-2">
                          <span className={match.homeScore > match.awayScore && isFinished ? "text-brand-green" : "text-white"}>
                            {isPre ? "-" : match.homeScore}
                          </span>
                          <span className="text-gray-600 font-light text-xl">-</span>
                          <span className={match.awayScore > match.homeScore && isFinished ? "text-brand-green" : "text-white"}>
                            {isPre ? "-" : match.awayScore}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 w-1/3">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center p-1.5">
                          <Trophy className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tighter text-center line-clamp-1">{match.awayName}</span>
                      </div>
                    </div>

                    <button className="w-full mt-6 flex items-center justify-center gap-2 bg-white/5 hover:bg-brand-green hover:text-black text-white text-xs font-black px-4 py-3 rounded-xl transition-colors">
                      <Play className="w-3 h-3 fill-current" /> 
                      {isLive ? "ASSISTIR AO VIVO" : "VER DETALHES"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
