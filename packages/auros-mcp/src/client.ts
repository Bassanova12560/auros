const DEFAULT_BASE_URL = "https://getauros.com";
const DEFAULT_DEMO_KEY = "auros_pk_test_demo";

export type AurosMcpClientOptions = {
  apiKey?: string;
  baseUrl?: string;
};

export class AurosApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: AurosMcpClientOptions = {}) {
    this.apiKey = (options.apiKey ?? process.env.AUROS_API_KEY ?? DEFAULT_DEMO_KEY).trim();
    this.baseUrl = (options.baseUrl ?? process.env.AUROS_BASE_URL ?? DEFAULT_BASE_URL).replace(
      /\/$/,
      ""
    );
    if (!this.apiKey) {
      throw new Error("AUROS_API_KEY is required");
    }
  }

  async score(body: Record<string, unknown>): Promise<unknown> {
    return this.request("POST", "/api/v1/score", body);
  }

  async scoreBatch(body: Record<string, unknown>): Promise<unknown> {
    return this.request("POST", "/api/v1/score/batch", body);
  }

  async products(query: Record<string, unknown> = {}): Promise<unknown> {
    return this.request("GET", "/api/v1/products", undefined, query);
  }

  async jurisdictions(query: Record<string, unknown> = {}): Promise<unknown> {
    return this.request("GET", "/api/v1/jurisdictions", undefined, query);
  }

  async checklist(body: Record<string, unknown>): Promise<unknown> {
    return this.request("POST", "/api/v1/checklist", body);
  }

  async compare(body: Record<string, unknown>): Promise<unknown> {
    return this.request("POST", "/api/v1/compare", body);
  }

  async regulatoryFeed(query: Record<string, unknown> = {}): Promise<unknown> {
    return this.request("GET", "/api/v1/regulatory/feed", undefined, query);
  }

  async status(): Promise<unknown> {
    return this.request("GET", "/api/v1/status", undefined, undefined, false);
  }

  private async request(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    query?: Record<string, unknown>,
    auth = true
  ): Promise<unknown> {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }
    }
    const qs = params.toString();
    const url = `${this.baseUrl}${path}${qs ? `?${qs}` : ""}`;

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

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json()) as unknown;
    if (!res.ok) {
      const err =
        typeof json === "object" && json !== null && "error" in json
          ? (json as { error?: { code?: string; message?: string } }).error
          : undefined;
      throw new Error(
        `[${err?.code ?? res.status}] ${err?.message ?? res.statusText} (${method} ${path})`
      );
    }
    return json;
  }
}

export { DEFAULT_DEMO_KEY, DEFAULT_BASE_URL };
