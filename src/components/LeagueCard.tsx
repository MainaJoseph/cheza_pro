import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { League } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";
import { PLACEHOLDER_IMAGE } from "../constants";

interface LeagueCardProps {
  league: League;
  showFavoriteButton?: boolean;
  compact?: boolean;
}

export function LeagueCard({
  league,
  showFavoriteButton = true,
  compact = false,
}: LeagueCardProps) {
  const { isDark } = useTheme();
  const { isLeagueFavorite, toggleLeagueFavorite } = useFavorites();
  const router = useRouter();

  const isFavorite = isLeagueFavorite(league.idLeague);

  const cardBg = isDark ? "#161626" : "#ffffff";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const badgeBg = isDark ? "#1e1e34" : "#f1f5f9";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#a1a1aa" : "#64748b";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";
  const iconBg = isDark ? "#1e1e34" : "#f1f5f9";

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/league/${league.idLeague}`);
  };

  const handleFavoritePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleLeagueFavorite(league.idLeague);
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.75}
        style={{
          alignItems: "center",
          margin: 6,
          padding: 14,
          borderRadius: 16,
          backgroundColor: cardBg,
          width: 100,
          borderWidth: 1,
          borderColor: borderColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.07,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: badgeBg,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Image
            source={{
              uri: league.strBadge || league.strLogo || PLACEHOLDER_IMAGE,
            }}
            style={{ width: 38, height: 38 }}
            contentFit="contain"
          />
        </View>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: textPrimary,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {league.strLeague}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      style={{
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 18,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.35 : 0.07,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      {/* Content row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 14,
        }}
      >
        {/* Badge */}
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: badgeBg,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Image
            source={{
              uri: league.strBadge || league.strLogo || PLACEHOLDER_IMAGE,
            }}
            style={{ width: 42, height: 42 }}
            contentFit="contain"
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: textPrimary,
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {league.strLeague}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#22c55e",
              }}
            >
              {league.strCountry}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: textMuted,
                marginHorizontal: 6,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: textSecondary,
              }}
            >
              {league.strSport}
            </Text>
          </View>
          {league.strCurrentSeason && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={11}
                color={textMuted}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  color: textMuted,
                  fontWeight: "500",
                }}
              >
                Season {league.strCurrentSeason}
              </Text>
            </View>
          )}
        </View>

        {/* Favorite + Arrow */}
        <View style={{ alignItems: "center", gap: 8 }}>
          {showFavoriteButton && (
            <TouchableOpacity
              onPress={handleFavoritePress}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isFavorite
                  ? "rgba(245,158,11,0.15)"
                  : iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={isFavorite ? "star" : "star-outline"}
                size={17}
                color={isFavorite ? "#f59e0b" : textSecondary}
              />
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-forward" size={16} color={textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
