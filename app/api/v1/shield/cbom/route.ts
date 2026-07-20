import { NextResponse } from "next/server";

import { buildCbom, SHIELD_DISCLAIMER, SHIELD_VERSION } from "@/lib/shield";

export const runtime = "nodejs";

/** Public sample CBOM — on-prem seals still require customer-held keys. */
export async function GET() {
  return NextResponse.json(
    {
      ...buildCbom("cloud_gateway"),
      note: "Sample inventory from getauros.com — production seals run via @adrien1212balitrand/auros-shield on customer premises.",
      product_url: "https://getauros.com/developers/shield",
      package: "@adrien1212balitrand/auros-shield",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        "X-AUROS-Shield-Version": SHIELD_VERSION,
        "X-AUROS-Disclaimer": SHIELD_DISCLAIMER.slice(0, 120),
      },
    }
  );
}
