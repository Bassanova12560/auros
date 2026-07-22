import { NextResponse } from "next/server";

import { isUpstashConfigured } from "@/lib/upstash";

export const runtime = "nodejs";

/** Ops probe for ARL lab ledger. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    product: "arl-lab-ledger",
    persistence: isUpstashConfigured() ? "upstash" : "memory",
    endpoints: {
      account: "GET /api/arl/account?account=",
      mint: "POST /api/arl/mint",
      watt: "POST /api/arl/watt",
      spot: "POST /api/arl/spot",
    },
    disclaimer:
      "Lab ledger only — mirrors ResourceToken + WattCoin economics. Not mainnet listing.",
  });
}
