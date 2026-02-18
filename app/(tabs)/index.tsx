import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/context/ThemeContext";
import {
  Header,
  MatchCard,
  LeagueCard,
  LoadingSpinner,
  ErrorMessage,
} from "../../src/components";
import { useApi } from "../../src/hooks/useApi";
import {
  getPopularLeagues,
  getMatchesForPopularLeagues,
} from "../../src/services/api";
import { APP_CONFIG } from "../../src/constants";
import { Match, League } from "../../src/types";

export default function HomeScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: leagues,
    loading: leaguesLoading,
    error: leaguesError,
    refetch: refetchLeagues,
  } = useApi<League[]>(getPopularLeagues, []);

  const {
    data: matches,
    loading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useApi<Match[]>(getMatchesForPopularLeagues, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchLeagues(), refetchMatches()]);
    setRefreshing(false);
  }, [refetchLeagues, refetchMatches]);

  const handleMatchPress = (match: Match) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/team/${match.idHomeTeam}`);
  };

  const bg = isDark ? "#0f0f1a" : "#f8fafc";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";
  const sectionBg = isDark ? "#161626" : "#ffffff";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header title="Cheza Pro" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22c55e"
            colors={["#22c55e"]}
          />
        }
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={
            isDark
              ? ["#0f2318", "#0f0f1a"]
              : ["#f0fdf4", "#f8fafc"]
          }
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 20,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: "#22c55e",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "800",
                    letterSpacing: 1,
                  }}
                >
                  LIVE
                </Text>
              </View>
              <Text
                style={{
                  color: isDark ? "#4ade80" : "#16a34a",
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                Top European Leagues
              </Text>
            </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: textPrimary,
                letterSpacing: -0.5,
                lineHeight: 28,
              }}
            >
              Follow Your{"\n"}Favourite Teams
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: textMuted,
                marginTop: 6,
                lineHeight: 18,
              }}
            >
              Scores, fixtures & standings
            </Text>
          </View>

          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: isDark
                ? "rgba(34,197,94,0.12)"
                : "rgba(34,197,94,0.08)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: isDark
                ? "rgba(34,197,94,0.25)"
                : "rgba(34,197,94,0.2)",
            }}
          >
            <Ionicons name="football" size={44} color="#22c55e" />
          </View>
        </LinearGradient>

        {/* Popular Leagues */}
        <View style={{ marginTop: 24, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 4,
                  height: 18,
                  backgroundColor: "#22c55e",
                  borderRadius: 2,
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  color: textPrimary,
                  letterSpacing: -0.3,
                }}
              >
                Popular Leagues
              </Text>
            </View>
          </View>

          {leaguesLoading && !leagues ? (
            <View style={{ paddingLeft: 16 }}>
              <View
                style={{ flexDirection: "row", gap: 10 }}
              >
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 100,
                      height: 120,
                      borderRadius: 16,
                      backgroundColor: isDark ? "#161626" : "#f1f5f9",
                    }}
                  />
                ))}
              </View>
            </View>
          ) : leaguesError ? (
            <View style={{ marginHorizontal: 16 }}>
              <ErrorMessage
                message={leaguesError}
                onRetry={refetchLeagues}
              />
            </View>
          ) : leagues && leagues.length > 0 ? (
            <FlatList
              data={leagues}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              keyExtractor={(item) => item.idLeague}
              renderItem={({ item }) => (
                <LeagueCard
                  league={item}
                  compact
                  showFavoriteButton={false}
                />
              )}
            />
          ) : null}
        </View>

        {/* Upcoming Matches */}
        <View style={{ marginTop: 20, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 4,
                  height: 18,
                  backgroundColor: "#22c55e",
                  borderRadius: 2,
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  color: textPrimary,
                  letterSpacing: -0.3,
                }}
              >
                Upcoming Matches
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(34,197,94,0.08)",
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <Ionicons
                name="refresh"
                size={11}
                color="#22c55e"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "#22c55e",
                  letterSpacing: 0.3,
                }}
              >
                Pull to refresh
              </Text>
            </View>
          </View>

          {matchesLoading && !matches ? (
            <LoadingSpinner />
          ) : matchesError ? (
            <View style={{ marginHorizontal: 0 }}>
              <ErrorMessage
                message={matchesError}
                onRetry={refetchMatches}
              />
            </View>
          ) : matches && matches.length > 0 ? (
            matches
              .slice(0, APP_CONFIG.MAX_UPCOMING_MATCHES)
              .map((match, index) => (
                <MatchCard
                  key={`${match.idEvent}-${index}`}
                  match={match}
                  onPress={() => handleMatchPress(match)}
                />
              ))
          ) : (
            <View
              style={{
                marginHorizontal: 16,
                borderRadius: 20,
                backgroundColor: sectionBg,
                padding: 40,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDark ? "#252545" : "#e2e8f0",
              }}
            >
              <Ionicons
                name="football-outline"
                size={48}
                color={isDark ? "#374151" : "#d1d5db"}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: textPrimary,
                  marginTop: 14,
                  marginBottom: 6,
                }}
              >
                No Upcoming Matches
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: textMuted,
                  textAlign: "center",
                }}
              >
                Pull down to refresh or check back later
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
