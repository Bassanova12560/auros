import type Stripe from "stripe";

import { sendGreenP1PaidInternal } from "@/lib/emails/send";
import { recordPartnerPaidReferral } from "@/lib/partners/paid-referrals";
import {
  TOLL_LIFECYCLE_EVENT_CREDITS,
  TOLL_LIFECYCLE_PRODUCT,
  TOLL_LOOKUP_PACK_CREDITS,
  TOLL_LOOKUP_PACK_PRODUCT,
} from "@/lib/toll/lifecycle-pricing";
import { grantTollCredits } from "@/lib/toll/metering";
import { parseTollCheckoutMetadata } from "@/lib/stripe/toll-checkout";

/** Grant credits + HITL notify. Never auto-certify. */
export async function fulfillTollCashFromStripe(
  session: Stripe.Checkout.Session
): Promise<void> {
  const meta = parseTollCheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return;

  if (meta.product === TOLL_LOOKUP_PACK_PRODUCT) {
    grantTollCredits({
      subjectId: meta.creditSubject,
      lookups: TOLL_LOOKUP_PACK_CREDITS,
    });
  } else if (meta.product === TOLL_LIFECYCLE_PRODUCT) {
    grantTollCredits({
      subjectId: meta.creditSubject,
      events: TOLL_LIFECYCLE_EVENT_CREDITS,
    });
  }

  recordPartnerPaidReferral({
    partnerCode: meta.partnerCode,
    product: meta.product,
    email: meta.email,
    company: meta.company,
    sessionId: session.id,
  });

  await sendGreenP1PaidInternal({
    product: meta.product,
    email: meta.email,
    company: meta.company,
    notes: `credit_subject=${meta.creditSubject}`,
    sessionId: session.id,
    partnerCode: meta.partnerCode ?? undefined,
  });
}
