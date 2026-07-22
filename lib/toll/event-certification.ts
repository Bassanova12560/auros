/**
 * AUROS Event Certification Layer v0 — indicative lifecycle events as queryable objects.
 * Audit by query; not legal attestation. HITL for regulator packs. No auto-badges.
 */

import { createHash } from "node:crypto";

import { isValidAssetDnaId } from "@/lib/asset-dna";
import {
  appendProofStreamEvent,
  listProofStreamEvents,
  type ProofStreamEvent,
} from "@/lib/proof-stream";
import {
  appendBillableLifecycleEvent,
  type BillableLifecycleResult,
} from "@/lib/toll/lifecycle";
import type { TollMeterSubject } from "@/lib/toll/metering";

export const EVENT_CERTIFICATION_ACTION = "event.certified" as const;

export type CertifiedEventKind =
  | "maintenance"
  | "downtime"
  | "coupon_paid"
  | "covenant_breach"
  | "doc_refresh"
  | "incident"
  | "other";

export const CERTIFIED_EVENT_KINDS: readonly CertifiedEventKind[] = [
  "maintenance",
  "downtime",
  "coupon_paid",
  "covenant_breach",
  "doc_refresh",
  "incident",
  "other",
] as const;

export const EVENT_CERTIFICATION_DISCLAIMER =
  "Indicative certification only — not a legal attestation. HITL required for regulator packs. No auto-badge.";

export type CertifiedLifecycleEvent = {
  eventId: string;
  certifiedAt: string;
  kind: CertifiedEventKind;
  assetDnaId: string;
  digest?: string;
  disclaimer: string;
};

export type CertifyLifecycleEventInput = {
  assetDnaId: string;
  kind: CertifiedEventKind;
  occurredAt?: string;
  payload?: Record<string, unknown>;
  actor?: string;
};

export function isCertifiedEventKind(raw: string): raw is CertifiedEventKind {
  return (CERTIFIED_EVENT_KINDS as readonly string[]).includes(raw);
}

function certificationDigest(input: {
  assetDnaId: string;
  kind: CertifiedEventKind;
  occurredAt: string;
  actor?: string;
  payload?: Record<string, unknown>;
}): string {
  const canonical = JSON.stringify({
    assetDnaId: input.assetDnaId,
    kind: input.kind,
    occurredAt: input.occurredAt,
    actor: input.actor ?? null,
    payload: input.payload ?? {},
  });
  return createHash("sha256").update(canonical).digest("hex");
}

function buildMeta(input: {
  kind: CertifiedEventKind;
  occurredAt: string;
  actor?: string;
  payload?: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    layer: "event_certification",
    version: "v0",
    kind: input.kind,
    occurredAt: input.occurredAt,
    indicative: true,
    ...(input.actor ? { actor: input.actor.trim().slice(0, 160) } : {}),
    ...(input.payload ? { payload: input.payload } : {}),
  };
}

function toCertified(
  event: ProofStreamEvent,
  kind: CertifiedEventKind
): CertifiedLifecycleEvent {
  return {
    eventId: event.id,
    certifiedAt: event.createdAt,
    kind,
    assetDnaId: event.assetDnaId,
    digest: event.contentHash,
    disclaimer: EVENT_CERTIFICATION_DISCLAIMER,
  };
}

/**
 * Append an indicative certified lifecycle event to the Proof Stream.
 */
export function certifyLifecycleEvent(
  input: CertifyLifecycleEventInput
):
  | { ok: true; certification: CertifiedLifecycleEvent }
  | { ok: false; error: "invalid_id" | "invalid_kind" } {
  const assetDnaId = input.assetDnaId?.trim() ?? "";
  if (!isValidAssetDnaId(assetDnaId)) {
    return { ok: false, error: "invalid_id" };
  }
  if (!isCertifiedEventKind(input.kind)) {
    return { ok: false, error: "invalid_kind" };
  }

  const occurredAt =
    typeof input.occurredAt === "string" && input.occurredAt.trim()
      ? input.occurredAt.trim()
      : new Date().toISOString();
  const digest = certificationDigest({
    assetDnaId,
    kind: input.kind,
    occurredAt,
    actor: input.actor,
    payload: input.payload,
  });
  const event = appendProofStreamEvent({
    assetDnaId,
    action: EVENT_CERTIFICATION_ACTION,
    contentHash: digest,
    meta: buildMeta({
      kind: input.kind,
      occurredAt,
      actor: input.actor,
      payload: input.payload,
    }),
  });

  return { ok: true, certification: toCertified(event, input.kind) };
}

/**
 * Certify + burn one lifecycle_event credit (bonus events first).
 * Does not change the dedicated lifecycle route — same metering primitive.
 */
export async function certifyBillableLifecycleEvent(
  input: CertifyLifecycleEventInput & { subject: TollMeterSubject }
): Promise<
  | {
      ok: true;
      certification: CertifiedLifecycleEvent;
      meterRemaining: number;
    }
  | { ok: false; error: "invalid_id" | "invalid_kind" }
  | Extract<BillableLifecycleResult, { ok: false }>
> {
  const assetDnaId = input.assetDnaId?.trim() ?? "";
  if (!isValidAssetDnaId(assetDnaId)) {
    return { ok: false, error: "invalid_id" };
  }
  if (!isCertifiedEventKind(input.kind)) {
    return { ok: false, error: "invalid_kind" };
  }

  const occurredAt =
    typeof input.occurredAt === "string" && input.occurredAt.trim()
      ? input.occurredAt.trim()
      : new Date().toISOString();
  const digest = certificationDigest({
    assetDnaId,
    kind: input.kind,
    occurredAt,
    actor: input.actor,
    payload: input.payload,
  });

  const billed = await appendBillableLifecycleEvent({
    subject: input.subject,
    assetDnaId,
    action: EVENT_CERTIFICATION_ACTION,
    contentHash: digest,
    meta: buildMeta({
      kind: input.kind,
      occurredAt,
      actor: input.actor,
      payload: input.payload,
    }),
  });

  if (!billed.ok) return billed;
  return {
    ok: true,
    certification: toCertified(billed.event, input.kind),
    meterRemaining: billed.meterRemaining,
  };
}

export function isCertifiedProofEvent(event: ProofStreamEvent): boolean {
  if (event.action !== EVENT_CERTIFICATION_ACTION) return false;
  const kind = event.meta?.kind;
  return typeof kind === "string" && isCertifiedEventKind(kind);
}

/** List certified events for an Asset DNA (newest first). */
export function listCertifiedLifecycleEvents(
  assetDnaId: string,
  limit = 50
):
  | { ok: true; assetDnaId: string; events: CertifiedLifecycleEvent[] }
  | { ok: false; error: "invalid_id" } {
  const id = assetDnaId?.trim() ?? "";
  if (!isValidAssetDnaId(id)) return { ok: false, error: "invalid_id" };
  const cap = Math.min(200, Math.max(1, limit));
  const events = listProofStreamEvents(id, 200)
    .filter(isCertifiedProofEvent)
    .slice(0, cap)
    .map((e) => toCertified(e, e.meta!.kind as CertifiedEventKind));
  return { ok: true, assetDnaId: id, events };
}
