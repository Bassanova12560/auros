"use client";

import type { Locale } from "@/lib/i18n";
import { getStarterKitUiMessages } from "@/lib/jurisdictions/starter-kit-i18n";
import {
  formatJurisdictionLabel,
  personaHeadline,
  primaryJurisdictionId,
  projectValueLabel,
  secondaryJurisdictionIds,
} from "@/lib/jurisdictions/starter-kit-persona";

export function StarterKitJurisdictionHero({
  jurisdictions,
  projectType,
  projectValue,
  locale,
}: {
  jurisdictions: string[];
  projectType: string;
  projectValue: string | null;
  locale: Locale;
}) {
  const ui = getStarterKitUiMessages(locale);
  const primary = primaryJurisdictionId(jurisdictions);
  const secondary = secondaryJurisdictionIds(jurisdictions);
  const hadUnsure = jurisdictions.includes("unsure");
  const value = projectValueLabel(projectValue, locale);

  return (
    <section className="mb-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/70">
        {ui.jurisdictionHeroEyebrow}
      </p>
      <h2 className="mt-3 font-display text-xl font-semibold text-white md:text-2xl">
        {personaHeadline({ projectType, jurisdictions, projectValue, locale })}
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {ui.jurisdictionPrimaryLabel}
          </p>
          <p className="mt-2 text-lg font-medium text-white">
            {formatJurisdictionLabel(primary, locale)}
          </p>
          {value ? (
            <p className="mt-1 text-xs text-white/45">Ticket {value}</p>
          ) : null}
        </div>

        {secondary.length > 0 ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {ui.jurisdictionCompareLabel}
            </p>
            <p className="mt-2 text-sm text-white/75">
              {secondary.map((j) => formatJurisdictionLabel(j, locale)).join(" · ")}
            </p>
          </div>
        ) : null}
      </div>

      {hadUnsure ? (
        <p className="mt-4 text-xs text-white/45">{ui.jurisdictionUnsureNote}</p>
      ) : null}
    </section>
  );
}
