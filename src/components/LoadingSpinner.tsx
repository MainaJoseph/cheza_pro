import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface SkeletonBlockProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  shimmerAnim: Animated.Value;
}

function SkeletonBlock({
  width,
  height,
  borderRadius = 8,
  shimmerAnim,
}: SkeletonBlockProps) {
  const { isDark } = useTheme();
  const baseBg = isDark ? "#1e1e34" : "#e2e8f0";
  const highlightBg = isDark ? "#2a2a48" : "#f1f5f9";

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [baseBg, highlightBg],
  });

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
      }}
    />
  );
}

interface LoadingSpinnerProps {
  size?: "small" | "large";
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const cardBg = isDark ? "#161626" : "#ffffff";
  const borderColor = isDark ? "#252545" : "#e2e8f0";

  const SkeletonMatchCard = () => (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 18,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <View
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonBlock width={120} height={12} shimmerAnim={shimmerAnim} />
        <SkeletonBlock width={60} height={12} shimmerAnim={shimmerAnim} />
      </View>
      {/* Body */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center", gap: 8 }}>
          <SkeletonBlock width={60} height={60} borderRadius={30} shimmerAnim={shimmerAnim} />
          <SkeletonBlock width={70} height={12} shimmerAnim={shimmerAnim} />
        </View>
        <SkeletonBlock width={80} height={44} borderRadius={14} shimmerAnim={shimmerAnim} />
        <View style={{ alignItems: "center", gap: 8 }}>
          <SkeletonBlock width={60} height={60} borderRadius={30} shimmerAnim={shimmerAnim} />
          <SkeletonBlock width={70} height={12} shimmerAnim={shimmerAnim} />
        </View>
      </View>
    </View>
  );

  const SkeletonTeamCard = () => (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 18,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <SkeletonBlock width={58} height={58} borderRadius={29} shimmerAnim={shimmerAnim} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBlock width="70%" height={14} shimmerAnim={shimmerAnim} />
        <SkeletonBlock width="50%" height={12} shimmerAnim={shimmerAnim} />
        <SkeletonBlock width="40%" height={11} shimmerAnim={shimmerAnim} />
      </View>
      <SkeletonBlock width={36} height={36} borderRadius={18} shimmerAnim={shimmerAnim} />
    </View>
  );

  const content = (
    <View style={{ paddingTop: fullScreen ? 60 : 16 }}>
      <SkeletonMatchCard />
      <SkeletonMatchCard />
      <SkeletonTeamCard />
      <SkeletonTeamCard />
      <SkeletonTeamCard />
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? "#0f0f1a" : "#f8fafc",
        }}
      >
        {content}
      </View>
    );
  }

  return content;
}
