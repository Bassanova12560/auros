import { NextRequest, NextResponse } from "next/server";

import { verifyGreenLabelPayment } from "@/lib/green/fulfill-label-payment";

export const runtime = "nodejs";

/** GET payment status after Stripe redirect — fulfills if webhook lag. */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id")?.trim() ?? "";
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "missing_session" }, { status: 400 });
  }

  const payment = await verifyGreenLabelPayment(sessionId);
  if (!payment) {
    return NextResponse.json({ ok: false, error: "payment_unconfirmed" }, { status: 402 });
  }

  return NextResponse.json({
    ok: true,
    applicationId: payment.applicationId,
    paidAt: payment.paidAt,
  });
}
