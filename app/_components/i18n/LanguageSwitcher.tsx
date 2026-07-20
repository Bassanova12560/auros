"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
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
      className={`inline-flex flex-wrap items-center justify-end gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5 ${className}`}
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
            title={NATIVE[code]}
            className={`rounded-full px-1.5 py-1 font-mono text-[10px] tracking-wider transition sm:px-2 ${
              active
                ? "bg-white text-void"
                : "text-white/45 hover:text-white"
            }`}
            aria-pressed={active}
            aria-label={NATIVE[code]}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
