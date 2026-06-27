export const UHI_INDEX_ROUTE = "/data/uhi-index";

export const UHI_INDEX_TOP_N = 30;

export type UhiSegment = "energy" | "treasury" | "credit" | "storage" | "compute";

export type UhiIndexEntry = {
  rank: number;
  id: string;
  name: string;
  segment: UhiSegment;
  uhi_score: number;
  watt_score: number | null;
  taxonomy_score: number | null;
  indicative_yield_pct: number | null;
  mom_pct: number | null;
  sourceUrl: string;
};

export type UhiIndexSegmentRow = {
  id: UhiSegment;
  count: number;
  avg_uhi: number | null;
  avg_watt: number | null;
};

export type UhiIndexPayload = {
  editionIso: string;
  generatedAt: string;
  entries: UhiIndexEntry[];
  segments: UhiIndexSegmentRow[];
  indexPerformance: {
    month_pct: number | null;
    ytd_pct: number | null;
  };
  catalogCount: number;
  methodologyNote: string;
};
