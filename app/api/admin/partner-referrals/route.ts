import { NextRequest, NextResponse } from "next/server";

import {
  listPartnerReferrals,
  partnerReferralSummaryToCsv,
  partnerReferralsToCsv,
  suggestedPartnerReferralFilename,
  summarizePartnerReferrals,
} from "@/lib/partners/referral-report";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * GET partner attribution export — Requires authenticated ops access
 * Query: ?partner=CODE (optional filter), ?view=summary (aggregate counts)
 */
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const partner = req.nextUrl.searchParams.get("partner");
  const view = req.nextUrl.searchParams.get("view");
  const rows = await listPartnerReferrals(partner);

  const csv =
    view === "summary"
      ? partnerReferralSummaryToCsv(summarizePartnerReferrals(rows))
      : partnerReferralsToCsv(rows);

  const filename = suggestedPartnerReferralFilename(partner);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
