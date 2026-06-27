/** Indicative nature & biodiversity signals per market reference (TNFD-aligned, not audited). */

export type NatureEcosystemType =
  | "forest"
  | "soil"
  | "wetland"
  | "mixed"
  | "unknown";

export type NatureSignal = "strong" | "moderate" | "weak" | "unknown";

export type NatureQualityProfile = {
  ecosystem: NatureEcosystemType;
  /** Habitat / biodiversity outcome evidence. */
  biodiversity_outcome: NatureSignal;
  /** TNFD LEAP-style disclosure maturity (indicative). */
  tnfd_disclosure: NatureSignal;
  /** Reversal & permanence for nature-based credits. */
  permanence: NatureSignal;
  /** Community / indigenous land rights signal. */
  community_land: NatureSignal;
  /** MRV (monitoring, reporting, verification) quality. */
  mrv_quality: NatureSignal;
};

/** Static profiles — update when TNFD / registry biodiversity standards evolve. */
export const GREEN_NATURE_PROFILES: Record<string, NatureQualityProfile> = {
  moss: {
    ecosystem: "forest",
    biodiversity_outcome: "strong",
    tnfd_disclosure: "moderate",
    permanence: "moderate",
    community_land: "moderate",
    mrv_quality: "strong",
  },
  "regen-network": {
    ecosystem: "soil",
    biodiversity_outcome: "strong",
    tnfd_disclosure: "moderate",
    permanence: "moderate",
    community_land: "strong",
    mrv_quality: "moderate",
  },
  flowcarbon: {
    ecosystem: "mixed",
    biodiversity_outcome: "moderate",
    tnfd_disclosure: "weak",
    permanence: "moderate",
    community_land: "unknown",
    mrv_quality: "moderate",
  },
  toucan: {
    ecosystem: "mixed",
    biodiversity_outcome: "moderate",
    tnfd_disclosure: "weak",
    permanence: "moderate",
    community_land: "unknown",
    mrv_quality: "moderate",
  },
  klim: {
    ecosystem: "mixed",
    biodiversity_outcome: "weak",
    tnfd_disclosure: "unknown",
    permanence: "weak",
    community_land: "unknown",
    mrv_quality: "weak",
  },
  "solid-world": {
    ecosystem: "mixed",
    biodiversity_outcome: "weak",
    tnfd_disclosure: "unknown",
    permanence: "weak",
    community_land: "unknown",
    mrv_quality: "weak",
  },
};
