import type { H2oScoreResult } from "@/lib/green/scoring/h2o-score";

/** postMessage `source` — filter on parent listeners. */
export const AUROS_EMBED_SOURCE = "auros-embed" as const;

export type AurosH2oEmbedEventType =
  | "auros:h2o:ready"
  | "auros:h2o:score"
  | "auros:h2o:passport";

export type AurosH2oScorePayload = {
  rating: number;
  tier: H2oScoreResult["tier"];
  preview_id: string;
  asset_class: H2oScoreResult["asset_class"];
  passport_required: true;
};

export type AurosH2oEmbedEvent =
  | {
      source: typeof AUROS_EMBED_SOURCE;
      type: "auros:h2o:ready";
      partner?: string;
    }
  | {
      source: typeof AUROS_EMBED_SOURCE;
      type: "auros:h2o:score";
      payload: AurosH2oScorePayload;
    }
  | {
      source: typeof AUROS_EMBED_SOURCE;
      type: "auros:h2o:passport";
      payload: { partner?: string };
    };

export function isAurosH2oEmbedEvent(data: unknown): data is AurosH2oEmbedEvent {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  return (
    record.source === AUROS_EMBED_SOURCE &&
    typeof record.type === "string" &&
    record.type.startsWith("auros:h2o:")
  );
}

export function emitAurosH2oEmbedEvent(
  event: Omit<AurosH2oEmbedEvent, "source">,
): void {
  if (typeof window === "undefined") return;
  const target = window.parent;
  if (target === window) return;
  try {
    target.postMessage({ source: AUROS_EMBED_SOURCE, ...event }, "*");
  } catch {
    // cross-origin parent may block in rare cases
  }
}

export function h2oScoreToEmbedPayload(result: H2oScoreResult): AurosH2oScorePayload {
  return {
    rating: result.rating,
    tier: result.tier,
    preview_id: result.preview_id,
    asset_class: result.asset_class,
    passport_required: true,
  };
}
