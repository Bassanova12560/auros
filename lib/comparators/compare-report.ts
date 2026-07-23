import {
  encodeCompareProductIdsParam,
  normalizeCompareProductIds,
} from "./compare-selection";
import { COMPARATOR_ROUTES } from "./constants";
import type { HubProduct } from "./compare-hub";

export const COMPARE_REPORT_ROUTE = `${COMPARATOR_ROUTES.compare}/report`;
export const COMPARE_REPORT_MIN = 2;
export const COMPARE_REPORT_MAX = 4;

export function buildCompareReportPath(ids: string[]): string {
  const normalized = normalizeCompareProductIds(ids);
  if (normalized.length < COMPARE_REPORT_MIN) return COMPARE_REPORT_ROUTE;
  return `${COMPARE_REPORT_ROUTE}?compare=${encodeCompareProductIdsParam(normalized)}`;
}

export function buildCompareReportUrl(ids: string[], origin = ""): string {
  return `${origin}${buildCompareReportPath(ids)}`;
}

/** Dossier funnel with selection preserved for /start → wizard. */
export function buildCompareDossierHref(ids: string[]): string {
  const normalized = normalizeCompareProductIds(ids);
  if (normalized.length === 0) return "/start";
  return `/start?compare=${encodeCompareProductIdsParam(normalized)}`;
}

export function buildCompareWizardHref(ids: string[]): string {
  const normalized = normalizeCompareProductIds(ids);
  const base = "/wizard?expert=1";
  if (normalized.length === 0) return base;
  return `${base}&compare=${encodeCompareProductIdsParam(normalized)}`;
}

/** Heuristic: carbon / water / energy-adjacent rows for soft Green upsell. */
const GREEN_ID_HINTS = [
  "toucan",
  "klima",
  "moss",
  "flowcarbon",
  "carbon",
  "bct",
  "nct",
  "mco2",
  "watt",
  "h2o",
  "water",
  "energy",
];

export function isGreenRelevantHubProduct(product: HubProduct): boolean {
  const hay = `${product.row.id} ${product.row.platform} ${product.row.product} ${product.row.category}`.toLowerCase();
  return GREEN_ID_HINTS.some((hint) => hay.includes(hint));
}

export function selectionHasGreenRelevant(products: HubProduct[]): boolean {
  return products.some(isGreenRelevantHubProduct);
}

/** Free CSV of the current shortlist (indicative — not a licensed data feed). */
export function buildCompareSelectionCsv(products: HubProduct[]): string {
  const header = [
    "id",
    "platform",
    "product",
    "apy_indicative",
    "tvl_usd",
    "min_investment_usd",
    "liquidity_days",
    "fees",
    "jurisdiction",
    "accredited_only",
    "live",
    "risk_tier",
    "chains",
  ];
  const escape = (value: string | number | boolean | null | undefined) => {
    const raw = value == null ? "" : String(value);
    if (/[",\n\r]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
    return raw;
  };
  const lines = [header.join(",")];
  for (const product of products.slice(0, COMPARE_REPORT_MAX)) {
    lines.push(
      [
        product.row.id,
        product.row.platform,
        product.row.product,
        product.row.apy,
        product.row.tvlUsd,
        product.meta.minInvestmentUsd,
        product.meta.liquidityDays,
        product.meta.fees,
        product.meta.jurisdiction ?? "",
        product.meta.accreditedOnly,
        product.row.live,
        product.riskTier,
        product.row.chains.join("|"),
      ]
        .map(escape)
        .join(",")
    );
  }
  return `${lines.join("\n")}\n`;
}
