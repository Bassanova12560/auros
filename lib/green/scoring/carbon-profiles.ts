/** Indicative carbon credit quality signals per market reference (not audited). */

export type CarbonRegistry =
  | "verra"
  | "gold_standard"
  | "puro"
  | "mixed"
  | "other"
  | "none"
  | "unknown";

export type CarbonQualitySignal = "strong" | "moderate" | "weak" | "unknown";

export type CarbonQualityProfile = {
  registry: CarbonRegistry;
  ccp_aligned: boolean | "partial" | "unknown";
  additionality: CarbonQualitySignal;
  permanence: CarbonQualitySignal;
  vintage_risk: "low" | "medium" | "high";
  /** Token wrapper without clear registry retirement trail. */
  on_chain_wrapper?: boolean;
};

/** Static profiles — update when ICVCM/CCP registry status changes. */
export const GREEN_CARBON_PROFILES: Record<string, CarbonQualityProfile> = {
  toucan: {
    registry: "mixed",
    ccp_aligned: "partial",
    additionality: "moderate",
    permanence: "moderate",
    vintage_risk: "medium",
    on_chain_wrapper: true,
  },
  klim: {
    registry: "mixed",
    ccp_aligned: false,
    additionality: "weak",
    permanence: "moderate",
    vintage_risk: "high",
    on_chain_wrapper: true,
  },
  moss: {
    registry: "verra",
    ccp_aligned: "partial",
    additionality: "strong",
    permanence: "moderate",
    vintage_risk: "medium",
  },
  flowcarbon: {
    registry: "mixed",
    ccp_aligned: "partial",
    additionality: "moderate",
    permanence: "moderate",
    vintage_risk: "medium",
    on_chain_wrapper: true,
  },
  "regen-network": {
    registry: "other",
    ccp_aligned: "unknown",
    additionality: "strong",
    permanence: "moderate",
    vintage_risk: "medium",
  },
  "solid-world": {
    registry: "mixed",
    ccp_aligned: "unknown",
    additionality: "moderate",
    permanence: "weak",
    vintage_risk: "high",
    on_chain_wrapper: true,
  },
  /**
   * REC / energy tooling — not carbon-credit wrappers.
   * Conservative profiles only; never invent stronger scores.
   */
  "energy-web": {
    registry: "other",
    ccp_aligned: "unknown",
    additionality: "moderate",
    permanence: "moderate",
    vintage_risk: "low",
    on_chain_wrapper: false,
  },
  powerledger: {
    registry: "other",
    ccp_aligned: "unknown",
    additionality: "moderate",
    permanence: "moderate",
    vintage_risk: "low",
    on_chain_wrapper: false,
  },
};
