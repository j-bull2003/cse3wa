"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

/* Syncs <meta name="theme-color"> to match the active theme. */
export default function ThemeColorMeta() {
  const { theme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
      ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "theme-color" }));
    const map: Record<string, string> = {
      light: "#f8fafc",
      dark:  "#030712",
      crt:   "#061b0a",   // matches --bg for CRT
    };
    meta.content = map[String(current ?? "light")] ?? "#ffffff";
  }, [current]);

  return null;
}
