import { NextRequest, NextResponse } from "next/server";

import {
  greenLabelApplicationsToCsv,
  suggestedGreenLabelApplicationsCsvFilename,
} from "@/lib/green/label-applications-csv";
import {
  listGreenLabelApplicationsForExport,
  parseGreenLabelExportFilter,
} from "@/lib/green/label-applications-export";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** GET all label applications as CSV — Requires authenticated ops access */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const filter = parseGreenLabelExportFilter(req.nextUrl.searchParams.get("filter"));
  const rows = await listGreenLabelApplicationsForExport(filter);
  const csv = greenLabelApplicationsToCsv(rows);
  const filename = suggestedGreenLabelApplicationsCsvFilename(filter);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
