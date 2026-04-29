import { SportsEvent } from "../types";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "sports-information.p.rapidapi.com";

async function fetchFromRapidAPI(path: string) {
  if (!RAPIDAPI_KEY) {
    console.error("RAPIDAPI_KEY não configurada.");
    return null;
  }

  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}${path}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na RapidAPI (${path}): ${response.status} - ${errorText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Falha na requisição RapidAPI (${path}):`, error);
    return null;
  }
}

export async function fetchRapidAPISports(): Promise<SportsEvent[]> {
  const leagues = [
    { id: "nfl", name: "NFL", sport: "american-football" },
    { id: "nba", name: "NBA", sport: "basketball" },
    { id: "mlb", name: "MLB", sport: "baseball" },
    { id: "nhl", name: "NHL", sport: "ice-hockey" },
    { id: "cfb", name: "College Football", sport: "american-football" },
    { id: "mbb", name: "College Basketball", sport: "basketball" },
    { id: "soccer", name: "Soccer", sport: "futebol" },
  ];

  const allEvents: SportsEvent[] = [];

  const promises = leagues.map(async (league) => {
    // Usamos o endpoint de scoreboard para pegar os jogos do dia/próximos
    const data = await fetchFromRapidAPI(`/${league.id}/scoreboard`);
    if (!data || !data.leagues || !data.leagues[0]?.events) return [];

    const leagueData = data.leagues[0];
    const leagueName = league.id === "soccer" ? (leagueData.name || "Global Soccer") : league.name;

    const events: SportsEvent[] = leagueData.events.map((event: any) => {
      const competition = event.competitions?.[0];
      const homeTeam = competition?.competitors?.find((c: any) => c.homeAway === "home")?.team;
      const awayTeam = competition?.competitors?.find((c: any) => c.homeAway === "away")?.team;
      
      const dateObj = new Date(event.date);
      const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
      const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      const broadcasts = competition?.broadcasts?.map((b: any) => b.names?.[0]).filter(Boolean) || [];

      // Deduzir país para futebol
      let countryCode = "us";
      if (league.id === "soccer") {
        const l = leagueName.toLowerCase();
        if (l.includes("brazil") || l.includes("brasileir")) countryCode = "br";
        else if (l.includes("england") || l.includes("premier")) countryCode = "gb";
        else if (l.includes("spain") || l.includes("liga")) countryCode = "es";
        else if (l.includes("italy") || l.includes("serie a")) countryCode = "it";
        else if (l.includes("germany") || l.includes("bundesliga")) countryCode = "de";
        else if (l.includes("france")) countryCode = "fr";
        else countryCode = "un";
      }

      return {
        sport: league.sport,
        league: leagueName,
        home: homeTeam?.displayName || homeTeam?.name || "Home Team",
        away: awayTeam?.displayName || awayTeam?.name || "Away Team",
        homeLogo: homeTeam?.logo,
        awayLogo: awayTeam?.logo,
        date: dateStr,
        time: timeStr,
        broadcast: broadcasts.length > 0 ? broadcasts : ["Streaming"],
        countryCode,
      };
    });

    return events;
  });

  const results = await Promise.all(promises);
  results.forEach((list) => allEvents.push(...list));

  return allEvents;
}
