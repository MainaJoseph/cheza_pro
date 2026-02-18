// API-Sports (Free: 100 requests/day per API)
export const API_SPORTS = {
  BASE_URL: process.env.EXPO_PUBLIC_API_SPORTS_BASE_URL || "https://api-sports.io",
  FOOTBALL: "/football/v3",
  BASKETBALL: "/basketball/v1",
  HEADERS: {
    'x-apisports-key': process.env.EXPO_PUBLIC_API_SPORTS_KEY || '',
  }
};

// TheSportsDB (Completely Free)
export const THE_SPORTS_DB = {
  BASE_URL: process.env.EXPO_PUBLIC_THE_SPORTS_DB_BASE_URL || "https://www.thesportsdb.com/api",
  API_KEY: process.env.EXPO_PUBLIC_THE_SPORTS_DB_KEY || "",
  VERSION: "/v1/json"
};

// ESPN API (Fallback, No API Key Required)
export const ESPN_API = {
  BASE_URL: "https://site.api.espn.com/apis/site/v2/sports",
  SOCCER: "/soccer",
  BASKETBALL: "/basketball",
};

// TheSportsDB League IDs
export const LEAGUES = {
  // Soccer/Football (TheSportsDB IDs)
  EPL: 4328,              // Premier League
  LA_LIGA: 4335,          // La Liga
  SERIE_A: 4332,          // Serie A
  BUNDESLIGA: 4331,       // Bundesliga
  LIGUE_1: 4334,          // Ligue 1
  CHAMPIONS_LEAGUE: 4330, // Champions League
  MLS: 4337,              // MLS
  EUROPA_LEAGUE: 4380,    // Europa League

  // Basketball (Limited coverage in free tier)
  NBA: 4387,              // NBA (if available)
};

// League display names
export const LEAGUE_NAMES: Record<number, string> = {
  4328: "Premier League",
  4335: "La Liga",
  4332: "Serie A",
  4331: "Bundesliga",
  4334: "Ligue 1",
  4330: "Champions League",
  4337: "MLS",
  4380: "Europa League",
  4387: "NBA",
};

// League full names for headers
export const LEAGUE_FULL_NAMES: Record<number, string> = {
  4328: "English Premier League",
  4335: "Spanish La Liga",
  4332: "Italian Serie A",
  4331: "German Bundesliga",
  4334: "French Ligue 1",
  4330: "UEFA Champions League",
  4337: "Major League Soccer",
  4380: "UEFA Europa League",
  4387: "National Basketball Association",
};

// App constants
export const APP_CONFIG = {
  LIVE_SCORE_REFRESH_INTERVAL: 30000, // 30 seconds (TheSportsDB has no limits)
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes for better performance
  MAX_UPCOMING_MATCHES: 15,
  API_RATE_LIMIT: Infinity, // TheSportsDB has no rate limits
};

// Placeholder image
export const PLACEHOLDER_IMAGE = "https://www.thesportsdb.com/images/media/player/thumb/xxxyyy.png";

// Default fallback image for TheSportsDB
export const DEFAULT_TEAM_IMAGE = "https://www.thesportsdb.com/images/media/team/default.png";
