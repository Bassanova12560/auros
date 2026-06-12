import { readFileSync } from "node:fs";
import { join } from "node:path";

import { isSupabaseConfigured } from "./auth/keys";
import { PROTOCOL_VERSION } from "./constants";
import { rankProtocolJurisdictions } from "./jurisdictions/rank";
import { listProtocolProducts } from "./products/adapter";
import { computeProtocolScore } from "./scoring/compute-score";

export type ServiceHealth = "operational" | "degraded" | "down";

export type ServiceCheck = {
  status: ServiceHealth;
  latency_ms?: number;
  message?: string;
};

export type ProtocolStatusPayload = {
  status: ServiceHealth;
  services: Record<string, ServiceCheck>;
  version: string;
  app_version: string;
  timestamp: string;
  deploy: {
    environment: string;
    commit: string | null;
    ref: string | null;
  };
};

function readAppVersion(): string {
  try {
    const raw = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

async function timedCheck(fn: () => void | Promise<void>): Promise<ServiceCheck> {
  const start = performance.now();
  try {
    await fn();
    return { status: "operational", latency_ms: Math.round(performance.now() - start) };
  } catch (err) {
    return {
      status: "down",
      latency_ms: Math.round(performance.now() - start),
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

function aggregateStatus(services: Record<string, ServiceCheck>): ServiceHealth {
  const values = Object.values(services);
  if (values.some((s) => s.status === "down")) return "down";
  if (values.some((s) => s.status === "degraded")) return "degraded";
  return "operational";
}

async function checkProductsCatalog(): Promise<ServiceCheck> {
  const start = performance.now();
  try {
    const result = await listProtocolProducts({
      limit: 1,
      page: 1,
      sort: "apy",
      category: "all",
    });
    if (!result.products) throw new Error("Products payload missing");
    return { status: "operational", latency_ms: Math.round(performance.now() - start) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("incrementalCache")) {
      return {
        status: "degraded",
        latency_ms: Math.round(performance.now() - start),
        message: "Catalog cache requires Next.js runtime",
      };
    }
    return {
      status: "down",
      latency_ms: Math.round(performance.now() - start),
      message,
    };
  }
}

/** Internal health probe for scoring, catalog, jurisdictions, and key storage. */
export async function getProtocolStatus(): Promise<ProtocolStatusPayload> {
  const [scoring, products, jurisdictions] = await Promise.all([
    timedCheck(() => {
      computeProtocolScore({ description: "AUROS protocol health probe" });
    }),
    checkProductsCatalog(),
    timedCheck(async () => {
      const ranked = rankProtocolJurisdictions({
        asset_type: "real_estate",
        investor_type: "professional",
      });
      if (!ranked.length) throw new Error("Jurisdiction ranking empty");
    }),
  ]);

  const database: ServiceCheck = isSupabaseConfigured()
    ? { status: "operational", message: "Supabase key store connected" }
    : {
        status: "degraded",
        message: "Local key store — Supabase not configured",
      };

  const services = {
    scoring,
    products,
    jurisdictions,
    database,
  };

  return {
    status: aggregateStatus(services),
    services,
    version: PROTOCOL_VERSION,
    app_version: readAppVersion(),
    timestamp: new Date().toISOString(),
    deploy: {
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      ref: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    },
  };
}
