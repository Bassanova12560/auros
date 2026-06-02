import type { WizardData } from "@/lib/wizard-types";

import { buildDocumentBlueprints } from "./document-blueprints";
import { buildTokenomicsBlueprint } from "./tokenomics-blueprint";
import {
  inferInstrumentType,
  mapRegulatoryPath,
  suggestedTokenStandard,
} from "./regulatory-path";
import { buildTokenizationRoadmap } from "./tokenization-roadmap";

export type TokenizationStudioPlan = {
  instrument: ReturnType<typeof inferInstrumentType>;
  regulatory: ReturnType<typeof mapRegulatoryPath>;
  tokenStandard: ReturnType<typeof suggestedTokenStandard>;
  tokenomics: ReturnType<typeof buildTokenomicsBlueprint>;
  roadmap: ReturnType<typeof buildTokenizationRoadmap>;
  documents: ReturnType<typeof buildDocumentBlueprints>;
  maturityLevel: "idea" | "structuring" | "ready_for_counsel" | "ready_for_tech";
};

export function buildTokenizationStudioPlan(
  data: WizardData
): TokenizationStudioPlan {
  const instrument = inferInstrumentType(data);
  const regulatory = mapRegulatoryPath(data);
  const tokenStandard = suggestedTokenStandard(data, instrument);
  const tokenomics = buildTokenomicsBlueprint(data);
  const roadmap = buildTokenizationRoadmap(data);
  const documents = buildDocumentBlueprints(data);

  const doneTasks = roadmap.flatMap((p) =>
    p.tasks.filter((t) => t.status === "done")
  ).length;
  const maturityLevel =
    doneTasks >= 5
      ? "ready_for_tech"
      : doneTasks >= 2
        ? "ready_for_counsel"
        : data.legalStructure && data.investorProfile
          ? "structuring"
          : "idea";

  return {
    instrument,
    regulatory,
    tokenStandard,
    tokenomics,
    roadmap,
    documents,
    maturityLevel,
  };
}

export {
  buildDocumentBlueprints,
  buildTokenizationRoadmap,
  buildTokenomicsBlueprint,
  inferInstrumentType,
  mapRegulatoryPath,
  suggestedTokenStandard,
};
export { VERIFIED_PROVIDERS, providersByCategory } from "./provider-directory";
