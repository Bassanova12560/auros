import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import type { CompareHubPayload, HubProduct } from "@/lib/comparators/compare-hub";
import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import type { ComparatorProductRow } from "@/lib/comparators/types";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import { YIELD_BENCHMARKS } from "@/lib/yield-calculator/yields";

import {
  COMPARATOR_TO_INDEX_CATEGORY,
  RWA_INDEX_CATEGORY_ORDER,
  type ApyStats,
  type CategoryIndexRow,
  type DossierTrendIndicative,
  type RwaIndexCategoryId,
  type RwaIndexPayload,
} from "./types";

const CATEGORY_HREFS: Record<RwaIndexCategoryId, string> = {
  bonds: COMPARATOR_ROUTES.bonds,
  stablecoins: COMPARATOR_ROUTES.stablecoins,
  real_estate: COMPARATOR_ROUTES.realEstate,
  private_credit: COMPARATOR_ROUTES.privateCredit,
  commodities: COMPARATOR_ROUTES.commodities,
  green: "/green/compare",
};

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function apyStatsFromRows(rows: ComparatorProductRow[]): ApyStats {
  const withYield = rows.filter((r) => r.apy > 0);
  const apys = withYield.map((r) => r.apy);
  return {
    min: apys.length > 0 ? Math.min(...apys) : null,
    max: apys.length > 0 ? Math.max(...apys) : null,
    median: median(apys),
    average: average(apys),
    productCount: rows.length,
    productsWithYield: withYield.length,
  };
}

function statsFromIllustrativeRange(
  productCount: number,
  apyMin: number,
  apyMax: number
): ApyStats {
  const mid = (apyMin + apyMax) / 2;
  return {
    min: apyMin,
    max: apyMax,
    median: mid,
    average: mid,
    productCount,
    productsWithYield: 0,
  };
}

function groupProductsByCategory(
  products: HubProduct[]
): Map<RwaIndexCategoryId, ComparatorProductRow[]> {
  const map = new Map<RwaIndexCategoryId, ComparatorProductRow[]>();
  for (const id of RWA_INDEX_CATEGORY_ORDER) {
    if (id !== "green") map.set(id, []);
  }
  for (const product of products) {
    const categoryId = COMPARATOR_TO_INDEX_CATEGORY[product.comparatorId];
    if (!categoryId) continue;
    map.get(categoryId)!.push(product.row);
  }
  return map;
}

function buildGreenCategoryRow(): CategoryIndexRow {
  const bench = YIELD_BENCHMARKS.green_carbon;
  return {
    id: "green",
    compareHref: CATEGORY_HREFS.green,
    stats: statsFromIllustrativeRange(
      GREEN_COMPARE_ROWS.length,
      bench.apyMin,
      bench.apyMax
    ),
    sourceNote: `${bench.sourceNote} — ${GREEN_COMPARE_ROWS.length} références AUROS Green.`,
    isIllustrative: true,
  };
}

function buildCategoryRow(
  id: RwaIndexCategoryId,
  rows: ComparatorProductRow[]
): CategoryIndexRow {
  if (id === "green") return buildGreenCategoryRow();

  const stats = apyStatsFromRows(rows);
  const isIllustrative =
    id === "commodities" && stats.productsWithYield === 0;

  if (isIllustrative) {
    const bench = YIELD_BENCHMARKS.commodities;
    return {
      id,
      compareHref: CATEGORY_HREFS[id],
      stats: {
        ...statsFromIllustrativeRange(rows.length, bench.apyMin, bench.apyMax),
        productCount: rows.length,
      },
      sourceNote: bench.sourceNote,
      isIllustrative: true,
    };
  }

  const sourceNotes: Record<Exclude<RwaIndexCategoryId, "green">, string> = {
    bonds: "Hub obligations — T-Bills et corporate tokenisés (JSON manuel + DefiLlama).",
    stablecoins: "Hub stablecoins — trésorerie et yield tokenisés.",
    real_estate: "Hub immobilier — loyers nets indicatifs catalogue AUROS.",
    private_credit: "Hub private credit — Maple, Centrifuge, Goldfinch, etc.",
    commodities: "Hub matières premières — exposition prix, APY hub souvent nul.",
  };

  return {
    id,
    compareHref: CATEGORY_HREFS[id],
    stats,
    sourceNote: sourceNotes[id],
    isIllustrative: false,
  };
}

/** First day of the reference month (UTC) for edition dating. */
export function getEditionIso(reference = new Date()): string {
  const year = reference.getUTCFullYear();
  const month = String(reference.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

/** Indicative dossier trend — no consolidated public DB; clearly labeled. */
export const INDICATIVE_DOSSIER_TRENDS: DossierTrendIndicative = {
  wizardStartsEstimate: 38,
  monthOverMonthPct: 9,
  note:
    "Estimation interne indicative — pas de statistiques publiques consolidées. Tendance wizard AUROS, non auditée.",
};

export function buildRwaIndexPayload(
  hub: CompareHubPayload,
  options?: {
    editionIso?: string;
    generatedAt?: string;
    activeJurisdictions?: number;
    dossierTrends?: DossierTrendIndicative;
  }
): RwaIndexPayload {
  const grouped = groupProductsByCategory(hub.products);
  const categories = RWA_INDEX_CATEGORY_ORDER.map((id) => {
    if (id === "green") return buildGreenCategoryRow();
    return buildCategoryRow(id, grouped.get(id) ?? []);
  });

  return {
    editionIso: options?.editionIso ?? getEditionIso(),
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    dataFetchedAt: hub.fetchedAt,
    categories,
    totalProducts: hub.totalProducts,
    activeJurisdictions: options?.activeJurisdictions ?? JURISDICTIONS.length,
    dossierTrends: options?.dossierTrends ?? INDICATIVE_DOSSIER_TRENDS,
  };
}

export async function getRwaIndexPayload(): Promise<RwaIndexPayload> {
  const hub = await getCompareHubPayload();
  return buildRwaIndexPayload(hub);
}
