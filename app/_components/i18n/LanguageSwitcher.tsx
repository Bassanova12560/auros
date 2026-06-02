"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

const LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher({
  className = "",
  ariaLabel = "Language",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5 ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
              active
                ? "bg-white text-void"
                : "text-white/45 hover:text-white"
            }`}
            aria-pressed={active}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
