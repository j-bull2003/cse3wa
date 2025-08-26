"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Subtle, reserved carousel:
 * - Keyboard: ← → to navigate
 * - Dots + Prev/Next buttons (aria-labelled)
 * - Auto-advance (pauses on hover/focus)
 * - Pixel look comes from your global styles + Tailwind utilities
 */
type Item = { title: string; body: string; href?: string; cta?: string };

export default function Carousel({
  items,
  autoMs = 6000,
  label = "Featured slides",
}: {
  items: Item[];
  autoMs?: number;
  label?: string;
}) {
  const [i, setI] = useState(0);
  const total = items.length;
  const timer = useRef<number | null>(null);
  const paused = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  function go(n: number) {
    setI((v) => (n + total) % total);
  }
  function next() { go(i + 1); }
  function prev() { go(i - 1); }

  // Auto-advance (pause on hover/focus)
  useEffect(() => {
    if (autoMs <= 0) return;
    if (paused.current) return;
    timer.current = window.setTimeout(next, autoMs);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [i, autoMs]);

  // Keyboard
  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  }

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="border card rounded-none dark:border-slate-700 relative overflow-hidden"
      onKeyDown={onKey}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 will-change-transform"
        style={{ transform: `translateX(${-i * 100}%)` }}
        aria-live="polite"
      >
        {items.map((it, idx) => (
          <article
            key={idx}
            className="min-w-full"
            aria-hidden={idx !== i}
            tabIndex={-1}
          >
            <div className="grid gap-4 md:grid-cols-5 items-center">
              {/* Visual block (keeps height consistent) */}
              <div className="md:col-span-2 h-40 md:h-48 border rounded-none dark:border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900"></div>

              {/* Text */}
              <div className="md:col-span-3 space-y-2">
                <h3 className="text-lg md:text-xl font-semibold">{it.title}</h3>
                <p className="text-sm ">{it.body}</p>
                {it.href && (
                  <a
                    href={it.href}
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70 inline-block"
                  >
                    {it.cta ?? "Open →"}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Prev/Next controls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="pointer-events-auto btn"
        >
          ←
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="pointer-events-auto btn"
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}/${total}`}
            aria-current={idx === i ? "true" : undefined}
            onClick={() => go(idx)}
            className={`h-2 w-6 border rounded-none dark:border-slate-700 ${idx === i ? "bg-slate-400" : "bg-transparent hover:bg-slate-200/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
