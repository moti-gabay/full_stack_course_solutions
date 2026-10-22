export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const dictionary = {
  he: {
    home: "דף הבית",
    welcome: "ברוכים הבאים",
    dashboard: "דשבורד",
    dashboardText: "הגעתם לכאן כי יש לכם cookie של session.",
    login: "התחברות",
    loginButton: "התחברות (יוצר cookie של session)",
    logout: "התנתקות",
  },
  en: {
    home: "Home",
    welcome: "Welcome",
    dashboard: "Dashboard",
    dashboardText: "You are here because you have a session cookie.",
    login: "Log in",
    loginButton: "Log in (sets a session cookie)",
    logout: "Log out",
  },
} satisfies Record<Locale, Record<string, string>>;
