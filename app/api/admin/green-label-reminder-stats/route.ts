import { NextRequest, NextResponse } from "next/server";

import { getGreenLabelReminderStats } from "@/lib/green/label-reminder-stats";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** GET label dossier reminder stats — Requires authenticated ops access */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const stats = await getGreenLabelReminderStats();
  if (!stats) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, stats });
}
