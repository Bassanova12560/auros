import type { Locale } from "@/lib/i18n";

import { getGreenMarketMessages } from "../market-i18n";
import type { GreenMarketActor, GreenMarketOffer } from "./types";

export type GreenMarketActorDetail = GreenMarketActor & {
  offers: GreenMarketOffer[];
};

/** Indicative actor profile title. */
export function formatGreenMarketActorTitle(
  actor: Pick<GreenMarketActor, "name" | "type">,
  locale: Locale
): string {
  const mm = getGreenMarketMessages(locale).market;
  return `${actor.name} — ${mm.actorTypes[actor.type]}`;
}
