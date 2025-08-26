"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

/* Cyber header: hamburger + glowing badge (student #) + cookie memory. */
const NAME = "Jessica Bull";
const STUDENT = process.env.NEXT_PUBLIC_STUDENT_NUMBER || "20963232";

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/tabs", label: "Tabs" },
    { href: "/play", label: "Game" },
    { href: "/todo", label: "Todo" },
    { href: "/blog", label: "Blog" },
    { href: "/escape-room", label: "Escape Room" },
    { href: "/coding-races", label: "Coding Races" },
    { href: "/court-room", label: "Court Room" },
    { href: "/about", label: "About" },
  ];
  

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  /* Cookie: remember last nav path (90 days). */
  useEffect(() => {
    document.cookie = `last_menu=${pathname};path=/;max-age=${60 * 60 * 24 * 90}`;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/30 bg-black/40 backdrop-blur scanlines">
      <a href="#main" className="skip-link m-2 rounded">Skip to content</a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Student badge + brand */}
        <div className="flex items-center gap-3">
          <span
            className="rounded-xl border border-cyan-400/40 bg-black/60 px-3 py-1 text-xs font-semibold text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,.35)]"
            aria-label={`${NAME} — Student number`}
            title={`${NAME}`}
          >
            {STUDENT}
          </span>
          <Link href="/" className="text-sm font-medium text-cyan-100">
            CSE3WA — Neon Showcase
          </Link>
        </div>

        {/* Menu */}
        <nav aria-label="Main navigation">
          <button
            className="flex items-center gap-2 rounded-xl border border-violet-400/40 bg-black/40 px-3 py-2 text-sm text-violet-200 hover:bg-violet-500/10 md:hidden"
            aria-controls={menuId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            ☰ Menu
          </button>

          <ul
            id={menuId}
            className={`${open ? "block" : "hidden"} absolute right-4 mt-2 w-64 rounded-2xl border border-white/10 bg-black/75 p-2 shadow-[0_0_30px_rgba(167,139,250,.35)] md:static md:mt-0 md:flex md:w-auto md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
            onClick={() => setOpen(false)}
          >
            {LINKS.map(({ href, label }) => {
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
            <li className="px-2 py-2 md:py-0 md:pl-2"><ThemeToggle /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
