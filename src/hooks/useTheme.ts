import { useState, useEffect, useCallback } from "react";

export type ThemeType = "gold" | "emerald" | "editorial";

export interface ThemeOption {
  id: ThemeType;
  name: string;
  subtitle: string;
  badgeColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "gold",
    name: "Obsidian & Gold",
    subtitle: "Boutique Lujo",
    badgeColor: "#D8C593",
  },
  {
    id: "emerald",
    name: "Emerald Trust",
    subtitle: "Clínico Quirúrgico",
    badgeColor: "#10B981",
  },
  {
    id: "editorial",
    name: "Editorial Luxe",
    subtitle: "Odontología Estética",
    badgeColor: "#EAB308",
  },
];

const THEME_STORAGE_KEY = "crm_odontologo_theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
    if (saved && ["gold", "emerald", "editorial"].includes(saved)) {
      return saved;
    }
    return "gold";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    setTheme,
    themeOptions: THEME_OPTIONS,
  };
}

export default useTheme;
