import type Stripe from "stripe";

import { sendGreenP1PaidInternal } from "@/lib/emails/send";
import { grantInvestorRoomAccess } from "@/lib/green/investor-room-access";
import { parseGreenP1CheckoutMetadata } from "@/lib/stripe/green-p1-checkout";
import { GREEN_INVESTOR_ROOM_PRODUCT } from "@/lib/green/p1-cash-pricing";
import { siteOrigin } from "@/lib/emails/constants";
import { recordPartnerPaidReferral } from "@/lib/partners/paid-referrals";

/** HITL notify + optional Investor Room token. Never auto-certify. */
export async function fulfillGreenP1FromStripe(
  session: Stripe.Checkout.Session
): Promise<void> {
  const meta = parseGreenP1CheckoutMetadata(
    (session.metadata ?? {}) as Record<string, string>
  );
  if (!meta) return;

  let accessUrl: string | undefined;
  if (meta.product === GREEN_INVESTOR_ROOM_PRODUCT) {
    const access = grantInvestorRoomAccess({
      email: meta.email,
      company: meta.company,
      sessionId: session.id,
    });
    accessUrl = `${siteOrigin()}/green/investors/room?token=${encodeURIComponent(access.token)}`;
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
    notes: meta.notes,
    sessionId: session.id,
    accessUrl,
    partnerCode: meta.partnerCode ?? undefined,
  });
}
