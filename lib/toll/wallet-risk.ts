/**
 * AUROS Wallet Attribution + behavioral risk v0 (indicative).
 */

export type WalletEntityLink = {
  wallet: string;
  entityLabel?: string;
  role?: "issuer" | "investor" | "operator" | "unknown";
  confidence: number;
};

export type BehavioralRiskFlag =
  | "unattributed_wallet"
  | "self_dealing_suspected"
  | "circular_funding_suspected"
  | "reassignment_risk"
  | "low_confidence_link";

export type WalletRiskSnapshot = {
  wallet: string;
  score: number;
  band: "low" | "medium" | "high";
  flags: BehavioralRiskFlag[];
  links: WalletEntityLink[];
  summary: string;
  disclaimer: string;
};

function normalizeWallet(raw: string): string {
  return raw.trim();
}

export function assessWalletBehavioralRisk(input: {
  wallet: string;
  entityLabel?: string;
  role?: WalletEntityLink["role"];
}): WalletRiskSnapshot {
  const wallet = normalizeWallet(input.wallet);
  const flags: BehavioralRiskFlag[] = [];
  const links: WalletEntityLink[] = [];
  let score = 40;

  if (!wallet || wallet.length < 8) {
    flags.push("unattributed_wallet");
    score = 15;
  } else if (!input.entityLabel) {
    flags.push("unattributed_wallet");
    score = 25;
  } else {
    links.push({
      wallet,
      entityLabel: input.entityLabel,
      role: input.role ?? "unknown",
      confidence: 55,
    });
    score = 55;
  }

  if (links.some((l) => l.confidence < 60)) {
    flags.push("low_confidence_link");
  }

  const band: WalletRiskSnapshot["band"] =
    score >= 60 ? "low" : score >= 35 ? "medium" : "high";

  return {
    wallet,
    score,
    band,
    flags,
    links,
    summary:
      band === "high"
        ? "Elevated behavioral / attribution risk — HITL review before institutional use."
        : "Indicative wallet attribution — not AML certification.",
    disclaimer:
      "Indicative only — not a regulated AML/KYT decision. Integrator remains accountable.",
  };
}
