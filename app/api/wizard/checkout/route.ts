import { NextResponse } from "next/server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import { isLocale } from "@/lib/i18n";
import {
  createWizardCheckoutSession,
  getStripe,
} from "@/lib/stripe/wizard-checkout";
import { isWizardTier } from "@/lib/wizard-modes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!getStripe()) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  let body: { tier?: string; email?: string; firstName?: string; locale?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const tier = body.tier?.trim();
  if (!tier || !isWizardTier(tier)) {
    return NextResponse.json({ error: "invalid_tier" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidCaptureEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const locale =
    body.locale && isLocale(body.locale) ? body.locale : "fr";

  const session = await createWizardCheckoutSession({
    tier,
    locale,
    email,
    firstName: body.firstName?.trim(),
  });

  if (!session) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ url: session.url, sessionId: session.sessionId });
}
