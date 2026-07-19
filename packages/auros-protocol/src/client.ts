import { AurosProtocolError } from "./errors";
import type {
  AurosProtocolOptions,
  AttestCreateRequest,
  AttestResponse,
  AttestVerifyResponse,
  ChargeflowCreateRequest,
  ChargeflowFCreateRequest,
  ChargeflowBatchRequestE,
  ChargeflowBatchRequestF,
  ChargeflowBatchRequestW,
  ChargeflowBatchResponse,
  ChargeflowListQuery,
  ChargeflowListResponse,
  ChargeflowResponse,
  ChargeflowVerifyResponse,
  ChargeflowWCreateRequest,
  ChecklistRequest,
  ChecklistResponse,
  CompareRequest,
  CompareResponse,
  CreateKeyRequest,
  CreateKeyResponse,
  DossierRequest,
  DossierResponse,
  GreenCqsBatchRequest,
  GreenCqsBatchResponse,
  GreenCqsPublicResponse,
  GreenWattBatchRequest,
  GreenWattBatchResponse,
  GreenWattPublicResponse,
  JurisdictionsQuery,
  JurisdictionsResponse,
  MonitorRequest,
  MonitorResponse,
  ProductsQuery,
  ProductsResponse,
  ProtocolErrorBody,
  ScoreHistoryResponse,
  ScoreRequest,
  ScoreResponse,
  ScoreBatchRequest,
  ScoreBatchResponse,
  WebhookRegisterRequest,
  WebhookRegisterResponse,
  WebhooksListResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://getauros.com";

export class AurosProtocol {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(options: AurosProtocolOptions) {
    if (!options.apiKey?.trim()) {
      throw new Error("apiKey is required");
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.fetchFn = options.fetch ?? globalThis.fetch;
    if (!this.fetchFn) {
      throw new Error("fetch is not available — pass options.fetch");
    }
  }

  async score(body: ScoreRequest): Promise<ScoreResponse> {
    return this.post<ScoreResponse>("/api/v1/score", body);
  }

  async scoreBatch(body: ScoreBatchRequest): Promise<ScoreBatchResponse> {
    return this.post<ScoreBatchResponse>("/api/v1/score/batch", body);
  }

  async scoreHistory(id: string): Promise<ScoreHistoryResponse> {
    return this.get<ScoreHistoryResponse>(
      `/api/v1/score/${encodeURIComponent(id)}/history`
    );
  }

  async products(query: ProductsQuery = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    return this.get<ProductsResponse>(`/api/v1/products${qs ? `?${qs}` : ""}`);
  }

  async compare(body: CompareRequest): Promise<CompareResponse> {
    return this.post<CompareResponse>("/api/v1/compare", body);
  }

  async jurisdictions(query: JurisdictionsQuery = {}): Promise<JurisdictionsResponse> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    return this.get<JurisdictionsResponse>(
      `/api/v1/jurisdictions${qs ? `?${qs}` : ""}`
    );
  }

  async checklist(body: ChecklistRequest): Promise<ChecklistResponse> {
    return this.post<ChecklistResponse>("/api/v1/checklist", body);
  }

  async monitor(body: MonitorRequest): Promise<MonitorResponse> {
    return this.post<MonitorResponse>("/api/v1/monitor", body);
  }

  async getMonitor(id: string): Promise<MonitorResponse> {
    return this.get<MonitorResponse>(`/api/v1/monitor/${encodeURIComponent(id)}`);
  }

  async deleteMonitor(id: string): Promise<{ ok: boolean; id: string; deleted: boolean }> {
    return this.request("DELETE", `/api/v1/monitor/${encodeURIComponent(id)}`);
  }

  async dossier(body: DossierRequest): Promise<DossierResponse> {
    return this.post<DossierResponse>("/api/v1/dossier", body);
  }

  async attest(body: AttestCreateRequest): Promise<AttestResponse> {
    return this.post<AttestResponse>("/api/v1/attest", body);
  }

  async verifyAttest(query: {
    id?: string;
    hash?: string;
    sig?: string;
  }): Promise<AttestVerifyResponse> {
    const params = new URLSearchParams();
    if (query.id) params.set("id", query.id);
    if (query.hash) params.set("hash", query.hash);
    if (query.sig) params.set("sig", query.sig);
    const qs = params.toString();
    return this.getPublic<AttestVerifyResponse>(
      `/api/v1/attest/verify${qs ? `?${qs}` : ""}`
    );
  }

  async createChargeflowE(
    body: ChargeflowCreateRequest
  ): Promise<ChargeflowResponse> {
    return this.post<ChargeflowResponse>("/api/v1/chargeflow", body);
  }

  async createChargeflowW(
    body: ChargeflowWCreateRequest
  ): Promise<ChargeflowResponse> {
    return this.post<ChargeflowResponse>("/api/v1/chargeflow/w", body);
  }

  async createChargeflowF(
    body: ChargeflowFCreateRequest
  ): Promise<ChargeflowResponse> {
    return this.post<ChargeflowResponse>("/api/v1/chargeflow/f", body);
  }

  async createChargeflowEBatch(
    body: ChargeflowBatchRequestE
  ): Promise<ChargeflowBatchResponse> {
    return this.post<ChargeflowBatchResponse>("/api/v1/chargeflow/batch", body);
  }

  async createChargeflowWBatch(
    body: ChargeflowBatchRequestW
  ): Promise<ChargeflowBatchResponse> {
    return this.post<ChargeflowBatchResponse>(
      "/api/v1/chargeflow/w/batch",
      body
    );
  }

  async createChargeflowFBatch(
    body: ChargeflowBatchRequestF
  ): Promise<ChargeflowBatchResponse> {
    return this.post<ChargeflowBatchResponse>(
      "/api/v1/chargeflow/f/batch",
      body
    );
  }

  async listChargeflow(
    query: ChargeflowListQuery = {}
  ): Promise<ChargeflowListResponse> {
    const params = new URLSearchParams();
    if (query.kind) params.set("kind", query.kind);
    if (query.status) params.set("status", query.status);
    if (query.limit != null) params.set("limit", String(query.limit));
    if (query.offset != null) params.set("offset", String(query.offset));
    const qs = params.toString();
    return this.get<ChargeflowListResponse>(
      `/api/v1/chargeflow${qs ? `?${qs}` : ""}`
    );
  }

  async getChargeflow(id: string): Promise<ChargeflowResponse> {
    return this.getPublic<ChargeflowResponse>(
      `/api/v1/chargeflow/${encodeURIComponent(id)}`
    );
  }

  async verifyChargeflow(query: {
    id?: string;
    hash?: string;
    sig?: string;
  }): Promise<ChargeflowVerifyResponse> {
    const params = new URLSearchParams();
    if (query.id) params.set("id", query.id);
    if (query.hash) params.set("hash", query.hash);
    if (query.sig) params.set("sig", query.sig);
    const qs = params.toString();
    return this.getPublic<ChargeflowVerifyResponse>(
      `/api/v1/chargeflow/verify${qs ? `?${qs}` : ""}`
    );
  }

  async retireChargeflow(
    id: string,
    body: { reason?: string } = {}
  ): Promise<ChargeflowResponse> {
    return this.post<ChargeflowResponse>(
      `/api/v1/chargeflow/${encodeURIComponent(id)}/retire`,
      body
    );
  }

  async registerWebhook(body: WebhookRegisterRequest): Promise<WebhookRegisterResponse> {
    return this.post<WebhookRegisterResponse>("/api/v1/webhooks", body);
  }

  async webhooks(): Promise<WebhooksListResponse> {
    return this.get<WebhooksListResponse>("/api/v1/webhooks");
  }

  async deleteWebhook(id: string): Promise<{ ok: boolean; id: string; deleted: boolean }> {
    return this.request("DELETE", `/api/v1/webhooks/${encodeURIComponent(id)}`);
  }

  /** Create a free-tier API key (no auth required). */
  async createKey(body: CreateKeyRequest): Promise<CreateKeyResponse> {
    return this.request<CreateKeyResponse>("POST", "/api/v1/keys", body, false);
  }

  /** Free public read — Watt Score for an AUROS Green compare reference. */
  async greenWattScore(id: string): Promise<GreenWattPublicResponse> {
    return this.getPublic<GreenWattPublicResponse>(
      `/api/green/watt/${encodeURIComponent(id)}`
    );
  }

  /** Free public read — Carbon Quality Score for an AUROS Green compare reference. */
  async greenCarbonQuality(id: string): Promise<GreenCqsPublicResponse> {
    return this.getPublic<GreenCqsPublicResponse>(
      `/api/green/carbon-quality/${encodeURIComponent(id)}`
    );
  }

  /** Batch Watt Scores — up to 50 energy assets per call (1 quota unit). */
  async greenWattBatch(body: GreenWattBatchRequest): Promise<GreenWattBatchResponse> {
    return this.post<GreenWattBatchResponse>("/api/v1/green/watt/batch", body);
  }

  /** Batch Carbon Quality Scores — up to 50 carbon credits per call (1 quota unit). */
  async greenCarbonQualityBatch(
    body: GreenCqsBatchRequest
  ): Promise<GreenCqsBatchResponse> {
    return this.post<GreenCqsBatchResponse>("/api/v1/green/carbon-quality/batch", body);
  }

  private async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  private async getPublic<T>(path: string): Promise<T> {
    return this.request<T>("GET", path, undefined, false);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    auth = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-AUROS-Protocol-Version": "1.0",
    };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (auth) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json()) as T | ProtocolErrorBody;
    if (!res.ok) {
      throw AurosProtocolError.fromResponse(res.status, json as ProtocolErrorBody);
    }
    return json as T;
  }
}
