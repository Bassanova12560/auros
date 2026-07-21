/**
 * Countable Green proof metrics only — no invented M€, APY, or API volume.
 */

import type { GreenRegistrySnapshot } from "./green-registry";
import type { GreenMarketSnapshot } from "./market/green-market-db";

export type GreenProofMetrics = {
  registryProjects: number;
  registryVerified: number;
  registryPilot: number;
  marketActors: number;
  marketVerified: number;
  marketReferenced: number;
  marketDemo: number;
  marketOffers: number;
  marketMode: "demo" | "live";
  /** True when at least one registry project or non-demo market actor exists */
  hasRealSurface: boolean;
};

export function computeGreenProofMetrics(input: {
  registry: GreenRegistrySnapshot;
  market: GreenMarketSnapshot;
}): GreenProofMetrics {
  const { registry, market } = input;
  const registryProjects = registry.projects.length;
  const registryVerified = registry.projects.filter((p) => p.labelTier === "verified").length;
  const registryPilot = registry.projects.filter((p) => p.labelTier === "pilot").length;

  let marketVerified = 0;
  let marketReferenced = 0;
  let marketDemo = 0;
  for (const a of market.actors) {
    if (a.listingTier === "verified") marketVerified += 1;
    else if (a.listingTier === "referenced") marketReferenced += 1;
    else marketDemo += 1;
  }

  const marketActors = market.actors.length;
  const hasRealSurface =
    registryProjects > 0 || marketVerified + marketReferenced > 0;

  return {
    registryProjects,
    registryVerified,
    registryPilot,
    marketActors,
    marketVerified,
    marketReferenced,
    marketDemo,
    marketOffers: market.offers.length,
    marketMode: market.mode,
    hasRealSurface,
  };
}
