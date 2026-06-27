import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { enrichGreenCompareRows } from "@/lib/green/compare-enriched";
import type { GreenProjectType } from "@/lib/green/constants";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getEditionIso } from "@/lib/rwa-index/compute";

import {
  GREEN_INDEX_TOP_N,
  type GreenIndexEntry,
  type GreenIndexPayload,
  type GreenIndexSegmentRow,
} from "./types";

function illustrativeMomPct(id: string, rank: number): number | null {
  if (rank > 10) return null;
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 97;
  return Math.round(((h % 11) - 3) * 10) / 10;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function buildSegments(
  enriched: ReturnType<typeof enrichGreenCompareRows>
): GreenIndexSegmentRow[] {
  const types = new Set<GreenProjectType>(
    enriched.map((r) => r.type)
  );

  return [...types].map((id) => {
    const rows = enriched.filter((r) => r.type === id);
    return {
      id,
      count: rows.length,
      avg_composite: average(rows.map((r) => r.composite_score)),
      avg_taxonomy: average(
        rows.map((r) => r.green_taxonomy_score).filter((v): v is number => v != null)
      ),
      avg_cqs: average(
        rows.map((r) => r.carbon_quality_score).filter((v): v is number => v != null)
      ),
      avg_watt: average(
        rows.map((r) => r.watt_score).filter((v): v is number => v != null)
      ),
    };
  });
}

export function buildGreenIndexPayload(options?: {
  editionIso?: string;
  generatedAt?: string;
  registryVerifiedCount?: number;
}): GreenIndexPayload {
  const enriched = enrichGreenCompareRows(GREEN_COMPARE_ROWS).sort(
    (a, b) => b.composite_score - a.composite_score
  );

  const entries: GreenIndexEntry[] = enriched
    .slice(0, GREEN_INDEX_TOP_N)
    .map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      type: row.type,
      composite_score: row.composite_score,
      taxonomy_score: row.green_taxonomy_score,
      carbon_quality_score: row.carbon_quality_score,
      watt_score: row.watt_score,
      labelStatus: row.labelStatus,
      sourceUrl: row.sourceUrl,
      mom_pct: illustrativeMomPct(row.id, index + 1),
    }));

  return {
    editionIso: options?.editionIso ?? getEditionIso(),
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    entries,
    segments: buildSegments(enriched),
    registryVerifiedCount: options?.registryVerifiedCount ?? 0,
    referenceCount: GREEN_COMPARE_ROWS.length,
    methodologyNote:
      "Composite = Taxonomy EU (35%) + Carbon Quality Score pour carbone (35%) + Watt Score énergie (30%). Données indicatives — pas un conseil en investissement.",
  };
}

export async function getGreenIndexPayload(): Promise<GreenIndexPayload> {
  let registryVerifiedCount = 0;
  try {
    const snap = await getGreenRegistrySnapshot();
    registryVerifiedCount = snap.projects.filter(
      (p) => p.labelTier === "verified"
    ).length;
  } catch {
    registryVerifiedCount = 0;
  }

  return buildGreenIndexPayload({ registryVerifiedCount });
}

export { getEditionIso };
