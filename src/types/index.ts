// League types
export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
  strCountry: string;
  strBadge: string | null;
  strLogo: string | null;
  strBanner: string | null;
  strDescriptionEN: string | null;
  strCurrentSeason: string | null;
}

// Team types
export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort: string | null;
  strAlternate: string | null;
  strSport: string;
  strLeague: string;
  idLeague: string;
  strCountry: string;
  strStadium: string | null;
  strStadiumThumb: string | null;
  strStadiumLocation: string | null;
  intStadiumCapacity: string | null;
  strWebsite: string | null;
  strFacebook: string | null;
  strTwitter: string | null;
  strInstagram: string | null;
  strDescriptionEN: string | null;
  strBadge: string | null;
  strLogo: string | null;
  strBanner: string | null;
  strJersey: string | null;
  intFormedYear: string | null;
}

// Match/Event types
export interface Match {
  idEvent: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strEvent: string;
  strEventAlternate: string | null;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strHomeTeamBadge: string | null;
  strAwayTeamBadge: string | null;
  dateEvent: string;
  strTime: string | null;
  strTimestamp: string | null;
  strVenue: string | null;
  strCountry: string | null;
  strStatus: string | null;
  strPostponed: string | null;
  strThumb: string | null;
  strProgress: string | null;
}

// Live Score types
export interface LiveScore {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strProgress: string | null;
  strStatus: string | null;
  strLeague: string;
  strHomeTeamBadge: string | null;
  strAwayTeamBadge: string | null;
}

// Player types
export interface Player {
  idPlayer: string;
  strPlayer: string;
  strNationality: string | null;
  strPosition: string | null;
  strHeight: string | null;
  strWeight: string | null;
  strThumb: string | null;
  strCutout: string | null;
  dateBorn: string | null;
  strNumber: string | null;
  strDescriptionEN: string | null;
}

// Standings/Table types
export interface Standing {
  idStanding: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strBadge: string | null;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
}

// News types (custom, as TheSportsDB doesn't have news)
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  imageUrl: string | null;
  publishedAt: string;
  url: string;
}

// API Response types
export interface LeaguesResponse {
  leagues: League[] | null;
}

export interface TeamsResponse {
  teams: Team[] | null;
}

export interface MatchesResponse {
  events: Match[] | null;
}

export interface LiveScoresResponse {
  events: LiveScore[] | null;
}

export interface PlayersResponse {
  player: Player[] | null;
}

export interface StandingsResponse {
  table: Standing[] | null;
}

// Favorites types
export interface FavoritesState {
  teams: string[];
  leagues: string[];
}

// Theme types
export type ThemeMode = "light" | "dark" | "system";

// Filter types
export interface MatchFilter {
  leagueId?: string;
  date?: string;
}

// Search result types
export interface SearchResult {
  type: "team" | "league";
  id: string;
  name: string;
  image: string | null;
  sport: string;
}
