"use client";
import * as React from "react";
import { ThemeProvider as NextThemes } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      /* Map theme names → class names on <html> */
      value={{ light: "light", dark: "dark", crt: "crt" }}
    >
      {children}
    </NextThemes>
  );
}
