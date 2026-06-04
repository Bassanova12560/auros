import type { GreenMarketActorType } from "./types";

/** Inline SVG icons for map markers (no unicode — reliable across fonts/OS). */
const MARKER_SVG: Record<GreenMarketActorType, string> = {
  producer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.1 3.1l1.1 1.1M11.8 11.8l1.1 1.1M3.1 12.9l1.1-1.1M11.8 4.2l1.1-1.1"/></svg>`,
  storer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="5" width="10" height="8" rx="1.2"/><path d="M5.5 5V4a2.5 2.5 0 0 1 5 0v1"/></svg>`,
  charger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" fill="#fff"><path d="M9.2 1.5 5.5 9h3.3L6.8 14.5 10.5 7H7.2z"/></svg>`,
  consumer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"><path d="M2.5 7.2 8 2.5l5.5 4.7V14H10v-4H6v4H2.5z"/></svg>`,
};

export function greenMarketMarkerSvg(type: GreenMarketActorType): string {
  return MARKER_SVG[type];
}
