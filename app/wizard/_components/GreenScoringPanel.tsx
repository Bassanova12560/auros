"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { GREEN_COMPARE_ROUTE } from "@/lib/green/constants";
import {
  formatCqsTierLabel,
  formatWattTierLabel,
  getGreenScoringCopy,
} from "@/lib/green/scoring-i18n";
import { formatLifetimeGwh } from "@/lib/green/scoring/watt-score";
import type { WizardGreenScores } from "@/lib/green/scoring/wizard-green-scores";

type Props = {
  scores: WizardGreenScores;
};

export function GreenScoringPanel({ scores }: Props) {
  const { locale } = useLocale();
  const copy = getGreenScoringCopy(locale);

  useEffect(() => {
    track("green_scoring_view", {
      locale,
      watt: scores.watt?.rating ?? null,
      cqs: scores.carbon_quality?.score ?? null,
    });
  }, [locale, scores]);

  return (
    <div className="mt-6 rounded-2xl border border-emerald-500/35 bg-emerald-500/[0.04] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
        {copy.panelEyebrow}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {scores.watt ? (
          <div className="rounded-xl border border-emerald-500/25 bg-black/40 px-4 py-4">
            <p className="text-xs text-neutral-500">{copy.wattLabel}</p>
            <p className="mt-1 font-mono text-3xl tabular-nums text-emerald-400">
              {scores.watt.rating}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {copy.wattUnit} · {formatWattTierLabel(scores.watt.tier, locale)}
            </p>
            {scores.watt.lifetime_gwh != null ? (
              <p className="mt-3 text-xs text-neutral-500">
                {copy.lifetimeLabel}:{" "}
                <span className="text-neutral-300">
                  {formatLifetimeGwh(scores.watt.lifetime_gwh)}
                </span>
              </p>
            ) : null}
            {scores.watt.energy_value_eur != null ? (
              <p className="mt-1 text-xs text-neutral-500">
                {copy.energyValueLabel}:{" "}
                <span className="text-neutral-300">
                  {scores.watt.energy_value_eur.toLocaleString(locale === "fr" ? "fr-FR" : "en-GB")} €
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        {scores.carbon_quality ? (
          <div className="rounded-xl border border-emerald-500/25 bg-black/40 px-4 py-4">
            <p className="text-xs text-neutral-500">{copy.cqsLabel}</p>
            <p className="mt-1 font-mono text-3xl tabular-nums text-emerald-400">
              {scores.carbon_quality.score}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {copy.cqsUnit} ·{" "}
              {formatCqsTierLabel(scores.carbon_quality.tier, locale)}
            </p>
          </div>
        ) : null}
      </div>

      {scores.priority_keys.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-medium text-neutral-400">{copy.prioritiesTitle}</p>
          <ul className="mt-2 space-y-2 text-sm text-neutral-400">
            {scores.priority_keys.map((key) => (
              <li key={key}>· {copy.priorities[key]}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">{copy.disclaimer}</p>

      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          href={GREEN_COMPARE_ROUTE}
          className="text-xs uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
        >
          {copy.compareLink}
        </Link>
        <Link
          href="/green/api"
          className="text-xs uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
        >
          {copy.apiLink}
        </Link>
      </div>
    </div>
  );
}
