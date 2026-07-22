import { NextResponse } from "next/server";

import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";
import { probeUpstashStatus } from "@/lib/upstash";

export const runtime = "nodejs";

/** GET /api/v1/toll/infra-status — Upstash + infra probe (ops) */
export async function GET(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimitAsync(
    `toll-infra:${ip}`,
    30,
    60_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }
  const upstash = await probeUpstashStatus();
  return NextResponse.json({
    ok: true,
    upstash,
    docs: "/docs/UPSTASH-SETUP.md",
  });
}
