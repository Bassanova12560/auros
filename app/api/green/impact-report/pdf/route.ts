import { NextResponse } from "next/server";

import { computeGreenComplianceScore } from "@/lib/green/scoring/green-compliance";
import { computeGreenRtmsScore, isGreenWizardAsset } from "@/lib/green/rtms-scoring";
import {
  generateGreenImpactReportPDF,
  suggestedGreenImpactReportFilename,
} from "@/lib/green/impact-report-pdf";
import type { GreenImpactReportInput } from "@/lib/green/impact-report-pdf";
import type { CsrdResult } from "@/lib/green/csrd-check/types";
import { isGreenImpactReportTier } from "@/lib/green/impact-report-pricing";
import { retrievePaidGreenImpactSession } from "@/lib/stripe/green-impact-checkout";
import { normalizeWizardData } from "@/lib/wizard-types";
import type { Locale } from "@/lib/i18n";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  const session = await retrievePaidGreenImpactSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "payment_required" }, { status: 402 });
  }

  const meta = session.metadata ?? {};
  const tierRaw = meta.tier?.trim() ?? "standard";
  const tier = isGreenImpactReportTier(tierRaw) ? tierRaw : "standard";
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";

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
