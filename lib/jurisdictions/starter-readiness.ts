import type { StarterKitContent } from "./starter-kit-types";

export type StarterReadiness = {
  score: number;
  label: "early" | "progressing" | "structured";
  priorities: string[];
  checklistDone: number;
  checklistTotal: number;
};

export function computeStarterReadiness(content: StarterKitContent): StarterReadiness {
  const checklistTotal = content.regulatoryChecklist.length;
  const timelinePhases = content.timeline.length;
  const techCount = content.techProviders.length;
  const nextCount = content.nextSteps.length;

  const checklistDone = Math.min(
    checklistTotal,
    Math.max(0, Math.floor(checklistTotal * 0.15))
  );

  let score = 58;
  score += Math.min(18, checklistTotal * 2);
  score += Math.min(12, timelinePhases * 3);
  score += Math.min(8, techCount * 2);
  score += Math.min(6, nextCount);
  score = Math.min(94, score);

  const label: StarterReadiness["label"] =
    score >= 82 ? "structured" : score >= 68 ? "progressing" : "early";

  const priorities = content.nextSteps.slice(0, 3);

  return {
    score,
    label,
    priorities,
    checklistDone,
    checklistTotal,
  };
}
