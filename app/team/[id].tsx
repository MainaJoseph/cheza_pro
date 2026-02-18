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
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../src/components";
import { useApi } from "../../src/hooks/useApi";
import {
  getTeamById,
  getNextMatchesByTeam,
  getLastMatchesByTeam,
} from "../../src/services/api";
import { PLACEHOLDER_IMAGE } from "../../src/constants";
import { Team, Match } from "../../src/types";

type TabType = "upcoming" | "results" | "info";

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { isTeamFavorite, toggleTeamFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: team,
    loading: teamLoading,
    error: teamError,
    refetch: refetchTeam,
  } = useApi<Team | null>(() => getTeamById(id || ""), [id]);

  const {
    data: upcomingMatches,
    loading: upcomingLoading,
    error: upcomingError,
    refetch: refetchUpcoming,
  } = useApi<Match[]>(() => getNextMatchesByTeam(id || ""), [id]);

  const {
    data: pastMatches,
    loading: pastLoading,
    error: pastError,
    refetch: refetchPast,
  } = useApi<Match[]>(() => getLastMatchesByTeam(id || ""), [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchTeam(), refetchUpcoming(), refetchPast()]);
    setRefreshing(false);
  }, [refetchTeam, refetchUpcoming, refetchPast]);

  const isFavorite = id ? isTeamFavorite(id) : false;

  const handleFavoritePress = () => {
    if (id) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleTeamFavorite(id);
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

  if (teamLoading && !team) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title="Team" showBack />
        <LoadingSpinner fullScreen />
      </View>
    );
  }

  if (teamError || !team) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <Header title="Team" showBack />
        <ErrorMessage
          message={teamError || "Team not found"}
          onRetry={refetchTeam}
          fullScreen
        />
      </View>
    );
  }

  const TABS: { key: TabType; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
    { key: "upcoming", label: "Fixtures", icon: "time-outline" },
    { key: "results", label: "Results", icon: "checkmark-circle-outline" },
    { key: "info", label: "Info", icon: "information-circle-outline" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "upcoming":
        if (upcomingLoading && !upcomingMatches) return <LoadingSpinner />;
        if (upcomingError)
          return <ErrorMessage message={upcomingError} onRetry={refetchUpcoming} />;
        if (!upcomingMatches || upcomingMatches.length === 0)
          return (
            <EmptyState
              icon="📅"
              title="No Upcoming Matches"
              message="Check back later for scheduled fixtures"
            />
          );
        return upcomingMatches.map((match) => (
          <MatchCard key={match.idEvent} match={match} />
        ));

      case "results":
        if (pastLoading && !pastMatches) return <LoadingSpinner />;
        if (pastError)
          return <ErrorMessage message={pastError} onRetry={refetchPast} />;
        if (!pastMatches || pastMatches.length === 0)
          return (
            <EmptyState
              icon="📊"
              title="No Recent Results"
              message="No past matches available"
            />
          );
        return pastMatches.map((match) => (
          <MatchCard key={match.idEvent} match={match} />
        ));

      case "info":
        return (
          <View style={{ paddingHorizontal: 16 }}>
            {/* Stadium Info */}
            {team.strStadium && (
              <View
                style={{
                  borderRadius: 18,
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(34,197,94,0.12)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Ionicons name="business-outline" size={16} color="#22c55e" />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Stadium
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: textPrimary,
                    marginBottom: 6,
                  }}
                >
                  {team.strStadium}
                </Text>
                {team.strStadiumLocation && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={textMuted}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: textSecondary,
                        fontWeight: "500",
                      }}
                    >
                      {team.strStadiumLocation}
                    </Text>
                  </View>
                )}
                {team.intStadiumCapacity && (
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Ionicons
                      name="people-outline"
                      size={13}
                      color={textMuted}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: textSecondary,
                        fontWeight: "500",
                      }}
                    >
                      Capacity:{" "}
                      {parseInt(team.intStadiumCapacity).toLocaleString()}
                    </Text>
                  </View>
                )}
                {team.strStadiumThumb && (
                  <Image
                    source={{ uri: team.strStadiumThumb }}
                    style={{
                      width: "100%",
                      height: 150,
                      marginTop: 14,
                      borderRadius: 12,
                    }}
                    contentFit="cover"
                  />
                )}
              </View>
            )}

            {/* Description */}
            {team.strDescriptionEN && (
              <View
                style={{
                  borderRadius: 18,
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(34,197,94,0.12)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={16}
                      color="#22c55e"
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    About
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: textSecondary,
                  }}
                >
                  {team.strDescriptionEN.slice(0, 500)}
                  {team.strDescriptionEN.length > 500 ? "..." : ""}
                </Text>
              </View>
            )}

            {/* Links */}
            {(team.strWebsite ||
              team.strFacebook ||
              team.strTwitter ||
              team.strInstagram) && (
              <View
                style={{
                  borderRadius: 18,
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(34,197,94,0.12)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Ionicons name="link-outline" size={16} color="#22c55e" />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: textMuted,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Links
                  </Text>
                </View>
                {team.strWebsite && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={15}
                      color="#22c55e"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#22c55e",
                        fontWeight: "500",
                      }}
                    >
                      {team.strWebsite}
                    </Text>
                  </View>
                )}
                {team.strTwitter && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons
                      name="logo-twitter"
                      size={15}
                      color="#1DA1F2"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: textSecondary,
                        fontWeight: "500",
                      }}
                    >
                      {team.strTwitter}
                    </Text>
                  </View>
                )}
                {team.strInstagram && (
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Ionicons
                      name="logo-instagram"
                      size={15}
                      color="#E1306C"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: textSecondary,
                        fontWeight: "500",
                      }}
                    >
                      {team.strInstagram}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Header
        title={team.strTeam}
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
        {/* Team Hero */}
        <LinearGradient
          colors={isDark ? ["#0f2318", "#0f0f1a"] : ["#f0fdf4", "#f8fafc"]}
          style={{
            alignItems: "center",
            paddingVertical: 28,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
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
              source={{ uri: team.strBadge || PLACEHOLDER_IMAGE }}
              style={{ width: 82, height: 82 }}
              contentFit="contain"
            />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: textPrimary,
              marginTop: 16,
              textAlign: "center",
              letterSpacing: -0.5,
            }}
          >
            {team.strTeam}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#22c55e",
              fontWeight: "600",
              marginTop: 5,
            }}
          >
            {team.strLeague}
          </Text>
          {team.intFormedYear && (
            <Text
              style={{
                fontSize: 12,
                color: textMuted,
                marginTop: 3,
                fontWeight: "500",
              }}
            >
              Est. {team.intFormedYear}
            </Text>
          )}

          {/* Quick stats */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 18,
              gap: 12,
            }}
          >
            {team.strCountry && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)",
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Ionicons
                  name="flag-outline"
                  size={12}
                  color={textMuted}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: textSecondary,
                    fontWeight: "600",
                  }}
                >
                  {team.strCountry}
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
                }}
              >
                <Ionicons name="star" size={12} color="#f59e0b" style={{ marginRight: 5 }} />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#f59e0b",
                    fontWeight: "600",
                  }}
                >
                  Favorite
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginTop: 16,
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
