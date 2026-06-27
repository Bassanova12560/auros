"use client";

import Link from "next/link";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { COMPARATOR_ROUTES } from "@/lib/comparators";
import { GREEN_INDEX_ROUTE } from "@/lib/green-index";
import {
  downloadUhiIndexCsv,
  formatUhiEditionLabel,
  getUhiIndexCopy,
  UHI_INDEX_FAQ,
  uhiIndexToCsv,
  type UhiIndexPayload,
} from "@/lib/uhi-index";

type Props = {
  payload: UhiIndexPayload;
};

export function UhiIndexView({ payload }: Props) {
  const { locale } = useLocale();
  const copy = getUhiIndexCopy(locale);
  const editionLabel = formatUhiEditionLabel(payload.editionIso, locale);

  function handleDownload() {
    const csv = uhiIndexToCsv(payload, copy.csvHeaders);
    downloadUhiIndexCsv(csv, payload.editionIso);
    track("uhi_index_csv_download", { edition: payload.editionIso });
  }

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-10 max-w-2xl text-center font-mono text-[11px] tracking-wide text-violet-400/70">
        {copy.editionLabel(editionLabel)}
      </p>
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section aria-labelledby="uhi-index-performance">
        <h2
          id="uhi-index-performance"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.performanceTitle}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.monthLabel}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-violet-300">
              {payload.indexPerformance.month_pct != null
                ? `${payload.indexPerformance.month_pct > 0 ? "+" : ""}${payload.indexPerformance.month_pct}%`
                : "—"}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.ytdLabel}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-violet-300">
              {payload.indexPerformance.ytd_pct != null
                ? `${payload.indexPerformance.ytd_pct > 0 ? "+" : ""}${payload.indexPerformance.ytd_pct}%`
                : "—"}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="uhi-index-metrics">
        <h2
          id="uhi-index-metrics"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.metricsTitle}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.catalogCount}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {payload.catalogCount}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              Méthodologie
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
              {payload.methodologyNote}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="uhi-index-top">
        <h2
          id="uhi-index-top"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.topTitle}
        </h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-violet-500/20">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-violet-500/30 font-mono text-[10px] uppercase tracking-wide text-violet-400/80">
                <th className="px-4 py-3 font-normal">{copy.table.rank}</th>
                <th className="px-4 py-3 font-normal">{copy.table.name}</th>
                <th className="px-4 py-3 font-normal">{copy.table.segment}</th>
                <th className="px-4 py-3 font-normal">{copy.table.uhi}</th>
                <th className="px-4 py-3 font-normal">{copy.table.watt}</th>
                <th className="px-4 py-3 font-normal">{copy.table.taxonomy}</th>
                <th className="px-4 py-3 font-normal">{copy.table.yield}</th>
                <th className="px-4 py-3 font-normal">{copy.table.mom}</th>
                <th className="px-4 py-3 font-normal">{copy.table.source}</th>
              </tr>
            </thead>
            <tbody>
              {payload.entries.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/[0.04] text-white/70 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-violet-400">{row.rank}</td>
                  <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                  <td className="px-4 py-3 text-white/50">
                    {copy.segments[row.segment] ?? row.segment}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-violet-300">
                    {row.uhi_score}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.watt_score ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.taxonomy_score ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.indicative_yield_pct != null
                      ? `${row.indicative_yield_pct}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-white/45">
                    {row.mom_pct != null ? `${row.mom_pct > 0 ? "+" : ""}${row.mom_pct}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-400/80 hover:text-violet-300"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="button" onClick={handleDownload}>
            {copy.downloadCsv}
          </PrimaryButton>
          <Link
            href={GREEN_INDEX_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            {copy.ctaGreenIndex}
          </Link>
          <Link
            href={COMPARATOR_ROUTES.compare}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            {copy.ctaCompare}
          </Link>
        </div>
      </section>

      <section aria-labelledby="uhi-index-segments">
        <h2
          id="uhi-index-segments"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.segmentsTitle}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {payload.segments.map((seg) => (
            <div key={seg.id} className="card-flat px-4 py-3">
              <p className="font-medium text-white/90">
                {copy.segments[seg.id] ?? seg.id}
              </p>
              <p className="mt-1 font-mono text-[10px] text-white/40">
                {copy.segmentCount}: {seg.count} · {copy.segmentAvgUhi}:{" "}
                {seg.avg_uhi ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ContentFaqList items={UHI_INDEX_FAQ} />
    </div>
  );
}
