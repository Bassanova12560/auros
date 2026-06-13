import { NextResponse } from "next/server";

import { computeGreenComplianceScore } from "@/lib/green/scoring/green-compliance";
import { computeGreenRtmsScore, isGreenWizardAsset } from "@/lib/green/rtms-scoring";
import {
  generateGreenImpactReportPDF,
  suggestedGreenImpactReportFilename,
} from "@/lib/green/impact-report-pdf";
import type { GreenImpactReportInput } from "@/lib/green/impact-report-pdf";
import type { CsrdResult } from "@/lib/green/csrd-check/types";
import { verifyGreenImpactReportEntitlement } from "@/lib/green/fulfill-impact-payment";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { normalizeWizardData } from "@/lib/wizard-types";

export const runtime = "nodejs";

const PDF_IP_LIMIT = 8;
const PDF_IP_WINDOW_MS = 3_600_000;
const PDF_SESSION_LIMIT = 5;

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const ipRate = checkRateLimit(`green-impact-pdf:${ip}`, PDF_IP_LIMIT, PDF_IP_WINDOW_MS);
  if (!ipRate.allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const sessionId = typeof o.sessionId === "string" ? o.sessionId.trim() : "";
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  const sessionRate = checkRateLimit(
    `green-impact-pdf:session:${sessionId}`,
    PDF_SESSION_LIMIT,
    PDF_IP_WINDOW_MS
  );
  if (!sessionRate.allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  const purchase = await verifyGreenImpactReportEntitlement(sessionId);
  if (!purchase) {
    return NextResponse.json({ error: "payment_required" }, { status: 402 });
  }

  const tier = purchase.tier;
  const locale = purchase.locale;

  const data = normalizeWizardData(
    (o.data && typeof o.data === "object" ? o.data : {}) as Record<string, unknown>
  );

  let greenCompliance = undefined;
  let greenRtms = undefined;
  try {
    if (data.assetType || data.description) {
      greenCompliance = computeGreenComplianceScore(data);
      if (isGreenWizardAsset(data.assetType)) {
        greenRtms = computeGreenRtmsScore(data);
      }
    }
  } catch {
    // optional scoring
  }

  const csrdResult =
    o.csrdResult && typeof o.csrdResult === "object"
      ? (o.csrdResult as CsrdResult)
      : undefined;

  const input: GreenImpactReportInput = {
    locale,
    tier,
    generatedAt: new Date().toISOString(),
    data,
    greenCompliance,
    greenRtms,
    csrdResult,
  };

  const blob = await generateGreenImpactReportPDF(input);
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filename = suggestedGreenImpactReportFilename(input);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
