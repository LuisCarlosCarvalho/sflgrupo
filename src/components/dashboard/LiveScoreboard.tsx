"use client";

import { useEffect, useState } from "react";
import { Play, Trophy, Clock } from "lucide-react";

interface SerpApiEvent {
  matchId: string;
  leagueName: string;
  homeName: string;
  awayName: string;
  homeScore: string;
  awayScore: string;
  statusText: string;
  matchTimeStr: string;
  isLive: boolean;
  isFinished: boolean;
}

export default function LiveScoreboard() {
  const [events, setEvents] = useState<SerpApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Removidas as abas porque a SerpApi não suporta busca global por esporte, apenas por texto.
  
  const fetchScores = async () => {
    setIsLoading(true);
    try {
      const SERP_API_KEY = "a05035cc7e0302be2786e863a75f04c851533515955eb023bac15ce12ae887d5";
      const queries = [
        "Real Madrid schedule",
        "Flamengo schedule",
        "Los Angeles Lakers schedule",
        "Golden State Warriors schedule"
      ];

      const results = await Promise.all(
        queries.map(async (q) => {
          const res = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(q)}&api_key=${SERP_API_KEY}`);
          const json = await res.json();
          return { query: q, data: json.sports_results };
        })
      );

      const formattedEvents: SerpApiEvent[] = [];

      results.forEach((item, index) => {
        if (!item.data) return;

        // O Google retorna game_spotlight para jogos em destaque (geralmente hoje ou ao vivo)
        // ou games (array de jogos futuros)
        let game = item.data.game_spotlight;
        if (!game && item.data.games && item.data.games.length > 0) {
          game = item.data.games[0]; // Pega o próximo jogo
        }

        if (game && game.teams && game.teams.length >= 2) {
          const homeTeam = game.teams[0];
          const awayTeam = game.teams[1];

          let isLive = false;
          let isFinished = false;
          let statusText = "Agendado";

          if (game.status) {
            const lowerStatus = game.status.toLowerCase();
            if (lowerStatus.includes("live") || lowerStatus.includes("in progress")) {
              isLive = true;
              statusText = "AO VIVO";
            } else if (lowerStatus.includes("ft") || lowerStatus.includes("final") || lowerStatus.includes("full-time")) {
              isFinished = true;
              statusText = "ENCERRADO";
            } else {
              statusText = game.status;
            }
          }

          let homeScoreStr = "-";
          let awayScoreStr = "-";

          // Tratar scores que podem vir como string "2" ou objeto de score no basquete
          if (homeTeam.score) {
            homeScoreStr = typeof homeTeam.score === 'object' ? homeTeam.score.total || "-" : homeTeam.score;
          }
          if (awayTeam.score) {
            awayScoreStr = typeof awayTeam.score === 'object' ? awayTeam.score.total || "-" : awayTeam.score;
          }

          const matchTimeStr = `${game.date || "Em breve"} ${game.time ? "às " + game.time : ""}`.trim();

          formattedEvents.push({
            matchId: `serp_${index}_${new Date().getTime()}`,
            leagueName: game.league || game.tournament || "Amistoso",
            homeName: homeTeam.name,
            awayName: awayTeam.name,
            homeScore: homeScoreStr,
            awayScore: awayScoreStr,
            statusText,
            matchTimeStr,
            isLive,
            isFinished
          });
        }
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar placares da SerpApi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchScores();
    // AVISO: Não usar setInterval com a SerpApi pois consome créditos imediatamente.
  }, []);

  const groupedEvents = events.reduce((acc, event) => {
    const league = event.leagueName;
    if (!acc[league]) acc[league] = [];
    acc[league].push(event);
    return acc;
  }, {} as Record<string, SerpApiEvent[]>);

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-white/5 border border-white/10" />
          ))}
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
          <Trophy className="w-12 h-12 text-white/10" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm max-w-md">
            Nenhuma partida em destaque encontrada via Google Search.
          </p>
        </div>
      )}

      {!isLoading && Object.entries(groupedEvents).map(([league, matches]) => (
        <div key={league} className="space-y-4">
          <h2 className="text-lg font-black uppercase tracking-widest text-brand-green border-b border-white/10 pb-2 flex items-center gap-2">
            {league}
            <span className="text-[10px] text-gray-500 font-normal tracking-normal ml-2">(Powered by Google)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
              <div key={match.matchId} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-brand-green transition-all shadow-xl">
                {match.isLive && (
                  <div className="absolute inset-0 bg-brand-green/5 blur-2xl pointer-events-none" />
                )}

                <div className="relative p-6 flex flex-col h-full justify-between">
                  <div className="flex justify-end items-start mb-6">
                    <div className="flex items-center gap-2">
                      {match.isLive ? (
                        <div className="flex items-center gap-1.5 bg-red-500/20 px-2 py-1 rounded-md border border-red-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-wider">
                            AO VIVO
                          </span>
                        </div>
                      ) : match.isFinished ? (
                        <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          ENCERRADO
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {match.matchTimeStr}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center gap-3 w-1/3">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center p-1.5">
                        <Trophy className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tighter text-center line-clamp-2 leading-tight">{match.homeName}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/3">
                      <div className="text-3xl font-black tracking-tighter flex items-center gap-2">
                        <span className="text-white">
                          {match.homeScore}
                        </span>
                        <span className="text-gray-600 font-light text-xl">-</span>
                        <span className="text-white">
                          {match.awayScore}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 w-1/3">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center p-1.5">
                        <Trophy className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tighter text-center line-clamp-2 leading-tight">{match.awayName}</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 flex items-center justify-center gap-2 bg-white/5 hover:bg-brand-green hover:text-black text-white text-xs font-black px-4 py-3 rounded-xl transition-colors">
                    <Play className="w-3 h-3 fill-current" /> 
                    {match.isLive ? "ASSISTIR AO VIVO" : "VER DESTAQUES"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
