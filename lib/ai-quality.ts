import type { DossierContent, WizardData } from "@/lib/wizard-types";
import { AI_CONFIG } from "@/lib/ai-config";

const GENERIC_ONLY =
  /lorem ipsum|as an ai|i cannot provide|placeholder|todo:/i;

/** Reject truncated or generic dossiers so the router tries the next provider. */
export function isDossierQualityAcceptable(
  content: DossierContent,
  data: WizardData
): boolean {
  const minChars = AI_CONFIG.minSectionChars;
  const sections = Object.values(content);
  if (sections.some((s) => GENERIC_ONLY.test(s))) return false;
  if (sections.some((s) => s.trim().length < minChars)) return false;

  const anchors = [
    data.assetType,
    data.city,
    data.country,
    String(data.estimatedValue),
    data.platform,
  ].filter((s) => s && String(s).length > 1);

  const blob = sections.join(" ").toLowerCase();
  const anchored = anchors.filter((a) =>
    blob.includes(String(a).toLowerCase())
  ).length;

  return anchored >= Math.min(2, anchors.length);
}
