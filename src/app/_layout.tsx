import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "../db/database";

const ACTIVE = "#5668D2";
const INACTIVE = "#A0A0A4";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="deck.db" onInit={initDatabase}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: "#F8F8FB",
          borderTopWidth: 0.4,
          borderTopColor: INACTIVE,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Deck",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "rectangle.stack", android: "style" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "gear", android: "settings" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
    </SQLiteProvider>
  );
}
