"use client";

import Link from "next/link";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { RWA_INDEX_FAQ } from "@/lib/rwa-index/faq";
import {
  downloadRwaIndexCsv,
  rwaIndexToCsv,
  type RwaIndexPayload,
} from "@/lib/rwa-index";
import {
  formatApyDisplay,
  formatEditionLabel,
  formatFetchedDate,
  getRwaIndexCopy,
} from "@/lib/rwa-index/i18n";

type RwaIndexViewProps = {
  payload: RwaIndexPayload;
};

function yieldBarWidth(apy: number | null, maxScale = 15): number {
  if (apy === null || apy <= 0) return 0;
  return Math.min(100, (apy / maxScale) * 100);
}

export function RwaIndexView({ payload }: RwaIndexViewProps) {
  const { locale } = useLocale();
  const copy = getRwaIndexCopy(locale);
  const editionLabel = formatEditionLabel(payload.editionIso, locale);
  const fetchedLabel = formatFetchedDate(payload.dataFetchedAt, locale);

  const maxAvg =
    payload.categories.reduce((best, row) => {
      const avg = row.stats.average ?? 0;
      return avg > best ? avg : best;
    }, 0) || 15;

  function handleDownload() {
    const csv = rwaIndexToCsv(payload, copy.categories);
    downloadRwaIndexCsv(csv, payload.editionIso);
    track("rwa_index_csv_download", { edition: payload.editionIso });
  }

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-10 max-w-2xl text-center font-mono text-[11px] tracking-wide text-white/50">
        {copy.editionLabel(editionLabel)}
      </p>
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section aria-labelledby="rwa-index-metrics">
        <h2
          id="rwa-index-metrics"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.metricsTitle}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.totalProducts}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {payload.totalProducts}
            </p>
          </div>
          <div className="card-flat px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.activeJurisdictions}
            </p>
            <p className="mt-2 font-display text-3xl font-medium text-white">
              {payload.activeJurisdictions}
            </p>
          </div>
          <div className="card-flat px-5 py-4 sm:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
              {copy.dossierTrendsTitle}
            </p>
            <p className="mt-2 font-display text-base font-medium text-white/90">
              {copy.dossierTrendsValue(
                payload.dossierTrends.wizardStartsEstimate,
                payload.dossierTrends.monthOverMonthPct
              )}
            </p>
            <p className="mt-2 text-xs font-light text-white/40">
              {copy.dossierTrendsNote}
            </p>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] text-white/30">
          {copy.dataFreshness(fetchedLabel)}
        </p>
      </section>

      <section aria-labelledby="rwa-index-table">
        <h2
          id="rwa-index-table"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.tableTitle}
        </h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] font-mono text-[10px] uppercase tracking-wide text-white/35">
                <th className="px-4 py-3 font-normal">{copy.tableCategory}</th>
                <th className="px-4 py-3 font-normal">{copy.tableProducts}</th>
                <th className="px-4 py-3 font-normal">{copy.tableAvg}</th>
                <th className="px-4 py-3 font-normal">{copy.tableMin}</th>
                <th className="px-4 py-3 font-normal">{copy.tableMedian}</th>
                <th className="px-4 py-3 font-normal">{copy.tableMax}</th>
                <th className="px-4 py-3 font-normal" aria-hidden>
                  <span className="sr-only">Chart</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {payload.categories.map((row) => {
                const avg = row.stats.average;
                const barW = yieldBarWidth(avg, Math.max(maxAvg, 12));
                return (
                  <tr
                    key={row.id}
                    className="border-b border-white/[0.04] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={row.compareHref}
                        className="font-medium text-white/90 hover:text-white"
                      >
                        {copy.categories[row.id]}
                      </Link>
                      {row.isIllustrative ? (
                        <span className="ml-2 inline-block rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-white/40">
                          {copy.illustrativeBadge}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-white/55">{row.stats.productCount}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatApyDisplay(avg, locale)}
                    </td>
                    <td className="px-4 py-3 text-white/55">
                      {formatApyDisplay(row.stats.min, locale)}
                    </td>
                    <td className="px-4 py-3 text-white/55">
                      {formatApyDisplay(row.stats.median, locale)}
                    </td>
                    <td className="px-4 py-3 text-white/55">
                      {formatApyDisplay(row.stats.max, locale)}
                    </td>
                    <td className="px-4 py-3 w-28">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-emerald-500/70"
                          style={{ width: `${barW}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="rwa-index-methodology">
        <h2
          id="rwa-index-methodology"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.methodologyTitle}
        </h2>
        <ul className="mt-5 max-w-2xl space-y-3 text-sm font-light leading-relaxed text-white/55">
          {copy.methodologyBody.map((paragraph) => (
            <li key={paragraph.slice(0, 40)}>{paragraph}</li>
          ))}
        </ul>
        <div className="mt-8">
          <PrimaryButton type="button" onClick={handleDownload}>
            {copy.downloadCta}
          </PrimaryButton>
        </div>
      </section>

      <section aria-labelledby="rwa-index-related">
        <h2
          id="rwa-index-related"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.relatedTitle}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {copy.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="card-flat interactive-subtle block px-4 py-3 text-sm text-white/70 hover:text-white"
              >
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rwa-index-faq">
        <h2
          id="rwa-index-faq"
          className="font-mono text-[11px] tracking-wide text-white/45"
        >
          {copy.faqTitle}
        </h2>
        <div className="mt-5">
          <ContentFaqList items={RWA_INDEX_FAQ} />
        </div>
      </section>
    </div>
  );
}
