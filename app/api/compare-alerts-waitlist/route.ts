import { NextResponse } from "next/server";

import {
  appendCompareAlertsWaitlist,
  parseCompareAlertsWaitlistInput,
  pingCompareAlertsWebhook,
} from "@/lib/comparators/alerts-waitlist";
import { notifyCompareAlertsWaitlistSignup } from "@/lib/comparators/alerts-waitlist-notify";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

/** Watch shortlist — email and/or HTTPS webhook. Best-effort delivery. */
export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`compare-alerts:${ip}`, 5, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseCompareAlertsWaitlistInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const row = appendCompareAlertsWaitlist(parsed.data);
  const webhookPing = await pingCompareAlertsWebhook(row);
  const notify = await notifyCompareAlertsWaitlistSignup(row);
  if (!notify.ok) {
    return NextResponse.json(notify, { status: 502 });
  }
  return NextResponse.json({
    ok: true,
    message: "waitlist_joined",
    delivery: "best_effort",
    note: "APY-move webhooks coming — registration persisted; confirmation ping is best-effort",
    channel: row.channel,
    webhook_ping_ok: webhookPing.ok,
  });
}
