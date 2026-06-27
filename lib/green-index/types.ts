import type { GreenProjectType } from "@/lib/green/constants";

export const GREEN_INDEX_ROUTE = "/data/green-index";

export const GREEN_INDEX_TOP_N = 20;

export type GreenIndexSegmentId = GreenProjectType;

export type GreenIndexEntry = {
  rank: number;
  id: string;
  name: string;
  type: GreenProjectType;
  composite_score: number;
  taxonomy_score: number | null;
  carbon_quality_score: number | null;
  watt_score: number | null;
  labelStatus: string;
  sourceUrl: string;
  /** Illustrative month-over-month change (first editions: seeded). */
  mom_pct: number | null;
};

export type GreenIndexSegmentRow = {
  id: GreenIndexSegmentId;
  count: number;
  avg_composite: number | null;
  avg_taxonomy: number | null;
  avg_cqs: number | null;
  avg_watt: number | null;
};

export type GreenIndexPayload = {
  editionIso: string;
  generatedAt: string;
  entries: GreenIndexEntry[];
  segments: GreenIndexSegmentRow[];
  registryVerifiedCount: number;
  referenceCount: number;
  methodologyNote: string;
};
