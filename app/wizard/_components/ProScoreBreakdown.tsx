"use client";

import { useMemo } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { ScoreDimension } from "@/lib/protocol/scoring/rules";
import {
  computeUnifiedWizardScore,
  getScoreDimensionLabels,
} from "@/lib/wizard-scoring-unified";
import type { WizardData } from "@/lib/wizard-types";

type Props = {
  data: WizardData;
};

const DIMENSION_ORDER: ScoreDimension[] = [
  "legal_structure",
  "kyc_aml",
  "mica_compliance",
  "data_room",
  "investor_protection",
];

export function ProScoreBreakdown({ data }: Props) {
  const { locale } = useLocale();
  const labels = useMemo(() => getScoreDimensionLabels(locale), [locale]);
  const unified = useMemo(
    () => computeUnifiedWizardScore("pro", data, locale),
    [data, locale]
  );

  if (unified.mode !== "pro") return null;

  const { protocol, mica } = unified;
  const priorities = protocol.critical_gaps.slice(0, 3);

  return (
    <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        {locale === "fr" ? "5 dimensions" : "5 dimensions"}
      </p>
      <p className="mt-1 text-sm text-white/55">
        {locale === "fr"
          ? "Score institutionnel — détail par axe réglementaire."
          : "Institutional score — breakdown by regulatory axis."}
      </p>

      <div className="mt-5 space-y-3">
        {DIMENSION_ORDER.map((dim) => {
          const value = protocol.breakdown[dim];
          return (
            <div key={dim}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-white/65">{labels[dim]}</span>
                <span className="font-mono text-[11px] tabular-nums text-white/80">
                  {value}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-white/50"
                  style={{ width: `${Math.min(100, value)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {mica ? (
        <p className="mt-5 font-mono text-[10px] text-white/45">
          MiCA · {mica.score}/100
        </p>
      ) : null}

      {priorities.length > 0 ? (
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {locale === "fr" ? "3 priorités" : "3 priorities"}
          </p>
          <ul className="mt-3 space-y-2">
            {priorities.map((gap) => (
              <li
                key={gap}
                className="text-xs leading-relaxed text-white/55 before:mr-2 before:text-accent before:content-['·']"
              >
                {gap}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
