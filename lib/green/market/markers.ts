import { greenMarketMarkerSvg } from "./marker-svg";
import type { GreenMarketActorType } from "./types";

export const MARKER_COLORS: Record<GreenMarketActorType, string> = {
  producer: "#0d5240",
  storer: "#3d5a80",
  charger: "#6b5b4f",
  consumer: "#4a4a52",
};

export function greenMarketMarkerHtml(type: GreenMarketActorType): string {
  const color = MARKER_COLORS[type];
  const svg = greenMarketMarkerSvg(type);
  return `<div style="
    width:28px;height:28px;border-radius:50%;
    background:${color};border:2px solid rgba(255,255,255,0.85);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 8px rgba(0,0,0,0.45);
  ">${svg}</div>`;
}
