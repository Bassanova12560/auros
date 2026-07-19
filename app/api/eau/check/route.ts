import { NextResponse } from "next/server";

import { computeH2oScoreFromText } from "@/lib/green/scoring/h2o-score";
import { eauPassportVerifyPath } from "@/lib/eau/passport";
import { checkRateLimitAsync, getRequestIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EAU_CHECK_LIMIT = 30;
const EAU_CHECK_WINDOW_MS = 60 * 60 * 1000;

/** Public hydrological readiness check — embeddable, routes to AUROS passport. */
export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const rate = await checkRateLimitAsync(
    `eau-check:${ip}`,
    EAU_CHECK_LIMIT,
    EAU_CHECK_WINDOW_MS
  );
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limit",
        message: `Max ${EAU_CHECK_LIMIT} checks/hour. Retry later or use /api/green/h2o/{id}.`,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(EAU_CHECK_LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rate.reset),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const text =
    typeof body === "object" &&
    body !== null &&
    "text" in body &&
    typeof (body as { text: unknown }).text === "string"
      ? (body as { text: string }).text.trim()
      : "";

  if (text.length < 10) {
    return NextResponse.json(
      { ok: false, error: "text_too_short", message: "Min 10 characters" },
      { status: 400 }
    );
  }

  const result = computeH2oScoreFromText(text);
  if (!result) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_water_asset",
        message:
          "Description not recognized as hydrological asset — try concession, m³/year, water rights, desalination or blue bond.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      h2o_score: result,
      verify_preview_path: eauPassportVerifyPath(result.preview_id),
      narrative:
        "Preview only. Platforms and investors will require a verifiable AUROS Hydrological Passport (dossier + optional Green Verified label) for listing-grade attestation.",
      generated_at: new Date().toISOString(),
    },
    {
      headers: {
        "X-RateLimit-Limit": String(EAU_CHECK_LIMIT),
        "X-RateLimit-Remaining": String(rate.remaining),
        "X-RateLimit-Reset": String(rate.reset),
      },
    }
  );
}
