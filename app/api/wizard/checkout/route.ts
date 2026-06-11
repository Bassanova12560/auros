import { NextResponse } from "next/server";

import { isValidCaptureEmail } from "@/lib/email-capture";
import { isLocale } from "@/lib/i18n";
import {
  computeWizardChargeCents,
  createWizardCheckoutSession,
  getStripe,
} from "@/lib/stripe/wizard-checkout";
import { resolveWizardUpgradeFrom } from "@/lib/stripe/wizard-upgrade-resolve";
import { isWizardTier } from "@/lib/wizard-modes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!getStripe()) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  let body: {
    tier?: string;
    email?: string;
    firstName?: string;
    locale?: string;
    upgradeFrom?: string;
    previousSessionId?: string;
    dossierId?: string;
  };
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

  const upgradeFromRaw = body.upgradeFrom?.trim();
  const explicitUpgrade =
    upgradeFromRaw && isWizardTier(upgradeFromRaw) ? upgradeFromRaw : undefined;

  let upgradeFrom: typeof explicitUpgrade;
  if (explicitUpgrade || body.previousSessionId?.trim()) {
    const resolved = await resolveWizardUpgradeFrom({
      tier,
      email,
      upgradeFrom: explicitUpgrade,
      previousSessionId: body.previousSessionId,
    });
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }
    upgradeFrom = resolved.upgradeFrom;
  }

  const session = await createWizardCheckoutSession({
    tier,
    locale,
    email,
    firstName: body.firstName?.trim(),
    upgradeFrom,
    previousSessionId: body.previousSessionId?.trim(),
  });

  if (!session) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({
    url: session.url,
    sessionId: session.sessionId,
    upgradeFrom: upgradeFrom ?? null,
    amountCents: computeWizardChargeCents(tier, upgradeFrom),
  });
}
