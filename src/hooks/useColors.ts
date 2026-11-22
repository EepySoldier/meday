import { useColorScheme } from "react-native";
import { darkCardColors, darkColors, lightCardColors, lightColors } from "../constants/colors";
import { useSettings } from "../context/SettingsContext";

export function useColors() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();

  let isDark = systemScheme === "dark";
  if (settings.theme === "light") isDark = false;
  if (settings.theme === "dark") isDark = true;

  return {
    colors: isDark ? darkColors : lightColors,
    cardColors: isDark ? darkCardColors : lightCardColors,
    isDark: isDark,
  };
}
