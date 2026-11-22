import { SQLiteDatabase } from "expo-sqlite";

export type Settings = {
  showButtons: boolean;
  shuffle: boolean;
  timerSound: "chime" | "none";
  vibration: boolean;
  keepAwake: boolean;
  theme: "system" | "light" | "dark";
};

export const defaultSettings: Settings = {
  showButtons: true,
  shuffle: false,
  timerSound: "chime",
  vibration: true,
  keepAwake: true,
  theme: "system",
};

// Settings are saved as key/value text, so booleans are "true"/"false"
export async function loadSettings(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    "SELECT key, value FROM settings"
  );

  const settings: Settings = { ...defaultSettings };
  for (const row of rows) {
    if (row.key === "showButtons") settings.showButtons = row.value === "true";
    if (row.key === "shuffle") settings.shuffle = row.value === "true";
    if (row.key === "vibration") settings.vibration = row.value === "true";
    if (row.key === "keepAwake") settings.keepAwake = row.value === "true";
    if (row.key === "timerSound") settings.timerSound = row.value as Settings["timerSound"];
    if (row.key === "theme") settings.theme = row.value as Settings["theme"];
  }
  return settings;
}

export async function saveSetting(
  db: SQLiteDatabase,
  key: keyof Settings,
  value: string | boolean
) {
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
    key,
    String(value)
  );
}
