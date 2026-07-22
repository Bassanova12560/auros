/**
 * AUROS Validation Trail — Proof Stream wrapper for agents.
 */

import { isValidAssetDnaId } from "@/lib/asset-dna";
import {
  listProofStreamEventsAsync,
  type ProofStreamEvent,
} from "@/lib/proof-stream";

export type TollTrailResult = {
  assetDnaId: string;
  count: number;
  events: ProofStreamEvent[];
  citations: Array<{ title: string; url: string; at: string }>;
};

export async function getValidationTrail(input: {
  assetDnaId: string;
  limit?: number;
}): Promise<TollTrailResult | { error: "invalid_id" }> {
  const id = input.assetDnaId?.trim() ?? "";
  if (!isValidAssetDnaId(id)) return { error: "invalid_id" };
  const limit = Math.min(100, Math.max(1, input.limit ?? 50));
  const events = await listProofStreamEventsAsync(id, limit);
  return {
    assetDnaId: id,
    count: events.length,
    events,
    citations: events.map((e) => ({
      title: e.action,
      url: `/api/v1/asset-dna/${encodeURIComponent(id)}/stream`,
      at: e.createdAt,
    })),
  };
}
