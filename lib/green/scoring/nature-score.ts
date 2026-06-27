import type { GreenCompareRow } from "../compare-data";

import {
  GREEN_NATURE_PROFILES,
  type NatureQualityProfile,
  type NatureSignal,
} from "./nature-profiles";

export type NatureScorePriorityKey =
  | "biodiversity_outcome"
  | "tnfd_disclosure"
  | "permanence"
  | "community_land"
  | "mrv_quality";

export type NatureScoreResult = {
  score: number;
  tier: "leading" | "aligned" | "developing" | "high_risk";
  /** Max 3 improvement signals (UX psychology). */
  priority_keys: NatureScorePriorityKey[];
  ecosystem: NatureQualityProfile["ecosystem"];
  tnfd_framework: "LEAP-inspired";
  methodology_note: string;
};

const SIGNAL_POINTS: Record<NatureSignal, number> = {
  strong: 20,
  moderate: 12,
  weak: 5,
  unknown: 7,
};

const ECOSYSTEM_BONUS: Record<NatureQualityProfile["ecosystem"], number> = {
  forest: 8,
  wetland: 8,
  soil: 6,
  mixed: 4,
  unknown: 0,
};

function tierFromScore(score: number): NatureScoreResult["tier"] {
  if (score >= 75) return "leading";
  if (score >= 60) return "aligned";
  if (score >= 45) return "developing";
  return "high_risk";
}

function buildPriorities(profile: NatureQualityProfile): NatureScorePriorityKey[] {
  const keys: NatureScorePriorityKey[] = [];
  if (profile.biodiversity_outcome === "weak" || profile.biodiversity_outcome === "unknown")
    keys.push("biodiversity_outcome");
  if (profile.tnfd_disclosure === "weak" || profile.tnfd_disclosure === "unknown")
    keys.push("tnfd_disclosure");
  if (profile.permanence === "weak") keys.push("permanence");
  if (profile.community_land === "weak" || profile.community_land === "unknown")
    keys.push("community_land");
  if (profile.mrv_quality === "weak" || profile.mrv_quality === "unknown")
    keys.push("mrv_quality");
  return keys.slice(0, 3);
}

export function computeNatureScoreFromProfile(
  profile: NatureQualityProfile
): NatureScoreResult {
  let score =
    SIGNAL_POINTS[profile.biodiversity_outcome] +
    SIGNAL_POINTS[profile.tnfd_disclosure] +
    SIGNAL_POINTS[profile.permanence] +
    SIGNAL_POINTS[profile.community_land] +
    SIGNAL_POINTS[profile.mrv_quality] +
    ECOSYSTEM_BONUS[profile.ecosystem];

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    tier: tierFromScore(score),
    priority_keys: buildPriorities(profile),
    ecosystem: profile.ecosystem,
    tnfd_framework: "LEAP-inspired",
    methodology_note:
      "Indicative AUROS Nature Score — TNFD LEAP-inspired signals, not TNFD certification.",
  };
}

export function inferNatureProfileFromText(text: string): NatureQualityProfile {
  const t = text.toLowerCase();
  const ecosystem: NatureQualityProfile["ecosystem"] =
    /forest|forêt|redd|mangrove/.test(t)
      ? "forest"
      : /soil|regenerative|agriculture|ecocredit/.test(t)
        ? "soil"
        : /wetland|marais|peat/.test(t)
          ? "wetland"
          : /nature|biodivers|habitat/.test(t)
            ? "mixed"
            : "unknown";

  const signal = (strong: RegExp, moderate: RegExp): NatureSignal => {
    if (strong.test(t)) return "strong";
    if (moderate.test(t)) return "moderate";
    if (/unknown|unclear|unverified/.test(t)) return "unknown";
    return "unknown";
  };

  return {
    ecosystem,
    biodiversity_outcome: signal(/biodivers|habitat|species|conservation/, /nature-based|ecological/),
    tnfd_disclosure: signal(/tnfd|leap|nature-related disclosure/, /esg report|sustainability report/),
    permanence: signal(/permanent|long-term|100 year/, /buffer|reversal risk/),
    community_land: signal(/indigenous|community|land rights|fpic/, /stakeholder|local/),
    mrv_quality: signal(/mrv|satellite|verified|audit/, /monitoring|reporting/),
  };
}

/** Nature score for compare rows — carbon nature-based + explicit biodiversity assets. */
export function computeNatureScoreForCompareRow(
  row: GreenCompareRow
): NatureScoreResult | null {
  const isNatureCarbon =
    row.type === "carbon" &&
    /nature|forest|soil|biodivers|conservation|ecocredit|amazon|redd/i.test(
      `${row.name} ${row.impactNote} ${row.token}`
    );

  if (!isNatureCarbon && row.type !== "carbon") return null;

  const profile =
    GREEN_NATURE_PROFILES[row.id] ??
    (isNatureCarbon
      ? inferNatureProfileFromText(`${row.name} ${row.impactNote} ${row.token}`)
      : null);

  if (!profile) return null;
  return computeNatureScoreFromProfile(profile);
}

export function computeNatureScoreFromWizardText(text: string): NatureScoreResult | null {
  if (!/biodivers|nature|tnfd|forêt|forest|habitat|ecocredit|soil carbon|redd/.test(text.toLowerCase())) {
    return null;
  }
  return computeNatureScoreFromProfile(inferNatureProfileFromText(text));
}
