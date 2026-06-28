import { checkRateLimit as checkMemoryRateLimit } from "@/lib/rate-limit";

import {
  ENTERPRISE_TIER_MONTHLY_LIMIT,
  FREE_TIER_MONTHLY_LIMIT,
  PREMIUM_TIER_MONTHLY_LIMIT,
} from "../constants";
import { monthQuotaResetUnix } from "../rate-limit-context";
import { findKeyRecord, getKeyUsage, incrementKeyUsage, type ApiKeyTier } from "./keys";

const IP_BURST_LIMIT = 30;
const IP_BURST_WINDOW_MS = 60_000;

export type ProtocolRateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  reset: number;
};

const MONTH_MS = 30 * 24 * 3_600_000;

type UpstashResponse = { result?: number | string | null };

async function upstashCommand(command: (string | number)[]): Promise<UpstashResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    return (await res.json()) as UpstashResponse;
  } catch {
    return null;
  }
}

function monthBucket(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthlyLimitForTier(tier: ApiKeyTier, isDemo: boolean): number {
  if (isDemo) return 50;
  if (tier === "enterprise") return ENTERPRISE_TIER_MONTHLY_LIMIT;
  if (tier === "premium" || tier === "monitor") return PREMIUM_TIER_MONTHLY_LIMIT;
  return FREE_TIER_MONTHLY_LIMIT;
}

export async function checkProtocolRateLimit(
  keyId: string,
  isDemo: boolean
): Promise<ProtocolRateLimitResult> {
  let tier: ApiKeyTier = "free";
  if (!isDemo && keyId !== "demo") {
    const record = await findKeyRecord(keyId);
    if (record) tier = record.tier;
  }
  const limit = monthlyLimitForTier(tier, isDemo);
  const reset = monthQuotaResetUnix();
  const bucket = monthBucket();
  const redisKey = `auros:protocol:${keyId}:${bucket}`;

  const upstash = await upstashCommand(["INCR", redisKey]);
  if (upstash?.result !== undefined && upstash.result !== null) {
    const count = Number(upstash.result);
    if (count === 1) {
      await upstashCommand(["PEXPIRE", redisKey, MONTH_MS]);
    }
    // Mirror usage to DB so quota nurture emails stay accurate in production.
    if (!isDemo && keyId !== "demo") {
      void incrementKeyUsage(keyId);
    }
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
      reset,
    };
  }

  const usage = await getKeyUsage(keyId);
  const next = usage + 1;
  if (next > limit) {
    return { allowed: false, remaining: 0, limit, reset };
  }
  await incrementKeyUsage(keyId);
  return { allowed: true, remaining: limit - next, limit, reset };
}

export function checkIpBurstLimit(ip: string): ProtocolRateLimitResult {
  const { allowed, remaining, reset } = checkMemoryRateLimit(
    `protocol-ip:${ip}`,
    IP_BURST_LIMIT,
    IP_BURST_WINDOW_MS
  );
  return { allowed, remaining, limit: IP_BURST_LIMIT, reset };
}
