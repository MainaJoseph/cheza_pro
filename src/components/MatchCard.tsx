import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Match } from "../types";
import { useTheme } from "../context/ThemeContext";
import { formatMatchDate, formatMatchTime } from "../services/api";
import { PLACEHOLDER_IMAGE } from "../constants";

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

export function MatchCard({ match, onPress }: MatchCardProps) {
  const { isDark } = useTheme();

  const hasScore =
    match.intHomeScore !== null && match.intAwayScore !== null;
  const isLive =
    match.strStatus !== "Match Finished" &&
    match.strProgress !== null &&
    match.strProgress !== "" &&
    match.strProgress !== "FT";
  const isFinished =
    match.strStatus === "Match Finished" || match.strProgress === "FT";

  // Pulsing animation for live indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isLive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isLive]);

  const cardBg = isDark ? "#161626" : "#ffffff";
  const headerBg = isDark ? "#1a1a30" : "#f8fafc";
  const teamCircleBg = isDark ? "#21213a" : "#f1f5f9";
  const scoreBg = isDark ? "#21213a" : "#f1f5f9";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";
  const leagueColor = isDark ? "#4ade80" : "#16a34a";

  const homeScore = parseInt(match.intHomeScore || "0");
  const awayScore = parseInt(match.intAwayScore || "0");

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={onPress ? 0.75 : 1}
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      {/* Left accent bar */}
      {isLive && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: "#ef4444",
            zIndex: 1,
          }}
        />
      )}
      {isFinished && hasScore && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: "#22c55e",
            zIndex: 1,
          }}
        />
      )}

      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: headerBg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: leagueColor,
            letterSpacing: 0.3,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {match.strLeague}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {isLive && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(239,68,68,0.15)",
                borderWidth: 1,
                borderColor: "rgba(239,68,68,0.4)",
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Animated.View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#ef4444",
                  marginRight: 5,
                  opacity: pulseAnim,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: "#ef4444",
                  letterSpacing: 0.5,
                }}
              >
                LIVE {match.strProgress}
              </Text>
            </View>
          )}
          {isFinished && (
            <View
              style={{
                backgroundColor: "rgba(34,197,94,0.12)",
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "#22c55e",
                }}
              >
                FT
              </Text>
            </View>
          )}
          <Text
            style={{
              fontSize: 11,
              fontWeight: "500",
              color: textMuted,
            }}
          >
            {formatMatchDate(match.dateEvent)}
          </Text>
        </View>
      </View>

      {/* Teams and Score */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Home Team */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: teamCircleBg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Image
                source={{ uri: match.strHomeTeamBadge || PLACEHOLDER_IMAGE }}
                style={{ width: 44, height: 44 }}
                contentFit="contain"
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: textPrimary,
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {match.strHomeTeam}
            </Text>
            {hasScore && isFinished && (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color:
                    homeScore > awayScore
                      ? "#22c55e"
                      : homeScore < awayScore
                      ? "#ef4444"
                      : textMuted,
                  marginTop: 2,
                }}
              >
                {homeScore > awayScore
                  ? "WIN"
                  : homeScore < awayScore
                  ? "LOSS"
                  : "DRAW"}
              </Text>
            )}
          </View>

          {/* Score / Time Center */}
          <View style={{ alignItems: "center", paddingHorizontal: 12 }}>
            {hasScore ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: scoreBg,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color:
                      homeScore > awayScore
                        ? "#22c55e"
                        : homeScore < awayScore
                        ? "#ef4444"
                        : textPrimary,
                    minWidth: 24,
                    textAlign: "center",
                  }}
                >
                  {match.intHomeScore}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    marginHorizontal: 8,
                    color: textMuted,
                    fontWeight: "300",
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color:
                      awayScore > homeScore
                        ? "#22c55e"
                        : awayScore < homeScore
                        ? "#ef4444"
                        : textPrimary,
                    minWidth: 24,
                    textAlign: "center",
                  }}
                >
                  {match.intAwayScore}
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: "#22c55e",
                    letterSpacing: 0.5,
                  }}
                >
                  {formatMatchTime(match.strTime)}
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: "700",
                    color: textMuted,
                    letterSpacing: 1.5,
                    marginTop: 3,
                    textTransform: "uppercase",
                  }}
                >
                  Kickoff
                </Text>
              </View>
            )}
          </View>

          {/* Away Team */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: teamCircleBg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Image
                source={{ uri: match.strAwayTeamBadge || PLACEHOLDER_IMAGE }}
                style={{ width: 44, height: 44 }}
                contentFit="contain"
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: textPrimary,
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {match.strAwayTeam}
            </Text>
            {hasScore && isFinished && (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color:
                    awayScore > homeScore
                      ? "#22c55e"
                      : awayScore < homeScore
                      ? "#ef4444"
                      : textMuted,
                  marginTop: 2,
                }}
              >
                {awayScore > homeScore
                  ? "WIN"
                  : awayScore < homeScore
                  ? "LOSS"
                  : "DRAW"}
              </Text>
            )}
          </View>
        </View>

        {/* Venue */}
        {match.strVenue && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: borderColor,
            }}
          >
            <Ionicons
              name="location-outline"
              size={12}
              color={textMuted}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontSize: 11,
                color: textMuted,
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              {match.strVenue}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
