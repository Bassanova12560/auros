/**
 * Investor Room access tokens — 30-day local store after paid checkout.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type InvestorRoomAccess = {
  token: string;
  email: string;
  company: string;
  sessionId: string;
  createdAt: string;
  expiresAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "investor-room-access.json");
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

function load(): InvestorRoomAccess[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as InvestorRoomAccess[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: InvestorRoomAccess[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-1_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function grantInvestorRoomAccess(input: {
  email: string;
  company?: string;
  sessionId: string;
}): InvestorRoomAccess {
  const now = Date.now();
  const row: InvestorRoomAccess = {
    token: randomBytes(18).toString("base64url"),
    email: input.email.trim().toLowerCase(),
    company: (input.company ?? "").trim().slice(0, 120),
    sessionId: input.sessionId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
  };
  const all = load().filter((r) => new Date(r.expiresAt).getTime() > now);
  all.push(row);
  save(all);
  return row;
}

export function resolveInvestorRoomAccess(
  token: string | null | undefined
): InvestorRoomAccess | null {
  const t = token?.trim();
  if (!t || t.length < 8) return null;
  const now = Date.now();
  const row = load().find((r) => r.token === t);
  if (!row) return null;
  if (new Date(row.expiresAt).getTime() <= now) return null;
  return row;
}
