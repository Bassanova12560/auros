import {
  GREEN_CHARGERS_ROUTE,
  GREEN_CONSUMERS_ROUTE,
  GREEN_PRODUCERS_ROUTE,
  GREEN_STORERS_ROUTE,
} from "../constants";
import type { GreenMarketActor, GreenMarketActorType } from "./types";

export function greenMarketActorTypeRoute(type: GreenMarketActorType): string {
  switch (type) {
    case "producer":
      return GREEN_PRODUCERS_ROUTE;
    case "storer":
      return GREEN_STORERS_ROUTE;
    case "charger":
      return GREEN_CHARGERS_ROUTE;
    case "consumer":
      return GREEN_CONSUMERS_ROUTE;
  }
}

export function greenMarketActorSheetHref(actor: GreenMarketActor): string {
  const email = actor.contactEmail?.trim();
  if (email) {
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`AUROS Green — ${actor.name}`)}`;
  }
  return greenMarketActorTypeRoute(actor.type);
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
