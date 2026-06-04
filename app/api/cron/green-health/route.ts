import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runGreenHealthChecks } from "@/lib/green/green-health";

export const runtime = "nodejs";

/** GET — smoke public Green routes (Vercel cron monitoring). */
export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runGreenHealthChecks();
  const failed = result.checks.filter((c) => !c.ok);

  for (const c of result.checks) {
    const tag = c.ok ? "ok" : "fail";
    console.log(
      `[green-health] ${tag} ${c.path} → ${c.status}${c.error ? ` (${c.error})` : ""}`
    );
  }

  if (!result.ok) {
    console.warn(
      `[green-health] ${failed.length} route(s) unhealthy on ${result.base}`
    );
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
