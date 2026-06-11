import { checkRateLimit as checkMemoryRateLimit } from "@/lib/rate-limit";

import { FREE_TIER_MONTHLY_LIMIT } from "../constants";
import { getKeyUsage, incrementKeyUsage } from "./keys";

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

export async function checkProtocolRateLimit(
  keyId: string,
  isDemo: boolean
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limit = isDemo ? 50 : FREE_TIER_MONTHLY_LIMIT;
  const bucket = monthBucket();
  const redisKey = `auros:protocol:${keyId}:${bucket}`;

  const upstash = await upstashCommand(["INCR", redisKey]);
  if (upstash?.result !== undefined && upstash.result !== null) {
    const count = Number(upstash.result);
    if (count === 1) {
      await upstashCommand(["PEXPIRE", redisKey, MONTH_MS]);
    }
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
    };
  }

  const usage = await getKeyUsage(keyId);
  const next = usage + 1;
  if (next > limit) {
    return { allowed: false, remaining: 0, limit };
  }
  await incrementKeyUsage(keyId);
  return { allowed: true, remaining: limit - next, limit };
}

export function checkIpBurstLimit(ip: string): { allowed: boolean } {
  const { allowed } = checkMemoryRateLimit(`protocol-ip:${ip}`, 30, 60_000);
  return { allowed };
}
