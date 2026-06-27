import type { HubProduct } from "@/lib/comparators/compare-hub";
import { getCompareHubPayload } from "@/lib/comparators/compare-hub";
import type { ComparatorId } from "@/lib/comparators/registry";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { enrichGreenCompareRows } from "@/lib/green/compare-enriched";
import type { GreenProjectType } from "@/lib/green/constants";
import { getEditionIso } from "@/lib/rwa-index/compute";

import {
  UHI_INDEX_TOP_N,
  type UhiIndexEntry,
  type UhiIndexPayload,
  type UhiIndexSegmentRow,
  type UhiSegment,
} from "./types";

const UHI_HUB_PLATFORM_HINTS = [
  "ondo",
  "backed",
  "centrifuge",
  "maple",
  "goldfinch",
  "nest",
  "clearpool",
  "credix",
];

function illustrativeMomPct(id: string, rank: number): number | null {
  if (rank > 15) return null;
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 97;
  return Math.round(((h % 13) - 4) * 10) / 10;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function greenTypeToSegment(type: GreenProjectType): UhiSegment {
  if (type === "solar" || type === "wind" || type === "rec" || type === "ppa") {
    return "energy";
  }
  return "energy";
}

function comparatorToSegment(id: ComparatorId): UhiSegment {
  if (id === "stablecoins" || id === "obligations") return "treasury";
  if (id === "private-credit") return "credit";
  if (id === "immobilier") return "storage";
  return "credit";
}

function parseYieldPct(note: string): number | null {
  const m = note.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (!m) return null;
  return Number.parseFloat(m[1]!.replace(",", "."));
}

function uhiScoreFromGreen(row: ReturnType<typeof enrichGreenCompareRows>[number]): number {
  const watt = row.watt_score ?? 0;
  const taxonomy = row.green_taxonomy_score ?? 0;
  return Math.max(0, Math.min(100, Math.round(watt * 0.55 + taxonomy * 0.45)));
}

function uhiScoreFromHub(product: HubProduct): number {
  const apy = product.row.apy;
  const tvlBoost = product.row.tvlUsd >= 5_000_000 ? 18 : product.row.tvlUsd >= 500_000 ? 10 : 4;
  const segmentBase =
    product.comparatorId === "stablecoins" || product.comparatorId === "obligations" ? 12 : 6;
  return Math.max(
    0,
    Math.min(100, Math.round(apy * 7 + tvlBoost + segmentBase))
  );
}

function entriesFromGreenCatalog(): Omit<UhiIndexEntry, "rank">[] {
  return enrichGreenCompareRows(GREEN_COMPARE_ROWS)
    .filter((row) => row.type !== "carbon" && row.watt_score != null)
    .map((row) => ({
      id: `green-${row.id}`,
      name: row.name,
      segment: greenTypeToSegment(row.type),
      uhi_score: uhiScoreFromGreen(row),
      watt_score: row.watt_score,
      taxonomy_score: row.green_taxonomy_score,
      indicative_yield_pct: parseYieldPct(row.yieldNote),
      mom_pct: null,
      sourceUrl: row.sourceUrl,
    }));
}

function entriesFromCompareHub(products: HubProduct[]): Omit<UhiIndexEntry, "rank">[] {
  return products
    .filter((p) => {
      const platform = p.row.platform.toLowerCase();
      return UHI_HUB_PLATFORM_HINTS.some((hint) => platform.includes(hint));
    })
    .filter((p) => p.row.apy > 0)
    .map((p) => ({
      id: `hub-${p.row.id}`,
      name: `${p.row.platform} — ${p.row.product}`,
      segment: comparatorToSegment(p.comparatorId),
      uhi_score: uhiScoreFromHub(p),
      watt_score: null,
      taxonomy_score: null,
      indicative_yield_pct: Math.round(p.row.apy * 100) / 100,
      mom_pct: null,
      sourceUrl: p.row.link.startsWith("http") ? p.row.link : "https://getauros.com/compare",
    }));
}

function dedupeEntries(entries: Omit<UhiIndexEntry, "rank">[]): Omit<UhiIndexEntry, "rank">[] {
  const seen = new Set<string>();
  const out: Omit<UhiIndexEntry, "rank">[] = [];
  for (const entry of entries.sort((a, b) => b.uhi_score - a.uhi_score)) {
    const key = entry.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out;
}

function buildSegments(entries: Omit<UhiIndexEntry, "rank">[]): UhiIndexSegmentRow[] {
  const segments = new Set<UhiSegment>(entries.map((e) => e.segment));
  return [...segments].map((id) => {
    const rows = entries.filter((e) => e.segment === id);
    return {
      id,
      count: rows.length,
      avg_uhi: average(rows.map((r) => r.uhi_score)),
      avg_watt: average(
        rows.map((r) => r.watt_score).filter((v): v is number => v != null)
      ),
    };
  });
}

function indexPerformance(entries: UhiIndexEntry[]): UhiIndexPayload["indexPerformance"] {
  const withMom = entries
    .slice(0, 10)
    .map((e, i) => illustrativeMomPct(e.id, i + 1))
    .filter((v): v is number => v != null);
  if (withMom.length === 0) return { month_pct: null, ytd_pct: null };
  const month = Math.round((withMom.reduce((a, b) => a + b, 0) / withMom.length) * 10) / 10;
  return {
    month_pct: month,
    ytd_pct: Math.round(month * 7.5 * 10) / 10,
  };
}

export function buildUhiIndexPayload(options?: {
  editionIso?: string;
  generatedAt?: string;
  hubProducts?: HubProduct[];
}): UhiIndexPayload {
  const merged = dedupeEntries([
    ...entriesFromGreenCatalog(),
    ...(options?.hubProducts ? entriesFromCompareHub(options.hubProducts) : []),
  ]);

  const ranked = merged
    .sort((a, b) => b.uhi_score - a.uhi_score)
    .slice(0, UHI_INDEX_TOP_N)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
      mom_pct: illustrativeMomPct(row.id, index + 1),
    }));

  return {
    editionIso: options?.editionIso ?? getEditionIso(),
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    entries: ranked,
    segments: buildSegments(merged),
    indexPerformance: indexPerformance(ranked),
    catalogCount: merged.length,
    methodologyNote:
      "UHI = actifs productifs tokenisés (énergie, trésorerie, crédit) scorés AUROS — Watt + Taxonomy pour le Green, APY + liquidité pour le comparateur RWA. Indicatif, pas conseil en investissement.",
  };
}

export async function getUhiIndexPayload(): Promise<UhiIndexPayload> {
  try {
    const hub = await getCompareHubPayload();
    return buildUhiIndexPayload({ hubProducts: hub.products });
  } catch {
    return buildUhiIndexPayload();
  }
}

export { getEditionIso };
