/**
 * PQC checklist evidence — affirmed items without proof do not raise the score.
 */

export const PQC_CHECKLIST_KEYS = [
  "offchain_register",
  "key_compromise_remedy",
  "token_vs_title",
  "crypto_agility",
] as const;

export type PqcChecklistKey = (typeof PQC_CHECKLIST_KEYS)[number];

export type PqcEvidenceItem = {
  url?: string;
  excerpt?: string;
  receipt_id?: string;
};

export type PqcEvidence = Partial<Record<PqcChecklistKey, PqcEvidenceItem>>;

export function hasPqcEvidence(item?: PqcEvidenceItem | null): boolean {
  if (!item) return false;
  return Boolean(
    item.url?.trim() || item.excerpt?.trim() || item.receipt_id?.trim()
  );
}

export function parsePqcEvidence(raw: unknown): PqcEvidence {
  if (!raw || typeof raw !== "object") return {};
  const out: PqcEvidence = {};
  for (const key of PQC_CHECKLIST_KEYS) {
    const row = (raw as Record<string, unknown>)[key];
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const item: PqcEvidenceItem = {};
    if (typeof r.url === "string" && r.url.trim()) item.url = r.url.trim();
    if (typeof r.excerpt === "string" && r.excerpt.trim())
      item.excerpt = r.excerpt.trim().slice(0, 500);
    if (typeof r.receipt_id === "string" && r.receipt_id.trim())
      item.receipt_id = r.receipt_id.trim();
    if (hasPqcEvidence(item)) out[key] = item;
  }
  return out;
}

export function parsePqcChecklist(raw: unknown): Record<PqcChecklistKey, boolean> {
  const base = {
    offchain_register: false,
    key_compromise_remedy: false,
    token_vs_title: false,
    crypto_agility: false,
  };
  if (!raw || typeof raw !== "object") return base;
  for (const key of PQC_CHECKLIST_KEYS) {
    base[key] = Boolean((raw as Record<string, unknown>)[key]);
  }
  return base;
}

/**
 * Only sourced affirmations raise the score.
 * Affirmed-without-evidence are ignored (anti-checkbox-washing).
 * 0 sourced → 2.5; 4 sourced → 8.5. Hard cap 3.0 if any unsourced claim exists and sourced=0.
 */
export function pqcScoreFromChecklist(
  checklist: Record<string, boolean>,
  evidence: PqcEvidence = {}
): {
  score: number;
  affirmed: number;
  sourced: number;
  unsourced: number;
  note: string;
} {
  let sourced = 0;
  let unsourced = 0;
  for (const key of PQC_CHECKLIST_KEYS) {
    if (!checklist[key]) continue;
    if (hasPqcEvidence(evidence[key])) sourced += 1;
    else unsourced += 1;
  }
  const affirmed = sourced + unsourced;
  let score = Math.round((2.5 + sourced * 1.5) * 10) / 10;
  if (sourced === 0 && unsourced > 0) {
    score = Math.min(score, 3);
  }
  const note =
    unsourced > 0
      ? `PQC: ${sourced}/4 sourced · ${unsourced} unsourced claim(s) ignored for scoring.`
      : `PQC checklist: ${sourced}/4 items sourced. Without off-chain register + remedy, keep sceptical.`;
  return { score: Math.min(10, score), affirmed, sourced, unsourced, note };
}

export function evidenceSourceUrls(evidence: PqcEvidence): string[] {
  const urls: string[] = [];
  for (const key of PQC_CHECKLIST_KEYS) {
    const u = evidence[key]?.url?.trim();
    if (u) urls.push(u);
    const rid = evidence[key]?.receipt_id?.trim();
    if (rid) urls.push(`shield:${rid}`);
  }
  return [...new Set(urls)];
}
