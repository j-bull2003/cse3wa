"use client";
import React from "react";

/** Kebab (⋮) menu button — rotates on open; center dot scales out. */
export default function Kebab({
  open,
  onToggle,
  controlsId,
  className = "",
  label = "Quick",
}: {
  open: boolean;
  onToggle: () => void;
  controlsId: string;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={open ? "Close quick menu" : "Open quick menu"}
      aria-expanded={open}
      aria-controls={controlsId}
      aria-haspopup="menu"
      onClick={onToggle}
      className={`group relative inline-flex h-9 w-10 items-center justify-center rounded-xl border px-3 py-2 text-sm transition
                  border-cyan-400/40 bg-black/50 text-cyan-100 hover:bg-white/10 ${className}`}
    >
      {/* Icon: three vertical dots; rotate on open */}
      <span
        aria-hidden
        className={`relative block h-5 w-5 transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
      >
        <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />
        <span
          className={`absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-transform duration-200
                      ${open ? "scale-0" : "scale-100"}`}
        />
        <span className="absolute left-1/2 bottom-0 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
