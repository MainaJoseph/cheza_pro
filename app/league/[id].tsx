import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/context/ThemeContext";
import { useFavorites } from "../../src/context/FavoritesContext";
import {
  Header,
  MatchCard,
  TeamCard,
  StandingRow,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../src/components";
import { useApi } from "../../src/hooks/useApi";
import {
  getLeagueById,
  getTeamsByLeague,
  getNextMatchesByLeague,
  getLeagueStandings,
} from "../../src/services/api";
import { PLACEHOLDER_IMAGE } from "../../src/constants";
import { League, Team, Match, Standing } from "../../src/types";

type TabType = "matches" | "standings" | "teams";

export default function LeagueDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { isLeagueFavorite, toggleLeagueFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabType>("matches");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: league,
    loading: leagueLoading,
    error: leagueError,
    refetch: refetchLeague,
  } = useApi<League | null>(() => getLeagueById(id || ""), [id]);

  const {
    data: teams,
    loading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams,
  } = useApi<Team[]>(() => getTeamsByLeague(id || ""), [id]);

  const {
    data: matches,
    loading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useApi<Match[]>(() => getNextMatchesByLeague(id || ""), [id]);

  const {
    data: standings,
    loading: standingsLoading,
    error: standingsError,
    refetch: refetchStandings,
  } = useApi<Standing[]>(() => getLeagueStandings(id || ""), [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchLeague(),
      refetchTeams(),
      refetchMatches(),
      refetchStandings(),
    ]);
    setRefreshing(false);
  }, [refetchLeague, refetchTeams, refetchMatches, refetchStandings]);

  const isFavorite = id ? isLeagueFavorite(id) : false;

  const handleFavoritePress = () => {
    if (id) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleLeagueFavorite(id);
    }
  };

  const handleTabChange = (tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const bg = isDark ? "#0f0f1a" : "#f8fafc";
  const cardBg = isDark ? "#161626" : "#ffffff";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#a1a1aa" : "#64748b";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";
  const tabBg = isDark ? "#161626" : "#f1f5f9";

  if (leagueLoading && !league) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title="League" showBack />
        <LoadingSpinner fullScreen />
      </View>
    );
  }

  if (leagueError || !league) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title="League" showBack />
        <ErrorMessage
          message={leagueError || "League not found"}
          onRetry={refetchLeague}
          fullScreen
        />
      </View>
    );
  }

  const TABS: { key: TabType; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
    { key: "matches", label: "Fixtures", icon: "time-outline" },
    { key: "standings", label: "Table", icon: "list-outline" },
    { key: "teams", label: "Teams", icon: "people-outline" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "matches":
        if (matchesLoading && !matches) return <LoadingSpinner />;
        if (matchesError)
          return (
            <ErrorMessage message={matchesError} onRetry={refetchMatches} />
          );
        if (!matches || matches.length === 0)
          return (
            <EmptyState
              icon="📅"
              title="No Upcoming Matches"
              message="Check back later for scheduled fixtures"
            />
          );
        return matches.map((match) => (
          <MatchCard key={match.idEvent} match={match} />
        ));

      case "teams":
        if (teamsLoading && !teams) return <LoadingSpinner />;
        if (teamsError)
          return <ErrorMessage message={teamsError} onRetry={refetchTeams} />;
        if (!teams || teams.length === 0)
          return (
            <EmptyState
              icon="🏆"
              title="No Teams Found"
              message="No teams available for this league"
            />
          );
        return (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              paddingHorizontal: 8,
            }}
          >
            {teams.map((team) => (
              <TeamCard key={team.idTeam} team={team} compact />
            ))}
          </View>
        );

      case "standings":
        if (standingsLoading && !standings) return <LoadingSpinner />;
        if (standingsError)
          return (
            <ErrorMessage message={standingsError} onRetry={refetchStandings} />
          );
        if (!standings || standings.length === 0)
          return (
            <EmptyState
              icon="📊"
              title="No Standings Available"
              message="Standings are not available for this league"
            />
          );
        return (
          <View
            style={{
              marginHorizontal: 16,
              borderRadius: 18,
              overflow: "hidden",
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor,
            }}
          >
            <StandingRow standing={{} as Standing} isHeader />
            {standings.map((standing) => (
              <StandingRow key={standing.idStanding} standing={standing} />
            ))}
            {/* Legend */}
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: borderColor,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              {[
                { color: "#22c55e", label: "Champions League" },
                { color: "#3b82f6", label: "Europa League" },
                { color: "#ef4444", label: "Relegation" },
              ].map((item) => (
                <View
                  key={item.label}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: item.color,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ fontSize: 10, color: textMuted, fontWeight: "500" }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header
        title={league.strLeague}
        showBack
        rightAction={{
          isFavorite,
          onPress: handleFavoritePress,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22c55e"
          />
        }
      >
        {/* League Hero */}
        <LinearGradient
          colors={isDark ? ["#0f2318", "#0f0f1a"] : ["#f0fdf4", "#f8fafc"]}
          style={{
            alignItems: "center",
            paddingVertical: 28,
            paddingHorizontal: 16,
          }}
        >
          {league.strBanner ? (
            <Image
              source={{ uri: league.strBanner }}
              style={{
                width: "90%",
                height: 100,
                borderRadius: 14,
              }}
              contentFit="contain"
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: isDark
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(34,197,94,0.06)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: isDark
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(34,197,94,0.15)",
              }}
            >
              <Image
                source={{
                  uri: league.strBadge || league.strLogo || PLACEHOLDER_IMAGE,
                }}
                style={{ width: 72, height: 72 }}
                contentFit="contain"
              />
            </View>
          )}

          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: textPrimary,
              marginTop: 16,
              textAlign: "center",
              letterSpacing: -0.5,
              paddingHorizontal: 16,
            }}
          >
            {league.strLeague}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 13, color: "#22c55e", fontWeight: "600" }}>
              {league.strCountry}
            </Text>
            <Text style={{ color: textMuted, fontSize: 13 }}>•</Text>
            <Text style={{ fontSize: 13, color: textSecondary, fontWeight: "500" }}>
              {league.strSport}
            </Text>
          </View>

          {league.strCurrentSeason && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={12}
                color={textMuted}
                style={{ marginRight: 5 }}
              />
              <Text style={{ fontSize: 12, color: textMuted, fontWeight: "500" }}>
                Season {league.strCurrentSeason}
              </Text>
            </View>
          )}

          {isFavorite && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(245,158,11,0.12)",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginTop: 10,
              }}
            >
              <Ionicons name="star" size={12} color="#f59e0b" style={{ marginRight: 5 }} />
              <Text style={{ fontSize: 12, color: "#f59e0b", fontWeight: "600" }}>
                Favorite League
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Description (matches tab only) */}
        {activeTab === "matches" && league.strDescriptionEN && (
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 8,
              borderRadius: 16,
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor,
              padding: 14,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                lineHeight: 20,
                color: textSecondary,
              }}
              numberOfLines={4}
            >
              {league.strDescriptionEN}
            </Text>
          </View>
        )}

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 14,
            padding: 4,
            backgroundColor: tabBg,
            borderWidth: 1,
            borderColor,
          }}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                borderRadius: 10,
                gap: 4,
                backgroundColor:
                  activeTab === tab.key ? "#22c55e" : "transparent",
              }}
            >
              <Ionicons
                name={tab.icon}
                size={13}
                color={activeTab === tab.key ? "#fff" : textMuted}
              />
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 12,
                  color: activeTab === tab.key ? "#fff" : textMuted,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={{ paddingBottom: 32 }}>{renderTabContent()}</View>
      </ScrollView>
    </View>
  );
}
