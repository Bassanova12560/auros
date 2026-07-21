import { questionsForPack } from "./definitions";
import type { TrustPackId } from "./taxonomy";

export type PackEvidenceItem = {
  url?: string;
  excerpt?: string;
  receipt_id?: string;
};

export type PackChecklist = Record<string, boolean>;
export type PackEvidence = Record<string, PackEvidenceItem>;

export type PackGrade = "A" | "B" | "C" | "D";

export function hasEvidence(item?: PackEvidenceItem | null): boolean {
  if (!item) return false;
  return Boolean(
    item.url?.trim() || item.excerpt?.trim() || item.receipt_id?.trim()
  );
}

export function gradeFromScore(score: number): PackGrade {
  if (score >= 8) return "A";
  if (score >= 6) return "B";
  if (score >= 4) return "C";
  return "D";
}

export function scoreTrustPack(input: {
  packId: TrustPackId;
  checklist: PackChecklist;
  evidence?: PackEvidence;
}): {
  score: number;
  grade: PackGrade;
  sourced: number;
  unsourced: number;
  total: number;
  note: string;
  perQuestion: {
    id: string;
    weight: number;
    affirmed: boolean;
    sourced: boolean;
    contribution: number;
  }[];
} {
  const questions = questionsForPack(input.packId);
  const evidence = input.evidence ?? {};
  let sourced = 0;
  let unsourced = 0;
  let weighted = 0;

  const perQuestion = questions.map((q) => {
    const affirmed = Boolean(input.checklist[q.id]);
    const sourcedOk = affirmed && hasEvidence(evidence[q.id]);
    if (affirmed && sourcedOk) sourced += 1;
    else if (affirmed) unsourced += 1;
    const contribution = sourcedOk ? q.weight * 10 : 0;
    weighted += contribution;
    return {
      id: q.id,
      weight: q.weight,
      affirmed,
      sourced: sourcedOk,
      contribution: Math.round(contribution * 10) / 10,
    };
  });

  let score = Math.round(weighted * 10) / 10;
  // Floor when nothing sourced but claims exist
  if (sourced === 0 && unsourced > 0) {
    score = Math.min(score, 2.5);
  }
  // Empty → low baseline honesty
  if (sourced === 0 && unsourced === 0) {
    score = 1.5;
  }

  const note =
    unsourced > 0
      ? `${sourced}/${questions.length} sourced · ${unsourced} unsourced ignored.`
      : `${sourced}/${questions.length} questions sourced.`;

  return {
    score,
    grade: gradeFromScore(score),
    sourced,
    unsourced,
    total: questions.length,
    note,
    perQuestion,
  };
}

export function parsePackEvidence(raw: unknown): PackEvidence {
  if (!raw || typeof raw !== "object") return {};
  const out: PackEvidence = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== "object") continue;
    const r = v as Record<string, unknown>;
    const item: PackEvidenceItem = {};
    if (typeof r.url === "string" && r.url.trim()) item.url = r.url.trim();
    if (typeof r.excerpt === "string" && r.excerpt.trim())
      item.excerpt = r.excerpt.trim().slice(0, 500);
    if (typeof r.receipt_id === "string" && r.receipt_id.trim())
      item.receipt_id = r.receipt_id.trim();
    if (hasEvidence(item)) out[k] = item;
  }
  return out;
}

export function parsePackChecklist(raw: unknown): PackChecklist {
  if (!raw || typeof raw !== "object") return {};
  const out: PackChecklist = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    out[k] = Boolean(v);
  }
  return out;
}
