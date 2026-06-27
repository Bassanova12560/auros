import { buildGreenIndexPayload } from "@/lib/green-index/compute";

export type GreenIndexChangelogEntry = {
  edition: string;
  generated_at: string;
  top_movers: Array<{ id: string; name: string; mom_pct: number | null; rank: number }>;
  new_in_top: Array<{ id: string; name: string; rank: number }>;
  reference_count: number;
  methodology_note: string;
};

export function buildGreenIndexChangelog(): GreenIndexChangelogEntry {
  const payload = buildGreenIndexPayload();
  const withMom = payload.entries.filter((e) => e.mom_pct != null);
  const top_movers = [...withMom]
    .sort((a, b) => (b.mom_pct ?? 0) - (a.mom_pct ?? 0))
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      name: e.name,
      mom_pct: e.mom_pct,
      rank: e.rank,
    }));

  return {
    edition: payload.editionIso,
    generated_at: payload.generatedAt,
    top_movers,
    new_in_top: payload.entries.slice(0, 3).map((e) => ({
      id: e.id,
      name: e.name,
      rank: e.rank,
    })),
    reference_count: payload.referenceCount,
    methodology_note: payload.methodologyNote,
  };
}
