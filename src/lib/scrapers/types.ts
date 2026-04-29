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

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  source: string;
  url: string;
}

