"use server";

import type { Locale } from "@/lib/i18n";
import {
  sendGreenOfferInterestActor,
  sendGreenOfferInterestInternal,
} from "@/lib/emails/send";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type SubmitGreenOfferInterestInput = {
  offerId: string;
  offerTitle: string;
  actorName: string;
  actorEmail?: string;
  visitorName: string;
  visitorEmail: string;
  message: string;
  locale: Locale;
};

export type SubmitGreenOfferInterestResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "rate_limit" };

export async function submitGreenOfferInterestAction(
  input: SubmitGreenOfferInterestInput
): Promise<SubmitGreenOfferInterestResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-offer-interest:${ip}`, 5, 3_600_000);
  if (!allowed) return { ok: false, error: "rate_limit" };

  const visitorEmail = input.visitorEmail.trim().toLowerCase();
  const visitorName = input.visitorName.trim();
  const message = input.message.trim().slice(0, 500);
  const offerId = input.offerId.trim();
  const offerTitle = input.offerTitle.trim();
  const actorName = input.actorName.trim();

  if (
    !offerId ||
    !offerTitle ||
    !actorName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail)
  ) {
    return { ok: false, error: "invalid" };
  }

  const payload = {
    offerId,
    offerTitle,
    actorName,
    visitorName: visitorName || "—",
    visitorEmail,
    message: message || "—",
    locale: input.locale,
  };

  void sendGreenOfferInterestInternal(payload);

  const actorEmail = input.actorEmail?.trim();
  if (actorEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(actorEmail)) {
    void sendGreenOfferInterestActor(actorEmail, payload);
  }

  return { ok: true };
}
