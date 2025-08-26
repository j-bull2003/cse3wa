"use client";
import { useEffect, useId, useState } from "react";

/* Pretty, accessible tabs for in-site content (not the generator). */
export default function Tabs({
  items,
  initial = 0,
}: {
  items: { label: string; content: React.ReactNode }[];
  initial?: number;
}) {
  const [i, setI] = useState(initial);
  const group = useId();

  /* Keyboard: ← → Home End */
  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const max = items.length - 1;
    if (e.key === "ArrowRight") setI((v) => (v >= max ? 0 : v + 1));
    if (e.key === "ArrowLeft") setI((v) => (v <= 0 ? max : v - 1));
    if (e.key === "Home") setI(0);
    if (e.key === "End") setI(max);
  }

  useEffect(() => { /* you could persist active tab if needed */ }, [i]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--card)] p-3 shadow-[0_0_30px_rgba(34,211,238,.15)]">
      <div
        role="tablist"
        aria-label="Highlights"
        className="flex flex-wrap items-center gap-2"
        onKeyDown={onKey}
      >
        {items.map((t, idx) => (
          <button
            key={idx}
            id={`${group}-tab-${idx}`}
            role="tab"
            aria-selected={i === idx}
            aria-controls={`${group}-panel-${idx}`}
            tabIndex={i === idx ? 0 : -1}
            onClick={() => setI(idx)}
            className={`rounded-xl border px-3 py-2 text-sm transition ${
              i === idx
                ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,.35)]"
                : "border-white/10 text-cyan-100/70 hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {items.map((t, idx) => (
        <div
          key={idx}
          id={`${group}-panel-${idx}`}
          role="tabpanel"
          aria-labelledby={`${group}-tab-${idx}`}
          hidden={i !== idx}
          className="mt-3 text-cyan-100/90"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
