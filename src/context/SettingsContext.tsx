import { useSQLiteContext } from "expo-sqlite";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { defaultSettings, loadSettings, saveSetting, Settings } from "../db/settings";

type SettingsContextType = {
  settings: Settings;
  changeSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  changeSetting: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings(db).then((loaded) => setSettings(loaded));
  }, [db]);

  function changeSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((old) => {
      if (!old) return old;
      return { ...old, [key]: value };
    });
    saveSetting(db, key, value);
  }

  // Wait until the settings are loaded so the theme doesn't flash
  if (!settings) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ settings, changeSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
