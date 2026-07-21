import type Stripe from "stripe";

import {
  sendGreenMarketIntroPaidInternal,
  sendGreenMarketVerifiedPaidInternal,
} from "@/lib/emails/send";
import {
  parseGreenMarketIntroMetadata,
  parseGreenMarketVerifiedMetadata,
} from "@/lib/stripe/green-market-cash-checkout";

/** HITL: notify ops after paid intro — never auto-connect parties. */
export async function fulfillGreenMarketIntroFromStripe(
  session: Stripe.Checkout.Session
): Promise<void> {
  const meta = parseGreenMarketIntroMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return;
  await sendGreenMarketIntroPaidInternal({
    ...meta,
    sessionId: session.id,
  });
}

export async function fulfillGreenMarketVerifiedFromStripe(
  session: Stripe.Checkout.Session
): Promise<void> {
  const meta = parseGreenMarketVerifiedMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return;
  await sendGreenMarketVerifiedPaidInternal({
    ...meta,
    sessionId: session.id,
  });
}
