import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
}: SearchBarProps) {
  const { isDark } = useTheme();

  const bg = isDark ? "#161626" : "#ffffff";
  const borderColor = isDark ? "#252545" : "#e2e8f0";
  const iconBg = isDark ? "#1e1e34" : "#f1f5f9";
  const iconColor = isDark ? "#6b7280" : "#94a3b8";
  const textColor = isDark ? "#ffffff" : "#0f172a";

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onClear) onClear();
  };

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: bg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: value.length > 0 ? "rgba(34,197,94,0.4)" : borderColor,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        <Ionicons name="search-outline" size={16} color={iconColor} />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#4b5563" : "#94a3b8"}
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: "500",
          color: textColor,
          paddingVertical: 0,
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && onClear && (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.7}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: iconBg,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <Ionicons name="close" size={14} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}
