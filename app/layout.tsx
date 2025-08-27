import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-providers";
import Header from "./components/header";
import Footer from "./components/footer";

import ThemeColorMeta from "./components/theme-color";
/* App shell */
export const metadata: Metadata = {
  title: "CSE3WA",
  description:
    "Cool, hacky, techy Next.js site with tabs, game, todo, blog, and a Moodle-ready tabs generator.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Make base text theme-aware (light/dark) */}
      <body className="min-h-screen">
        <ThemeProvider>
        <ThemeColorMeta /> 
          <Header />
          <main id="main" className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
