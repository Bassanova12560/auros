import type { DossierPayload } from "../dossier/generate";
import { sha256Hex } from "./signing";

/**
 * Stable readiness snapshot — excludes branding / URLs / key_hash.
 * Platforms verify this hash, not the full marketing PDF.
 */
export type AttestCanonicalPayload = {
  v: 1;
  dossier_id: string;
  locale: string;
  generated_at: string;
  score: number;
  grade: string;
  status: string;
  mica_classification: string;
  breakdown: Record<string, number>;
  critical_gaps: string[];
  sections: string[];
  checklist_total: number | null;
  checklist_done: number | null;
};

export function buildAttestCanonical(dossier: DossierPayload): AttestCanonicalPayload {
  const checklist = dossier.checklist;
  return {
    v: 1,
    dossier_id: dossier.id,
    locale: dossier.locale,
    generated_at: dossier.created_at,
    score: dossier.score.score,
    grade: dossier.score.grade,
    status: dossier.score.status,
    mica_classification: dossier.score.mica_classification,
    breakdown: { ...dossier.score.breakdown },
    critical_gaps: [...dossier.score.critical_gaps].sort(),
    sections: [...dossier.sections].sort(),
    checklist_total: checklist?.total_items ?? checklist?.items?.length ?? null,
    checklist_done: null,
  };
}

/** Deterministic JSON stringify (sorted object keys). */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export function attestationContentSha256(dossier: DossierPayload): string {
  const canonical = buildAttestCanonical(dossier);
  return sha256Hex(stableStringify(canonical));
}
