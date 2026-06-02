"use client";

import { resolveRiskTier, type RiskTier } from "@/lib/comparators/risk";
import type { ComparatorId } from "@/lib/comparators/registry";
import { useComparatorPage } from "./useComparatorPage";

const TIER_STYLES: Record<RiskTier, string> = {
  conservative:
    "border-sky-500/20 bg-sky-500/10 text-sky-200/90",
  core: "border-white/15 bg-white/[0.06] text-white/60",
  advanced:
    "border-amber-500/25 bg-amber-500/10 text-amber-200/90",
};

export function RiskBadge({
  comparatorId,
  category,
}: {
  comparatorId: ComparatorId;
  category: string;
}) {
  const { messages } = useComparatorPage();
  const tier = resolveRiskTier(comparatorId, category);
  const label = messages.risk[tier];

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${TIER_STYLES[tier]}`}
      title={messages.risk.badgeHint}
    >
      {label}
    </span>
  );
}
