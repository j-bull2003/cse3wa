"use client";
import * as React from "react";
import { ThemeProvider as NextThemes } from "next-themes";

/** App-wide theming. Adds `class="dark"` to <html> when dark mode is active. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemes>
  );
}
