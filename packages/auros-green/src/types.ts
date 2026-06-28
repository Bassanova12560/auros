export type AurosGreenOptions = {
  /** Bearer API key (optional for anonymous tier — rate limited). */
  apiKey?: string;
  /** Defaults to https://getauros.com */
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type GreenApiErrorBody = {
  ok?: false;
  error?: { code?: string; message?: string };
};

export type GreenScoreResponse = {
  ok: true;
  score: {
    id: string;
    name: string;
    composite_score: number;
    carbon_quality: { score: number; tier: string } | null;
    watt: { rating: number } | null;
    nature_score: { score: number; tier: string } | null;
    benchmark: { percentile: number; label: string };
  };
};

export type GreenRegistryResponse = {
  ok: true;
  registry_connect: {
    serial: string;
    project_name: string;
    match: string;
    scores: { carbon_quality: { score: number } };
  };
};

export type GreenChangelogResponse = {
  ok: true;
  changelog: Record<string, unknown>;
};

export type GreenNatureIndexResponse = {
  ok: true;
  payload: {
    editionIso: string;
    referenceCount: number;
    entries: Array<{
      id: string;
      name: string;
      rank: number;
      nature_score: number;
      cqs: number | null;
    }>;
  };
};

export type GreenNatureScoreResponse = {
  ok: true;
  nature_score: { score: number; tier: string; ecosystem: string };
};

export type GreenScoreHistoryResponse = {
  ok: true;
  history: {
    id: string;
    name: string;
    entries: Array<{ edition: string; composite_score: number }>;
    trend: { composite_delta: number; months: number } | null;
  };
};

export type GreenDppResponse = {
  ok: true;
  dpp: Record<string, unknown>;
};
