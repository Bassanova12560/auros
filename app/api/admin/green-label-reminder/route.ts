import { NextRequest, NextResponse } from "next/server";

import {
  runGreenLabelIncompleteReminderCron,
  sendGreenLabelIncompleteReminderForApplication,
} from "@/lib/green/label-incomplete-reminder";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** POST — trigger incomplete dossier reminder(s). Body: { applicationId? } */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { applicationId?: string } = {};
  try {
    body = (await req.json()) as { applicationId?: string };
  } catch {
    body = {};
  }

  if (body.applicationId?.trim()) {
    const result = await sendGreenLabelIncompleteReminderForApplication(
      body.applicationId.trim(),
      { force: true }
    );
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    const { ok: _ok, ...rest } = result;
    return NextResponse.json({ ok: true, ...rest });
  }

  const result = await runGreenLabelIncompleteReminderCron();
  return NextResponse.json({ ok: true, ...result });
}
