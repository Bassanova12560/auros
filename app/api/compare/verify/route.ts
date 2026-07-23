import { NextResponse } from "next/server";

import { verifyCompareSignature } from "@/lib/comparators/api/signing";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

/** Verify a compare snapshot HMAC (content_hash + signature). */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const rate = await checkRateLimitAsync(`compare-verify:${ip}`, 120, 3_600_000);
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const obj = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const contentHash =
    typeof obj.content_hash === "string"
      ? obj.content_hash
      : typeof obj.contentHash === "string"
        ? obj.contentHash
        : "";
  const signature =
    typeof obj.signature === "string"
      ? obj.signature
      : typeof obj.sig === "string"
        ? obj.sig
        : "";

  if (!contentHash || !signature) {
    return NextResponse.json(
      { ok: false, error: "content_hash_and_signature_required" },
      { status: 400 }
    );
  }

  const valid = verifyCompareSignature(contentHash, signature);
  return NextResponse.json({
    ok: true,
    valid,
    alg: "HMAC-SHA256",
    prefix: "auros-compare:v1:",
  });
}
