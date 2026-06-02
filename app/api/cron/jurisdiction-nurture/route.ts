import { NextResponse } from "next/server";

import { runJurisdictionNurture } from "@/lib/jurisdictions/nurture";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runJurisdictionNurture();
  return NextResponse.json({ ok: true, ...result });
}
