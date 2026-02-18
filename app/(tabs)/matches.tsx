import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/context/ThemeContext";
import {
  Header,
  MatchCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../src/components";
import { useApi } from "../../src/hooks/useApi";
import {
  getNextMatchesByLeague,
  getLastMatchesByLeague,
} from "../../src/services/api";
import { LEAGUES, LEAGUE_NAMES } from "../../src/constants";
import { Match } from "../../src/types";

type MatchFilter = "upcoming" | "results";

export default function MatchesScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<MatchFilter>("upcoming");
  const [selectedLeague, setSelectedLeague] = useState<number>(LEAGUES.EPL);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = useCallback(async (): Promise<Match[]> => {
    if (filter === "upcoming") {
      return getNextMatchesByLeague(selectedLeague);
    } else {
      return getLastMatchesByLeague(selectedLeague);
    }
  }, [filter, selectedLeague]);

  const {
    data: matches,
    loading,
    error,
    refetch,
  } = useApi<Match[]>(fetchMatches, [filter, selectedLeague]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleMatchPress = (match: Match) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/team/${match.idHomeTeam}`);
  };

  const handleFilterChange = (newFilter: MatchFilter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };

  const handleLeagueChange = (leagueId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLeague(leagueId);
  };

  const leagueOptions = useMemo(() => {
    return Object.entries(LEAGUES).map(([key, id]) => ({
      id,
      name: LEAGUE_NAMES[id] || key,
    }));
  }, []);

  const bg = isDark ? "#0f0f1a" : "#f8fafc";
  const tabBg = isDark ? "#161626" : "#f1f5f9";
  const activeTabBg = isDark ? "#22c55e" : "#22c55e";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title="Matches" />

      {/* Filter Tabs */}
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
        {(["upcoming", "results"] as MatchFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => handleFilterChange(f)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 10,
              gap: 6,
              backgroundColor: filter === f ? activeTabBg : "transparent",
            }}
          >
            <Ionicons
              name={f === "upcoming" ? "time-outline" : "checkmark-circle-outline"}
              size={15}
              color={filter === f ? "#fff" : textMuted}
            />
            <Text
              style={{
                fontWeight: "700",
                fontSize: 13,
                color: filter === f ? "#fff" : textMuted,
              }}
            >
              {f === "upcoming" ? "Upcoming" : "Results"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* League Filter */}
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
                selectedLeague === league.id
                  ? "#22c55e"
                  : borderColor,
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

      {/* Matches List */}
      <View style={{ flex: 1, marginTop: 12 }}>
        {loading && !matches ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item, index) => `${item.idEvent}-${index}`}
            renderItem={({ item }) => (
              <MatchCard
                match={item}
                onPress={() => handleMatchPress(item)}
              />
            )}
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
                icon={filter === "upcoming" ? "📅" : "📊"}
                title="No Matches Found"
                message={`No ${filter} matches available for this league`}
              />
            }
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 24,
            }}
          />
        )}
      </View>
    </View>
  );
}
