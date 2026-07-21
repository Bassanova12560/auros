/**
 * Server-only Asset DNA + Proof Stream hooks for Green.
 * Do NOT import from lib/green/index (client barrel).
 */

import {
  assetDnaClassFromGreenProject,
  mintAssetDna,
  persistAssetDna,
} from "@/lib/asset-dna";
import { appendProofStreamEvent } from "@/lib/proof-stream";
import type { GreenProjectType } from "@/lib/green/constants";

export async function mintDnaForMarketActor(input: {
  name: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
}): Promise<string> {
  const dna = await mintAssetDna({
    assetClass: "green_energy",
    displayName: input.name,
    jurisdiction: { country: input.country },
    origin: {
      operatorName: input.name,
      siteName: `${input.city}, ${input.country}`,
      coordinates: { lat: input.lat, lon: input.lon },
    },
    compliance: {
      listingTier: "referenced",
      labelTier: "none",
    },
  });
  return dna.id;
}

export async function linkMarketActorDna(input: {
  assetDnaId: string;
  marketActorId: string;
  pending: boolean;
}): Promise<void> {
  const { resolveAssetDna } = await import("@/lib/asset-dna");
  const dna = await resolveAssetDna(input.assetDnaId);
  if (dna) {
    dna.links = { ...dna.links, marketActorId: input.marketActorId };
    dna.updatedAt = new Date().toISOString();
    await persistAssetDna(dna);
  }
  appendProofStreamEvent({
    assetDnaId: input.assetDnaId,
    action: "dna.minted",
    meta: { marketActorId: input.marketActorId, pending: input.pending },
  });
  appendProofStreamEvent({
    assetDnaId: input.assetDnaId,
    action: "market.submitted",
    meta: { marketActorId: input.marketActorId, pending: input.pending },
  });
}

export function emitMarketModerationProof(input: {
  assetDnaId: string;
  marketActorId: string;
  action: "approve" | "reject";
}): void {
  appendProofStreamEvent({
    assetDnaId: input.assetDnaId,
    action: input.action === "approve" ? "market.approved" : "market.rejected",
    meta: { marketActorId: input.marketActorId },
  });
}

export async function mintAndAttachRegistryDna(input: {
  projectId: string;
  projectName: string;
  projectType: GreenProjectType | string;
  country: string;
  contactName: string;
  labelTier: "verified" | "pilot";
  applicationId: string;
}): Promise<string> {
  const dna = await mintAssetDna({
    assetClass: assetDnaClassFromGreenProject(input.projectType),
    displayName: input.projectName,
    jurisdiction: { country: input.country },
    origin: {
      operatorName: input.contactName,
      siteName: input.projectName,
    },
    compliance: {
      labelTier: input.labelTier,
      listingTier: "verified",
    },
    links: {
      registryProjectId: input.projectId,
    },
  });

  appendProofStreamEvent({
    assetDnaId: dna.id,
    action: "dna.minted",
    meta: { registryProjectId: input.projectId },
  });
  appendProofStreamEvent({
    assetDnaId: dna.id,
    action: "registry.published",
    meta: {
      registryProjectId: input.projectId,
      labelTier: input.labelTier,
      applicationId: input.applicationId,
    },
  });

  return dna.id;
}
