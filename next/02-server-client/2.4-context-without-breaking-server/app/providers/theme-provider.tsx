"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { createLocalStorageStore } from "@/lib/local-storage-store";

type Theme = "light" | "dark";

const themeStore = createLocalStorageStore<Theme>("theme", "light");
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggle() {
    themeStore.set(theme === "dark" ? "light" : "dark");
  }

  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
