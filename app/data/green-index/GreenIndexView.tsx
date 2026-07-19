"use client";

import Link from "next/link";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import {
  AUROS_WIZARD_ROUTE,
  GREEN_COMPARE_ROUTE,
} from "@/lib/green/constants";
import {
  downloadGreenIndexCsv,
  getGreenIndexCopy,
  GREEN_INDEX_FAQ,
  greenIndexToCsv,
  formatGreenEditionLabel,
  type GreenIndexPayload,
} from "@/lib/green-index";

type Props = {
  payload: GreenIndexPayload;
};

export function GreenIndexView({ payload }: Props) {
  const { locale } = useLocale();
  const copy = getGreenIndexCopy(locale);
  const editionLabel = formatGreenEditionLabel(payload.editionIso, locale);

  function handleDownload() {
    const csv = greenIndexToCsv(payload, copy.csvHeaders);
    downloadGreenIndexCsv(csv, payload.editionIso);
    track("green_index_csv_download", { edition: payload.editionIso });
  }

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-10 max-w-2xl text-center font-mono text-[11px] tracking-wide text-emerald-400/70">
        {copy.editionLabel(editionLabel)}
      </p>
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section aria-labelledby="green-index-metrics">
        <h2
          id="green-index-metrics"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.metricsTitle}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.references}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {payload.referenceCount}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.registryVerified}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {payload.registryVerifiedCount}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              CQS / Watt
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
              {payload.methodologyNote}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="green-index-top">
        <h2
          id="green-index-top"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.topTitle}
        </h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-500/20">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-500/30 font-mono text-[10px] uppercase tracking-wide text-emerald-500/80">
                <th className="px-4 py-3 font-normal">{copy.table.rank}</th>
                <th className="px-4 py-3 font-normal">{copy.table.name}</th>
                <th className="px-4 py-3 font-normal">{copy.table.type}</th>
                <th className="px-4 py-3 font-normal">{copy.table.composite}</th>
                <th className="px-4 py-3 font-normal">{copy.table.taxonomy}</th>
                <th className="px-4 py-3 font-normal">{copy.table.cqs}</th>
                <th className="px-4 py-3 font-normal">{copy.table.watt}</th>
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
                  <td className="px-4 py-3 font-mono text-emerald-400">{row.rank}</td>
                  <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                  <td className="px-4 py-3 text-white/50">
                    {copy.projectTypes[row.type] ?? row.type}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-emerald-400">
                    {row.composite_score}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.taxonomy_score ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.carbon_quality_score ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.watt_score ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-white/45">
                    {row.mom_pct != null ? `${row.mom_pct > 0 ? "+" : ""}${row.mom_pct}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-500/80 hover:text-emerald-400"
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
            href="/data/terminal"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            Data Terminal →
          </Link>
          <Link
            href="/data/licence"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            Licence →
          </Link>
          <Link
            href="/data/nature-score"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            Nature Score Index →
          </Link>
          <Link
            href="/data/uhi-index"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            AUROS UHI Index →
          </Link>
          <Link
            href={GREEN_COMPARE_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            {copy.ctaCompare}
          </Link>
          <Link
            href={`${AUROS_WIZARD_ROUTE}?type=green`}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
          >
            {copy.ctaWizard}
          </Link>
        </div>
      </section>

      <section aria-labelledby="green-index-segments">
        <h2
          id="green-index-segments"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.segmentsTitle}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {payload.segments.map((seg) => (
            <div key={seg.id} className="card-flat px-4 py-3">
              <p className="font-medium text-white/90">
                {copy.projectTypes[seg.id] ?? seg.id}
              </p>
              <p className="mt-1 font-mono text-[10px] text-white/40">
                {copy.segmentCount}: {seg.count} · {copy.segmentAvgComposite}:{" "}
                {seg.avg_composite ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ContentFaqList items={GREEN_INDEX_FAQ} />
    </div>
  );
}
