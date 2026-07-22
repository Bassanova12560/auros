/**
 * AUROS Toll Benchmark API v0 — RWA readiness / index comparables (indicative).
 * Wraps Green Index + asset-class segment averages for desks / IA.
 */

import { getGreenIndexPayload } from "@/lib/green-index";
import type { GreenIndexEntry, GreenIndexSegmentRow } from "@/lib/green-index";

export const BENCHMARK_DISCLAIMER =
  "Indicative AUROS benchmark — not a market price, credit rating, or investment advice. HITL for institutional use.";

export type TollBenchmarkKind = "green_index" | "segment" | "peer_rank";

export type TollBenchmarkResult = {
  kind: TollBenchmarkKind;
  editionIso: string;
  generatedAt: string;
  top?: GreenIndexEntry[];
  segments?: GreenIndexSegmentRow[];
  peer?: {
    id: string;
    rank: number | null;
    composite_score: number | null;
    peersAbove: number;
    peersBelow: number;
    segmentId?: string;
  };
  summary: string;
  disclaimer: string;
};

export async function buildTollBenchmark(input?: {
  kind?: TollBenchmarkKind;
  assetId?: string;
  segment?: string;
  topN?: number;
}): Promise<TollBenchmarkResult> {
  const payload = await getGreenIndexPayload();
  const kind: TollBenchmarkKind = input?.kind ?? "green_index";
  const topN = Math.min(50, Math.max(5, input?.topN ?? 20));
  const top = payload.entries.slice(0, topN);

  if (kind === "segment") {
    const seg = input?.segment?.trim();
    const segments = seg
      ? payload.segments.filter((s) => s.id === seg)
      : payload.segments;
    return {
      kind: "segment",
      editionIso: payload.editionIso,
      generatedAt: payload.generatedAt,
      segments,
      summary: seg
        ? `Segment ${seg}: ${segments[0]?.count ?? 0} rows (indicative).`
        : `${payload.segments.length} Green Index segments.`,
      disclaimer: BENCHMARK_DISCLAIMER,
    };
  }

  if (kind === "peer_rank" && input?.assetId?.trim()) {
    const id = input.assetId.trim();
    const entry = payload.entries.find((e) => e.id === id);
    const rank = entry?.rank ?? null;
    return {
      kind: "peer_rank",
      editionIso: payload.editionIso,
      generatedAt: payload.generatedAt,
      peer: {
        id,
        rank,
        composite_score: entry?.composite_score ?? null,
        peersAbove: rank != null ? rank - 1 : payload.entries.length,
        peersBelow:
          rank != null
            ? Math.max(0, payload.entries.length - rank)
            : 0,
        segmentId: entry?.type,
      },
      top: top.slice(0, 5),
      summary: entry
        ? `${entry.name} rank #${entry.rank} / ${payload.entries.length} (indicative).`
        : `Asset ${id} not in current Green Index top — treat as unranked.`,
      disclaimer: BENCHMARK_DISCLAIMER,
    };
  }

  return {
    kind: "green_index",
    editionIso: payload.editionIso,
    generatedAt: payload.generatedAt,
    top,
    segments: payload.segments,
    summary: `AUROS Green Index top ${top.length} · edition ${payload.editionIso}.`,
    disclaimer: BENCHMARK_DISCLAIMER,
  };
}
