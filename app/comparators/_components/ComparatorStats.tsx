"use client";

import { useComparatorPage } from "./useComparatorPage";
import {
  formatSummaryTvl,
  type ComparatorSummary,
} from "@/lib/comparators/stats";
import { formatComparatorDate } from "@/lib/comparators/i18n";
import { getPageCopy } from "@/lib/comparators/page-copy";
import type { ComparatorPageId } from "@/lib/comparators/constants";

type ComparatorStatsProps = {
  pageId: ComparatorPageId;
  summary: ComparatorSummary;
  fetchedAt: string;
  source: "live" | "fallback";
  className?: string;
};

export function ComparatorStats({
  pageId,
  summary,
  fetchedAt,
  source,
  className = "",
}: ComparatorStatsProps) {
  const { locale, messages } = useComparatorPage();
  const labels = getPageCopy(messages, pageId).stats;
  const updated = formatComparatorDate(fetchedAt, locale);
  const best = summary.bestApy;

  return (
    <div className={className}>
      {/* Mobile — hero APY + 2 cols */}
      <div className="grid gap-2 md:hidden">
        <StatCell
          label={labels.bestApy}
          value={best ? `${best.apy.toFixed(2)}%` : "—"}
          detail={best ? `${best.platform} · ${best.product}` : undefined}
          highlight
          mobile
        />
        <div className="grid grid-cols-2 gap-2">
          <StatCell
            label={labels.totalTvl}
            value={formatSummaryTvl(summary.totalTvlUsd)}
            detail={labels.protocols(summary.platformCount)}
            mobile
          />
          <StatCell
            label={labels.products}
            value={String(summary.productCount)}
            detail={
              source === "live"
                ? labels.liveSource(updated)
                : labels.cacheSource(updated)
            }
            mobile
          />
        </div>
      </div>

      {/* Desktop — 3 cols */}
      <div className="hidden gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06] md:grid md:grid-cols-3">
        <StatCell
          label={labels.bestApy}
          value={best ? `${best.apy.toFixed(2)}%` : "—"}
          detail={best ? `${best.platform} · ${best.product}` : undefined}
          highlight
        />
        <StatCell
          label={labels.totalTvl}
          value={formatSummaryTvl(summary.totalTvlUsd)}
          detail={labels.protocols(summary.platformCount)}
        />
        <StatCell
          label={labels.products}
          value={String(summary.productCount)}
          detail={
            source === "live"
              ? labels.liveSource(updated)
              : labels.cacheSource(updated)
          }
        />
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  detail,
  highlight,
  mobile,
}: {
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
  mobile?: boolean;
}) {
  const shell = mobile
    ? `rounded-xl border border-white/[0.08] px-4 py-3.5 ${
        highlight ? "border-white/15 bg-white/[0.04]" : "bg-white/[0.02]"
      }`
    : `px-5 py-4 ${highlight ? "bg-white/[0.04]" : "bg-surface/80"}`;

  return (
    <div className={shell}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>
      <p
        className={`mt-1 font-display tabular-nums tracking-tight text-white ${
          highlight
            ? "text-3xl md:text-3xl"
            : mobile
              ? "text-xl"
              : "text-xl md:text-2xl"
        }`}
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-1 truncate font-mono text-[10px] text-white/40">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
