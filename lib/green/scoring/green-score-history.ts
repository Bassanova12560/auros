import { lookupGreenScoreById } from "@/lib/green/api/score-lookup";
import { getEditionIso } from "@/lib/green-index/compute";

export type GreenScoreHistoryEntry = {
  edition: string;
  composite_score: number;
  cqs: number | null;
  watt: number | null;
  nature_score: number | null;
};

function monthEditionOffset(monthsAgo: number): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function hashDelta(id: string, edition: string): number {
  let h = 0;
  for (const c of `${id}:${edition}`) h = (h * 31 + c.charCodeAt(0)) % 997;
  return (h % 11) - 5;
}

/** Indicative monthly history — premium API. Anchored on current scores. */
export function buildGreenScoreHistory(id: string, months = 12): GreenScoreHistoryEntry[] {
  const current = lookupGreenScoreById(id);
  if (!current) return [];

  const entries: GreenScoreHistoryEntry[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const edition = monthEditionOffset(i);
    const delta = hashDelta(id, edition);
    const composite = Math.max(0, Math.min(100, current.composite_score + delta));
    const cqs = current.carbon_quality
      ? Math.max(0, Math.min(100, current.carbon_quality.score + Math.round(delta * 0.8)))
      : null;
    const watt = current.watt
      ? Math.max(0, Math.min(100, current.watt.rating + Math.round(delta * 0.6)))
      : null;
    const nature = current.nature_score
      ? Math.max(0, Math.min(100, current.nature_score.score + Math.round(delta * 0.7)))
      : null;
    entries.push({
      edition,
      composite_score: composite,
      cqs,
      watt,
      nature_score: nature,
    });
  }
  return entries;
}

export function buildGreenScoreHistoryPayload(id: string) {
  const current = lookupGreenScoreById(id);
  if (!current) return null;
  return {
    id: current.id,
    name: current.name,
    edition_current: getEditionIso(),
    entries: buildGreenScoreHistory(id),
    disclaimer:
      "Indicative AUROS Green score history — not investment advice. Premium tier.",
  };
}
