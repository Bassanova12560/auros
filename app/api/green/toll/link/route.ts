import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/protocol/auth/keys";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { transferTollCredits } from "@/lib/toll/metering";

export const runtime = "nodejs";

/**
 * POST /api/green/toll/link — Bearer key + { fromEmail }
 * Moves bonus credits from email:{fromEmail} → key:{hash}.
 */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`toll-link:${ip}`, 20, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  const auth = request.headers.get("authorization")?.trim();
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const raw = auth.slice(7).trim();
  const validation = await validateApiKey(raw);
  if (!validation.valid || !validation.keyHash) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const fromEmail =
    typeof body.fromEmail === "string"
      ? body.fromEmail.trim().toLowerCase()
      : "";
  if (!fromEmail.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const result = transferTollCredits({
    fromSubjectId: `email:${fromEmail}`,
    toSubjectId: `key:${validation.keyHash}`,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    transferred: result.transferred,
    to: `key:${validation.keyHash.slice(0, 8)}…`,
  });
}
