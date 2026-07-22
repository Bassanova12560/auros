/**
 * AUROS Toll metering — lookup / research credits (Upstash when set).
 * Spec: docs/AUROS-TOLL-MASTER-PLAN.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { checkRateLimitAsync } from "@/lib/rate-limit";

export type TollMeterOp =
  | "resolve"
  | "search"
  | "trail"
  | "drift"
  | "schema"
  | "research"
  | "policy"
  | "agent"
  | "lifecycle_event";

/** Credit cost per operation (lookup tax). */
export const TOLL_CREDIT_COST: Record<TollMeterOp, number> = {
  schema: 0,
  resolve: 1,
  search: 1,
  trail: 1,
  drift: 1,
  research: 5,
  policy: 3,
  agent: 2,
  lifecycle_event: 1,
};

/** Monthly included credits before paid packs. */
export const TOLL_MONTHLY_INCLUDED = {
  anonymous: 200,
  free: 2_000,
  premium: 25_000,
  enterprise: 100_000,
} as const;

export type TollMeterSubject = {
  id: string;
  tier: keyof typeof TOLL_MONTHLY_INCLUDED;
};

export type TollMeterResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  cost: number;
  reset: number;
};

type CreditBalance = {
  lookups: number;
  events: number;
  updatedAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "toll-credit-balances.json");
const MONTH_MS = 30 * 24 * 3_600_000;

type UpstashResponse = { result?: number | string | null };

async function upstashCommand(command: (string | number)[]): Promise<UpstashResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    return (await res.json()) as UpstashResponse;
  } catch {
    return null;
  }
}

function monthBucket(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthResetUnix(): number {
  const now = new Date();
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1) / 1000
  );
}

function loadBalances(): Record<string, CreditBalance> {
  try {
    if (!existsSync(FILE)) return {};
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as Record<
      string,
      CreditBalance
    >;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveBalances(rows: Record<string, CreditBalance>): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows, null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function getTollBonusCredits(subjectId: string): CreditBalance {
  const row = loadBalances()[subjectId];
  return row ?? { lookups: 0, events: 0, updatedAt: new Date().toISOString() };
}

/** Grant paid pack credits (lookup or lifecycle events). */
export function grantTollCredits(input: {
  subjectId: string;
  lookups?: number;
  events?: number;
}): CreditBalance {
  const all = loadBalances();
  const prev = all[input.subjectId] ?? {
    lookups: 0,
    events: 0,
    updatedAt: new Date().toISOString(),
  };
  const next: CreditBalance = {
    lookups: prev.lookups + Math.max(0, input.lookups ?? 0),
    events: prev.events + Math.max(0, input.events ?? 0),
    updatedAt: new Date().toISOString(),
  };
  all[input.subjectId] = next;
  saveBalances(all);
  return next;
}

/** Move bonus credits from one subject to another (self-serve email → key). */
export function transferTollCredits(input: {
  fromSubjectId: string;
  toSubjectId: string;
}): { ok: true; transferred: CreditBalance } | { ok: false; error: string } {
  const fromId = input.fromSubjectId.trim();
  const toId = input.toSubjectId.trim();
  if (!fromId || !toId || fromId === toId) {
    return { ok: false, error: "invalid_subjects" };
  }
  const all = loadBalances();
  const from = all[fromId] ?? {
    lookups: 0,
    events: 0,
    updatedAt: new Date().toISOString(),
  };
  if (from.lookups <= 0 && from.events <= 0) {
    return { ok: false, error: "nothing_to_transfer" };
  }
  const to = all[toId] ?? {
    lookups: 0,
    events: 0,
    updatedAt: new Date().toISOString(),
  };
  const transferred: CreditBalance = {
    lookups: from.lookups,
    events: from.events,
    updatedAt: new Date().toISOString(),
  };
  all[toId] = {
    lookups: to.lookups + from.lookups,
    events: to.events + from.events,
    updatedAt: transferred.updatedAt,
  };
  all[fromId] = { lookups: 0, events: 0, updatedAt: transferred.updatedAt };
  saveBalances(all);
  return { ok: true, transferred };
}

/** Consume bonus event credits (lifecycle). Returns false if none left (falls back to monthly). */
export function consumeBonusEventCredit(subjectId: string): boolean {
  const all = loadBalances();
  const prev = all[subjectId];
  if (!prev || prev.events <= 0) return false;
  prev.events -= 1;
  prev.updatedAt = new Date().toISOString();
  all[subjectId] = prev;
  saveBalances(all);
  return true;
}

async function incrUsage(
  redisKey: string,
  cost: number
): Promise<number | null> {
  if (cost <= 0) return 0;
  const first = await upstashCommand(["INCRBY", redisKey, cost]);
  if (first?.result === undefined || first.result === null) return null;
  const count = Number(first.result);
  if (count === cost) {
    await upstashCommand(["PEXPIRE", redisKey, MONTH_MS]);
  }
  return count;
}

/**
 * Meter a toll operation. Uses Upstash when configured; else in-memory monthly window.
 */
export async function consumeTollCredits(input: {
  subject: TollMeterSubject;
  op: TollMeterOp;
}): Promise<TollMeterResult> {
  const cost = TOLL_CREDIT_COST[input.op];
  const bonus = getTollBonusCredits(input.subject.id);
  const included = TOLL_MONTHLY_INCLUDED[input.subject.tier];
  const limit = included + bonus.lookups;
  const reset = monthResetUnix();

  if (cost === 0) {
    return { allowed: true, remaining: limit, limit, used: 0, cost: 0, reset };
  }

  // Lifecycle can burn bonus event credits first
  if (input.op === "lifecycle_event" && consumeBonusEventCredit(input.subject.id)) {
    return {
      allowed: true,
      remaining: limit,
      limit,
      used: 0,
      cost,
      reset,
    };
  }

  const bucket = monthBucket();
  const redisKey = `auros:toll:${input.subject.id}:${bucket}`;
  const used = await incrUsage(redisKey, cost);

  if (used != null) {
    const allowed = used <= limit;
    return {
      allowed,
      remaining: Math.max(0, limit - used),
      limit,
      used,
      cost,
      reset,
    };
  }

  // Fallback: durable-enough async IP/memory window keyed monthly
  const mem = await checkRateLimitAsync(redisKey, limit, MONTH_MS);
  // checkRateLimitAsync increments by 1 — approximate multi-cost by extra incrs
  for (let i = 1; i < cost; i++) {
    await checkRateLimitAsync(redisKey, limit, MONTH_MS);
  }
  const usedApprox = limit - mem.remaining + (cost - 1);
  return {
    allowed: mem.allowed && usedApprox <= limit,
    remaining: Math.max(0, limit - usedApprox),
    limit,
    used: usedApprox,
    cost,
    reset: mem.reset || reset,
  };
}
