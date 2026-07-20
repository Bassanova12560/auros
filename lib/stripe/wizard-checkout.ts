import Stripe from "stripe";

import { siteOrigin } from "@/lib/emails/constants";
import type { Locale } from "@/lib/i18n";
import { resolveCatalogLocale } from "@/lib/i18n";
import {
  isWizardTier,
  WIZARD_TIER_AMOUNTS,
  WIZARD_TIER_LABELS,
  type WizardTier,
} from "@/lib/wizard-modes";

import { getStripe } from "./jurisdiction-checkout";

export { getStripe, stripeWebhookSecret } from "./jurisdiction-checkout";

export type WizardCheckoutInput = {
  tier: WizardTier;
  locale: Locale;
  email: string;
  firstName?: string;
  /** Prior tier already paid — charges price difference only. */
  upgradeFrom?: WizardTier;
  /** Existing Stripe checkout session id for the prior purchase. */
  previousSessionId?: string;
};

export function wizardProduct(tier: WizardTier) {
  return {
    tier,
    currency: "eur" as const,
    amountCents: WIZARD_TIER_AMOUNTS[tier],
    name: WIZARD_TIER_LABELS[tier],
  };
}

/** Tier rank for upgrade validation (starter < pro < institutional). */
export const WIZARD_TIER_RANK: Record<WizardTier, number> = {
  starter: 0,
  pro: 1,
  institutional: 2,
};

export function isUpgradeTier(from: WizardTier, to: WizardTier): boolean {
  return WIZARD_TIER_RANK[to] > WIZARD_TIER_RANK[from];
}

/** Charge amount in cents — full price or difference when upgrading. */
export function computeWizardChargeCents(
  tier: WizardTier,
  upgradeFrom?: WizardTier | null
): number {
  const full = WIZARD_TIER_AMOUNTS[tier];
  if (!upgradeFrom || upgradeFrom === tier) return full;
  const prior = WIZARD_TIER_AMOUNTS[upgradeFrom];
  if (prior >= full) return full;
  return full - prior;
}

export function parseWizardCheckoutMetadata(
  meta: Record<string, string>
): {
  tier: WizardTier;
  email: string;
  locale: Locale;
  upgradeFrom?: WizardTier;
} | null {
  if (meta.product !== "wizard") return null;
  const tier = meta.wizard_tier?.trim();
  const email = meta.email?.trim().toLowerCase();
  if (!tier || !isWizardTier(tier) || !email || !email.includes("@")) {
    return null;
  }
  const localeRaw = meta.locale?.trim();
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "fr"
      ? localeRaw
      : "fr";
  const upgradeRaw = meta.upgrade_from?.trim();
  const upgradeFrom =
    upgradeRaw && isWizardTier(upgradeRaw) ? upgradeRaw : undefined;
  return { tier, email, locale, upgradeFrom };
}

export async function createWizardCheckoutSession(
  input: WizardCheckoutInput,
  stripeClient?: Stripe
): Promise<{ url: string; sessionId: string } | null> {
  const stripe = stripeClient ?? getStripe();
  if (!stripe) return null;

  const product = wizardProduct(input.tier);
  const chargeCents = computeWizardChargeCents(input.tier, input.upgradeFrom);
  const origin = siteOrigin();
  const label = product.name[resolveCatalogLocale(input.locale)] ?? product.name.fr;

  const description =
    input.upgradeFrom && chargeCents < product.amountCents
      ? input.locale === "en"
        ? `Upgrade from ${input.upgradeFrom} — pay the difference only`
        : input.locale === "es"
          ? `Upgrade desde ${input.upgradeFrom} — pague solo la diferencia`
          : `Upgrade depuis ${input.upgradeFrom} — payez uniquement la différence`
      : input.locale === "en"
        ? "AUROS Pro wizard — institutional dossier"
        : input.locale === "es"
          ? "Wizard Pro AUROS — dossier institucional"
          : "Wizard Pro AUROS — dossier institutionnel";

  const metadata: Record<string, string> = {
    product: "wizard",
    wizard_tier: input.tier,
    email: input.email,
    locale: input.locale,
    firstName: input.firstName ?? "",
  };
  if (input.upgradeFrom) {
    metadata.upgrade_from = input.upgradeFrom;
  }
  if (input.previousSessionId?.trim()) {
    metadata.previous_session_id = input.previousSessionId.trim();
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: chargeCents,
          product_data: {
            name: label,
            description,
          },
        },
      },
    ],
    metadata,
    success_url: `${origin}/wizard/ready?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/wizard/pro?cancelled=1${input.upgradeFrom ? `&upgrade_from=${input.upgradeFrom}` : ""}`,
    allow_promotion_codes: true,
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}
