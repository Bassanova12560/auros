/**
 * Liquidity Bridge waitlist — not brokerage, not RFQ execution.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type LiquidityWaitlistRole =
  | "issuer"
  | "mm"
  | "platform"
  | "other";

export type LiquidityWaitlistEntry = {
  email: string;
  role: LiquidityWaitlistRole;
  chain?: string;
  message?: string;
  locale: string;
  createdAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "liquidity-waitlist.json");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = new Set<LiquidityWaitlistRole>([
  "issuer",
  "mm",
  "platform",
  "other",
]);

export function isLiquidityWaitlistRole(
  value: unknown
): value is LiquidityWaitlistRole {
  return typeof value === "string" && ROLES.has(value as LiquidityWaitlistRole);
}

export function normalizeLiquidityWaitlistEmail(
  value: unknown
): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 254) return null;
  return email;
}

export function normalizeOptionalText(
  value: unknown,
  max: number
): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

export function parseLiquidityWaitlistInput(raw: unknown):
  | {
      ok: true;
      data: {
        email: string;
        role: LiquidityWaitlistRole;
        chain?: string;
        message?: string;
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  const email = normalizeLiquidityWaitlistEmail(body.email);
  if (!email) return { ok: false, error: "invalid_email" };
  if (!isLiquidityWaitlistRole(body.role)) {
    return { ok: false, error: "invalid_role" };
  }
  return {
    ok: true,
    data: {
      email,
      role: body.role,
      chain: normalizeOptionalText(body.chain, 80),
      message: normalizeOptionalText(body.message, 500),
    },
  };
}

/** @deprecated Prefer parseLiquidityWaitlistInput — kept for API route clarity. */
export function normalizeLiquidityWaitlistInput(raw: {
  email?: unknown;
  role?: unknown;
  chain?: unknown;
  message?: unknown;
  locale?: unknown;
}):
  | { ok: true; entry: Omit<LiquidityWaitlistEntry, "createdAt"> }
  | { ok: false; error: string } {
  const parsed = parseLiquidityWaitlistInput(raw);
  if (!parsed.ok) return parsed;
  return {
    ok: true,
    entry: {
      ...parsed.data,
      locale:
        typeof raw.locale === "string" ? raw.locale.trim().slice(0, 8) : "fr",
    },
  };
}

export function appendLiquidityWaitlist(
  entry: Omit<LiquidityWaitlistEntry, "createdAt">
): LiquidityWaitlistEntry {
  const row: LiquidityWaitlistEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
  };
  let all: LiquidityWaitlistEntry[] = [];
  try {
    if (existsSync(FILE)) {
      const parsed = JSON.parse(
        readFileSync(FILE, "utf8")
      ) as LiquidityWaitlistEntry[];
      if (Array.isArray(parsed)) all = parsed;
    }
  } catch {
    all = [];
  }
  all.push(row);
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(all.slice(-2_000), null, 2), "utf8");
  } catch {
    // ignore
  }
  return row;
}
