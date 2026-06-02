"use client";

import type { Locale } from "@/lib/i18n";
import { getStarterPhaseBannerMessages } from "@/lib/jurisdictions/starter-phase-banner-i18n";

export function StarterPhaseBanner({
  locale,
  jurisdictionCountry,
}: {
  locale: Locale;
  jurisdictionCountry: string;
}) {
  const m = getStarterPhaseBannerMessages(locale);

  return (
    <div className="mb-6 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
        {m.eyebrow}
      </p>
      <p className="mt-1 text-sm text-white/75">
        {m.body(jurisdictionCountry)}
      </p>
    </div>
  );
}
