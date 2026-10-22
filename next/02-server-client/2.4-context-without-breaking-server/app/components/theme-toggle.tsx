"use client";

import { useTheme } from "@/app/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle} className="rounded border px-3 py-1">
      {theme === "dark" ? "☀️ מצב בהיר" : "🌙 מצב כהה"}
    </button>
  );
}
