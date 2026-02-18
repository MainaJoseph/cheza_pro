import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Standing } from "../types";
import { useTheme } from "../context/ThemeContext";
import { PLACEHOLDER_IMAGE } from "../constants";

interface StandingRowProps {
  standing: Standing;
  isHeader?: boolean;
}

export function StandingRow({ standing, isHeader = false }: StandingRowProps) {
  const { isDark } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (!isHeader) {
      router.push(`/team/${standing.idTeam}`);
    }
  };

  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";
  const headerBg = isDark ? "#1a1a2e" : "#f8fafc";

  if (isHeader) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: headerBg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Text
          style={{
            width: 28,
            fontSize: 10,
            fontWeight: "700",
            color: textMuted,
            letterSpacing: 0.3,
          }}
        >
          #
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: "700",
            color: textMuted,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          Team
        </Text>
        {["P", "W", "D", "L", "GD", "Pts"].map((label) => (
          <Text
            key={label}
            style={{
              width: label === "GD" || label === "Pts" ? 36 : 28,
              fontSize: 10,
              fontWeight: "700",
              color: textMuted,
              textAlign: "center",
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    );
  }

  const rank = parseInt(standing.intRank, 10);
  const isChampions = rank <= 4;
  const isEuropa = rank === 5 || rank === 6;
  const isRelegation = rank >= 18;
  const gd = parseInt(standing.intGoalDifference, 10);

  const accentColor = isChampions
    ? "#22c55e"
    : isEuropa
    ? "#3b82f6"
    : isRelegation
    ? "#ef4444"
    : "transparent";

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
      }}
    >
      {/* Rank with color indicator */}
      <View
        style={{
          width: 28,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 3,
            height: 22,
            borderRadius: 2,
            backgroundColor: accentColor,
            marginRight: 5,
          }}
        />
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: textPrimary,
          }}
        >
          {standing.intRank}
        </Text>
      </View>

      {/* Team */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: standing.strBadge || PLACEHOLDER_IMAGE }}
          style={{ width: 22, height: 22, marginRight: 8 }}
          contentFit="contain"
        />
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: textPrimary,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {standing.strTeam}
        </Text>
      </View>

      {/* Stats */}
      {[
        standing.intPlayed,
        standing.intWin,
        standing.intDraw,
        standing.intLoss,
      ].map((val, i) => (
        <Text
          key={i}
          style={{
            width: 28,
            fontSize: 12,
            fontWeight: "500",
            color: textMuted,
            textAlign: "center",
          }}
        >
          {val}
        </Text>
      ))}

      {/* Goal Diff */}
      <Text
        style={{
          width: 36,
          fontSize: 12,
          fontWeight: "600",
          textAlign: "center",
          color:
            gd > 0 ? "#22c55e" : gd < 0 ? "#ef4444" : textMuted,
        }}
      >
        {gd > 0 ? `+${gd}` : gd}
      </Text>

      {/* Points */}
      <Text
        style={{
          width: 36,
          fontSize: 13,
          fontWeight: "800",
          color: textPrimary,
          textAlign: "center",
        }}
      >
        {standing.intPoints}
      </Text>
    </TouchableOpacity>
  );
}
