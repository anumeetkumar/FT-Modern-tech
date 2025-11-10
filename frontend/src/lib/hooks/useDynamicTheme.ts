// hooks/useDynamicTheme.ts
"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  [key: string]: string;
}

interface ThemeData {
  mode: ThemeMode;
  colors: ThemeColors;
}

// 🧠 Mock API function (you can later replace this with a real API call)
async function fetchThemeData(): Promise<ThemeData> {
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 500));

  // Dummy theme data (like you'd get from backend or user settings)
  return {
    mode: "light",
    colors: {
      "--primary": "#26bbed",
      "--secondary": "#ffffff",
      "--accent": "#333333",
      "--background": "#ffffff",
      "--foreground": "#000000",
      "--muted": "#666666",
      "--border": "#e5e5e5",
      "--success": "#22c55e",
      "--warning": "#f59e0b",
      "--error": "#ef4444",
    },
  };
}

// 🪄 Hook to dynamically apply theme colors
export function useDynamicTheme() {
  const [theme, setTheme] = useState<ThemeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await fetchThemeData();
        setTheme(data);
        applyTheme(data);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // 🎨 Function to apply colors to :root
  const applyTheme = (themeData: ThemeData) => {
    const root = document.documentElement;
    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (themeData.mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  };

  // 🧩 Allow manual theme update (e.g. user toggles)
  const updateTheme = (newTheme: ThemeData) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return { theme, loading, updateTheme };
}
