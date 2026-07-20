// src/errors.ts
var AurosProtocolError = class _AurosProtocolError extends Error {
  code;
  status;
  constructor(code, message, status) {
    super(message);
    this.name = "AurosProtocolError";
    this.code = code;
    this.status = status;
  }
  static fromResponse(status, body) {
    const code = body.error?.code ?? "unknown_error";
    const message = body.error?.message ?? "Request failed";
    return new _AurosProtocolError(code, message, status);
  }
};

// src/client.ts
var DEFAULT_BASE_URL = "https://getauros.com";
var AurosProtocol = class {
  apiKey;
  baseUrl;
  fetchFn;
  constructor(options) {
    if (!options.apiKey?.trim()) {
      throw new Error("apiKey is required");
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.fetchFn = options.fetch ?? globalThis.fetch;
    if (!this.fetchFn) {
      throw new Error("fetch is not available \u2014 pass options.fetch");
    }
  }
  async score(body) {
    return this.post("/api/v1/score", body);
  }
  async scoreBatch(body) {
    return this.post("/api/v1/score/batch", body);
  }
  async scoreHistory(id) {
    return this.get(
      `/api/v1/score/${encodeURIComponent(id)}/history`
    );
  }
  async products(query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== void 0 && value !== null) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    return this.get(`/api/v1/products${qs ? `?${qs}` : ""}`);
  }
  async compare(body) {
    return this.post("/api/v1/compare", body);
  }
  async jurisdictions(query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== void 0 && value !== null) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    return this.get(
      `/api/v1/jurisdictions${qs ? `?${qs}` : ""}`
    );
  }
  async checklist(body) {
    return this.post("/api/v1/checklist", body);
  }
  async monitor(body) {
    return this.post("/api/v1/monitor", body);
  }
  async getMonitor(id) {
    return this.get(`/api/v1/monitor/${encodeURIComponent(id)}`);
  }
  async deleteMonitor(id) {
    return this.request("DELETE", `/api/v1/monitor/${encodeURIComponent(id)}`);
  }
  async dossier(body) {
    return this.post("/api/v1/dossier", body);
  }
  async attest(body) {
    return this.post("/api/v1/attest", body);
  }
  async verifyAttest(query) {
    const params = new URLSearchParams();
    if (query.id) params.set("id", query.id);
    if (query.hash) params.set("hash", query.hash);
    if (query.sig) params.set("sig", query.sig);
    const qs = params.toString();
    return this.getPublic(
      `/api/v1/attest/verify${qs ? `?${qs}` : ""}`
    );
  }
  async createChargeflowE(body) {
    return this.post("/api/v1/chargeflow", body);
  }
  async createChargeflowW(body) {
    return this.post("/api/v1/chargeflow/w", body);
  }
  async createChargeflowF(body) {
    return this.post("/api/v1/chargeflow/f", body);
  }
  async createChargeflowEBatch(body) {
    return this.post("/api/v1/chargeflow/batch", body);
  }
  async createChargeflowWBatch(body) {
    return this.post(
      "/api/v1/chargeflow/w/batch",
      body
    );
  }
  async createChargeflowFBatch(body) {
    return this.post(
      "/api/v1/chargeflow/f/batch",
      body
    );
  }
  /** Offline OCPI CDR / CSV rows → CFU-E batch (not a live OCPI client). */
  async createChargeflowFromOcpi(body) {
    return this.post(
      "/api/v1/chargeflow/from-ocpi",
      body
    );
  }
  async listChargeflowPartners() {
    return this.getPublic(
      "/api/v1/chargeflow/partners"
    );
  }
  async syncChargeflowPartner(body) {
    return this.post(
      "/api/v1/chargeflow/partners/sync",
      body
    );
  }
  async listChargeflow(query = {}) {
    const params = new URLSearchParams();
    if (query.kind) params.set("kind", query.kind);
    if (query.status) params.set("status", query.status);
    if (query.operator_id) params.set("operator_id", query.operator_id);
    if (query.limit != null) params.set("limit", String(query.limit));
    if (query.offset != null) params.set("offset", String(query.offset));
    const qs = params.toString();
    return this.get(
      `/api/v1/chargeflow${qs ? `?${qs}` : ""}`
    );
  }
  async getChargeflow(id) {
    return this.getPublic(
      `/api/v1/chargeflow/${encodeURIComponent(id)}`
    );
  }
  async verifyChargeflow(query) {
    const params = new URLSearchParams();
    if (query.id) params.set("id", query.id);
    if (query.hash) params.set("hash", query.hash);
    if (query.sig) params.set("sig", query.sig);
    const qs = params.toString();
    return this.getPublic(
      `/api/v1/chargeflow/verify${qs ? `?${qs}` : ""}`
    );
  }
  async retireChargeflow(id, body = {}) {
    return this.post(
      `/api/v1/chargeflow/${encodeURIComponent(id)}/retire`,
      body
    );
  }
  /** Premium institutional CFU portfolio export (JSON). Use format=csv via fetch for CSV. */
  async chargeflowExport(query = {}) {
    const params = new URLSearchParams();
    params.set("format", "json");
    if (query.kind) params.set("kind", query.kind);
    if (query.status) params.set("status", query.status);
    if (query.operator_id) params.set("operator_id", query.operator_id);
    if (query.limit != null) params.set("limit", String(query.limit));
    return this.get(
      `/api/v1/chargeflow/export?${params.toString()}`
    );
  }
  /** Watts Reserve — create reservation intent (Premium). */
  async wattsReserve(body) {
    return this.post("/api/v1/watts/reserve", body);
  }
  async wattsReservation(id) {
    return this.get(
      `/api/v1/watts/reserve/${encodeURIComponent(id)}`
    );
  }
  async wattsConfirm(id) {
    return this.post(
      `/api/v1/watts/reserve/${encodeURIComponent(id)}/confirm`,
      {}
    );
  }
  async wattsSettle(id, body = {}) {
    return this.post(
      `/api/v1/watts/reserve/${encodeURIComponent(id)}/settle`,
      body
    );
  }
  async wattsCreateOffer(body) {
    return this.post("/api/v1/watts/offers", body);
  }
  async wattsOffers(query = {}) {
    const params = new URLSearchParams();
    if (query.mine) params.set("mine", "1");
    if (query.country) params.set("country", query.country);
    if (query.status) params.set("status", query.status);
    const qs = params.toString();
    return this.get(
      `/api/v1/watts/offers${qs ? `?${qs}` : ""}`
    );
  }
  async wattsMatchOffers(body) {
    return this.post(
      "/api/v1/watts/offers/match",
      body
    );
  }
  async wattsWithdrawOffer(id) {
    return this.post(
      `/api/v1/watts/offers/${encodeURIComponent(id)}/withdraw`,
      {}
    );
  }
  async wattsSecondaryList(body) {
    return this.post(
      "/api/v1/watts/secondary",
      body
    );
  }
  async wattsSecondary(query = {}) {
    const params = new URLSearchParams();
    if (query.mine) params.set("mine", "1");
    const qs = params.toString();
    return this.get(
      `/api/v1/watts/secondary${qs ? `?${qs}` : ""}`
    );
  }
  async wattsSecondaryInterest(id, body = {}) {
    return this.post(
      `/api/v1/watts/secondary/${encodeURIComponent(id)}/interest`,
      body
    );
  }
  async wattsWithdrawSecondary(id) {
    return this.post(
      `/api/v1/watts/secondary/${encodeURIComponent(id)}/withdraw`,
      {}
    );
  }
  async registerWebhook(body) {
    return this.post("/api/v1/webhooks", body);
  }
  async webhooks() {
    return this.get("/api/v1/webhooks");
  }
  async deleteWebhook(id) {
    return this.request("DELETE", `/api/v1/webhooks/${encodeURIComponent(id)}`);
  }
  /** Create a free-tier API key (no auth required). */
  async createKey(body) {
    return this.request("POST", "/api/v1/keys", body, false);
  }
  /** Free public read — Watt Score for an AUROS Green compare reference. */
  async greenWattScore(id) {
    return this.getPublic(
      `/api/green/watt/${encodeURIComponent(id)}`
    );
  }
  /** Free public read — Carbon Quality Score for an AUROS Green compare reference. */
  async greenCarbonQuality(id) {
    return this.getPublic(
      `/api/green/carbon-quality/${encodeURIComponent(id)}`
    );
  }
  /** Batch Watt Scores — up to 50 energy assets per call (1 quota unit). */
  async greenWattBatch(body) {
    return this.post("/api/v1/green/watt/batch", body);
  }
  /** Batch Carbon Quality Scores — up to 50 carbon credits per call (1 quota unit). */
  async greenCarbonQualityBatch(body) {
    return this.post("/api/v1/green/carbon-quality/batch", body);
  }
  async get(path) {
    return this.request("GET", path);
  }
  async getPublic(path) {
    return this.request("GET", path, void 0, false);
  }
  async post(path, body) {
    return this.request("POST", path, body);
  }
  async request(method, path, body, auth = true) {
    const headers = {
      Accept: "application/json",
      "X-AUROS-Protocol-Version": "1.0"
    };
    if (body !== void 0) {
      headers["Content-Type"] = "application/json";
    }
    if (auth) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
    const json = await res.json();
    if (!res.ok) {
      throw AurosProtocolError.fromResponse(res.status, json);
    }
    return json;
  }
};
export {
  AurosProtocol,
  AurosProtocolError
};
