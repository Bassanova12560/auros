"use client";

import Link from "next/link";

import type { GreenComplianceScore } from "@/lib/green/scoring/green-compliance";

type Props = {
  compliance: GreenComplianceScore;
};

const SFDR_LABELS: Record<GreenComplianceScore["sfdr_classification"], string> = {
  article_6: "SFDR Article 6",
  article_8: "SFDR Article 8",
  article_9: "SFDR Article 9",
};

const GBS_LABELS: Record<GreenComplianceScore["eu_gbs_eligible"], string> = {
  eligible: "Éligible EU GBS",
  conditional: "EU GBS — sous conditions",
  not_eligible: "Hors EU Green Bond Standard",
};

const CLASS_LABELS: Record<GreenComplianceScore["asset_class"], string> = {
  renewable: "Énergie renouvelable",
  carbon: "Crédits carbone",
  green_bond: "Green bond",
  biodiversity: "Biodiversité",
  agriculture: "Agriculture durable",
  other_green: "Actif vert",
};

export function GreenCompliancePanel({ compliance }: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-teal-500/35 bg-teal-500/[0.04] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400/80">
            Green Score · EU Taxonomy
          </p>
          <p className="mt-1 text-sm text-neutral-300">
            {CLASS_LABELS[compliance.asset_class]} — alignement indicatif
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular-nums text-teal-400">
            {compliance.eu_taxonomy_alignment}
          </p>
          <p className="mt-1 text-xs text-neutral-400">/100 Taxonomy</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3">
          <p className="text-xs text-neutral-500">Classification SFDR</p>
          <p className="mt-1 text-sm font-medium text-teal-300">
            {SFDR_LABELS[compliance.sfdr_classification]}
          </p>
        </div>
        <div className="rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3">
          <p className="text-xs text-neutral-500">EU Green Bond Standard</p>
          <p className="mt-1 text-sm font-medium text-teal-300">
            {GBS_LABELS[compliance.eu_gbs_eligible]}
          </p>
        </div>
      </div>

      {compliance.priorities.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm text-neutral-400">
          {compliance.priorities.map((p) => (
            <li key={p}>· {p}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">{compliance.disclaimer}</p>

      <Link
        href="/green/csrd-check"
        className="mt-4 inline-flex text-xs uppercase tracking-wider text-teal-500/70 hover:text-teal-400"
      >
        Tester votre scope CSRD →
      </Link>
    </div>
  );
}
