import { absoluteUrl } from "@/lib/comparators/site";

import { GREEN_API_OPENAPI_PATH } from "./constants";

export const GREEN_API_STATUS_PATHS = [
  "/api/green/score/toucan",
  "/api/green/nature-index",
  "/api/green/registry?serial=VCS-674",
  GREEN_API_OPENAPI_PATH,
] as const;

export type GreenApiStatusCheck = {
  path: string;
  status: number;
  ok: boolean;
  latency_ms: number;
  error?: string;
};

export type GreenApiStatusPayload = {
  ok: boolean;
  service: "auros-green-api";
  version: "1.1.0";
  base: string;
  checks: GreenApiStatusCheck[];
  docs: string;
  press: string;
  checked_at: string;
};

const PROBE_TIMEOUT_MS = 8_000;

export async function buildGreenApiStatus(baseInput?: string): Promise<GreenApiStatusPayload> {
  const base = (baseInput ?? absoluteUrl("")).replace(/\/$/, "");
  const checks: GreenApiStatusCheck[] = [];

  for (const path of GREEN_API_STATUS_PATHS) {
    const url = `${base}${path}`;
    const started = Date.now();
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        next: { revalidate: 0 },
      });
      checks.push({
        path,
        status: res.status,
        ok: res.status >= 200 && res.status < 300,
        latency_ms: Date.now() - started,
      });
    } catch (err) {
      checks.push({
        path,
        status: 0,
        ok: false,
        latency_ms: Date.now() - started,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    ok: checks.every((c) => c.ok),
    service: "auros-green-api",
    version: "1.1.0",
    base,
    checks,
    docs: "/green/api",
    press: "/green/press",
    checked_at: new Date().toISOString(),
  };
}
