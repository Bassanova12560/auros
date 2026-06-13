import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import {
  isGreenImpactReportTier,
  type GreenImpactReportTier,
} from "@/lib/green/impact-report-pricing";
import { createGreenImpactCheckoutSession } from "@/lib/stripe/green-impact-checkout";

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
  const tierRaw = typeof o.tier === "string" ? o.tier.trim() : "standard";
  if (!isGreenImpactReportTier(tierRaw)) {
    return NextResponse.json({ error: "invalid_tier" }, { status: 400 });
  }
  const tier = tierRaw as GreenImpactReportTier;

  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 });
  }

  const localeRaw = typeof o.locale === "string" ? o.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";

  const result = await createGreenImpactCheckoutSession({
    tier,
    locale,
    email,
    firstName: typeof o.firstName === "string" ? o.firstName : undefined,
  });

  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url, sessionId: result.sessionId });
}
