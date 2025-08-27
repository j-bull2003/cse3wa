"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import Hamburger from "./hamburger";
import Kebab from "./kebab";

/* Always-visible links */
const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tabs", label: "Tabs" },
  { href: "/about", label: "About" },
];

/* Kebab (⋮): quick links */
const KEBAB_LINKS = [
  { href: "/todo", label: "Todo" },
  { href: "/play", label: "Play" },
  { href: "/blog", label: "Blog" },
];

/* Hamburger (☰): project pages */
const HAMBURGER_LINKS = [
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
];

/** Site navigation: primary links + theme + kebab + hamburger. */
export default function Navigation() {
  const [openMore, setOpenMore] = useState(false);   // hamburger
  const [openQuick, setOpenQuick] = useState(false); // kebab
  const moreId = useId();
  const quickId = useId();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  /* Remember last visited page (90 days) */
  useEffect(() => {
    document.cookie = `last_menu=${pathname};path=/;max-age=${60 * 60 * 24 * 90}`;
  }, [pathname]);

  /* Click outside closes menus */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setOpenMore(false);
        setOpenQuick(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <nav ref={navRef} aria-label="Site navigation" className="flex items-center gap-2">
      {/* Primary links (always visible) */}
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

      {/* Kebab (⋮) quick links */}
      <div className="relative">
        <Kebab
          open={openQuick}
          onToggle={() => {
            setOpenQuick((v) => !v);
            setOpenMore(false);
          }}
          controlsId={quickId}
          label="Quick"
        />
        <ul
          id={quickId}
          role="menu"
          className={`
            absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-black/80 p-2
            shadow-[0_0_30px_rgba(34,211,238,.35)]
            origin-top-right transform transition
            ${openQuick ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}
          `}
          onClick={() => setOpenQuick(false)}
        >
          {KEBAB_LINKS.map(({ href, label }) => {
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

      {/* Hamburger (☰) project pages */}
      <div className="relative">
        <Hamburger
          open={openMore}
          onToggle={() => {
            setOpenMore((v) => !v);
            setOpenQuick(false);
          }}
          controlsId={moreId}
          label="More"
        />
        <ul
          id={moreId}
          role="menu"
          className={`
            absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-black/75 p-2
            shadow-[0_0_30px_rgba(167,139,250,.35)]
            origin-top-right transform transition
            ${openMore ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}
          `}
          onClick={() => setOpenMore(false)}
        >
          {HAMBURGER_LINKS.map(({ href, label }) => {
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
  );
}
