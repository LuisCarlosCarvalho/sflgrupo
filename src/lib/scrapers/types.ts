export interface SportsEvent {
  sport: string;
  league: string;
  home: string;
  away?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  broadcast: string[];
  countryCode?: string; // e.g. "br", "us", "gb"
  homeLogo?: string;
  awayLogo?: string;
}

