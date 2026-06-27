import { NextResponse } from "next/server";

import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { computeCarbonQualityForCompareRow } from "@/lib/green/scoring/carbon-quality";

export const revalidate = 3600;

/** Free public read — Carbon Quality Score for a catalog reference id. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const row = GREEN_COMPARE_ROWS.find((r) => r.id === id);
  if (!row) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const result = computeCarbonQualityForCompareRow(row);
  if (!result) {
    return NextResponse.json(
      { ok: false, error: "not_carbon_asset", id },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ok: true,
    id,
    name: row.name,
    carbon_quality: result,
    disclaimer:
      "Indicative AUROS Carbon Quality Score — not a Verra/ICVCM certification.",
    generated_at: new Date().toISOString(),
  });
}
