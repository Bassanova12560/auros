/**
 * Live APY/TVL move detection + best-effort webhook/email delivery.
 * Idempotent delivery keys; honest thresholds; never invent metrics.
 *
 * Payload schema: auros.compare.alerts.move.v1
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Resend } from "resend";

import { resendFrom } from "@/lib/emails/constants";
import { getCompareHubPayload, type HubProduct } from "./compare-hub";
import { resolveCompareEntity } from "./entity-graph";
import {
  listCompareAlertsWatchers,
  type CompareAlertsWaitlistEntry,
} from "./alerts-waitlist";

const DATA_DIR = join(process.cwd(), ".data");
const SNAPSHOT_FILE = join(DATA_DIR, "compare-alerts-metric-snapshots.json");
const DELIVERY_FILE = join(DATA_DIR, "compare-alerts-deliveries.json");

/** Absolute APY change (percentage points) to emit a move. */
export const APY_MOVE_THRESHOLD_PP = 0.25;
/** Relative TVL change + minimum absolute USD delta. */
export const TVL_MOVE_THRESHOLD_PCT = 0.05;
export const TVL_MOVE_MIN_ABS_USD = 100_000;

export const COMPARE_ALERTS_MOVE_SCHEMA = "auros.compare.alerts.move.v1" as const;

export type MetricSnapshot = {
  product_id: string;
  apy: number;
  tvl_usd: number;
  live: boolean;
  as_of: string;
};

export type MetricSnapshotStore = {
  updated_at: string;
  products: Record<string, MetricSnapshot>;
};

export type CompareAlertMove = {
  product_id: string;
  entity_key: string;
  entity_id: string;
  issuer_key: string;
  platform: string;
  product: string;
  field: "apy" | "tvl_usd";
  previous: number;
  current: number;
  delta: number;
  delta_pct: number | null;
  source_type: "live" | "manual";
  note: "indicative_never_invented";
};

export type CompareAlertsMovePayload = {
  event: "compare.alerts.apy_move";
  schema: typeof COMPARE_ALERTS_MOVE_SCHEMA;
  delivery: "best_effort";
  as_of: string;
  watcher_product_ids: string[];
  moves: CompareAlertMove[];
  idempotency_key: string;
  policy: {
    never_invent_apy: true;
    indicative_only: true;
    not_investment_advice: true;
  };
  thresholds: {
    apy_pp: number;
    tvl_pct: number;
    tvl_min_abs_usd: number;
  };
};

type DeliveryLedger = {
  keys: string[];
};

function readJson<T>(path: string, fallback: T): T {
  try {
    if (!existsSync(path)) return fallback;
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(path: string, value: unknown): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(path, JSON.stringify(value, null, 2), "utf8");
  } catch {
    // serverless may be read-only
  }
}

export function loadMetricSnapshots(): MetricSnapshotStore {
  return readJson<MetricSnapshotStore>(SNAPSHOT_FILE, {
    updated_at: new Date(0).toISOString(),
    products: {},
  });
}

export function saveMetricSnapshots(store: MetricSnapshotStore): void {
  writeJson(SNAPSHOT_FILE, store);
}

function loadDeliveryLedger(): DeliveryLedger {
  return readJson<DeliveryLedger>(DELIVERY_FILE, { keys: [] });
}

function saveDeliveryLedger(ledger: DeliveryLedger): void {
  writeJson(DELIVERY_FILE, { keys: ledger.keys.slice(-5_000) });
}

export function wasDeliveryAttempted(idempotencyKey: string): boolean {
  return loadDeliveryLedger().keys.includes(idempotencyKey);
}

export function markDeliveryAttempted(idempotencyKey: string): void {
  const ledger = loadDeliveryLedger();
  if (!ledger.keys.includes(idempotencyKey)) {
    ledger.keys.push(idempotencyKey);
    saveDeliveryLedger(ledger);
  }
}

export function buildIdempotencyKey(
  watcherKey: string,
  moves: CompareAlertMove[],
  asOfDay: string
): string {
  const body = moves
    .map(
      (m) =>
        `${m.product_id}:${m.field}:${m.previous}->${m.current}`
    )
    .sort()
    .join("|");
  return createHash("sha256")
    .update(`${watcherKey}|${asOfDay}|${body}`)
    .digest("hex")
    .slice(0, 32);
}

export function detectMovesForProducts(
  products: HubProduct[],
  previous: MetricSnapshotStore,
  asOf: string
): { moves: CompareAlertMove[]; next: MetricSnapshotStore } {
  const next: MetricSnapshotStore = {
    updated_at: asOf,
    products: { ...previous.products },
  };
  const moves: CompareAlertMove[] = [];

  for (const product of products) {
    const id = product.row.id;
    const current: MetricSnapshot = {
      product_id: id,
      apy: product.row.apy,
      tvl_usd: product.row.tvlUsd,
      live: product.row.live,
      as_of: asOf,
    };
    const prev = previous.products[id];
    next.products[id] = current;
    if (!prev) continue;

    const entity = resolveCompareEntity(product);
    const source_type: "live" | "manual" = product.row.live ? "live" : "manual";

    const apyDelta = current.apy - prev.apy;
    if (Math.abs(apyDelta) >= APY_MOVE_THRESHOLD_PP) {
      moves.push({
        product_id: id,
        entity_key: entity.entity_key,
        entity_id: entity.entity_id,
        issuer_key: entity.issuer_key,
        platform: product.row.platform,
        product: product.row.product,
        field: "apy",
        previous: prev.apy,
        current: current.apy,
        delta: Math.round(apyDelta * 1000) / 1000,
        delta_pct: prev.apy !== 0 ? apyDelta / prev.apy : null,
        source_type,
        note: "indicative_never_invented",
      });
    }

    const tvlDelta = current.tvl_usd - prev.tvl_usd;
    const tvlPct =
      prev.tvl_usd > 0 ? Math.abs(tvlDelta) / prev.tvl_usd : null;
    if (
      tvlPct != null &&
      tvlPct >= TVL_MOVE_THRESHOLD_PCT &&
      Math.abs(tvlDelta) >= TVL_MOVE_MIN_ABS_USD
    ) {
      moves.push({
        product_id: id,
        entity_key: entity.entity_key,
        entity_id: entity.entity_id,
        issuer_key: entity.issuer_key,
        platform: product.row.platform,
        product: product.row.product,
        field: "tvl_usd",
        previous: prev.tvl_usd,
        current: current.tvl_usd,
        delta: tvlDelta,
        delta_pct: tvlPct * Math.sign(tvlDelta),
        source_type,
        note: "indicative_never_invented",
      });
    }
  }

  return { moves, next };
}

export function buildMovePayload(input: {
  asOf: string;
  watcher: CompareAlertsWaitlistEntry;
  moves: CompareAlertMove[];
  idempotencyKey: string;
}): CompareAlertsMovePayload {
  return {
    event: "compare.alerts.apy_move",
    schema: COMPARE_ALERTS_MOVE_SCHEMA,
    delivery: "best_effort",
    as_of: input.asOf,
    watcher_product_ids: input.watcher.productIds,
    moves: input.moves,
    idempotency_key: input.idempotencyKey,
    policy: {
      never_invent_apy: true,
      indicative_only: true,
      not_investment_advice: true,
    },
    thresholds: {
      apy_pp: APY_MOVE_THRESHOLD_PP,
      tvl_pct: TVL_MOVE_THRESHOLD_PCT,
      tvl_min_abs_usd: TVL_MOVE_MIN_ABS_USD,
    },
  };
}

export async function deliverMoveWebhook(
  webhookUrl: string,
  payload: CompareAlertsMovePayload
): Promise<{ ok: boolean; status?: number }> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AUROS-Compare-Alerts/1.0",
        "X-AUROS-Idempotency-Key": payload.idempotency_key,
        "X-AUROS-Event": payload.event,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}

export async function deliverMoveEmail(
  email: string,
  payload: CompareAlertsMovePayload,
  locale: string
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;
  const resend = new Resend(key);
  const lines = payload.moves
    .slice(0, 12)
    .map(
      (m) =>
        `<li><strong>${m.platform} · ${m.product}</strong> — ${m.field}: ${m.previous} → ${m.current} (Δ ${m.delta})</li>`
    )
    .join("");
  const subject =
    locale.startsWith("fr")
      ? `[AUROS Compare] Mouvement APY/TVL — ${payload.moves.length} signal(s)`
      : `[AUROS Compare] APY/TVL move — ${payload.moves.length} signal(s)`;
  const { error } = await resend.emails.send({
    from: resendFrom(),
    to: email,
    subject,
    html: `<p>Indicative APY/TVL moves on your watched shortlist (best-effort; not investment advice; APY never invented).</p>
<ul>${lines}</ul>
<p>as_of: ${payload.as_of}<br/>idempotency: ${payload.idempotency_key}<br/>schema: ${payload.schema}</p>`,
  });
  return !error;
}

export type CompareApyAlertsRunResult = {
  watchers: number;
  products_tracked: number;
  moves_detected: number;
  deliveries_attempted: number;
  deliveries_skipped_idempotent: number;
  webhook_ok: number;
  email_ok: number;
  errors: number;
  seeded_baseline: boolean;
};

function watcherKey(w: CompareAlertsWaitlistEntry): string {
  return `${w.email ?? ""}|${w.webhookUrl ?? ""}|${w.productIds.join(",")}`;
}

/** Cron runner — seed baseline on first run (no false positives). */
export async function runCompareApyAlerts(): Promise<CompareApyAlertsRunResult> {
  const result: CompareApyAlertsRunResult = {
    watchers: 0,
    products_tracked: 0,
    moves_detected: 0,
    deliveries_attempted: 0,
    deliveries_skipped_idempotent: 0,
    webhook_ok: 0,
    email_ok: 0,
    errors: 0,
    seeded_baseline: false,
  };

  const hub = await getCompareHubPayload();
  const asOf = hub.fetchedAt;
  const previous = loadMetricSnapshots();
  const hadBaseline = Object.keys(previous.products).length > 0;

  const { moves: allMoves, next } = detectMovesForProducts(
    hub.products,
    previous,
    asOf
  );
  saveMetricSnapshots(next);
  result.products_tracked = hub.products.length;

  if (!hadBaseline) {
    result.seeded_baseline = true;
    // First run: establish baseline only — do not alert.
    return result;
  }

  result.moves_detected = allMoves.length;
  if (allMoves.length === 0) return result;

  const watchers = listCompareAlertsWatchers();
  result.watchers = watchers.length;
  const asOfDay = asOf.slice(0, 10);

  for (const watcher of watchers) {
    const watched = new Set(watcher.productIds);
    const scoped = allMoves.filter((m) => watched.has(m.product_id));
    const seen = new Set<string>();
    const moves = scoped.filter((m) => {
      const k = `${m.product_id}:${m.field}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (moves.length === 0) continue;

    const idem = buildIdempotencyKey(watcherKey(watcher), moves, asOfDay);
    if (wasDeliveryAttempted(idem)) {
      result.deliveries_skipped_idempotent += 1;
      continue;
    }

    const payload = buildMovePayload({
      asOf,
      watcher,
      moves,
      idempotencyKey: idem,
    });

    result.deliveries_attempted += 1;
    markDeliveryAttempted(idem);

    try {
      if (
        (watcher.channel === "webhook" || watcher.channel === "both") &&
        watcher.webhookUrl
      ) {
        const wh = await deliverMoveWebhook(watcher.webhookUrl, payload);
        if (wh.ok) result.webhook_ok += 1;
        else result.errors += 1;
      }
      if (
        (watcher.channel === "email" || watcher.channel === "both") &&
        watcher.email
      ) {
        const ok = await deliverMoveEmail(
          watcher.email,
          payload,
          watcher.locale
        );
        if (ok) result.email_ok += 1;
        else result.errors += 1;
      }
    } catch {
      result.errors += 1;
    }
  }

  return result;
}
