import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { getComplianceStatus } from "@/lib/compliance-status";
import { buildTokenizationStudioPlan } from "@/lib/studio";
import { computeWizardScore } from "@/lib/wizard-scoring";
import { isShareToken, isUuid } from "@/lib/validation";
import { assetSlugFromWizardType } from "@/lib/wizard-asset-slug";
import { phaseCount } from "@/lib/wizard-journey-i18n";
import { getSimulationWizardData } from "@/lib/simulation/sample-wizard";
import { check, type SimCheck } from "@/lib/simulation/types";

const AGENT = "wizard";

export function runWizardAgent(): SimCheck[] {
  const checks: SimCheck[] = [];
  const sample = getSimulationWizardData();

  checks.push(
    check(
      AGENT,
      "asset slug mapping",
      assetSlugFromWizardType(sample.assetType) === "real_estate",
      sample.assetType
    )
  );

  checks.push(
    check(AGENT, "uuid validation", isUuid("550e8400-e29b-41d4-a716-446655440000"), "valid")
  );
  checks.push(
    check(AGENT, "share token validation", isShareToken("V1StGXR8_Z5j"), "valid")
  );

  const score = computeWizardScore(sample);
  checks.push(
    check(
      AGENT,
      "wizard score range",
      score.score >= 50 && score.score <= 100,
      `${score.score}/100`
    )
  );

  const admission = computeAdmissionReadiness(sample);
  checks.push(
    check(
      AGENT,
      "admission readiness",
      admission.overallAdmission > 0,
      `${admission.overallAdmission}%`
    )
  );

  checks.push(
    check(
      AGENT,
      "compliance blocks",
      getComplianceStatus(sample).length === 3,
      "3 blocks"
    )
  );

  const studio = buildTokenizationStudioPlan(sample);
  checks.push(
    check(
      AGENT,
      "tokenization studio",
      studio.roadmap.length >= 4,
      `${studio.roadmap.length} phases`
    )
  );

  checks.push(
    check(
      AGENT,
      "wizard journey phases",
      phaseCount() === 4,
      "4 parties"
    )
  );

  return checks;
}
