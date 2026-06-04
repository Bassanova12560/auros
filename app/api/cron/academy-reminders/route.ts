import { NextResponse } from "next/server";

import { runAcademyReminderCron } from "@/lib/academy/reminder-prefs";
import { isCronAuthorized } from "@/lib/cron-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runAcademyReminderCron();
  return NextResponse.json({ ok: true, ...result });
}
