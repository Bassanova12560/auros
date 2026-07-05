import { NextResponse } from "next/server";

import { computeH2oScoreFromText } from "@/lib/green/scoring/h2o-score";
import {
  eauPassportVerifyPathForScore,
} from "@/lib/eau/passport";

export const runtime = "nodejs";

/** Public hydrological readiness check — embeddable, routes to AUROS passport. */
export async function POST(request: Request) {
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

  return NextResponse.json({
    ok: true,
    h2o_score: result,
    verify_preview_path: eauPassportVerifyPathForScore(result),
    narrative:
      "Preview only. Platforms and investors will require a verifiable AUROS Hydrological Passport (dossier + optional Green Verified label) for listing-grade attestation.",
    generated_at: new Date().toISOString(),
  });
}
