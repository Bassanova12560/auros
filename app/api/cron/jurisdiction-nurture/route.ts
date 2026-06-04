import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runJurisdictionNurture } from "@/lib/jurisdictions/nurture";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runJurisdictionNurture();
  return NextResponse.json({ ok: true, ...result });
}
