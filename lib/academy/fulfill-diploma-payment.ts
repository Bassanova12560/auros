import type Stripe from "stripe";

import {
  getPurchaseByStripeSession,
  insertDiplomaPurchase,
  newDiplomaPurchaseId,
} from "./diploma-purchase";
import { parseAcademyDiplomaMetadata } from "./diploma-checkout";
import { diplomaProduct } from "./diploma-pricing";

export async function fulfillAcademyDiplomaPayment(
  session: Stripe.Checkout.Session
): Promise<{ ok: true; purchaseId: string } | { ok: false; reason: string }> {
  const meta = parseAcademyDiplomaMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return { ok: false, reason: "invalid_metadata" };

  const existing = await getPurchaseByStripeSession(session.id);
  if (existing) return { ok: true, purchaseId: existing.id };

  const product = diplomaProduct(meta.diplomaType);
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const purchaseId =
    meta.diplomaType === "individual"
      ? newDiplomaPurchaseId("DIP")
      : newDiplomaPurchaseId("INST");

  const certSnapshot =
    meta.diplomaType === "individual" ? meta.certSnapshot ?? null : null;

  const inserted = await insertDiplomaPurchase({
    id: purchaseId,
    productType: meta.diplomaType,
    certId: meta.certId ?? certSnapshot?.id ?? null,
    certSnapshot,
    organizationName: meta.organizationName ?? null,
    contactEmail: meta.contactEmail,
    contactName: meta.contactName ?? null,
    stripeSessionId: session.id,
    stripePaymentIntent: paymentIntentId ?? null,
    amountCents: session.amount_total ?? product.amountCents,
  });

  if (!inserted.ok) {
    if (inserted.reason === "duplicate") {
      const again = await getPurchaseByStripeSession(session.id);
      if (again) return { ok: true, purchaseId: again.id };
    }
    return { ok: false, reason: inserted.reason };
  }

  return { ok: true, purchaseId: inserted.purchase.id };
}
