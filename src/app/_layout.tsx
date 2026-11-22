import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { SettingsProvider } from "../context/SettingsContext";
import { initDatabase } from "../db/database";
import { useColors } from "../hooks/useColors";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="deck.db" onInit={initDatabase}>
      <SettingsProvider>
        <AppStack />
      </SettingsProvider>
    </SQLiteProvider>
  );
}

// Separate component because useColors needs the settings from SettingsProvider
function AppStack() {
  const { colors, isDark } = useColors();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
