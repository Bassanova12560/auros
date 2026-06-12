"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AurosProtocol: () => AurosProtocol,
  AurosProtocolError: () => AurosProtocolError
});
module.exports = __toCommonJS(index_exports);

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
  async get(path) {
    return this.request("GET", path);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AurosProtocol,
  AurosProtocolError
});
