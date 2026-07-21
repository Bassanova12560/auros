import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import { createGreenMarketIntroCheckoutSession } from "@/lib/stripe/green-market-cash-checkout";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Stripe Checkout — Green Market paid intro (149 €). */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-market-intro:${ip}`, 8, 3_600_000);
  if (!allowed) {
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
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const offerId = typeof o.offerId === "string" ? o.offerId.trim() : "";
  const offerTitle = typeof o.offerTitle === "string" ? o.offerTitle.trim() : "";
  const actorName = typeof o.actorName === "string" ? o.actorName.trim() : "";
  const visitorName =
    typeof o.visitorName === "string" ? o.visitorName.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (!email.includes("@") || !offerId || !offerTitle || !actorName) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const localeRaw = typeof o.locale === "string" ? o.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" ||
    localeRaw === "es" ||
    localeRaw === "ar" ||
    localeRaw === "zh"
      ? localeRaw
      : "fr";

  const result = await createGreenMarketIntroCheckoutSession({
    email,
    locale,
    offerId,
    offerTitle,
    actorName,
    visitorName,
    message,
  });
  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url, sessionId: result.sessionId });
}
