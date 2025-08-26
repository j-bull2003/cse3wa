import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-providers";
import Header from "./components/header";
import Footer from "./components/footer";

/* App shell */
export const metadata: Metadata = {
  title: "CSE3WA — Neon Showcase",
  description:
    "Cool, hacky, techy Next.js site with tabs, game, todo, blog, and a Moodle-ready tabs generator.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Make base text theme-aware (light/dark) */}
      <body className="min-h-screen text-slate-900 dark:text-slate-100">
        {/* This toggles `class="dark"` on <html> */}
        <ThemeProvider>
          <Header />
          <main id="main" className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
