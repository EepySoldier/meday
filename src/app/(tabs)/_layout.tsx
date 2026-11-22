import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { fonts } from "../../constants/fonts";
import { useColors } from "../../hooks/useColors";

export default function TabsLayout() {
  const { colors } = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0.4,
          borderTopColor: colors.tabInactive,
          elevation: 0,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Deck",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "albums" : "albums-outline"} size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
