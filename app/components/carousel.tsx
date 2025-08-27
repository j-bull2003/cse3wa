"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

/** Slide item shape. imgSrc is optional; gradient renders if omitted. */
export type CarouselItem = {
  title: string;
  body: string;
  href?: string;
  cta?: string;
  imgSrc?: string | StaticImageData; 
  imgAlt?: string;  
};

export default function Carousel({
  items,
  autoMs = 6000,                    // 0 disables auto-advance
  label = "Featured slides",         // aria-label for screen readers
  onSlideChange,                     // optional callback(i)
}: {
  items: CarouselItem[];
  autoMs?: number;
  label?: string;
  onSlideChange?: (index: number) => void;
}) {
  const total = Math.max(0, items.length);
  const [i, setI] = useState(0);
  const baseId = useId();
  const timer = useRef<number | null>(null);
  const paused = useRef(false);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  // Change helpers
  const go = (n: number) => setI((v) => ((n % total) + total) % total);
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  // Auto-advance with pause on hover/focus
  useEffect(() => {
    if (autoMs <= 0 || total < 2 || paused.current) return;
    timer.current = window.setTimeout(next, autoMs);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, autoMs, total]);

  // Focus the active slide (improves SR + keyboard context)
  useEffect(() => {
    onSlideChange?.(i);
    const el = slideRefs.current[i];
    if (!el) return;
    // Defer focus until after transform finishes a bit
    const t = window.setTimeout(() => el.focus(), 160);
    return () => window.clearTimeout(t);
  }, [i, onSlideChange]);

  // Keyboard support at the component level
  function onKey(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "Home") { e.preventDefault(); go(0); }
    if (e.key === "End") { e.preventDefault(); go(total - 1); }
  }

  // Compose IDs for aria-controls / aria-labelledby
  const trackId = `${baseId}-track`;
  const slideId = (idx: number) => `${baseId}-slide-${idx}`;

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
      {/* Track: translateX by 100% per slide */}
      <div
        id={trackId}
        className="flex transition-transform duration-500 will-change-transform"
        style={{ transform: `translateX(${-i * 100}%)` }}
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((it, idx) => (
          <article
            key={idx}
            id={slideId(idx)}
            ref={(el: HTMLElement | null) => { slideRefs.current[idx] = el; }}
            className="min-w-full outline-none"
            aria-hidden={idx !== i}
            tabIndex={idx === i ? 0 : -1}
          >
            <div className="grid gap-4 md:grid-cols-5 items-center">
              {/* Visual */}
              <div className="relative md:col-span-2 h-40 md:h-48 border rounded-none dark:border-slate-700 overflow-hidden">
                {it.imgSrc ? (
                  <>
                    <Image
                      src={it.imgSrc}
                      alt={it.imgAlt ?? it.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                  </>
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
              </div>

              {/* Copy */}
              <div className="md:col-span-3 space-y-2">
                <h3 className="text-lg md:text-xl font-semibold">{it.title}</h3>
                <p className="text-sm">{it.body}</p>
                {it.href && (
                  <a
                    href={it.href}
                    className="btn hover:bg-slate-100/70 dark:hover:bg-slate-800/70 inline-block"
                    aria-describedby={slideId(idx)}
                  >
                    {it.cta ?? "Open →"}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Prev / Next */}
      {total > 1 && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="button"
              onClick={prev}
              aria-controls={trackId}
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
              aria-controls={trackId}
              aria-label="Next slide"
              className="pointer-events-auto btn"
            >
              →
            </button>
          </div>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-controls={trackId}
              aria-label={`Go to slide ${idx + 1} of ${total}`}
              aria-current={idx === i ? "true" : undefined}
              onClick={() => go(idx)}
              className={`h-2 w-6 border rounded-none dark:border-slate-700 ${
                idx === i ? "bg-slate-400" : "bg-transparent hover:bg-slate-200/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
