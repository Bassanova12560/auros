"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  COMPARATOR_REGISTRY,
  COMPARATOR_ROUTES,
} from "@/lib/comparators";
import { JURISDICTIONS_ROUTE } from "@/lib/jurisdictions";
import { useComparatorPage } from "./useComparatorPage";

export function ComparatorNavDropdown() {
  const pathname = usePathname();
  const { messages, tabLabel } = useComparatorPage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] text-white/55 transition hover:border-white/20 hover:text-white/80"
      >
        {messages.navDropdown.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={`transition ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-void/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          {COMPARATOR_REGISTRY.filter((entry) => !entry.soon).map((entry) => {
            const active = pathname === entry.href;

            return (
              <Link
                key={entry.id}
                href={entry.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 font-mono text-[11px] transition ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span>{tabLabel(entry.id)}</span>
                {active ? (
                  <span className="text-[9px] uppercase tracking-wider text-white/35">
                    {messages.navDropdown.current}
                  </span>
                ) : null}
              </Link>
            );
          })}

          <div className="my-1.5 h-px bg-white/[0.08]" aria-hidden />

          <Link
            href={JURISDICTIONS_ROUTE}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-mono text-[11px] transition ${
              pathname === JURISDICTIONS_ROUTE
                ? "bg-white/[0.08] text-white"
                : "text-white/55 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {messages.navDropdown.jurisdictions}
          </Link>

          <div className="my-1.5 h-px bg-white/[0.08]" aria-hidden />

          <Link
            href={COMPARATOR_ROUTES.compare}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`flex items-center justify-between rounded-xl px-3 py-2 font-mono text-[11px] transition ${
              pathname === COMPARATOR_ROUTES.compare
                ? "bg-white/[0.08] text-white"
                : "text-white/55 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {messages.navDropdown.compareAll}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
