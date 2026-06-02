import { NextRequest, NextResponse } from "next/server";

import { listPendingGreenLabelApplications } from "@/lib/green/publish-label";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** GET pending label applications — Authorization: Bearer CRON_SECRET */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const items = await listPendingGreenLabelApplications();
  return NextResponse.json({ ok: true, items });
}
