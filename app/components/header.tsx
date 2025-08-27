"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import Hamburger from "./hamburger";

/* Brand + student badge */
const NAME = "Jessica Bull";
const STUDENT = process.env.NEXT_PUBLIC_STUDENT_NUMBER || "20963232";

/* Primary (always visible) vs Menu (inside hamburger) */
const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tabs", label: "Tabs" },
  { href: "/about", label: "About" },
];

const MENU_LINKS = [
  { href: "/todo", label: "Todo" },
  { href: "/play", label: "Play" },
  { href: "/blog", label: "Blog" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  /* Remember last visited page (90 days) */
  useEffect(() => {
    document.cookie = `last_menu=${pathname};path=/;max-age=${60 * 60 * 24 * 90}`;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/30 bg-black/40 backdrop-blur scanlines">
      <a href="#main" className="skip-link m-2 rounded">Skip to content</a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Badge + brand */}
        <div className="flex items-center gap-3">
          <span
            className="rounded-xl border border-cyan-400/40 bg-black/60 px-3 py-1 text-xs font-semibold text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,.35)]"
            aria-label={`${NAME} — Student number`}
            title={NAME}
          >
            {STUDENT}
          </span>
          <Link href="/" className="text-sm font-medium text-cyan-100">
            CSE3WA — Neon Showcase
          </Link>
        </div>

        {/* Primary inline nav + Theme + Hamburger */}
        <nav aria-label="Site navigation" className="flex items-center gap-2">
          {/* Primary links stay visible on all sizes */}
          <ul className="flex flex-wrap items-center gap-1">
            {PRIMARY_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm text-cyan-100 hover:bg-white/5 ${
                      active ? "underline decoration-cyan-400 underline-offset-4" : ""
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Hamburger + dropdown (MENU_LINKS only) */}
          <div className="relative">
            <Hamburger
              open={open}
              onToggle={() => setOpen((v) => !v)}
              controlsId={menuId}
              label="More"
            />

            <ul
              id={menuId}
              role="menu"
              className={`
                absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-black/75 p-2
                shadow-[0_0_30px_rgba(167,139,250,.35)]
                origin-top-right transform transition
                ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}
              `}
              onClick={() => setOpen(false)}
            >
              {MENU_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <li key={href} role="none">
                    <Link
                      role="menuitem"
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm text-cyan-100 hover:bg-white/5 ${
                        active ? "underline decoration-cyan-400 underline-offset-4" : ""
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
