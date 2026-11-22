export const lightColors = {
  background: "#F4F4F7",
  surface: "#FFFFFF",
  sheet: "#F2F2F7",
  text: "#1C1C1E",
  textSecondary: "#6E6E73",
  textTertiary: "#A0A0A4",
  border: "#E3E3E8",
  primary: "#0066CC",
  onPrimary: "#FFFFFF",
  danger: "#D70015",
  chip: "#E9E9EE",
  overlay: "rgba(0, 0, 0, 0.4)",
  cardIconBox: "rgba(255, 255, 255, 0.7)",
  cardButton: "rgba(255, 255, 255, 0.6)",
  tabBar: "#F8F8FB",
  tabActive: "#5668D2",
  tabInactive: "#A0A0A4",
};

export const darkColors = {
  background: "#121214",
  surface: "#1E1E21",
  sheet: "#121214",
  text: "#F2F2F7",
  textSecondary: "#9A9AA0",
  textTertiary: "#6E6E73",
  border: "#2E2E33",
  primary: "#3D8BFF",
  onPrimary: "#FFFFFF",
  danger: "#FF453A",
  chip: "#2A2A2E",
  overlay: "rgba(0, 0, 0, 0.6)",
  cardIconBox: "rgba(255, 255, 255, 0.12)",
  cardButton: "rgba(255, 255, 255, 0.1)",
  tabBar: "#1A1A1D",
  tabActive: "#7D8CF0",
  tabInactive: "#6E6E73",
};

export type Colors = typeof lightColors;

// The names are saved in the database, the hex values are only for drawing
export const cardColorNames = ["peach", "mint", "blue", "lavender", "pink", "yellow"];

export const lightCardColors: Record<string, string> = {
  peach: "#FBE5D3",
  mint: "#DDF0E4",
  blue: "#DCE8F8",
  lavender: "#E7E2F7",
  pink: "#F8E0E5",
  yellow: "#F8F0D2",
};

export const darkCardColors: Record<string, string> = {
  peach: "#4A3A2E",
  mint: "#2E4236",
  blue: "#2C3A4D",
  lavender: "#3A3550",
  pink: "#4A3036",
  yellow: "#4A4430",
};
