import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import { createGreenApiPremiumCheckoutSession } from "@/lib/stripe/green-api-checkout";

export const runtime = "nodejs";

/** Stripe Checkout — AUROS Green API Premium (299 €/mois). */
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
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "missing_email", message: "Use the same email as POST /api/v1/keys" },
      { status: 400 }
    );
  }

  const localeRaw = typeof o.locale === "string" ? o.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr" ? localeRaw : "fr";

  const result = await createGreenApiPremiumCheckoutSession({ email, locale });
  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url, sessionId: result.sessionId });
}
