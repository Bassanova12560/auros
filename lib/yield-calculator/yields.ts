import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import type { ComparatorProductRow } from "@/lib/comparators/types";

import type { YieldAssetClass, YieldCalculatorInput, YieldEstimate } from "./types";

/** EU HICP illustrative benchmark — not a guaranteed rate. */
export const EU_INFLATION_APY = 2.5;

export type YieldBenchmark = {
  apyMin: number;
  apyMax: number;
  compareHref: string;
  /** Documents how the range was derived. */
  sourceNote: string;
};

/**
 * APY ranges derived from AUROS comparator manual JSON + hub categories (2026-06-11).
 * Recomputed via `apyRangeFromRows` when live rows are available in tests.
 *
 * tbills: bonds sovereign (bIB01, BENJI, USYC, WTGXX, SBTB) → 4.2–4.8 %
 * stablecoins: treasury yield products (USDM, bIB01) → 4.2–5.0 %
 * real_estate: immobilier-manual.json → 6.5–10.0 %
 * private_credit: private-credit-manual.json → 5.1–12.5 %
 * commodities: manual rows APY 0 — exposure, not coupon; illustrative 0–2 %
 * green_carbon: no fixed APY in GREEN_COMPARE_ROWS — variable market 0–5 % illustrative
 */
export const YIELD_BENCHMARKS: Record<YieldAssetClass, YieldBenchmark> = {
  tbills: {
    apyMin: 4.2,
    apyMax: 4.8,
    compareHref: COMPARATOR_ROUTES.bonds,
    sourceNote: "Moyenne hub obligations — catégorie sovereign (T-Bills tokenisés).",
  },
  stablecoins: {
    apyMin: 4.2,
    apyMax: 5.0,
    compareHref: COMPARATOR_ROUTES.stablecoins,
    sourceNote: "Hub stablecoins — trésorerie tokenisée (USDM, bIB01, pools DefiLlama).",
  },
  real_estate: {
    apyMin: 6.5,
    apyMax: 10.0,
    compareHref: COMPARATOR_ROUTES.realEstate,
    sourceNote: "Hub immobilier tokenisé — loyers nets indicatifs catalogue AUROS.",
  },
  private_credit: {
    apyMin: 5.1,
    apyMax: 12.5,
    compareHref: COMPARATOR_ROUTES.privateCredit,
    sourceNote: "Hub private credit — Maple, Centrifuge, Goldfinch, etc.",
  },
  commodities: {
    apyMin: 0,
    apyMax: 2,
    compareHref: COMPARATOR_ROUTES.commodities,
    sourceNote:
      "Matières premières tokenisées — exposition prix, pas coupon fixe (APY hub souvent 0).",
  },
  green_carbon: {
    apyMin: 0,
    apyMax: 5,
    compareHref: "/green/compare",
    sourceNote:
      "Crédits carbone / PPA tokenisés — marché variable, pas d'APY garanti (AUROS Green).",
  },
};

export function apyRangeFromRows(
  rows: ComparatorProductRow[],
  filter?: (row: ComparatorProductRow) => boolean
): { apyMin: number; apyMax: number } | null {
  const scoped = (filter ? rows.filter(filter) : rows).filter((r) => r.apy > 0);
  if (scoped.length === 0) return null;
  const apys = scoped.map((r) => r.apy);
  return { apyMin: Math.min(...apys), apyMax: Math.max(...apys) };
}

function clampAmount(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return amount;
}

function clampMonths(months: number | undefined): number {
  const m = months ?? 12;
  if (!Number.isFinite(m) || m < 1) return 12;
  return Math.min(360, Math.round(m));
}

function prorateAnnual(amount: number, apyPercent: number, months: number): number {
  const annual = (amount * apyPercent) / 100;
  return (annual * months) / 12;
}

export function computeYieldEstimate(input: YieldCalculatorInput): YieldEstimate {
  const amountEur = clampAmount(input.amountEur);
  const holdingMonths = clampMonths(input.holdingMonths);
  const bench = YIELD_BENCHMARKS[input.assetClass];
  const { apyMin, apyMax, compareHref, sourceNote } = bench;
  const apyMid = (apyMin + apyMax) / 2;

  const periodReturnMin = prorateAnnual(amountEur, apyMin, holdingMonths);
  const periodReturnMax = prorateAnnual(amountEur, apyMax, holdingMonths);
  const annualReturnMinEur = prorateAnnual(amountEur, apyMin, 12);
  const annualReturnMaxEur = prorateAnnual(amountEur, apyMax, 12);

  return {
    assetClass: input.assetClass,
    apyMin,
    apyMax,
    apyMid,
    annualReturnMinEur,
    annualReturnMaxEur,
    monthlyReturnMinEur: periodReturnMin / holdingMonths,
    monthlyReturnMaxEur: periodReturnMax / holdingMonths,
    inflationApy: EU_INFLATION_APY,
    beatsInflationMin: apyMin > EU_INFLATION_APY,
    beatsInflationMax: apyMax > EU_INFLATION_APY,
    holdingMonths,
    compareHref,
    sourceNote,
  };
}

/** Bar width 0–100 for visual comparison (capped at 15 % APY scale). */
export function yieldBarPercent(apy: number): number {
  const scale = 15;
  return Math.min(100, Math.max(0, (apy / scale) * 100));
}

export function formatEur(value: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatApy(value: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
