"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { YIELD_CALCULATOR_FAQ } from "@/lib/yield-calculator/faq";
import {
  YIELD_ASSET_CLASS_ORDER,
  getYieldCalculatorCopy,
} from "@/lib/yield-calculator/i18n";
import {
  computeYieldEstimate,
  formatApy,
  formatEur,
  yieldBarPercent,
} from "@/lib/yield-calculator/yields";
import type { YieldAssetClass } from "@/lib/yield-calculator/types";

const DEFAULT_AMOUNT = 10_000;
const DEFAULT_MONTHS = 12;

function localeTag(locale: string): string {
  if (locale === "en") return "en-GB";
  if (locale === "es") return "es-ES";
  return "fr-FR";
}

export function YieldCalculatorView() {
  const { locale } = useLocale();
  const copy = getYieldCalculatorCopy(locale);
  const fmtLocale = localeTag(locale);

  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [assetClass, setAssetClass] = useState<YieldAssetClass>("tbills");
  const [holdingMonths, setHoldingMonths] = useState(DEFAULT_MONTHS);

  const estimate = useMemo(
    () =>
      computeYieldEstimate({
        amountEur: amount,
        assetClass,
        holdingMonths,
      }),
    [amount, assetClass, holdingMonths]
  );

  const inflationBar = yieldBarPercent(estimate.inflationApy);
  const yieldBar = yieldBarPercent(estimate.apyMid);

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
                htmlFor="yield-amount"
                className="font-display text-sm font-medium text-white"
              >
                {copy.amountLabel}
              </label>
              <p className="mt-1 text-xs text-white/45">{copy.amountHint}</p>
              <input
                id="yield-amount"
                type="number"
                min={0}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="yield-asset"
                className="font-display text-sm font-medium text-white"
              >
                {copy.assetClassLabel}
              </label>
              <select
                id="yield-asset"
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value as YieldAssetClass)}
                className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              >
                {YIELD_ASSET_CLASS_ORDER.map((id) => (
                  <option key={id} value={id} className="bg-[#0a0a0b]">
                    {copy.assetClasses[id]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="yield-months"
                className="font-display text-sm font-medium text-white"
              >
                {copy.holdingLabel}
              </label>
              <p className="mt-1 text-xs text-white/45">{copy.holdingHint}</p>
              <input
                id="yield-months"
                type="range"
                min={1}
                max={60}
                step={1}
                value={holdingMonths}
                onChange={(e) => setHoldingMonths(Number(e.target.value))}
                className="mt-3 w-full accent-white/70"
              />
              <p className="mt-2 font-mono text-[11px] text-white/50">
                {copy.holdingMonths(holdingMonths)}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {copy.resultTitle}
            </p>

            <p className="mt-4 font-mono text-[11px] text-white/45">{copy.apyRange}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white md:text-3xl">
              {formatApy(estimate.apyMin, fmtLocale)} % – {formatApy(estimate.apyMax, fmtLocale)} %
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {copy.annualReturn}
                </dt>
                <dd className="mt-1 font-display text-lg font-medium text-white">
                  {formatEur(estimate.annualReturnMinEur, fmtLocale)} –{" "}
                  {formatEur(estimate.annualReturnMaxEur, fmtLocale)}
                </dd>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {copy.monthlyReturn}
                </dt>
                <dd className="mt-1 font-display text-lg font-medium text-white">
                  {formatEur(estimate.monthlyReturnMinEur, fmtLocale)} –{" "}
                  {formatEur(estimate.monthlyReturnMaxEur, fmtLocale)}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <p className="font-mono text-[11px] text-white/45">{copy.vsInflation}</p>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 flex justify-between font-mono text-[10px] text-white/40">
                    <span>{copy.inflationLabel}</span>
                    <span>{formatApy(estimate.inflationApy, fmtLocale)} %</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-white/25 transition-all duration-500"
                      style={{ width: `${inflationBar}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between font-mono text-[10px] text-white/40">
                    <span>{copy.yieldLabel}</span>
                    <span>{formatApy(estimate.apyMid, fmtLocale)} %</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-emerald-400/70 transition-all duration-500"
                      style={{ width: `${yieldBar}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/50">
                {estimate.beatsInflationMin
                  ? copy.beatsInflation
                  : copy.belowInflation}
              </p>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/40">
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {copy.sourceNote}
              </span>
              <br />
              {estimate.sourceNote}
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <PrimaryButton
                href={estimate.compareHref}
                onClick={() =>
                  track("yield_calculator_cta", {
                    target: "compare",
                    assetClass,
                    amount,
                  })
                }
              >
                {copy.compareCta}
              </PrimaryButton>
              <Link
                href="/wizard"
                onClick={() =>
                  track("yield_calculator_cta", { target: "wizard", assetClass })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline sm:ml-2"
              >
                {copy.wizardCta}
              </Link>
              <Link
                href="/estimate"
                onClick={() =>
                  track("yield_calculator_cta", { target: "estimate", assetClass })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.estimateCta}
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
          <ContentFaqList items={YIELD_CALCULATOR_FAQ} />
        </div>
      </section>
    </div>
  );
}
