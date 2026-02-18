import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    isFavorite: boolean;
    onPress: () => void;
  };
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const isHome = title === "Cheza Pro";

  const bg = isDark ? "#0f0f1a" : "#ffffff";
  const borderColor = isDark ? "#1e1e32" : "#e2e8f0";
  const iconBg = isDark ? "#1a1a2e" : "#f1f5f9";
  const textColor = isDark ? "#ffffff" : "#0f172a";
  const iconColor = isDark ? "#e2e8f0" : "#1e293b";

  return (
    <View
      style={{
        backgroundColor: bg,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        {/* Left side */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: iconBg,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="chevron-back" size={22} color={iconColor} />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>
            {isHome ? (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                        fontSize: 14,
                        fontWeight: "800",
                        color: "#fff",
                        letterSpacing: 0.5,
                      }}
                    >
                      CHEZA
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "800",
                      color: textColor,
                      letterSpacing: -0.5,
                    }}
                  >
                    Pro
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#22c55e",
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "600",
                      color: "#22c55e",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Live Sports Tracker
                  </Text>
                </View>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: textColor,
                  letterSpacing: -0.3,
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
          </View>
        </View>

        {/* Right side */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {rightAction && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                rightAction.onPress();
              }}
              activeOpacity={0.7}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: rightAction.isFavorite
                  ? "rgba(245,158,11,0.15)"
                  : iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={rightAction.isFavorite ? "star" : "star-outline"}
                size={19}
                color={rightAction.isFavorite ? "#f59e0b" : isDark ? "#a1a1aa" : "#64748b"}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleThemeToggle}
            activeOpacity={0.7}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={18}
              color={isDark ? "#a78bfa" : "#f59e0b"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
