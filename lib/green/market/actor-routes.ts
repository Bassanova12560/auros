import {
  GREEN_CHARGERS_ROUTE,
  GREEN_CONSUMERS_ROUTE,
  GREEN_MARKET_ACTOR_ROUTE,
  GREEN_PRODUCERS_ROUTE,
  GREEN_STORERS_ROUTE,
} from "../constants";
import { getGreenMarketActorById as getDemoGreenMarketActorById } from "./data";
import type { GreenMarketActor, GreenMarketActorType } from "./types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

/** Public path for a marketplace actor profile page. */
export function greenMarketActorPath(id: string): string {
  return `${GREEN_MARKET_ACTOR_ROUTE}/${encodeURIComponent(id.trim())}`;
}

/** Absolute share URL for a single actor profile (optional origin for tests). */
export function buildGreenMarketActorShareUrl(id: string, origin?: string): string {
  const base = origin?.replace(/\/$/, "") ?? "";
  return `${base}${greenMarketActorPath(id)}`;
}

export function normalizeGreenMarketActorId(raw: string): string {
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

export function isGreenMarketActorUuid(id: string): boolean {
  return UUID_RE.test(id.trim());
}

/** Resolve actor id from demo seed data (sync, for tests and demo fallback). */
export function findDemoGreenMarketActorById(id: string): GreenMarketActor | null {
  const normalized = normalizeGreenMarketActorId(id);
  if (!normalized) return null;
  return getDemoGreenMarketActorById(normalized) ?? null;
}

/** Map popup and listing links — actor profile page. */
export function greenMarketActorSheetHref(actor: GreenMarketActor): string {
  return greenMarketActorPath(actor.id);
}

/** mailto link when contact email is available. */
export function greenMarketActorMailtoHref(actor: GreenMarketActor): string | null {
  const email = actor.contactEmail?.trim();
  if (!email) return null;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`AUROS Green — ${actor.name}`)}`;
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
