"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import {
  prefillFromCostEstimator,
  saveWizardPrefill,
} from "@/lib/wizard-prefill";
import { COST_ESTIMATOR_FAQ } from "@/lib/cost-estimator/faq";
import {
  COST_ASSET_ORDER,
  DEAL_SIZE_ORDER,
  getCostEstimatorCopy,
} from "@/lib/cost-estimator/i18n";
import {
  JURISDICTION_IDS,
  computeCostEstimate,
  formatCostEur,
} from "@/lib/cost-estimator/estimates";
import type {
  CostAssetType,
  DealSizeRange,
  JurisdictionChoice,
} from "@/lib/cost-estimator/types";
import { getJurisdictionMessages, jurisdictionLabel } from "@/lib/jurisdictions/i18n";

function localeTag(locale: string): string {
  if (locale === "en") return "en-GB";
  if (locale === "es") return "es-ES";
  return "fr-FR";
}

export function CostEstimatorView() {
  const { locale } = useLocale();
  const copy = getCostEstimatorCopy(locale);
  const fmtLocale = localeTag(locale);
  const jurisdictionMessages = getJurisdictionMessages(locale);

  const [assetType, setAssetType] = useState<CostAssetType>("real_estate");
  const [dealSize, setDealSize] = useState<DealSizeRange>("500k_2m");
  const [jurisdiction, setJurisdiction] = useState<JurisdictionChoice>("recommend");

  const estimate = useMemo(
    () => computeCostEstimate({ assetType, dealSize, jurisdiction }),
    [assetType, dealSize, jurisdiction]
  );

  const jurisdictionName = jurisdictionLabel(
    jurisdictionMessages,
    estimate.jurisdictionId
  );

  const setupLines = estimate.breakdown;

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section className="mx-auto max-w-2xl" aria-live="polite">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="cost-asset"
                className="font-display text-sm font-medium text-white"
              >
                {copy.assetLabel}
              </label>
              <p className="mt-1 text-xs text-white/45">{copy.assetHint}</p>
              <select
                id="cost-asset"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as CostAssetType)}
                className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              >
                {COST_ASSET_ORDER.map((id) => (
                  <option key={id} value={id} className="bg-[#0a0a0b]">
                    {copy.assetTypes[id]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cost-deal-size"
                className="font-display text-sm font-medium text-white"
              >
                {copy.dealSizeLabel}
              </label>
              <p className="mt-1 text-xs text-white/45">{copy.dealSizeHint}</p>
              <select
                id="cost-deal-size"
                value={dealSize}
                onChange={(e) => setDealSize(e.target.value as DealSizeRange)}
                className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              >
                {DEAL_SIZE_ORDER.map((id) => (
                  <option key={id} value={id} className="bg-[#0a0a0b]">
                    {copy.dealSizes[id]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cost-jurisdiction"
                className="font-display text-sm font-medium text-white"
              >
                {copy.jurisdictionLabel}
              </label>
              <p className="mt-1 text-xs text-white/45">{copy.jurisdictionHint}</p>
              <select
                id="cost-jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value as JurisdictionChoice)}
                className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              >
                <option value="recommend" className="bg-[#0a0a0b]">
                  {copy.jurisdictionRecommend}
                </option>
                {JURISDICTION_IDS.map((id) => (
                  <option key={id} value={id} className="bg-[#0a0a0b]">
                    {jurisdictionLabel(jurisdictionMessages, id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {copy.resultTitle}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="font-display text-lg font-semibold text-white">
                {jurisdictionName}
              </p>
              {estimate.jurisdictionRecommended ? (
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {copy.recommendedBadge}
                </span>
              ) : null}
            </div>

            <p className="mt-1 font-mono text-[11px] text-white/45">{copy.delayLabel}</p>
            <p className="font-display text-base text-white/80">
              {copy.delayRange(estimate.delayMinMonths, estimate.delayMaxMonths)}
            </p>

            <p className="mt-6 font-mono text-[11px] text-white/45">{copy.setupTotal}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white md:text-3xl">
              {formatCostEur(estimate.setupMinEur, fmtLocale)} –{" "}
              {formatCostEur(estimate.setupMaxEur, fmtLocale)}
            </p>

            <dl className="mt-6 space-y-3">
              {setupLines.map((line) => (
                <div
                  key={line.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <dt className="text-sm text-white/65">
                    {copy.breakdownLabels[line.id]}
                  </dt>
                  <dd className="font-mono text-sm text-white">
                    {formatCostEur(line.minEur, fmtLocale)} –{" "}
                    {formatCostEur(line.maxEur, fmtLocale)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {copy.ongoingAnnual}
              </p>
              <p className="mt-1 font-display text-lg font-medium text-white">
                {formatCostEur(estimate.ongoingMinEur, fmtLocale)} –{" "}
                {formatCostEur(estimate.ongoingMaxEur, fmtLocale)}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/70">
                {copy.firstYearTotal}
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-white">
                {formatCostEur(estimate.totalFirstYearMinEur, fmtLocale)} –{" "}
                {formatCostEur(estimate.totalFirstYearMaxEur, fmtLocale)}
              </p>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/40">
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {copy.sourceNote}
              </span>
              <br />
              {estimate.sourceNote}
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryButton
                href="/wizard?mode=explore"
                onClick={() => {
                  saveWizardPrefill(
                    prefillFromCostEstimator({
                      assetType,
                      dealSize,
                      jurisdictionId: estimate.jurisdictionId,
                    })
                  );
                  track("cost_estimator_cta", {
                    target: "wizard",
                    assetType,
                    jurisdiction: estimate.jurisdictionId,
                  });
                }}
              >
                {copy.wizardCta}
              </PrimaryButton>
              <Link
                href="/estimate"
                onClick={() =>
                  track("cost_estimator_cta", { target: "estimate", assetType })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.estimateCta}
              </Link>
              <Link
                href="/jurisdictions"
                onClick={() =>
                  track("cost_estimator_cta", {
                    target: "jurisdictions",
                    jurisdiction: estimate.jurisdictionId,
                  })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.jurisdictionsCta}
              </Link>
              <Link
                href="/tools/jurisdiction-picker"
                onClick={() =>
                  track("cost_estimator_cta", { target: "jurisdiction_picker", assetType })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.pickerCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] tracking-wide text-white/45">{copy.relatedTitle}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {copy.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] text-white/55 transition hover:border-white/20 hover:text-white/80"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-white">{copy.faqTitle}</h2>
        <div className="mt-6">
          <ContentFaqList items={COST_ESTIMATOR_FAQ} />
        </div>
      </section>
    </div>
  );
}
