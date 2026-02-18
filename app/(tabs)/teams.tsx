import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/context/ThemeContext";
import {
  Header,
  TeamCard,
  LeagueCard,
  SearchBar,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../src/components";
import { useApi } from "../../src/hooks/useApi";
import {
  getTeamsByLeague,
  getPopularLeagues,
  searchTeams,
} from "../../src/services/api";
import { LEAGUES, LEAGUE_NAMES } from "../../src/constants";
import { Team, League } from "../../src/types";

type ViewMode = "teams" | "leagues";

export default function TeamsScreen() {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("teams");
  const [selectedLeague, setSelectedLeague] = useState<number>(LEAGUES.EPL);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = useCallback(async (): Promise<Team[]> => {
    return getTeamsByLeague(selectedLeague);
  }, [selectedLeague]);

  const {
    data: teams,
    loading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams,
  } = useApi<Team[]>(fetchTeams, [selectedLeague]);

  const {
    data: leagues,
    loading: leaguesLoading,
    error: leaguesError,
    refetch: refetchLeagues,
  } = useApi<League[]>(getPopularLeagues, []);

  const { data: searchResults, loading: searchLoading } = useApi<Team[]>(
    () =>
      searchQuery.length >= 3
        ? searchTeams(searchQuery)
        : Promise.resolve([]),
    [searchQuery]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (viewMode === "teams") {
      await refetchTeams();
    } else {
      await refetchLeagues();
    }
    setRefreshing(false);
  }, [viewMode, refetchTeams, refetchLeagues]);

  const handleViewMode = (mode: ViewMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(mode);
  };

  const handleLeagueChange = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLeague(id);
  };

  const leagueOptions = useMemo(() => {
    return Object.entries(LEAGUES).map(([key, id]) => ({
      id,
      name: LEAGUE_NAMES[id] || key,
    }));
  }, []);

  const displayTeams = searchQuery.length >= 3 ? searchResults : teams;
  const isLoading = searchQuery.length >= 3 ? searchLoading : teamsLoading;

  const bg = isDark ? "#0f0f1a" : "#f8fafc";
  const tabBg = isDark ? "#161626" : "#f1f5f9";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title="Teams & Leagues" />

      {/* View Mode Toggle */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          marginTop: 14,
          marginBottom: 12,
          borderRadius: 14,
          padding: 4,
          backgroundColor: tabBg,
          borderWidth: 1,
          borderColor,
        }}
      >
        {(["teams", "leagues"] as ViewMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            onPress={() => handleViewMode(mode)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 10,
              gap: 6,
              backgroundColor: viewMode === mode ? "#22c55e" : "transparent",
            }}
          >
            <Ionicons
              name={mode === "teams" ? "people-outline" : "trophy-outline"}
              size={15}
              color={viewMode === mode ? "#fff" : textMuted}
            />
            <Text
              style={{
                fontWeight: "700",
                fontSize: 13,
                color: viewMode === mode ? "#fff" : textMuted,
                textTransform: "capitalize",
              }}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === "teams" ? (
        <>
          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search teams (min 3 chars)..."
            onClear={() => setSearchQuery("")}
          />

          {/* League Filter */}
          {searchQuery.length < 3 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ maxHeight: 48 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                alignItems: "center",
              }}
            >
              {leagueOptions.map((league) => (
                <TouchableOpacity
                  key={league.id}
                  onPress={() => handleLeagueChange(league.id)}
                  activeOpacity={0.8}
                  style={{
                    marginRight: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor:
                      selectedLeague === league.id
                        ? "#22c55e"
                        : isDark
                        ? "#161626"
                        : "#ffffff",
                    borderWidth: 1,
                    borderColor:
                      selectedLeague === league.id ? "#22c55e" : borderColor,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color:
                        selectedLeague === league.id
                          ? "#fff"
                          : isDark
                          ? "#a1a1aa"
                          : "#475569",
                    }}
                  >
                    {league.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={{ flex: 1, marginTop: 10 }}>
            {isLoading && !displayTeams ? (
              <LoadingSpinner />
            ) : teamsError && !searchQuery ? (
              <ErrorMessage message={teamsError} onRetry={refetchTeams} />
            ) : (
              <FlatList
                data={displayTeams}
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
                ListEmptyComponent={
                  <EmptyState
                    icon={searchQuery ? "🔍" : "🏆"}
                    title={searchQuery ? "No Results" : "No Teams Found"}
                    message={
                      searchQuery
                        ? `No teams found for "${searchQuery}"`
                        : "No teams available for this league"
                    }
                  />
                }
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
              />
            )}
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          {leaguesLoading && !leagues ? (
            <LoadingSpinner />
          ) : leaguesError ? (
            <ErrorMessage message={leaguesError} onRetry={refetchLeagues} />
          ) : (
            <FlatList
              data={leagues}
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
              ListEmptyComponent={
                <EmptyState
                  icon="🏟️"
                  title="No Leagues Found"
                  message="Unable to load leagues"
                />
              }
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      )}
    </View>
  );
}
