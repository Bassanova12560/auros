import { JURISDICTIONS } from "@/lib/jurisdictions/data";
import { getRwaIndexPayload } from "@/lib/rwa-index";
import type { RwaIndexPayload } from "@/lib/rwa-index/types";

import {
  CURRENT_EDITION,
  type AssetMixRow,
  type BlockerRow,
  type JurisdictionBreakdownRow,
  type MicaReadinessSignal,
  type StateOfRwaIssuersPayload,
} from "./types";

/** Indicative MiCA readiness signals — modeled from MiCA checker scoring patterns, not live dossier DB. */
export const INDICATIVE_MICA_SIGNALS: MicaReadinessSignal[] = [
  { id: "whitepaper", scorePct: 38 },
  { id: "issuer_structure", scorePct: 72 },
  { id: "eu_nexus", scorePct: 54 },
  { id: "investor_type", scorePct: 61 },
];

export const INDICATIVE_MICA_NOTE =
  "Scores indicatifs dérivés des profils types AUROS MiCA checker et parcours wizard — pas de statistiques publiques consolidées ni audit réglementaire.";

/** Indicative common blockers from wizard intake patterns. */
export const INDICATIVE_BLOCKERS: BlockerRow[] = [
  { id: "whitepaper_missing", sharePct: 34 },
  { id: "jurisdiction_undecided", sharePct: 28 },
  { id: "legal_structure", sharePct: 22 },
  { id: "investor_classification", sharePct: 16 },
];

/** Indicative jurisdiction interest shares — wizard / jurisdiction-picker trends, not verified issuance volume. */
export const INDICATIVE_JURISDICTION_SHARES: Record<string, number> = {
  luxembourg: 24,
  "dubai-difc": 18,
  ireland: 14,
  france: 12,
  singapore: 10,
  switzerland: 9,
  gibraltar: 8,
  bahrain: 5,
};

export function getQuarterStartIso(edition = CURRENT_EDITION): string {
  const match = /^(\d{4})-Q([1-4])$/.exec(edition);
  if (!match) return `${new Date().getUTCFullYear()}-01-01`;
  const year = Number(match[1]);
  const quarter = Number(match[2]);
  const month = (quarter - 1) * 3 + 1;
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

export function computeAssetMix(
  categories: RwaIndexPayload["categories"],
  totalProducts: number
): AssetMixRow[] {
  if (totalProducts <= 0) {
    return categories.map((c) => ({
      categoryId: c.id,
      productCount: c.stats.productCount,
      sharePct: 0,
    }));
  }
  return categories.map((c) => ({
    categoryId: c.id,
    productCount: c.stats.productCount,
    sharePct: Math.round((c.stats.productCount / totalProducts) * 1000) / 10,
  }));
}

export function computeMicaAvgScore(signals: MicaReadinessSignal[]): number {
  if (signals.length === 0) return 0;
  const sum = signals.reduce((acc, s) => acc + s.scorePct, 0);
  return Math.round(sum / signals.length);
}

export function buildJurisdictionBreakdown(): JurisdictionBreakdownRow[] {
  return JURISDICTIONS.map((j) => ({
    jurisdictionId: j.id,
    sharePct: INDICATIVE_JURISDICTION_SHARES[j.id] ?? 0,
    totalCostMid: j.totalCostMid,
    licenseMaxMonths: j.licenseMaxMonths,
  })).sort((a, b) => b.sharePct - a.sharePct);
}

export function buildStateOfRwaIssuersPayload(
  rwaIndex: RwaIndexPayload,
  options?: { edition?: string; generatedAt?: string }
): StateOfRwaIssuersPayload {
  const edition = options?.edition ?? CURRENT_EDITION;
  const signals = INDICATIVE_MICA_SIGNALS;

  return {
    edition,
    quarterStartIso: getQuarterStartIso(edition),
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    rwaIndexEditionIso: rwaIndex.editionIso,
    totalProducts: rwaIndex.totalProducts,
    activeJurisdictions: rwaIndex.activeJurisdictions,
    assetMix: computeAssetMix(rwaIndex.categories, rwaIndex.totalProducts),
    micaReadiness: {
      avgScorePct: computeMicaAvgScore(signals),
      signals,
      note: INDICATIVE_MICA_NOTE,
    },
    blockers: INDICATIVE_BLOCKERS,
    jurisdictionBreakdown: buildJurisdictionBreakdown(),
    dossierTrends: rwaIndex.dossierTrends,
    rwaIndexCategories: rwaIndex.categories,
  };
}

export async function getStateOfRwaIssuersPayload(): Promise<StateOfRwaIssuersPayload> {
  const rwaIndex = await getRwaIndexPayload();
  return buildStateOfRwaIssuersPayload(rwaIndex);
}
