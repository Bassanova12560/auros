import { NextResponse } from "next/server";

import { isUpstashConfigured } from "@/lib/upstash";

export const runtime = "nodejs";

/** Health probe for ARL lab ledger — minimal surface (no endpoint map). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    product: "arl-lab-ledger",
    persistence: isUpstashConfigured() ? "durable" : "ephemeral",
    disclaimer: "Lab ledger only — not mainnet. HITL for production settlement.",
  });
}
