"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/* Small a11y toggle; emoji keeps deps tiny. */
export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded-xl border border-cyan-500/40 bg-black/30 px-3 py-2 text-sm text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,.35)] hover:bg-cyan-500/10"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
    >
      {mounted && current === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
