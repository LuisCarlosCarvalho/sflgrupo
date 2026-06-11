import { SportsEvent } from "../types";

const endpoints = [
  { path: "soccer/all", sport: "futebol", league: "Global Soccer" },
  { path: "basketball/nba", sport: "basketball", league: "NBA" },
  { path: "football/nfl", sport: "american-football", league: "NFL" },
  { path: "mma/ufc", sport: "mma", league: "UFC" }
];

export async function fetchESPNScraper(): Promise<SportsEvent[]> {
  const allEvents: SportsEvent[] = [];

  const promises = endpoints.map(async ({ path, sport, league }) => {
    try {
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?limit=50`);
      if (!response.ok) return [];

      const data = await response.json();
      if (!data || !data.events) return [];

      const events: SportsEvent[] = data.events.map((event: any) => {
        const competition = event.competitions?.[0];
        const competitors = competition?.competitors || [];
        
        let homeTeam = competitors.find((c: any) => c.homeAway === "home")?.team;
        let awayTeam = competitors.find((c: any) => c.homeAway === "away")?.team;
        
        // MMA/UFC logic where it might not be strictly home/away
        if (!homeTeam && competitors.length > 0) homeTeam = competitors[0]?.team;
        if (!awayTeam && competitors.length > 1) awayTeam = competitors[1]?.team;

        const dateObj = new Date(event.date);
        const dateStr = dateObj.toISOString().split("T")[0]; 
        const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

        const broadcasts = competition?.broadcasts?.map((b: any) => b.names?.[0]).filter(Boolean) || [];

        // Deduce country for soccer based on league name or event name
        let countryCode = "us";
        if (sport === "futebol") {
          const l = (event.season?.slug || event.name || "").toLowerCase();
          if (l.includes("brazil") || l.includes("brasileir")) countryCode = "br";
          else if (l.includes("england") || l.includes("premier")) countryCode = "gb";
          else if (l.includes("spain") || l.includes("liga")) countryCode = "es";
          else if (l.includes("italy") || l.includes("serie a")) countryCode = "it";
          else if (l.includes("germany") || l.includes("bundesliga")) countryCode = "de";
          else if (l.includes("france")) countryCode = "fr";
          else if (l.includes("uefa") || l.includes("champions")) countryCode = "eu";
          else countryCode = "un";
        }

        // Try to get actual league name from the API
        let actualLeagueName = league;
        if (sport === "futebol" && event.season?.slug) {
          actualLeagueName = event.season.slug.replace(/-/g, ' ').toUpperCase();
        } else if (event.shortName && sport === "mma") {
          actualLeagueName = event.shortName;
        }

        return {
          sport,
          league: actualLeagueName,
          home: homeTeam?.displayName || homeTeam?.name || event.shortName || "Evento",
          away: awayTeam?.displayName || awayTeam?.name || undefined,
          homeLogo: homeTeam?.logo,
          awayLogo: awayTeam?.logo,
          date: dateStr,
          time: timeStr,
          broadcast: broadcasts.length > 0 ? broadcasts : ["Streaming"],
          countryCode,
        };
      });

      return events;
    } catch (error) {
      console.error(`ESPN API Error (${path}):`, error);
      return [];
    }
  });

  const results = await Promise.all(promises);
  results.forEach((list) => allEvents.push(...list));

  return allEvents;
}
