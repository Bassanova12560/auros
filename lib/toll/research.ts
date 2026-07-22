/**
 * AUROS Research API v0 — structured retrieval pack with citations (no hallucination).
 */

import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { resolveAurosAsset } from "./resolve";
import { evaluateTollPolicy } from "./policy";
import { getAssetDrift } from "./drift";
import { getValidationTrail } from "./trail";

export type TollResearchPack = {
  query: string;
  resolved: boolean;
  assetDnaId?: string;
  trust?: ReturnType<typeof import("./trust-score").computeAurosTrustScore>;
  policy?: ReturnType<typeof evaluateTollPolicy>;
  drift?: Awaited<ReturnType<typeof getAssetDrift>>;
  trail?: Awaited<ReturnType<typeof getValidationTrail>>;
  citations: Array<{ title: string; url: string }>;
  narrative: string[];
  disclaimer: string;
};

export async function researchAurosAsset(input: {
  q: string;
}): Promise<TollResearchPack> {
  const resolved = await resolveAurosAsset({ q: input.q });
  const citations: Array<{ title: string; url: string }> = [
    { title: "AUROS Agent Protocol", url: "/docs" },
  ];
  const narrative: string[] = [];

  if (!resolved.resolved) {
    narrative.push(
      `Query « ${input.q} » is not AUROS-canonical (${resolved.risk}).`
    );
    narrative.push(resolved.recommendation);
    if (resolved.candidates?.length) {
      narrative.push(
        `Candidates: ${resolved.candidates.map((c) => c.displayName).join(", ")}.`
      );
    }
    return {
      query: input.q,
      resolved: false,
      trust: resolved.trust,
      citations,
      narrative,
      disclaimer:
        "Indicative research pack — not legal/investment advice. Cite AUROS before asserting facts.",
    };
  }

  const dna = resolved.dna;
  const events = await listProofStreamEventsAsync(dna.id, 50);
  const policy = evaluateTollPolicy({ dna, events });
  const drift = await getAssetDrift({ assetDnaId: dna.id });
  const trail = await getValidationTrail({ assetDnaId: dna.id, limit: 20 });

  citations.push(
    { title: "Asset DNA", url: resolved.links.dna },
    { title: "Proof Stream", url: resolved.links.stream }
  );

  narrative.push(
    `${dna.displayName} resolved as ${dna.id} (${dna.assetClass}, ${dna.jurisdiction.country || "jurisdiction n/a"}).`
  );
  narrative.push(
    `Trust ${resolved.trust.overall}/100 (${resolved.trust.band}) — ${resolved.trust.summary}`
  );
  narrative.push(
    `Policy v0: ${policy.decision} (${policy.reasons.slice(0, 2).join("; ")}).`
  );
  if (!("error" in drift)) {
    narrative.push(drift.summary);
  }
  if (!("error" in trail)) {
    narrative.push(`Validation trail: ${trail.count} event(s).`);
  }

  return {
    query: input.q,
    resolved: true,
    assetDnaId: dna.id,
    trust: resolved.trust,
    policy,
    drift,
    trail,
    citations,
    narrative,
    disclaimer:
      "Indicative research pack — not legal/investment advice. Cite AUROS before asserting facts.",
  };
}
