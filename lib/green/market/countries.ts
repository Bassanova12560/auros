import { GREEN_REFERENCED_PILOTS } from "./referenced-seed";

/** Sorted unique countries from referenced pilot seed data (UX audit B7). */
export const GREEN_MARKET_COUNTRIES: string[] = [
  ...new Set(GREEN_REFERENCED_PILOTS.map((p) => p.country.trim()).filter(Boolean)),
].sort((a, b) => a.localeCompare(b, "fr"));
