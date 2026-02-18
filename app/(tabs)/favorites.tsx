import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/context/ThemeContext";
import { useFavorites } from "../../src/context/FavoritesContext";
import {
  Header,
  TeamCard,
  LeagueCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../src/components";
import { useApi } from "../../src/hooks/useApi";
import { getTeamsByIds, getPopularLeagues } from "../../src/services/api";
import { Team, League } from "../../src/types";

type FavoriteType = "teams" | "leagues";

export default function FavoritesScreen() {
  const { isDark } = useTheme();
  const { favorites } = useFavorites();
  const [viewType, setViewType] = useState<FavoriteType>("teams");
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavoriteTeams = useCallback(async (): Promise<Team[]> => {
    if (favorites.teams.length === 0) return [];
    return getTeamsByIds(favorites.teams);
  }, [favorites.teams]);

  const {
    data: favoriteTeams,
    loading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams,
  } = useApi<Team[]>(fetchFavoriteTeams, [favorites.teams]);

  const fetchFavoriteLeagues = useCallback(async (): Promise<League[]> => {
    if (favorites.leagues.length === 0) return [];
    const allLeagues = await getPopularLeagues();
    return allLeagues.filter((league) =>
      favorites.leagues.includes(league.idLeague)
    );
  }, [favorites.leagues]);

  const {
    data: favoriteLeagues,
    loading: leaguesLoading,
    error: leaguesError,
    refetch: refetchLeagues,
  } = useApi<League[]>(fetchFavoriteLeagues, [favorites.leagues]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (viewType === "teams") {
      await refetchTeams();
    } else {
      await refetchLeagues();
    }
    setRefreshing(false);
  }, [viewType, refetchTeams, refetchLeagues]);

  const handleTabChange = (tab: FavoriteType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewType(tab);
  };

  const bg = isDark ? "#0f0f1a" : "#f8fafc";
  const tabBg = isDark ? "#161626" : "#f1f5f9";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";
  const badgeBg = isDark ? "#252545" : "#e2e8f0";
  const badgeText = isDark ? "#a1a1aa" : "#64748b";

  const renderContent = () => {
    if (viewType === "teams") {
      if (favorites.teams.length === 0) {
        return (
          <EmptyState
            icon="⭐"
            title="No Favorite Teams"
            message="Tap the star on any team to add it here"
          />
        );
      }
      if (teamsLoading && !favoriteTeams) {
        return <LoadingSpinner />;
      }
      if (teamsError) {
        return <ErrorMessage message={teamsError} onRetry={refetchTeams} />;
      }
      return (
        <FlatList
          data={favoriteTeams}
          keyExtractor={(item) => item.idTeam}
          renderItem={({ item }) => <TeamCard team={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#22c55e"
              colors={["#22c55e"]}
            />
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        />
      );
    }

    if (favorites.leagues.length === 0) {
      return (
        <EmptyState
          icon="⭐"
          title="No Favorite Leagues"
          message="Tap the star on any league to add it here"
        />
      );
    }
    if (leaguesLoading && !favoriteLeagues) {
      return <LoadingSpinner />;
    }
    if (leaguesError) {
      return <ErrorMessage message={leaguesError} onRetry={refetchLeagues} />;
    }
    return (
      <FlatList
        data={favoriteLeagues}
        keyExtractor={(item) => item.idLeague}
        renderItem={({ item }) => <LeagueCard league={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22c55e"
            colors={["#22c55e"]}
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      />
    );
  };

  const totalFavorites = favorites.teams.length + favorites.leagues.length;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title="Favorites" />

      {/* Summary badge */}
      {totalFavorites > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            marginTop: 14,
            marginBottom: 4,
          }}
        >
          <Ionicons name="star" size={13} color="#f59e0b" />
          <Text
            style={{
              fontSize: 12,
              color: "#f59e0b",
              fontWeight: "600",
              marginLeft: 5,
            }}
          >
            {totalFavorites} saved item{totalFavorites !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          marginTop: 10,
          marginBottom: 12,
          borderRadius: 14,
          padding: 4,
          backgroundColor: tabBg,
          borderWidth: 1,
          borderColor,
        }}
      >
        {(["teams", "leagues"] as FavoriteType[]).map((tab) => {
          const count =
            tab === "teams" ? favorites.teams.length : favorites.leagues.length;
          const isActive = viewType === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabChange(tab)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                borderRadius: 10,
                gap: 6,
                backgroundColor: isActive ? "#22c55e" : "transparent",
              }}
            >
              <Ionicons
                name={tab === "teams" ? "people-outline" : "trophy-outline"}
                size={15}
                color={isActive ? "#fff" : textMuted}
              />
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 13,
                  color: isActive ? "#fff" : textMuted,
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </Text>
              {count > 0 && (
                <View
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.25)"
                      : badgeBg,
                    borderRadius: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    minWidth: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "800",
                      color: isActive ? "#fff" : badgeText,
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
