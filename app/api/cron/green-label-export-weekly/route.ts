import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runGreenLabelWeeklyExportCron } from "@/lib/green/label-weekly-export";

export const runtime = "nodejs";

/** GET — weekly label applications CSV export to ops e-mail (Vercel cron). */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runGreenLabelWeeklyExportCron();
  return NextResponse.json({ ok: true, ...result });
}
