import { NextResponse } from "next/server";

import { WATER_COMPARE_ROWS } from "@/lib/green/water-compare-data";
import { computeH2oScoreForCompareRow } from "@/lib/green/scoring/h2o-score";
import { eauPassportVerifyPath } from "@/lib/eau/passport";

export const revalidate = 3600;

/** Free public read — H₂O Score for a hydrological catalog reference id. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const row = WATER_COMPARE_ROWS.find((r) => r.id === id);
  if (!row) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const result = computeH2oScoreForCompareRow(row);

  return NextResponse.json({
    ok: true,
    id,
    name: row.name,
    h2o_score: result,
    verify_preview_path: eauPassportVerifyPath(result.preview_id),
    disclaimer:
      "Indicative AUROS H₂O Score — hydrological readiness signal, not a concession audit. Full Passeport Hydrique AUROS requires dossier on getauros.com.",
    batch_api: "/api/v1/green/h2o/batch",
    passport_unlock: "/comment-tokeniser/eau",
    docs: "/developers/docs/endpoint-green-h2o",
    generated_at: new Date().toISOString(),
  });
}
