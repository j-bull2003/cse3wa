"use client";
import React from "react";

/** Accessible hamburger. Three bars morph to an X via transforms. */
export default function Hamburger({
  open,
  onToggle,
  controlsId,
  className = "",
  label = "More",
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
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={controlsId}
      onClick={onToggle}
      className={`group relative inline-flex h-9 w-11 items-center justify-center rounded-xl border px-3 py-2 text-sm transition
                  border-cyan-400/40 bg-black/50 text-cyan-100 hover:bg-white/10 ${className}`}
    >
      <span aria-hidden className="relative block h-4 w-5">
        <span
          className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-300
                      ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current transition-opacity duration-200
                      ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`absolute left-0 bottom-0 h-0.5 w-full bg-current transition-transform duration-300
                      ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
