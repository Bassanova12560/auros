import { AurosGreenError } from "./errors";
import type {
  AurosGreenOptions,
  GreenApiErrorBody,
  GreenChangelogResponse,
  GreenDppResponse,
  GreenNatureIndexResponse,
  GreenNatureScoreResponse,
  GreenRegistryResponse,
  GreenScoreHistoryResponse,
  GreenScoreResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://getauros.com";

export class AurosGreen {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(options: AurosGreenOptions = {}) {
    this.apiKey = options.apiKey?.trim() || undefined;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.fetchFn = options.fetch ?? globalThis.fetch;
    if (!this.fetchFn) {
      throw new Error("fetch is not available — pass options.fetch");
    }
  }

  async getScore(id: string): Promise<GreenScoreResponse> {
    return this.get<GreenScoreResponse>(`/api/green/score/${encodeURIComponent(id)}`);
  }

  async getScores(ids: string[]): Promise<{ ok: true; scores: GreenScoreResponse["score"][] }> {
    const qs = new URLSearchParams({ ids: ids.join(",") });
    return this.get(`/api/green/scores?${qs.toString()}`);
  }

  async analyzeCarbon(text: string): Promise<{ ok: true; carbon_quality: { score: number } }> {
    return this.post("/api/green/score/analyze", { text });
  }

  async getRegistry(serial: string): Promise<GreenRegistryResponse> {
    const qs = new URLSearchParams({ serial });
    return this.get<GreenRegistryResponse>(`/api/green/registry?${qs.toString()}`);
  }

  async getChangelog(): Promise<GreenChangelogResponse> {
    return this.get<GreenChangelogResponse>("/api/green/changelog");
  }

  async getNatureIndex(): Promise<GreenNatureIndexResponse> {
    return this.get<GreenNatureIndexResponse>("/api/green/nature-index");
  }

  async getNatureScore(id: string): Promise<GreenNatureScoreResponse> {
    return this.get<GreenNatureScoreResponse>(
      `/api/green/nature-score/${encodeURIComponent(id)}`
    );
  }

  async getScoreHistory(id: string): Promise<GreenScoreHistoryResponse> {
    return this.get<GreenScoreHistoryResponse>(
      `/api/green/score/${encodeURIComponent(id)}/history`
    );
  }

  async getDpp(id: string, format?: "json" | "jsonld"): Promise<GreenDppResponse | Record<string, unknown>> {
    const qs = format === "jsonld" ? "?format=jsonld" : "";
    const path = `/api/green/dpp/${encodeURIComponent(id)}${qs}`;
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      headers:
        format === "jsonld"
          ? { ...this.headers(), Accept: "application/ld+json" }
          : this.headers(),
    });
    const body = (await res.json()) as GreenDppResponse & GreenApiErrorBody;
    if (!res.ok) {
      throw AurosGreenError.fromResponse(res.status, body as GreenApiErrorBody);
    }
    return body as GreenDppResponse | Record<string, unknown>;
  }

  private headers(): HeadersInit {
    const h: Record<string, string> = { Accept: "application/json" };
    if (this.apiKey) h.Authorization = `Bearer ${this.apiKey}`;
    return h;
  }

  private async get<T>(path: string): Promise<T> {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, { headers: this.headers() });
    return this.parse<T>(res);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { ...this.headers(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return this.parse<T>(res);
  }

  private async parse<T>(res: Response): Promise<T> {
    const body = (await res.json()) as T & GreenApiErrorBody;
    if (!res.ok) {
      throw AurosGreenError.fromResponse(res.status, body as GreenApiErrorBody);
    }
    return body as T;
  }
}
