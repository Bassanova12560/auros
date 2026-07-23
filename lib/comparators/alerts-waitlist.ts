/**
 * Compare shortlist alerts — email waitlist and/or webhook URL.
 * Delivery is best-effort / notify-when-ready (not live APY webhooks yet).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  normalizeCompareProductIds,
  COMPARE_HUB_MAX,
} from "./compare-selection";

export type CompareAlertsChannel = "email" | "webhook" | "both";

export type CompareAlertsWaitlistEntry = {
  email?: string;
  webhookUrl?: string;
  productIds: string[];
  locale: string;
  channel: CompareAlertsChannel;
  createdAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "compare-alerts-waitlist.json");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeCompareAlertsEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 254) return null;
  return email;
}

export function normalizeWebhookUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw || raw.length > 500) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function parseCompareAlertsWaitlistInput(raw: unknown):
  | {
      ok: true;
      data: {
        email?: string;
        webhookUrl?: string;
        productIds: string[];
        locale: string;
        channel: CompareAlertsChannel;
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  const email = normalizeCompareAlertsEmail(body.email);
  const webhookUrl = normalizeWebhookUrl(
    body.webhookUrl ?? body.webhook_url ?? body.webhook
  );
  if (!email && !webhookUrl) {
    return { ok: false, error: "email_or_webhook_required" };
  }

  const idsRaw = Array.isArray(body.productIds)
    ? body.productIds
    : Array.isArray(body.product_ids)
      ? body.product_ids
      : typeof body.compare === "string"
        ? body.compare.split(",")
        : [];
  const productIds = normalizeCompareProductIds(
    idsRaw.filter((id): id is string => typeof id === "string")
  );
  if (productIds.length < 1 || productIds.length > COMPARE_HUB_MAX) {
    return { ok: false, error: "invalid_selection" };
  }

  const channel: CompareAlertsChannel =
    email && webhookUrl ? "both" : webhookUrl ? "webhook" : "email";

  return {
    ok: true,
    data: {
      email: email ?? undefined,
      webhookUrl: webhookUrl ?? undefined,
      productIds,
      locale:
        typeof body.locale === "string" ? body.locale.trim().slice(0, 8) : "en",
      channel,
    },
  };
}

export function appendCompareAlertsWaitlist(
  entry: Omit<CompareAlertsWaitlistEntry, "createdAt">
): CompareAlertsWaitlistEntry {
  const row: CompareAlertsWaitlistEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
  };
  let all: CompareAlertsWaitlistEntry[] = [];
  try {
    if (existsSync(FILE)) {
      const parsed = JSON.parse(
        readFileSync(FILE, "utf8")
      ) as CompareAlertsWaitlistEntry[];
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
    // serverless may be read-only — still return row for notify path
  }
  return row;
}

/** Best-effort confirmation ping — not a live yield webhook. */
export async function pingCompareAlertsWebhook(
  entry: CompareAlertsWaitlistEntry
): Promise<{ ok: boolean; status?: number }> {
  if (!entry.webhookUrl) return { ok: true };
  try {
    const res = await fetch(entry.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AUROS-Compare-Alerts/1.0",
      },
      body: JSON.stringify({
        event: "compare.alerts.waitlist.registered",
        delivery: "best_effort",
        note: "APY move webhooks coming — this is registration confirmation only",
        product_ids: entry.productIds,
        locale: entry.locale,
        created_at: entry.createdAt,
      }),
      signal: AbortSignal.timeout(5_000),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
