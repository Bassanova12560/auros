import type { CarbonQualityProfile } from "./carbon-profiles";
import type { CarbonQualityScore } from "./carbon-quality";

export type IcvcmReadinessStatus = "ready" | "partial" | "gap";

export type IcvcmReadiness = {
  status: IcvcmReadinessStatus;
  /** Short headline for API / press. */
  headline: string;
  /** ICVCM Core Carbon Principles alignment signal. */
  ccp_aligned: CarbonQualityScore["ccp_aligned"];
  /** Target narrative — ICVCM assessment framework maturity 2027. */
  framework: "ICVCM CCP 2027";
};

export function computeIcvcmReadiness(
  cqs: CarbonQualityScore | null,
  profile?: CarbonQualityProfile
): IcvcmReadiness | null {
  if (!cqs) return null;

  const ccp = cqs.ccp_aligned;
  let status: IcvcmReadinessStatus;
  let headline: string;

  if (ccp === true && cqs.score >= 70) {
    status = "ready";
    headline = "Strong CCP alignment — likely ICVCM-ready trajectory";
  } else if (ccp === true || ccp === "partial") {
    status = "partial";
    headline = "Partial CCP alignment — close gaps before 2027 ICVCM assessments";
  } else {
    status = "gap";
    headline = "CCP alignment gap — prioritize registry retirement & additionality";
  }

  if (profile?.on_chain_wrapper && profile.registry === "mixed") {
    if (status === "ready") status = "partial";
    headline = "On-chain wrapper — verify registry retirement trail for ICVCM";
  }

  return {
    status,
    headline,
    ccp_aligned: ccp,
    framework: "ICVCM CCP 2027",
  };
}
