import { NextRequest, NextResponse } from "next/server";

import {
  sendGreenMarketApproved,
} from "@/lib/emails/send";
import { moderateGreenMarketListing } from "@/lib/green/market/green-market-db";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** POST { table, id, action: approve|reject } — Requires authenticated ops access */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { table?: string; id?: string; action?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const table = body.table;
  const id = body.id?.trim();
  const action = body.action;

  if (
    !id ||
    (table !== "green_market_assets" && table !== "green_market_offers") ||
    (action !== "approve" && action !== "reject")
  ) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await moderateGreenMarketListing({ table, id, action });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  if (action === "approve" && result.contactEmail) {
    void sendGreenMarketApproved(result.contactEmail, {
      name: result.label,
      kind: result.kind,
      locale: "fr",
    });
  }

  if (action === "approve" && table === "green_market_assets") {
    const { notifyGreenMarketGeoAlerts } = await import(
      "@/lib/green/market/notify-alerts"
    );
    void notifyGreenMarketGeoAlerts(id);
  }

  return NextResponse.json({ ok: true });
}
