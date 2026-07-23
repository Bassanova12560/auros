import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { PrintReportButton } from "@/app/comparators/_components/PrintReportButton";
import {
  COMPARATOR_ROUTES,
  formatComparatorDate,
  formatLiquidity,
  formatMinInvestment,
  getComparatorMessages,
  getCompareHubPayload,
  parseCompareProductIdsParam,
} from "@/lib/comparators";
import { buildCompareDeskMailto } from "@/lib/comparators/desk-lead";
import {
  buildCompareDossierHref,
  COMPARE_REPORT_MIN,
} from "@/lib/comparators/compare-report";
import { getSponsoredSlot } from "@/lib/comparators/sponsored";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  localeFromCookieValue,
} from "@/lib/i18n";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(`${COMPARATOR_ROUTES.compare}/report`),
  title: "Compare Report | AUROS",
  description:
    "Indicative shareable compare report from your RWA shortlist — print or continue to dossier.",
  robots: { index: false, follow: true },
};

export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<{ compare?: string }>;
};

export default async function CompareReportPage({ searchParams }: PageProps) {
  const { compare } = await searchParams;
  const ids = parseCompareProductIdsParam(compare);
  const jar = await cookies();
  const locale =
    localeFromCookieValue(jar.get(LOCALE_STORAGE_KEY)?.value) ?? DEFAULT_LOCALE;
  const messages = getComparatorMessages(locale);
  const copy = messages.compareHub.report;
  const hub = messages.compareHub;

  const payload = await getCompareHubPayload();
  const byId = new Map(payload.products.map((p) => [p.row.id, p]));
  const products = ids
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const asOf = formatComparatorDate(payload.fetchedAt, locale);
  const dossierHref = buildCompareDossierHref(ids);
  const deskHref = buildCompareDeskMailto({
    productIds: ids,
    productLabels: products.map((p) => `${p.row.platform} · ${p.row.product}`),
    locale,
  });
  const backHref =
    COMPARATOR_ROUTES.compare +
    (ids.length ? `?compare=${ids.join(",")}` : "");

  return (
    <main className="page-main">
      <div className="page-inner page-inner--5xl mx-auto print:max-w-none">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/55">{copy.subtitle}</p>
            <p className="mt-2 font-mono text-[10px] text-white/35">
              {copy.asOf(asOf)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            {products.length >= COMPARE_REPORT_MIN ? (
              <PrintReportButton label={copy.print} />
            ) : null}
            <PrimaryButton
              href={dossierHref}
              className="!px-4 !py-2.5 !text-[11px]"
            >
              {copy.dossierCta}
            </PrimaryButton>
            {products.length >= COMPARE_REPORT_MIN ? (
              <a
                href={deskHref}
                className="rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/45"
              >
                {copy.deskCta}
              </a>
            ) : null}
          </div>
        </header>

        {products.length < COMPARE_REPORT_MIN ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <p className="text-sm text-white/60">{copy.empty}</p>
            <Link
              href={COMPARATOR_ROUTES.compare}
              className="mt-4 inline-block font-mono text-[11px] text-white/50 underline-offset-2 hover:underline"
            >
              {copy.back} →
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.product}
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.apy}
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.minInvestment}
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.liquidity}
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.jurisdiction}
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.source}
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {hub.comparePanel.rows.risk}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const sponsored = getSponsoredSlot(product.row.id);
                    return (
                      <tr
                        key={product.row.id}
                        className="border-b border-white/[0.05]"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">
                            {product.row.platform}
                          </p>
                          <p className="font-mono text-xs text-white/50">
                            {product.row.product}
                          </p>
                          {sponsored ? (
                            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-sky-200/80">
                              {sponsored.label === "sponsored"
                                ? hub.sponsored.badgeSponsored
                                : hub.sponsored.badgePartenariat}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 font-display tabular-nums text-white">
                          {product.row.apy > 0
                            ? `${product.row.apy.toFixed(2)}%`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">
                          {formatMinInvestment(product.meta.minInvestmentUsd)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">
                          {formatLiquidity(
                            product.meta.liquidityDays,
                            hub.liquidity
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">
                          {product.meta.jurisdiction ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">
                          {product.row.live
                            ? hub.filters.sourceLive
                            : hub.filters.sourceManual}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">
                          {messages.risk[product.riskTier]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 font-mono text-[10px] leading-relaxed text-white/35">
              {copy.indicative}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 print:hidden">
              <PrimaryButton href={dossierHref}>{copy.dossierCta}</PrimaryButton>
              <a
                href={deskHref}
                className="rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/60"
              >
                {copy.deskCta}
              </a>
              <Link
                href={backHref}
                className="rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/40"
              >
                {copy.back}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
