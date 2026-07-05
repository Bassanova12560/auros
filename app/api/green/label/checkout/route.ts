/** Requires STRIPE_SECRET_KEY (see lib/stripe/green-label-checkout). */
import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import { getGreenLabelApplicationForCheckout } from "@/lib/green/fulfill-label-payment";
import { createGreenLabelCheckoutSession } from "@/lib/stripe/green-label-checkout";

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
  const applicationId =
    typeof o.applicationId === "string" ? o.applicationId.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";

  if (!applicationId || !email.includes("@")) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const application = await getGreenLabelApplicationForCheckout(applicationId, email);
  if (!application) {
    return NextResponse.json({ error: "application_not_found" }, { status: 404 });
  }
  if (application.paidAt) {
    return NextResponse.json({ error: "already_paid" }, { status: 409 });
  }

  const localeRaw = typeof o.locale === "string" ? o.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";

  const result = await createGreenLabelCheckoutSession({
    applicationId: application.id,
    email,
    locale,
    projectName: application.projectName,
  });

  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url, sessionId: result.sessionId });
}
