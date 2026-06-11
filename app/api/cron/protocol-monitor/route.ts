import { NextResponse } from "next/server";

import { checkRegulatoryUpdates } from "@/lib/protocol/monitor/check-regulatory-updates";

/** Cron endpoint — protect with CRON_SECRET header. Wire in vercel.json or Trigger.dev. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = req.headers.get("authorization")?.trim();

  if (secret) {
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (bearer !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 503 }
    );
  }

  const result = await checkRegulatoryUpdates();
  return NextResponse.json({ ok: true, ...result });
}
