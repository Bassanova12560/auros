/**
 * Paid partner attributions (Green P1+ cash) — local store for ops / dashboard.
 * Complements Supabase leads/dossiers referred_by. Not a payout engine.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { normalizePartnerCode } from "@/lib/partner-attribution";

export type PartnerPaidReferral = {
  id: string;
  partnerCode: string;
  product: string;
  email: string;
  company: string;
  sessionId: string;
  createdAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "partner-paid-referrals.json");

function load(): PartnerPaidReferral[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as PartnerPaidReferral[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: PartnerPaidReferral[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-2_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function recordPartnerPaidReferral(input: {
  partnerCode: string | null | undefined;
  product: string;
  email: string;
  company?: string;
  sessionId: string;
}): PartnerPaidReferral | null {
  const partnerCode = normalizePartnerCode(input.partnerCode);
  if (!partnerCode) return null;
  const sessionId = input.sessionId.trim();
  if (!sessionId) return null;

  const existing = load();
  const dup = existing.find(
    (r) => r.sessionId === sessionId && r.partnerCode === partnerCode
  );
  if (dup) return dup;

  const row: PartnerPaidReferral = {
    id: `pay_${sessionId.slice(0, 24)}`,
    partnerCode,
    product: input.product.slice(0, 64),
    email: input.email.trim().toLowerCase(),
    company: (input.company ?? "").trim().slice(0, 160),
    sessionId,
    createdAt: new Date().toISOString(),
  };
  existing.push(row);
  save(existing);
  return row;
}

export function listPartnerPaidReferrals(
  partnerCode?: string | null
): PartnerPaidReferral[] {
  const code = normalizePartnerCode(partnerCode);
  const rows = load();
  if (!code) return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return rows
    .filter((r) => r.partnerCode === code)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function countPartnerPaidReferrals(partnerCode: string): number {
  return listPartnerPaidReferrals(partnerCode).length;
}
