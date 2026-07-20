import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runDossierIncompleteNurture } from "@/lib/dossier/nurture";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runDossierIncompleteNurture();
  console.log("[dossier-nurture]", JSON.stringify(result));
  return NextResponse.json({ ok: true, ...result });
}
