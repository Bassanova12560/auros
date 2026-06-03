import { NextRequest, NextResponse } from "next/server";

import { renewGreenCompareSnapshot } from "@/lib/green/compare-snapshot";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const RENEW_LIMIT = 20;
const RENEW_WINDOW_MS = 3_600_000;

/** POST — extend compare snapshot TTL ({ id }). */
export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(
    `green-compare-snapshot-renew:${ip}`,
    RENEW_LIMIT,
    RENEW_WINDOW_MS
  );
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const id =
    body && typeof body === "object" && "id" in body && typeof body.id === "string"
      ? body.id.trim()
      : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const result = await renewGreenCompareSnapshot(id);
  if (!result.ok) {
    const status = result.error === "not_found" ? 404 : 503;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    expiresAt: result.expiresAt,
    renewed: result.renewed,
  });
}
