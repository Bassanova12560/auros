import { NextResponse } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { runAssetRedTeam } from "@/lib/toll/red-team";

export const runtime = "nodejs";

/** POST /api/green/toll/red-team-pilot — desk demo without burning API credits */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(
    `toll-red-team-pilot:${ip}`,
    20,
    3_600_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const q = String(
    body.q ?? body.assetDnaId ?? body.assetQuery ?? ""
  ).trim();
  if (!q) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  const result = await runAssetRedTeam({
    assetDnaId: q,
    assetQuery: q,
  });

  return NextResponse.json({ ok: true, ...result });
}
