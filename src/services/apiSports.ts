import axios from "axios";
import {
  League,
  Team,
  Match,
  Standing,
  SearchResult,
} from "../types";
import { THE_SPORTS_DB, LEAGUES, LEAGUE_NAMES, APP_CONFIG, PLACEHOLDER_IMAGE } from "../constants";

// Simple in-memory cache
const cache: Map<string, { data: unknown; timestamp: number }> = new Map();

const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < APP_CONFIG.CACHE_DURATION) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

const setCache = (key: string, data: unknown): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Build API base URL from environment variables
// Format: https://www.thesportsdb.com/api/v1/json/{API_KEY}
const API_KEY = THE_SPORTS_DB.API_KEY || "3"; // Free tier key is "3"
const API_BASE = `${THE_SPORTS_DB.BASE_URL}${THE_SPORTS_DB.VERSION}/${API_KEY}`;

// TheSportsDB instance
const theSportsDB = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// League metadata
const SPORTS_DB_LEAGUES: Record<string, string> = {
  "4328": "Premier League",
  "4335": "La Liga",
  "4332": "Serie A",
  "4331": "Bundesliga",
  "4334": "Ligue 1",
  "4337": "MLS",
  "4330": "Champions League",
  "4380": "Europa League",
  "4387": "NBA",
};

// ============ LEAGUES ============

export const getPopularLeagues = async (): Promise<League[]> => {
  const cacheKey = "popular_leagues";
  const cached = getCached<League[]>(cacheKey);
  if (cached) return cached;

  try {
    const leagueIds = Object.values(LEAGUES);
    const leagues: League[] = [];

    // Fetch each league details
    for (const leagueId of leagueIds) {
      try {
        const response = await theSportsDB.get(`/lookupleague.php?id=${leagueId}`);
        const leagueData = response.data?.leagues?.[0];
        if (leagueData) {
          leagues.push({
            idLeague: leagueData.idLeague,
            strLeague: leagueData.strLeague,
            strSport: leagueData.strSport || "Soccer",
            strLeagueAlternate: leagueData.strLeagueAlternate || leagueData.strLeague,
            strCountry: leagueData.strCountry || getCountryFromLeague(leagueId.toString()),
            strBadge: leagueData.strBadge || leagueData.strLogo || null,
            strLogo: leagueData.strLogo || leagueData.strBadge || null,
            strBanner: leagueData.strBanner || null,
            strDescriptionEN: leagueData.strDescriptionEN || null,
            strCurrentSeason: leagueData.strCurrentSeason || "2024-2025",
          });
        }
      } catch (err) {
        // If individual fetch fails, add a fallback entry
        const name = LEAGUE_NAMES[leagueId] || `League ${leagueId}`;
        leagues.push({
          idLeague: leagueId.toString(),
          strLeague: name,
          strSport: "Soccer",
          strLeagueAlternate: name,
          strCountry: getCountryFromLeague(leagueId.toString()),
          strBadge: null,
          strLogo: null,
          strBanner: null,
          strDescriptionEN: null,
          strCurrentSeason: "2024-2025",
        });
      }
    }

    setCache(cacheKey, leagues);
    return leagues;
  } catch (error) {
    console.error("Error fetching popular leagues:", error);
    // Return static fallback
    return Object.entries(SPORTS_DB_LEAGUES).map(([id, name]) => ({
      idLeague: id,
      strLeague: name,
      strSport: "Soccer",
      strLeagueAlternate: name,
      strCountry: getCountryFromLeague(id),
      strBadge: null,
      strLogo: null,
      strBanner: null,
      strDescriptionEN: null,
      strCurrentSeason: "2024-2025",
    }));
  }
};

export const getLeagueById = async (leagueId: string): Promise<League | null> => {
  const cacheKey = `league_${leagueId}`;
  const cached = getCached<League>(cacheKey);
  if (cached) return cached;

  try {
    const response = await theSportsDB.get(`/lookupleague.php?id=${leagueId}`);
    const leagueData = response.data?.leagues?.[0];

    if (!leagueData) return null;

    const league: League = {
      idLeague: leagueData.idLeague,
      strLeague: leagueData.strLeague,
      strSport: leagueData.strSport || "Soccer",
      strLeagueAlternate: leagueData.strLeagueAlternate || leagueData.strLeague,
      strCountry: leagueData.strCountry || "",
      strBadge: leagueData.strBadge || leagueData.strLogo || null,
      strLogo: leagueData.strLogo || leagueData.strBadge || null,
      strBanner: leagueData.strBanner || null,
      strDescriptionEN: leagueData.strDescriptionEN || null,
      strCurrentSeason: leagueData.strCurrentSeason || "2024-2025",
    };

    setCache(cacheKey, league);
    return league;
  } catch (error) {
    console.error(`Error fetching league ${leagueId}:`, error);
    return null;
  }
};

// ============ TEAMS ============

export const getTeamsByLeague = async (leagueId: string | number): Promise<Team[]> => {
  const cacheKey = `teams_${leagueId}`;
  const cached = getCached<Team[]>(cacheKey);
  if (cached) return cached;

  try {
    // Use lookup_all_teams.php endpoint (correct endpoint for getting all teams in a league)
    const response = await theSportsDB.get(`/lookup_all_teams.php?id=${leagueId}`);
    const teamsData = response.data?.teams || [];

    const teams: Team[] = teamsData.map((team: any) => ({
      idTeam: team.idTeam,
      strTeam: team.strTeam,
      strTeamShort: team.strTeamShort || null,
      strAlternate: team.strAlternate || team.strTeam,
      strSport: team.strSport || "Soccer",
      strLeague: team.strLeague || LEAGUE_NAMES[Number(leagueId)] || String(leagueId),
      idLeague: String(leagueId),
      strCountry: team.strCountry || "",
      strStadium: team.strStadium || null,
      strStadiumThumb: team.strStadiumThumb || null,
      strStadiumLocation: team.strStadiumLocation || null,
      intStadiumCapacity: team.intStadiumCapacity || null,
      strWebsite: team.strWebsite || null,
      strFacebook: team.strFacebook || null,
      strTwitter: team.strTwitter || null,
      strInstagram: team.strInstagram || null,
      strDescriptionEN: team.strDescriptionEN || null,
      strBadge: team.strBadge || PLACEHOLDER_IMAGE,
      strLogo: team.strTeamLogo || team.strBadge || PLACEHOLDER_IMAGE,
      strBanner: team.strTeamBanner || null,
      strJersey: team.strTeamJersey || null,
      intFormedYear: team.intFormedYear || null,
    }));

    setCache(cacheKey, teams);
    return teams;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    return [];
  }
};

export const getTeamById = async (teamId: string): Promise<Team | null> => {
  const cacheKey = `team_${teamId}`;
  const cached = getCached<Team>(cacheKey);
  if (cached) return cached;

  try {
    const response = await theSportsDB.get(`/lookupteam.php?id=${teamId}`);
    const teamData = response.data?.teams?.[0];

    if (!teamData) return null;

    const team: Team = {
      idTeam: teamData.idTeam,
      strTeam: teamData.strTeam,
      strTeamShort: teamData.strTeamShort || null,
      strAlternate: teamData.strAlternate || teamData.strTeam,
      strSport: teamData.strSport || "Soccer",
      strLeague: teamData.strLeague || "",
      idLeague: teamData.idLeague || "",
      strCountry: teamData.strCountry || "",
      strStadium: teamData.strStadium || null,
      strStadiumThumb: teamData.strStadiumThumb || null,
      strStadiumLocation: teamData.strStadiumLocation || null,
      intStadiumCapacity: teamData.intStadiumCapacity || null,
      strWebsite: teamData.strWebsite || null,
      strFacebook: teamData.strFacebook || null,
      strTwitter: teamData.strTwitter || null,
      strInstagram: teamData.strInstagram || null,
      strDescriptionEN: teamData.strDescriptionEN || null,
      strBadge: teamData.strBadge || PLACEHOLDER_IMAGE,
      strLogo: teamData.strTeamLogo || teamData.strBadge || PLACEHOLDER_IMAGE,
      strBanner: teamData.strTeamBanner || null,
      strJersey: teamData.strTeamJersey || null,
      intFormedYear: teamData.intFormedYear || null,
    };

    setCache(cacheKey, team);
    return team;
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    return null;
  }
};

export const searchTeams = async (query: string): Promise<Team[]> => {
  if (!query || query.length < 3) return [];

  const cacheKey = `search_teams_${query.toLowerCase()}`;
  const cached = getCached<Team[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await theSportsDB.get(`/searchteams.php?t=${encodeURIComponent(query)}`);
    const teamsData = response.data?.teams || [];

    const teams: Team[] = teamsData.map((team: any) => ({
      idTeam: team.idTeam,
      strTeam: team.strTeam,
      strTeamShort: team.strTeamShort || null,
      strAlternate: team.strAlternate || team.strTeam,
      strSport: team.strSport || "Soccer",
      strLeague: team.strLeague || "",
      idLeague: team.idLeague || "",
      strCountry: team.strCountry || "",
      strStadium: team.strStadium || null,
      strStadiumThumb: team.strStadiumThumb || null,
      strStadiumLocation: team.strStadiumLocation || null,
      intStadiumCapacity: team.intStadiumCapacity || null,
      strWebsite: team.strWebsite || null,
      strFacebook: team.strFacebook || null,
      strTwitter: team.strTwitter || null,
      strInstagram: team.strInstagram || null,
      strDescriptionEN: team.strDescriptionEN || null,
      strBadge: team.strBadge || PLACEHOLDER_IMAGE,
      strLogo: team.strTeamLogo || team.strBadge || PLACEHOLDER_IMAGE,
      strBanner: team.strTeamBanner || null,
      strJersey: team.strTeamJersey || null,
      intFormedYear: team.intFormedYear || null,
    }));

    setCache(cacheKey, teams);
    return teams;
  } catch (error) {
    console.error(`Error searching teams with query "${query}":`, error);
    return [];
  }
};

export const getTeamsByIds = async (teamIds: string[]): Promise<Team[]> => {
  const results: Team[] = [];
  for (const id of teamIds.slice(0, 10)) {
    const team = await getTeamById(id);
    if (team) results.push(team);
  }
  return results;
};

// ============ MATCHES ============

// Helper to map match data to Match interface
const mapMatchData = (match: any, leagueId?: string | number): Match => ({
  idEvent: match.idEvent,
  idLeague: leagueId ? String(leagueId) : match.idLeague || "",
  strLeague: match.strLeague || (leagueId ? LEAGUE_NAMES[Number(leagueId)] || String(leagueId) : ""),
  strSeason: match.strSeason || "",
  strEvent: match.strEvent,
  strEventAlternate: match.strEventAlternate || null,
  strHomeTeam: match.strHomeTeam,
  strAwayTeam: match.strAwayTeam,
  idHomeTeam: match.idHomeTeam,
  idAwayTeam: match.idAwayTeam,
  intHomeScore: match.intHomeScore || null,
  intAwayScore: match.intAwayScore || null,
  strHomeTeamBadge: match.strHomeTeamBadge || null,
  strAwayTeamBadge: match.strAwayTeamBadge || null,
  dateEvent: match.dateEvent || "",
  strTime: match.strTime || null,
  strTimestamp: match.strTimestamp || null,
  strVenue: match.strVenue || null,
  strCountry: match.strCountry || null,
  strStatus: match.strStatus || null,
  strPostponed: match.strPostponed || null,
  strThumb: match.strThumb || null,
  strProgress: getMatchProgress(match),
});

export const getNextMatchesByLeague = async (leagueId: string | number): Promise<Match[]> => {
  const cacheKey = `next_matches_league_${leagueId}`;
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    // Use eventsnextleague.php for upcoming matches
    const response = await theSportsDB.get(`/eventsnextleague.php?id=${leagueId}`);
    const matchesData = response.data?.events || [];

    const matches: Match[] = matchesData.map((match: any) => mapMatchData(match, leagueId));

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error(`Error fetching next matches for league ${leagueId}:`, error);
    return [];
  }
};

export const getLastMatchesByLeague = async (leagueId: string | number): Promise<Match[]> => {
  const cacheKey = `last_matches_league_${leagueId}`;
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    // Use eventspastleague.php for past matches
    const response = await theSportsDB.get(`/eventspastleague.php?id=${leagueId}`);
    const matchesData = response.data?.events || [];

    const matches: Match[] = matchesData.map((match: any) => ({
      ...mapMatchData(match, leagueId),
      strProgress: "FT", // Mark past matches as finished
    }));

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error(`Error fetching past matches for league ${leagueId}:`, error);
    return [];
  }
};

export const getNextMatchesByTeam = async (teamId: string): Promise<Match[]> => {
  const cacheKey = `next_matches_team_${teamId}`;
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await theSportsDB.get(`/eventsnext.php?id=${teamId}`);
    const matchesData = response.data?.events || [];

    const matches: Match[] = matchesData.map((match: any) => mapMatchData(match));

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error(`Error fetching next matches for team ${teamId}:`, error);
    return [];
  }
};

export const getLastMatchesByTeam = async (teamId: string): Promise<Match[]> => {
  const cacheKey = `last_matches_team_${teamId}`;
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await theSportsDB.get(`/eventslast.php?id=${teamId}`);
    const matchesData = response.data?.results || [];

    const matches: Match[] = matchesData.map((match: any) => ({
      ...mapMatchData(match),
      strProgress: "FT",
    }));

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error(`Error fetching past matches for team ${teamId}:`, error);
    return [];
  }
};

export const getMatchesForPopularLeagues = async (): Promise<Match[]> => {
  const cacheKey = "popular_matches";
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch upcoming matches from top leagues
    const topLeagues = [LEAGUES.EPL, LEAGUES.LA_LIGA, LEAGUES.SERIE_A, LEAGUES.CHAMPIONS_LEAGUE];
    let allMatches: Match[] = [];

    for (const leagueId of topLeagues) {
      try {
        const matches = await getNextMatchesByLeague(leagueId);
        allMatches = [...allMatches, ...matches];
      } catch (err) {
        console.warn(`Failed to fetch matches for league ${leagueId}`);
      }
    }

    // Sort by date
    allMatches.sort((a, b) => {
      const dateA = new Date(a.dateEvent + " " + (a.strTime || "00:00"));
      const dateB = new Date(b.dateEvent + " " + (b.strTime || "00:00"));
      return dateA.getTime() - dateB.getTime();
    });

    // Limit results
    const limited = allMatches.slice(0, APP_CONFIG.MAX_UPCOMING_MATCHES);

    setCache(cacheKey, limited);
    return limited;
  } catch (error) {
    console.error("Error fetching popular matches:", error);
    return [];
  }
};

// ============ STANDINGS ============

export const getLeagueStandings = async (leagueId: string | number): Promise<Standing[]> => {
  const cacheKey = `standings_${leagueId}`;
  const cached = getCached<Standing[]>(cacheKey);
  if (cached) return cached;

  try {
    // Get current season (European format: 2024-2025)
    const currentYear = new Date().getFullYear();
    const season = `${currentYear - 1}-${currentYear}`;

    let response = await theSportsDB.get(`/lookuptable.php?l=${leagueId}&s=${season}`);
    let standingsData = response.data?.table || [];

    // If no results, try with just the year
    if (standingsData.length === 0) {
      response = await theSportsDB.get(`/lookuptable.php?l=${leagueId}&s=${currentYear}`);
      standingsData = response.data?.table || [];
    }

    const standings: Standing[] = standingsData.map((entry: any, index: number) => ({
      idStanding: entry.idStanding || `${leagueId}-${index}`,
      intRank: entry.intRank || String(index + 1),
      idTeam: entry.idTeam,
      strTeam: entry.strTeam,
      strBadge: entry.strTeamBadge || null,
      idLeague: String(leagueId),
      strLeague: LEAGUE_NAMES[Number(leagueId)] || String(leagueId),
      strSeason: season,
      intPlayed: entry.intPlayed || "0",
      intWin: entry.intWin || "0",
      intDraw: entry.intDraw || "0",
      intLoss: entry.intLoss || "0",
      intGoalsFor: entry.intGoalsFor || "0",
      intGoalsAgainst: entry.intGoalsAgainst || "0",
      intGoalDifference: entry.intGoalDifference || "0",
      intPoints: entry.intPoints || "0",
    }));

    setCache(cacheKey, standings);
    return standings;
  } catch (error) {
    console.error(`Error fetching standings for league ${leagueId}:`, error);
    return [];
  }
};

// ============ HELPERS ============

const getMatchProgress = (match: any): string | null => {
  if (match.strStatus === "Match Finished") return "FT";
  if (match.strStatus === "Not Started") return null;
  return match.strStatus || null;
};

const getCountryFromLeague = (leagueId: string): string => {
  const countries: Record<string, string> = {
    "4328": "England",      // Premier League
    "4335": "Spain",        // La Liga
    "4332": "Italy",        // Serie A
    "4331": "Germany",      // Bundesliga
    "4334": "France",       // Ligue 1
    "4337": "USA",          // MLS
    "4330": "Europe",       // Champions League
    "4380": "Europe",       // Europa League
  };
  return countries[leagueId] || "";
};

// ============ UTILITY ============

export const formatMatchDate = (dateString: string): string => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatMatchTime = (timeString: string | null): string => {
  if (!timeString) return "TBD";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const clearCache = (): void => {
  cache.clear();
};

export const universalSearch = async (query: string): Promise<SearchResult[]> => {
  const teams = await searchTeams(query);
  return teams.map((team) => ({
    type: "team" as const,
    id: team.idTeam,
    name: team.strTeam,
    image: team.strBadge,
    sport: team.strSport,
  }));
};