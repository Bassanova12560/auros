export const NATURE_INDEX_ROUTE = "/data/nature-score";
export const NATURE_INDEX_TOP_N = 20;

export type NatureIndexEntry = {
  rank: number;
  id: string;
  name: string;
  type: string;
  nature_score: number;
  nature_tier: string;
  ecosystem: string;
  cqs: number | null;
  country_hint: string | null;
};

export type NatureIndexPayload = {
  editionIso: string;
  generatedAt: string;
  referenceCount: number;
  methodologyNote: string;
  entries: NatureIndexEntry[];
};
