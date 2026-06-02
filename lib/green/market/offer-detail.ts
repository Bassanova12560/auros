import type { Locale } from "@/lib/i18n";

import { getGreenMarketMessages } from "../market-i18n";
import type { GreenMarketActor, GreenMarketOffer } from "./types";

export type GreenMarketOfferDetail = GreenMarketOffer & {
  description: string;
  startDate: string | null;
  endDate: string | null;
  actor: GreenMarketActor | null;
};

/** Indicative listing title — actor, side and energy type. */
export function formatGreenMarketOfferTitle(
  offer: Pick<GreenMarketOffer, "actorName" | "side" | "energyType">,
  locale: Locale
): string {
  const mm = getGreenMarketMessages(locale).market;
  return `${offer.actorName} — ${mm.sides[offer.side]} · ${mm.energyTypes[offer.energyType]}`;
}

/** Fallback description when no actor profile is linked. */
export function defaultGreenMarketOfferDescription(
  offer: Pick<
    GreenMarketOffer,
    "volumeKwh" | "pricePerKwh" | "city" | "country" | "side" | "energyType"
  >,
  locale: Locale
): string {
  const od = getGreenMarketMessages(locale).offerDetail;
  const mm = getGreenMarketMessages(locale).market;
  return od.defaultDescription(
    mm.sides[offer.side],
    mm.energyTypes[offer.energyType],
    offer.city,
    offer.country,
    offer.volumeKwh,
    offer.pricePerKwh
  );
}
