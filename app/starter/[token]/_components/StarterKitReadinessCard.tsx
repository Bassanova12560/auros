"use client";

import { useMemo } from "react";

import type { StarterKitContent } from "@/lib/jurisdictions/starter-kit-types";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";
import { starterKitMarketTotal, starterKitSavingsPercent } from "@/lib/jurisdictions/starter-kit-value";
import { computeStarterReadiness } from "@/lib/jurisdictions/starter-readiness";
import type { Locale } from "@/lib/i18n";

export function StarterKitReadinessCard({
  content,
  locale,
}: {
  content: StarterKitContent;
  locale: Locale;
}) {
  const readiness = useMemo(() => computeStarterReadiness(content), [content]);
  const m = getEnterpriseMessages(locale).readiness;
  const v = getEnterpriseMessages(locale).valueStack;
  const savings = starterKitSavingsPercent();

  const labelText =
    readiness.label === "structured"
      ? m.structured
      : readiness.label === "progressing"
        ? m.progressing
        : m.early;

  return (
    <aside className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {m.title}
          </p>
          <p className="mt-2 max-w-md text-sm text-white/55">{m.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            {m.scoreLabel}
          </p>
          <p className="font-display text-4xl tabular-nums text-white">
            {readiness.score}
            <span className="text-lg text-white/35">/100</span>
          </p>
          <p className="mt-1 text-xs text-emerald-300/80">{labelText}</p>
        </div>
      </div>

      <div
        className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={readiness.score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-emerald-400/70 transition-all"
          style={{ width: `${readiness.score}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-white/40">
        {m.checklistProgress(readiness.checklistDone, readiness.checklistTotal)}
      </p>
      <p className="mt-2 text-xs text-white/35">{m.jurisdictionNote}</p>
      <p className="mt-2 text-xs text-white/35">
        {v.totalMarket} ~{starterKitMarketTotal().toLocaleString(locale === "en" ? "en-GB" : "fr-FR")} € · {v.savings(savings)}
      </p>

      {readiness.priorities.length > 0 ? (
        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            {m.prioritiesTitle}
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/70">
            {readiness.priorities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </aside>
  );
}
