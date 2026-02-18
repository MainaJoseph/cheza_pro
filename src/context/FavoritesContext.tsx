import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesState } from "../types";

interface FavoritesContextType {
  favorites: FavoritesState;
  isTeamFavorite: (teamId: string) => boolean;
  isLeagueFavorite: (leagueId: string) => boolean;
  toggleTeamFavorite: (teamId: string) => void;
  toggleLeagueFavorite: (leagueId: string) => void;
  addTeamFavorite: (teamId: string) => void;
  removeTeamFavorite: (teamId: string) => void;
  addLeagueFavorite: (leagueId: string) => void;
  removeLeagueFavorite: (leagueId: string) => void;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_STORAGE_KEY = "@sports_app_favorites";

const initialState: FavoritesState = {
  teams: [],
  leagues: [],
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites when they change
  useEffect(() => {
    if (isLoaded) {
      saveFavorites(favorites);
    }
  }, [favorites, isLoaded]);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        setFavorites({
          teams: parsed.teams || [],
          leagues: parsed.leagues || [],
        });
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveFavorites = async (data: FavoritesState) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const isTeamFavorite = useCallback(
    (teamId: string) => {
      return favorites.teams.includes(teamId);
    },
    [favorites.teams]
  );

  const isLeagueFavorite = useCallback(
    (leagueId: string) => {
      return favorites.leagues.includes(leagueId);
    },
    [favorites.leagues]
  );

  const addTeamFavorite = useCallback((teamId: string) => {
    setFavorites((prev) => ({
      ...prev,
      teams: prev.teams.includes(teamId)
        ? prev.teams
        : [...prev.teams, teamId],
    }));
  }, []);

  const removeTeamFavorite = useCallback((teamId: string) => {
    setFavorites((prev) => ({
      ...prev,
      teams: prev.teams.filter((id) => id !== teamId),
    }));
  }, []);

  const toggleTeamFavorite = useCallback((teamId: string) => {
    setFavorites((prev) => ({
      ...prev,
      teams: prev.teams.includes(teamId)
        ? prev.teams.filter((id) => id !== teamId)
        : [...prev.teams, teamId],
    }));
  }, []);

  const addLeagueFavorite = useCallback((leagueId: string) => {
    setFavorites((prev) => ({
      ...prev,
      leagues: prev.leagues.includes(leagueId)
        ? prev.leagues
        : [...prev.leagues, leagueId],
    }));
  }, []);

  const removeLeagueFavorite = useCallback((leagueId: string) => {
    setFavorites((prev) => ({
      ...prev,
      leagues: prev.leagues.filter((id) => id !== leagueId),
    }));
  }, []);

  const toggleLeagueFavorite = useCallback((leagueId: string) => {
    setFavorites((prev) => ({
      ...prev,
      leagues: prev.leagues.includes(leagueId)
        ? prev.leagues.filter((id) => id !== leagueId)
        : [...prev.leagues, leagueId],
    }));
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavorites(initialState);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isTeamFavorite,
        isLeagueFavorite,
        toggleTeamFavorite,
        toggleLeagueFavorite,
        addTeamFavorite,
        removeTeamFavorite,
        addLeagueFavorite,
        removeLeagueFavorite,
        clearAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
