import { NextResponse } from "next/server";

import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { computeWattScoreForCompareRow } from "@/lib/green/scoring/watt-score";

export const revalidate = 3600;

/** Free public read — Watt Score for a catalog reference id. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const row = GREEN_COMPARE_ROWS.find((r) => r.id === id);
  if (!row) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const result = computeWattScoreForCompareRow(row);
  if (!result) {
    return NextResponse.json(
      { ok: false, error: "not_energy_asset", id },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ok: true,
    id,
    name: row.name,
    watt_score: result,
    disclaimer:
      "Indicative AUROS Watt Score — energy value signal, not a production audit.",
    batch_api: "/api/v1/green/watt/batch",
    companion_api: "/api/green/carbon-quality/{id}",
    docs: "/developers/docs/endpoint-green-watt",
    generated_at: new Date().toISOString(),
  });
}
