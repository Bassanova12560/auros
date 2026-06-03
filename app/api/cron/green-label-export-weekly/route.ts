import { NextResponse } from "next/server";

import { runGreenLabelWeeklyExportCron } from "@/lib/green/label-weekly-export";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/** GET — weekly label applications CSV export to ops e-mail (Vercel cron). */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runGreenLabelWeeklyExportCron();
  return NextResponse.json({ ok: true, ...result });
}
