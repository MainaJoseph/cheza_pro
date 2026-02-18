import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({
  message,
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const { isDark } = useTheme();

  const bg = fullScreen ? (isDark ? "#0f0f1a" : "#f8fafc") : "transparent";
  const cardBg = isDark ? "#161626" : "#ffffff";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const iconCircle = isDark ? "rgba(239,68,68,0.15)" : "#fef2f2";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onRetry) onRetry();
  };

  const content = (
    <View
      style={{
        marginHorizontal: 16,
        borderRadius: 20,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor,
        padding: 24,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: iconCircle,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Ionicons name="warning-outline" size={30} color="#ef4444" />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: textPrimary,
          textAlign: "center",
          marginBottom: 8,
          letterSpacing: -0.2,
        }}
      >
        Something went wrong
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: textMuted,
          textAlign: "center",
          marginBottom: onRetry ? 20 : 0,
          lineHeight: 19,
        }}
      >
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          onPress={handleRetry}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#22c55e",
            borderRadius: 24,
            paddingHorizontal: 28,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="refresh" size={15} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bg,
          justifyContent: "center",
          paddingVertical: 32,
        }}
      >
        {content}
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 16 }}>{content}</View>
  );
}
