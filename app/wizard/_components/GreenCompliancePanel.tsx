"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { getGreenComplianceCopy } from "@/lib/green/compliance-i18n";
import type { GreenComplianceScore } from "@/lib/green/scoring/green-compliance";

import { GreenImpactReportCta } from "@/app/green/_components/GreenImpactReportCta";

type Props = {
  compliance: GreenComplianceScore;
  email?: string;
};

export function GreenCompliancePanel({ compliance, email }: Props) {
  const { locale } = useLocale();
  const copy = getGreenComplianceCopy(locale);

  useEffect(() => {
    track("green_compliance_view", {
      locale,
      score: compliance.eu_taxonomy_alignment,
    });
  }, [locale, compliance.eu_taxonomy_alignment]);

  return (
    <div className="mt-6 rounded-2xl border border-teal-500/35 bg-teal-500/[0.04] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400/80">
            {copy.panelEyebrow}
          </p>
          <p className="mt-1 text-sm text-neutral-300">
            {copy.assetClassLabels[compliance.asset_class]} {copy.alignmentSuffix}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular-nums text-teal-400">
            {compliance.eu_taxonomy_alignment}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{copy.taxonomyUnit}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3">
          <p className="text-xs text-neutral-500">{copy.sfdrLabel}</p>
          <p className="mt-1 text-sm font-medium text-teal-300">
            {copy.sfdrLabels[compliance.sfdr_classification]}
          </p>
        </div>
        <div className="rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3">
          <p className="text-xs text-neutral-500">{copy.gbsLabel}</p>
          <p className="mt-1 text-sm font-medium text-teal-300">
            {copy.gbsLabels[compliance.eu_gbs_eligible]}
          </p>
        </div>
      </div>

      {compliance.priority_keys.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm text-neutral-400">
          {compliance.priority_keys.map((key) => (
            <li key={key}>· {copy.priorities[key]}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">{copy.disclaimer}</p>

      <Link
        href="/green/csrd-check"
        className="mt-4 inline-flex text-xs uppercase tracking-wider text-teal-500/70 hover:text-teal-400"
      >
        {copy.csrdCheckLink}
      </Link>

      <GreenImpactReportCta email={email} compact />
    </div>
  );
}
