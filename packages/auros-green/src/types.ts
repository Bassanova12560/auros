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
