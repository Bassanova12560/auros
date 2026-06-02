import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { COUNTRIES_EUROPE } from "@/lib/wizard-countries";
import { normalizeDocumentIds } from "@/lib/rwa-document-phases";
import { buildTokenizationStudioPlan } from "@/lib/studio";
import type { WizardData } from "@/lib/wizard-types";

export type ComplianceItem = {
  id: string;
  ok: boolean;
  status: string;
};

export function getComplianceStatus(data: WizardData): ComplianceItem[] {
  const readiness = computeAdmissionReadiness(data);
  const studio = buildTokenizationStudioPlan(data);
  const held = normalizeDocumentIds(data.documents ?? []);
  const inEu =
    COUNTRIES_EUROPE.includes(
      data.country as (typeof COUNTRIES_EUROPE)[number]
    ) || data.country === "United Kingdom";

  const micaOk =
    readiness.compliancePercent >= 60 &&
    Boolean(data.legalStructure?.trim()) &&
    inEu;

  const kycOk =
    held.includes("kyc_aml_policy") && readiness.compliancePercent >= 50;

  const scOk =
    held.includes("smart_contract_audit") ||
    studio.tokenStandard.standard.includes("3643");

  return [
    {
      id: "mica",
      ok: micaOk,
      status: micaOk ? "aligned" : "review_required",
    },
    {
      id: "kyc",
      ok: kycOk,
      status: kycOk ? "policy_ready" : "pending",
    },
    {
      id: "smart_contract",
      ok: scOk,
      status: scOk ? "erc3643_ready" : "blueprint_only",
    },
  ];
}
