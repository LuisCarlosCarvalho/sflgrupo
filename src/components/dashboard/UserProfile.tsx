// src/components/dashboard/UserProfile.tsx
"use client";

import { User, Mail, CreditCard, Calendar, MessageCircle, ShieldCheck, Monitor, Tv, LayoutGrid, Globe, Download, Plus, X, Clock, BookOpen, ExternalLink } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
    planType?: string;
    expires_at?: string;
    notification_active?: boolean;
    connections?: number;
    app_name?: string;
    device_type?: string;
    location?: string;
    favoriteCountry?: string;
    favoriteTeam?: string;
  };
  plan?: {
    expires_at: string;
    plan_name: string;
  };
}

interface DashboardApp {
  id: string;
  name: string;
  platform: string;
  download_url: string;
  icon_url?: string;
  description?: string;
  status?: string;
  gradient?: string;
}

import { useState, useEffect } from "react";
import { updateFavoriteTeam } from "@/app/actions/user";

const TEAMS_DB = {
  "Brasil": ["Seleção Brasileira", "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Grêmio", "Cruzeiro", "Atlético Mineiro"],
  "Inglaterra": ["Seleção Inglesa", "Arsenal", "Manchester City", "Liverpool", "Chelsea", "Manchester United", "Tottenham"],
  "Espanha": ["Seleção Espanhola", "Real Madrid", "Barcelona", "Atlético de Madrid", "Sevilla"],
  "Itália": ["Seleção Italiana", "Juventus", "Milan", "Inter de Milão", "Napoli", "Roma"],
  "França": ["Seleção Francesa", "PSG", "Marseille", "Lyon", "Monaco"],
  "Alemanha": ["Seleção Alemã", "Bayern de Munique", "Borussia Dortmund", "Bayer Leverkusen"]
};

export default function UserProfile({ user, plan, apps = [] }: UserProfileProps & { apps?: DashboardApp[] }) {
  const [selectedCountry, setSelectedCountry] = useState(user.favoriteCountry || "");
  const [selectedTeam, setSelectedTeam] = useState(user.favoriteTeam || "");
  const [savingTeam, setSavingTeam] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState<{name: string, text: string} | null>(null);
  const [upcomingMatch, setUpcomingMatch] = useState<any>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    if (!user.favoriteTeam) return;
    const fetchMatch = async () => {
      setLoadingMatch(true);
      try {
        let nextGame = null;
        
        // 1. Tentar buscar direto no TheSportsDB pelo nome do time
        try {
          const teamSearchRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(user.favoriteTeam as string)}`);
          const teamSearchData = await teamSearchRes.json();
          const teamId = teamSearchData?.teams?.[0]?.idTeam;

          if (teamId) {
            const eventsRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`);
            const eventsData = await eventsRes.json();
            
            if (eventsData?.events && eventsData.events.length > 0) {
              const event = eventsData.events[0];
              const matchDate = new Date(event.strTimestamp + "Z");
              const isInvalidDate = isNaN(matchDate.getTime());
              
              nextGame = {
                home: event.strHomeTeam,
                away: event.strAwayTeam,
                date: isInvalidDate ? event.dateEvent : matchDate.toISOString().split('T')[0],
                time: isInvalidDate ? event.strTime.substring(0, 5) : matchDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                broadcast: [event.strLeague || "Esportes"]
              };
            }
          }
        } catch (dbErr) {
          console.error("TheSportsDB error:", dbErr);
        }

        // 2. Fallback para a API interna caso falhe
        if (!nextGame) {
          const res = await fetch("/api/games/upcoming");
          const games = await res.json();
          if (Array.isArray(games)) {
            const teamLower = user.favoriteTeam!.toLowerCase();
            nextGame = games.find((g: any) => 
              (g.home && g.home.toLowerCase().includes(teamLower)) || 
              (g.away && g.away.toLowerCase().includes(teamLower))
            );
          }
        }

        setUpcomingMatch(nextGame || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMatch(false);
      }
    };
    fetchMatch();
  }, [user.favoriteTeam]);

  const handleSaveTeam = async () => {
    setSavingTeam(true);
    try {
      await updateFavoriteTeam(selectedCountry, selectedTeam);
      alert("Time salvo com sucesso! O SFL Stream dará prioridade para seus jogos.");
    } catch (e) {
      alert("Erro ao salvar time.");
    }
    setSavingTeam(false);
  };

  // Priorizar o vencimento do objeto user (que é o que o admin edita agora)
  const finalExpiryDate = user.expires_at || plan?.expires_at;

  const expirationDate = finalExpiryDate
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(finalExpiryDate))
    : "Não disponível";

  const isExpired = finalExpiryDate ? new Date(finalExpiryDate) < new Date() : false;
  const daysRemaining = finalExpiryDate 
    ? Math.ceil((new Date(finalExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 100;

  // Alerta pisca se o admin disparar OU se faltar menos de 7 dias
  const showAlarm = user.notification_active || (daysRemaining >= 0 && daysRemaining <= 7);

  const whatsappMessage = encodeURIComponent(
    `Olá, sou o ${user.name} e quero renovar meu plano ${user.planType || "SFL Stream"}`
  );

  const whatsappNumber = "351928485483";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className={`relative transition-all duration-500 ${showAlarm ? 'pt-24' : 'pt-0'}`}>
        {showAlarm && (
          <div className="absolute top-0 left-0 right-0 animate-in slide-in-from-top-4 duration-500 z-10">
            <div className="bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(255,193,7,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                  <Calendar className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-brand-yellow tracking-widest">Atenção! Renovação Próxima</p>
                  <p className="text-xs text-white font-bold">
                    Seu plano vence em <span className="text-brand-yellow">{daysRemaining} dias</span>. Renove agora para não perder o acesso!
                  </p>
                </div>
              </div>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                className="w-full md:w-auto text-center bg-brand-yellow text-black text-[10px] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest hover:bg-white transition-all shadow-lg"
              >
                Renovar Agora
              </a>
            </div>
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
          Central do <span className="text-brand-green">Assinante</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Gerencie seu plano e informações de conta.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Info Card */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Nome
              </label>
              <p className="text-lg font-bold text-white">{user.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> E-mail
              </label>
              <p className="text-lg font-bold text-white truncate">{user.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-3 h-3" /> Plano
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                    user.planType === 'VIP' ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20' : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                  }`}>
                    {user.planType || "FREE"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Vencimento
                </label>
                <p className={`text-sm font-bold ${isExpired ? 'text-red-500' : 'text-white'}`}>{expirationDate}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> Localidade
              </label>
              <p className="text-lg font-bold text-white">{user.location || "Brasil"}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="w-3 h-3" /> Pontos
              </label>
              <p className="text-md font-bold text-white">{user.connections || 1} PONTO(S)</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Monitor className="w-3 h-3" /> Aplicativo
              </label>
              <p className="text-md font-bold text-white uppercase">{user.app_name || "SFL Stream"}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              className={`flex items-center justify-center gap-3 w-full ${isExpired ? 'bg-red-500 hover:bg-white text-white hover:text-black' : 'bg-brand-green hover:bg-brand-yellow text-black'} font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-green/10 text-xs`}
            >
              <MessageCircle className="w-5 h-5" />
              {isExpired ? 'REATIVAR ASSINATURA' : 'RENOVAR ASSINATURA'}
            </a>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className={`w-20 h-20 ${isExpired ? 'bg-red-500/10 text-red-500' : 'bg-brand-green/10 text-brand-green'} rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,166,81,0.1)]`}>
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <p className={`text-[10px] font-black ${isExpired ? 'text-red-500' : 'text-brand-green'} uppercase tracking-[0.2em] mb-1`}>Status da Conta</p>
            <p className="text-2xl font-black text-white">{isExpired ? 'VENCIDA' : 'ATIVA'}</p>
          </div>
          <p className="text-gray-500 text-xs font-medium px-4">
            {isExpired 
              ? "Sua conta está vencida. Renove para continuar assistindo!" 
              : "Sua conta está em dia. Aproveite o melhor do entretenimento!"}
          </p>
        </div>

        {/* Applications Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col space-y-6 min-h-[400px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.2em] mb-1">Store</p>
              <h3 className="text-2xl font-black text-white uppercase italic">Aplicações</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <Download className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[440px] pr-2 custom-scrollbar">
            {apps.map((app) => {
              const isTV = app.platform === "Smart TV LG" || app.platform === "Smart TV Samsung";
              const isHowToInstall = app.status === "HOW_TO_INSTALL";
              const isComingSoon = app.status === "COMING_SOON";
              const isAvailable = app.status === "AVAILABLE" || (!app.status && Boolean(app.download_url));
              
              const statusBadge = isComingSoon ? (
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Clock size={10} /> Breve
                </span>
              ) : isHowToInstall ? (
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                  <BookOpen size={10} /> Instalar
                </span>
              ) : (
                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Download size={10} /> Baixar
                </span>
              );

              const CardContent = (
                <>
                  <div className={`w-12 h-12 rounded-xl ${app.gradient ? `bg-gradient-to-br ${app.gradient}` : 'bg-black/40'} flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 p-2`}>
                    {app.icon_url ? (
                      <img src={app.icon_url} alt={app.name} className="w-full h-full object-contain drop-shadow" />
                    ) : (
                      <Download className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-black text-white uppercase group-hover:text-brand-yellow transition-colors truncate">{app.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {statusBadge}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isComingSoon
                      ? "bg-white/5 text-gray-500 group-hover:bg-white/10"
                      : isHowToInstall
                      ? "bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-black"
                      : "bg-brand-yellow/10 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black"
                  }`}>
                    {isTV || isHowToInstall ? <Monitor size={14} /> : isComingSoon ? <Clock size={14} /> : <Download size={14} />}
                  </div>
                </>
              );

              // Para apps com instruções (LG, Samsung ou status Como Instalar)
              if (isTV || isHowToInstall) {
                const instructionText = app.description || app.download_url || "Siga as orientações para instalar este aplicativo na sua TV.";
                return (
                  <button 
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedInstruction({ name: app.name, text: instructionText })}
                    className="flex w-full items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-yellow/30 hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    {CardContent}
                  </button>
                );
              }

              // Para apps em desenvolvimento (Breve)
              if (isComingSoon) {
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedInstruction({ 
                      name: app.name, 
                      text: app.description || "Este aplicativo está em fase de desenvolvimento e será liberado em breve para todos os assinantes." 
                    })}
                    className="flex w-full items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/30 hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    {CardContent}
                  </button>
                );
              }

              // Para apps disponíveis para download
              if (app.download_url) {
                return (
                  <a 
                    key={app.id}
                    href={app.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-yellow/30 hover:bg-white/10 transition-all group"
                  >
                    {CardContent}
                  </a>
                );
              }

              return (
                <div 
                  key={app.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 opacity-60"
                >
                  {CardContent}
                </div>
              );
            })}

            {apps.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                <Download className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-[9px] font-black uppercase tracking-widest">Nenhum app disponível</p>
              </div>
            )}
          </div>

          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center pt-4 border-t border-white/5">
            Clique no ícone para baixar e instalar em seu dispositivo.
          </p>
        </div>

        {/* Favorite Team Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col space-y-6 min-h-[400px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] mb-1">Esportes</p>
              <h3 className="text-xl font-black text-white uppercase italic">Time do Coração</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
              <span className="text-xl">⚽</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              Selecione seu país e time. O aplicativo dará prioridade ao seu time na grade esportiva e enviará alertas de jogos!
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">País / Seleção</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-brand-green transition-colors appearance-none"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedTeam("");
                }}
              >
                <option value="" disabled className="bg-black">Selecione o País</option>
                {Object.keys(TEAMS_DB).map(country => (
                  <option key={country} value={country} className="bg-black">{country}</option>
                ))}
              </select>
            </div>

            {selectedCountry && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-brand-green transition-colors appearance-none"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="" disabled className="bg-black">Selecione o Time</option>
                  {TEAMS_DB[selectedCountry as keyof typeof TEAMS_DB].map(team => (
                    <option key={team} value={team} className="bg-black">{team}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleSaveTeam}
              disabled={!selectedTeam || savingTeam}
              className="w-full bg-brand-green hover:bg-white text-black font-black py-3 rounded-xl transition-all disabled:opacity-50 mt-4 text-xs uppercase"
            >
              {savingTeam ? "Salvando..." : "Salvar Time do Coração"}
            </button>
          </div>

          {/* Match Alert (Real Data) */}
          {user.favoriteTeam && (() => {
            const teamLogos: Record<string, string> = {
              "Palmeiras": "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
              "Flamengo": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg",
              "São Paulo": "https://upload.wikimedia.org/wikipedia/commons/4/4b/S%C3%A3o_Paulo_Futebol_Clube.png",
              "Corinthians": "https://upload.wikimedia.org/wikipedia/en/5/5a/Sport_Club_Corinthians_Paulista_crest.svg",
              "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
              "Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
            };
            const logo = teamLogos[user.favoriteTeam] || "https://upload.wikimedia.org/wikipedia/commons/a/ad/Football_in_flat_style.svg";

            return (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-xl p-2 shrink-0">
                    <img src={logo} alt={user.favoriteTeam} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    {loadingMatch ? (
                      <p className="text-xs font-bold text-gray-400">Buscando próximos jogos...</p>
                    ) : upcomingMatch ? (
                      <>
                        <p className="text-[10px] font-black text-brand-green uppercase tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          PRÓXIMO JOGO
                        </p>
                        <p className="text-xs font-bold text-white mt-1">
                          {upcomingMatch.home} vs {upcomingMatch.away}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {(() => {
                            const matchDate = new Date(upcomingMatch.date + 'T' + upcomingMatch.time);
                            return matchDate.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' }) + ' às ' + upcomingMatch.time;
                          })()}
                          {upcomingMatch.broadcast && upcomingMatch.broadcast.length > 0 && ` - ${upcomingMatch.broadcast.join(', ')}`}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          SEM JOGOS PRÓXIMOS
                        </p>
                        <p className="text-xs font-bold text-white mt-1">
                          Nenhuma partida agendada
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Para os próximos 7 dias</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      {selectedInstruction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedInstruction(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                <Tv size={20} />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Como Instalar - {selectedInstruction.name}</h2>
            </div>
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedInstruction.text}</p>
            </div>
            <button
              onClick={() => setSelectedInstruction(null)}
              className="w-full bg-brand-yellow text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] mt-6"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
