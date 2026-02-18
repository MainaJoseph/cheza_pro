import { Tabs } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/context/ThemeContext";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabIconProps {
  label: string;
  focused: boolean;
  icon: IoniconName;
  iconFocused: IoniconName;
  isDark: boolean;
}

function TabIcon({ label, focused, icon, iconFocused, isDark }: TabIconProps) {
  const activeColor = "#22c55e";
  const inactiveColor = isDark ? "#4b5563" : "#94a3b8";

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4,
      }}
    >
      <View
        style={{
          width: 44,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
          backgroundColor: focused
            ? isDark
              ? "rgba(34,197,94,0.15)"
              : "rgba(34,197,94,0.1)"
            : "transparent",
        }}
      >
        <Ionicons
          name={focused ? iconFocused : icon}
          size={22}
          color={focused ? activeColor : inactiveColor}
        />
      </View>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? "700" : "500",
          color: focused ? activeColor : inactiveColor,
          marginTop: 3,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { isDark } = useTheme();

  const tabBarBg = isDark ? "#0f0f1a" : "#ffffff";
  const borderColor = isDark ? "#1a1a2e" : "#e2e8f0";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 86 : 68,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 6,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 20,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: isDark ? "#4b5563" : "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Home"
              focused={focused}
              icon="home-outline"
              iconFocused="home"
              isDark={isDark}
            />
          ),
          tabBarButton: ({ children, style, onPress, accessibilityRole, accessibilityState, accessibilityLabel, testID }) => (
            <TouchableOpacity
              style={style}
              onPress={(e) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.(e);
              }}
              accessibilityRole={accessibilityRole}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              activeOpacity={1}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Matches"
              focused={focused}
              icon="football-outline"
              iconFocused="football"
              isDark={isDark}
            />
          ),
          tabBarButton: ({ children, style, onPress, accessibilityRole, accessibilityState, accessibilityLabel, testID }) => (
            <TouchableOpacity
              style={style}
              onPress={(e) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.(e);
              }}
              accessibilityRole={accessibilityRole}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              activeOpacity={1}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Teams"
              focused={focused}
              icon="trophy-outline"
              iconFocused="trophy"
              isDark={isDark}
            />
          ),
          tabBarButton: ({ children, style, onPress, accessibilityRole, accessibilityState, accessibilityLabel, testID }) => (
            <TouchableOpacity
              style={style}
              onPress={(e) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.(e);
              }}
              accessibilityRole={accessibilityRole}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              activeOpacity={1}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Saved"
              focused={focused}
              icon="bookmark-outline"
              iconFocused="bookmark"
              isDark={isDark}
            />
          ),
          tabBarButton: ({ children, style, onPress, accessibilityRole, accessibilityState, accessibilityLabel, testID }) => (
            <TouchableOpacity
              style={style}
              onPress={(e) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.(e);
              }}
              accessibilityRole={accessibilityRole}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              activeOpacity={1}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
