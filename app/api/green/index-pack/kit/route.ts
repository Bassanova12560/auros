import { NextResponse } from "next/server";

import { getGreenIndexPayload, greenIndexToCsv } from "@/lib/green-index";

export const runtime = "nodejs";

/**
 * Commercial Index Pack kit (citation + CSV).
 * Public download of the same public index with commercial licence header —
 * paid entitlement is tracked via Stripe HITL; redistribution full = partners.
 */
export async function GET() {
  const payload = await getGreenIndexPayload();
  const csv = greenIndexToCsv(payload, {
    rank: "rank",
    name: "name",
    type: "type",
    composite: "composite",
    taxonomy: "taxonomy",
    cqs: "cqs",
    watt: "watt",
    mom: "mom",
    source: "source",
  });

  const kit = [
    "# AUROS Green Index Pack — commercial kit",
    `# Edition: ${payload.editionIso}`,
    "# Licence: internal / tools use under Index Pack subscription.",
    "# Citation: « AUROS Green RWA Index, édition " +
      payload.editionIso +
      ", getauros.com/data/green-index »",
    "# Full market redistribution: contact partners — /data/licence",
    "# Feed JSON: GET /api/green/index",
    "",
    csv,
  ].join("\n");

  return new NextResponse(kit, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="auros-green-index-pack-${payload.editionIso}.txt"`,
      "Cache-Control": "no-store",
    },
  });
}
