import type { GreenMarketActorType } from "./types";

const MARKER_COLORS: Record<GreenMarketActorType, string> = {
  producer: "#0a5c38",
  storer: "#3d5a80",
  charger: "#6b5b4f",
  consumer: "#4a4a52",
};

const MARKER_SYMBOLS: Record<GreenMarketActorType, string> = {
  producer: "☀",
  storer: "⚡",
  charger: "▣",
  consumer: "⌂",
};

export function greenMarketMarkerHtml(type: GreenMarketActorType): string {
  const color = MARKER_COLORS[type];
  const symbol = MARKER_SYMBOLS[type];
  return `<div style="
    width:28px;height:28px;border-radius:50%;
    background:${color};border:2px solid rgba(255,255,255,0.85);
    display:flex;align-items:center;justify-content:center;
    font-size:12px;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.45);
  ">${symbol}</div>`;
}
