"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/* Small a11y toggle; now cycles light → dark → crt. */
export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Compute current after mount to avoid hydration mismatch
  const current = mounted ? (theme === "system" ? systemTheme : theme) : "light";

  function nextTheme(t: string | undefined) {
    if (t === "light") return "dark";
    if (t === "dark")  return "crt";
    return "light";
  }

  const label =
    current === "dark" ? "Switch to CRT theme"
    : current === "crt" ? "Switch to Light theme"
    : "Switch to Dark theme";

  const icon = current === "dark" ? "🟢" : current === "crt" ? "💡" : "🌙";

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="rounded-xl border px-3 py-2 text-sm border-slate-300 bg-white/60 text-slate-700
                   dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100"
        disabled
      >
        🌙
      </button>
    );
  }

  return (
    <button
      aria-label={label}
      className="rounded-xl border px-3 py-2 text-sm transition
                 border-slate-300 bg-white/60 text-slate-700 hover:bg-white/80
                 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-800/70
                 crt:border-emerald-500/50 crt:bg-emerald-950/40 crt:text-emerald-100"
      onClick={() => setTheme(nextTheme(String(current)))}
    >
      {icon}
    </button>
  );
}
