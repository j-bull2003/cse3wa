"use client";
import { ThemeProvider as NextThemes } from "next-themes";
import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{ light: "light", dark: "dark", crt: "crt" }} 
    >
      {children}
    </NextThemes>
  );
}
