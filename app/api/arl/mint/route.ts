import { NextResponse } from "next/server";
import { z } from "zod";

import {
  attachArlLabCookie,
  resolveArlLabMutationAccount,
} from "@/lib/arl/lab-session";
import { mintAkWh } from "@/lib/arl/ledger";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({
  accountId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  amount: z.number().positive().max(50_000),
  deviceId: z.string().max(64).optional(),
});

/** Mint lab akWh (demo · cookie session · IP rate-limited · not production oracle). */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`arl-mint:${ip}`, 40, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "rate_limited", message: "Mint rate limit" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", message: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 },
    );
  }

  const session = resolveArlLabMutationAccount(req, parsed.data.accountId);
  if (!session.ok) {
    return NextResponse.json(
      { error: session.error, message: session.message },
      { status: session.status },
    );
  }

  try {
    const snap = await mintAkWh({
      accountId: session.accountId,
      amount: parsed.data.amount,
      deviceId: parsed.data.deviceId,
    });
    const res = NextResponse.json(snap);
    return attachArlLabCookie(res, session.cookieValue);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "mint failed";
    const unavailable = /unavailable|transport|corrupt|save failed/i.test(msg);
    return NextResponse.json(
      { error: unavailable ? "service_unavailable" : "mint_rejected", message: msg },
      { status: unavailable ? 503 : 400 },
    );
  }
}
