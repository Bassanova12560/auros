import type { WelhrResult } from "@/lib/eau/water-legal-risk";
import { CONTINUITY_PLAYBOOK_ROUTE } from "@/lib/wets/continuity-playbook";

export type ResilienceBriefPriority = {
  label: string;
  href: string;
};

export type ResilienceBrief = {
  /** 0–100 indicative composite */
  resilience_score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  headline: string;
  welhr_grade: WelhrResult["grade"];
  stress_band: WelhrResult["stress_band"];
  priorities: ResilienceBriefPriority[];
};

const PRIORITY_LINKS: Record<string, ResilienceBriefPriority> = {
  map_water_rights: {
    label: "Cartographier droits d’eau",
    href: "/eau/risk/score",
  },
  check_local_moratorium: {
    label: "Moratorium / rezoning",
    href: "/eau/trust/risk-events",
  },
  litigation_screen: { label: "Screen litiges", href: "/eau/risk/score" },
  community_engagement: {
    label: "Social license",
    href: "/demos/data-center-100mw",
  },
  cooling_water_contract: {
    label: "Contrats refroidissement",
    href: CONTINUITY_PLAYBOOK_ROUTE,
  },
  stress_zone_disclosure: {
    label: "Disclosure stress zone",
    href: "/eau/trust/console",
  },
};

export function buildResilienceBrief(welhr: WelhrResult): ResilienceBrief {
  const resilience_score = Math.round(
    Math.min(100, Math.max(0, welhr.score * 0.85 + (welhr.risk_tier === "contained" ? 12 : 0)))
  );
  const grade =
    resilience_score >= 80
      ? "A"
      : resilience_score >= 65
        ? "B"
        : resilience_score >= 50
          ? "C"
          : resilience_score >= 35
            ? "D"
            : "F";

  const priorities: ResilienceBriefPriority[] = [];
  for (const p of welhr.priorities) {
    const link = PRIORITY_LINKS[p];
    if (link) priorities.push(link);
    if (priorities.length >= 2) break;
  }
  priorities.push({
    label: "Playbook continuité",
    href: CONTINUITY_PLAYBOOK_ROUTE,
  });

  const headline =
    welhr.risk_tier === "elevated"
      ? "Résilience sous tension — playbook et WETS avant levée."
      : welhr.risk_tier === "moderate"
        ? "Résilience modérée — verrouiller contrats eau et preuves."
        : "Résilience contenue — consolider verify et rapport public.";

  return {
    resilience_score,
    grade,
    headline,
    welhr_grade: welhr.grade,
    stress_band: welhr.stress_band,
    priorities: priorities.slice(0, 3),
  };
}
