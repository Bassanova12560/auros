/**
 * Durable JSON blob store for compare alert watchers / snapshots / delivery ledger.
 * Order: Upstash Redis → .data file → ephemeral (warn).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { isUpstashConfigured, upstashCommand } from "@/lib/upstash";

export type AlertsStoreBackend = "upstash" | "file" | "ephemeral";

export type AlertsPersistResult<T> = {
  value: T;
  backend: AlertsStoreBackend;
  ephemeral: boolean;
  warning: string | null;
};

const DATA_DIR = join(process.cwd(), ".data");

const EPHEMERAL_WARNING =
  "ephemeral_store — set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN for durable watchers on serverless";

function filePath(name: string): string {
  return join(DATA_DIR, name);
}

function readFileJson<T>(name: string, fallback: T): T {
  try {
    const path = filePath(name);
    if (!existsSync(path)) return fallback;
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeFileJson(name: string, value: unknown): boolean {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(filePath(name), JSON.stringify(value, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function loadAlertsJson<T>(
  redisKey: string,
  fileName: string,
  fallback: T
): Promise<AlertsPersistResult<T>> {
  if (isUpstashConfigured()) {
    const res = await upstashCommand(["GET", redisKey]);
    if (res != null) {
      if (res.result == null || res.result === "") {
        return {
          value: fallback,
          backend: "upstash",
          ephemeral: false,
          warning: null,
        };
      }
      if (typeof res.result === "string") {
        try {
          return {
            value: JSON.parse(res.result) as T,
            backend: "upstash",
            ephemeral: false,
            warning: null,
          };
        } catch {
          return {
            value: fallback,
            backend: "upstash",
            ephemeral: false,
            warning: "corrupt_upstash_blob_reset",
          };
        }
      }
    }
    // Transport failure — try file before ephemeral
  }

  const fromFile = readFileJson<T | null>(fileName, null);
  if (fromFile != null) {
    return {
      value: fromFile,
      backend: "file",
      ephemeral: false,
      warning: isUpstashConfigured()
        ? "upstash_unavailable_file_fallback"
        : null,
    };
  }

  return {
    value: fallback,
    backend: "ephemeral",
    ephemeral: true,
    warning: EPHEMERAL_WARNING,
  };
}

export async function saveAlertsJson<T>(
  redisKey: string,
  fileName: string,
  value: T
): Promise<AlertsPersistResult<T>> {
  if (isUpstashConfigured()) {
    const payload = JSON.stringify(value);
    const res = await upstashCommand(["SET", redisKey, payload]);
    if (res != null) {
      // Best-effort mirror to file for local ops / debug
      writeFileJson(fileName, value);
      return {
        value,
        backend: "upstash",
        ephemeral: false,
        warning: null,
      };
    }
  }

  if (writeFileJson(fileName, value)) {
    return {
      value,
      backend: "file",
      ephemeral: false,
      warning: isUpstashConfigured()
        ? "upstash_unavailable_file_fallback"
        : null,
    };
  }

  return {
    value,
    backend: "ephemeral",
    ephemeral: true,
    warning: EPHEMERAL_WARNING,
  };
}

export const ALERTS_WATCHERS_KEY = "auros:compare:alerts:watchers:v1";
export const ALERTS_SNAPSHOTS_KEY = "auros:compare:alerts:snapshots:v1";
export const ALERTS_DELIVERIES_KEY = "auros:compare:alerts:deliveries:v1";

export const ALERTS_WATCHERS_FILE = "compare-alerts-waitlist.json";
export const ALERTS_SNAPSHOTS_FILE = "compare-alerts-metric-snapshots.json";
export const ALERTS_DELIVERIES_FILE = "compare-alerts-deliveries.json";
