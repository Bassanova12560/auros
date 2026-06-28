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
  AurosGreen: () => AurosGreen,
  AurosGreenError: () => AurosGreenError
});
module.exports = __toCommonJS(index_exports);

// src/errors.ts
var AurosGreenError = class _AurosGreenError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = "AurosGreenError";
    this.code = code;
    this.status = status;
  }
  static fromResponse(status, body) {
    const code = body.error?.code ?? "unknown_error";
    const message = body.error?.message ?? "Request failed";
    return new _AurosGreenError(code, message, status);
  }
};

// src/client.ts
var DEFAULT_BASE_URL = "https://getauros.com";
var AurosGreen = class {
  constructor(options = {}) {
    this.apiKey = options.apiKey?.trim() || void 0;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.fetchFn = options.fetch ?? globalThis.fetch;
    if (!this.fetchFn) {
      throw new Error("fetch is not available \u2014 pass options.fetch");
    }
  }
  async getScore(id) {
    return this.get(`/api/green/score/${encodeURIComponent(id)}`);
  }
  async getScores(ids) {
    const qs = new URLSearchParams({ ids: ids.join(",") });
    return this.get(`/api/green/scores?${qs.toString()}`);
  }
  async analyzeCarbon(text) {
    return this.post("/api/green/score/analyze", { text });
  }
  async getRegistry(serial) {
    const qs = new URLSearchParams({ serial });
    return this.get(`/api/green/registry?${qs.toString()}`);
  }
  async getChangelog() {
    return this.get("/api/green/changelog");
  }
  async getNatureIndex() {
    return this.get("/api/green/nature-index");
  }
  async getNatureScore(id) {
    return this.get(
      `/api/green/nature-score/${encodeURIComponent(id)}`
    );
  }
  async getScoreHistory(id) {
    return this.get(
      `/api/green/score/${encodeURIComponent(id)}/history`
    );
  }
  async getDpp(id, format) {
    const qs = format === "jsonld" ? "?format=jsonld" : "";
    const path = `/api/green/dpp/${encodeURIComponent(id)}${qs}`;
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      headers: format === "jsonld" ? { ...this.headers(), Accept: "application/ld+json" } : this.headers()
    });
    const body = await res.json();
    if (!res.ok) {
      throw AurosGreenError.fromResponse(res.status, body);
    }
    return body;
  }
  headers() {
    const h = { Accept: "application/json" };
    if (this.apiKey) h.Authorization = `Bearer ${this.apiKey}`;
    return h;
  }
  async get(path) {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, { headers: this.headers() });
    return this.parse(res);
  }
  async post(path, body) {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { ...this.headers(), "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return this.parse(res);
  }
  async parse(res) {
    const body = await res.json();
    if (!res.ok) {
      throw AurosGreenError.fromResponse(res.status, body);
    }
    return body;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AurosGreen,
  AurosGreenError
});
