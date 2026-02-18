import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  "📅": "calendar-outline",
  "📊": "bar-chart-outline",
  "🏆": "trophy-outline",
  "🏟️": "business-outline",
  "⭐": "star-outline",
  "🔍": "search-outline",
  "📭": "mail-open-outline",
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export function EmptyState({ icon = "📭", title, message }: EmptyStateProps) {
  const { isDark } = useTheme();

  const iconName = ICON_MAP[icon] || "ellipsis-horizontal-circle-outline";
  const circleBg = isDark ? "#1a1a2e" : "#f1f5f9";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingVertical: 64,
      }}
    >
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: circleBg,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons name={iconName} size={40} color="#22c55e" />
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: textPrimary,
          textAlign: "center",
          marginBottom: 8,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </Text>

      {message && (
        <Text
          style={{
            fontSize: 14,
            color: textMuted,
            textAlign: "center",
            lineHeight: 20,
            fontWeight: "400",
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}
