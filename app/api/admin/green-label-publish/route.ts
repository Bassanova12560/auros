import { NextRequest, NextResponse } from "next/server";

import { sendGreenLabelApproved } from "@/lib/emails/send";
import { siteOrigin } from "@/lib/emails/constants";
import { greenVerifyPath } from "@/lib/green/green-registry";
import {
  publishGreenLabelApplication,
  type PublishGreenLabelInput,
} from "@/lib/green/publish-label";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** POST publish label application — Authorization: Bearer CRON_SECRET */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Partial<PublishGreenLabelInput>;
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const applicationId = body.applicationId?.trim();
  if (
    !applicationId ||
    !body.summaryFr?.trim() ||
    !body.summaryEn?.trim() ||
    !body.summaryEs?.trim()
  ) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await publishGreenLabelApplication({
    applicationId,
    summaryFr: body.summaryFr.trim(),
    summaryEn: body.summaryEn.trim(),
    summaryEs: body.summaryEs.trim(),
    labelTier: body.labelTier,
    verifyToken: body.verifyToken,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const verifyUrl = `${siteOrigin()}${greenVerifyPath(result.verifyToken)}`;
  const registryUrl = `${siteOrigin()}/green/registry`;

  if (result.email.includes("@")) {
    void sendGreenLabelApproved(result.email, {
      contactName: result.contactName,
      projectName: result.projectName,
      verifyUrl,
      registryUrl,
      locale: result.preferredLocale,
    });
  }

  return NextResponse.json({
    ok: true,
    projectId: result.projectId,
    verifyToken: result.verifyToken,
    verifyUrl,
  });
}
