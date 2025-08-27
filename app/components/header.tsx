"use client";
import Link from "next/link";
import Navigation from "./navigation";

/* Header shell: student badge + brand + injected Navigation */
const NAME = "Jessica Bull";
const STUDENT = process.env.NEXT_PUBLIC_STUDENT_NUMBER || "20963232";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/30 bg-black/40 backdrop-blur scanlines">
      <a href="#main" className="skip-link m-2 rounded">Skip to content</a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Student badge + brand */}
        <div className="flex items-center gap-3">
          <span
            className="rounded-xl border border-cyan-400/40 bg-black/60 px-3 py-1 text-xs font-semibold text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,.35)]"
            aria-label={`${NAME} — Student number`}
            title={NAME}
          >
            {STUDENT}
          </span>
          <Link href="/" className="text-sm font-medium text-cyan-100">
            CSE3WA
          </Link>
        </div>

        {/* Navigation (primary + kebab + hamburger + theme) */}
        <Navigation />
      </div>
    </header>
  );
}
