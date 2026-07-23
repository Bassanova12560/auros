/**
 * Compare shortlist alerts — email waitlist and/or webhook URL.
 * Registration persists watchers; live APY/TVL moves via cron (alerts-apy-moves).
 * Durable when Upstash configured; else file/.data with ephemeral warning on serverless.
 */

import {
  ALERTS_WATCHERS_FILE,
  ALERTS_WATCHERS_KEY,
  loadAlertsJson,
  saveAlertsJson,
  type AlertsPersistResult,
  type AlertsStoreBackend,
} from "./alerts-durable-store";
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

export async function listCompareAlertsWatchers(): Promise<
  AlertsPersistResult<CompareAlertsWaitlistEntry[]>
> {
  const loaded = await loadAlertsJson<CompareAlertsWaitlistEntry[]>(
    ALERTS_WATCHERS_KEY,
    ALERTS_WATCHERS_FILE,
    []
  );
  const value = Array.isArray(loaded.value) ? loaded.value : [];
  return { ...loaded, value };
}

export type AppendWatcherResult = {
  entry: CompareAlertsWaitlistEntry;
  backend: AlertsStoreBackend;
  ephemeral: boolean;
  warning: string | null;
};

export async function appendCompareAlertsWaitlist(
  entry: Omit<CompareAlertsWaitlistEntry, "createdAt">
): Promise<AppendWatcherResult> {
  const row: CompareAlertsWaitlistEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
  };
  const listed = await listCompareAlertsWatchers();
  const all = [...listed.value, row].slice(-2_000);
  const saved = await saveAlertsJson(
    ALERTS_WATCHERS_KEY,
    ALERTS_WATCHERS_FILE,
    all
  );
  return {
    entry: row,
    backend: saved.backend,
    ephemeral: saved.ephemeral,
    warning: saved.warning,
  };
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
        note: "Registration confirmation — live moves use event compare.alerts.apy_move (schema auros.compare.alerts.move.v1)",
        product_ids: entry.productIds,
        locale: entry.locale,
        created_at: entry.createdAt,
        move_event: "compare.alerts.apy_move",
        move_schema: "auros.compare.alerts.move.v1",
      }),
      signal: AbortSignal.timeout(5_000),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
