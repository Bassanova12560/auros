import { NextRequest, NextResponse } from "next/server";

import { siteOrigin } from "@/lib/emails/constants";
import { sendGreenLabelStatusUpdate } from "@/lib/emails/send";
import type { GreenLabelApplicationStatus } from "@/lib/green/label-applications";
import { updateGreenLabelApplicationStatus } from "@/lib/green/update-label-status";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

type Body = {
  applicationId?: string;
  status?: GreenLabelApplicationStatus;
};

/** POST update label application status — Authorization: Bearer CRON_SECRET */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const applicationId = body.applicationId?.trim();
  const status = body.status;

  if (!applicationId || (status !== "in_review" && status !== "rejected")) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await updateGreenLabelApplicationStatus({ applicationId, status });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  if (result.changed && result.email.includes("@")) {
    void sendGreenLabelStatusUpdate(result.email, status, {
      contactName: result.contactName,
      projectName: result.projectName,
      myUrl: `${siteOrigin()}/green/my#label-status`,
      locale: "fr",
    });
  }

  return NextResponse.json({
    ok: true,
    status: result.status,
    previousStatus: result.previousStatus,
    changed: result.changed,
  });
}
