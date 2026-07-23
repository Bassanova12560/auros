"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  LOCALES,
  applyDocumentLocale,
  storeLocale,
  type Locale,
} from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

const LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
  ar: "ع",
  zh: "中",
};

const NATIVE: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  ar: "العربية",
  zh: "中文",
};

/**
 * Compact language control — one chip + menu.
 * Avoids wrapping 5 pills into a column on iPhone.
 */
export function LanguageSwitcher({
  className = "",
  ariaLabel = "Language",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectLocale(code: Locale) {
    if (code === locale) {
      setOpen(false);
      return;
    }
    setLocale(code);
    storeLocale(code);
    applyDocumentLocale(code);
    setOpen(false);
    // Full reload remounts client trees and lets the root layout re-read the
    // `auros_locale` cookie so hybrid RSC pages re-init in the new language.
    window.location.reload();
  }

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        className="inline-flex h-9 min-w-[3.25rem] items-center justify-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-2.5 font-mono text-[11px] tracking-wider text-white/75 transition hover:border-white/25 hover:text-white"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{LABELS[locale]}</span>
        <span
          className={`text-[8px] text-white/40 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute end-0 top-[calc(100%+6px)] z-50 min-w-[9.5rem] overflow-hidden rounded-xl border border-white/12 bg-void/95 py-1 shadow-none backdrop-blur-xl"
        >
          {LOCALES.map((code) => {
            const active = locale === code;
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                  }`}
                  onClick={() => selectLocale(code)}
                >
                  <span>{NATIVE[code]}</span>
                  <span className="font-mono text-[10px] tracking-wider text-white/35">
                    {LABELS[code]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
