"use client";
import { ThemeProvider as NextThemes } from "next-themes";
import * as React from "react";

/* Dark/Light theming; prefers system. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemes>
  );
}
