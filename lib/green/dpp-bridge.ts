import { absoluteUrl } from "@/lib/comparators/site";
import { lookupGreenScoreById } from "@/lib/green/api/score-lookup";

export type DppBridgeDocument = {
  "@context": string[];
  "@type": string[];
  "@id": string;
  name: string;
  identifier: string;
  description: string;
  manufacturer: { "@type": string; name: string; url: string };
  additionalProperty: Array<{ "@type": string; name: string; value: string | number }>;
  sustainabilityInformation: {
    carbonFootprintIndicative: number | null;
    aurosGreenComposite: number;
    aurosCqs: number | null;
    aurosWatt: number | null;
    aurosNatureScore: number | null;
    euTaxonomyAlignment: number | null;
    icvcmReadiness: string | null;
  };
  url: string;
  dateModified: string;
  disclaimer: string;
};

/** EU Digital Product Passport–aligned JSON-LD (v0 bridge) from AUROS Green scores. */
export function buildDppBridgeDocument(id: string): DppBridgeDocument | null {
  const score = lookupGreenScoreById(id);
  if (!score) return null;

  const base = absoluteUrl("");
  const now = new Date().toISOString();

  return {
    "@context": [
      "https://schema.org/",
      "https://w3id.org/circularityhub/vocab",
    ],
    "@type": ["Product", "DefinedTerm"],
    "@id": `${base}/api/green/dpp/${id}`,
    name: score.name,
    identifier: score.id,
    description: `Tokenized climate asset reference — AUROS Green DPP Bridge export for ${score.name}.`,
    manufacturer: {
      "@type": "Organization",
      name: "AUROS",
      url: base,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "auros.green_index_rank", value: score.green_index_rank ?? "n/a" },
      { "@type": "PropertyValue", name: "auros.label_status", value: score.label_status },
      { "@type": "PropertyValue", name: "auros.benchmark_percentile", value: score.benchmark.percentile },
    ],
    sustainabilityInformation: {
      carbonFootprintIndicative: score.carbon_quality?.score ?? null,
      aurosGreenComposite: score.composite_score,
      aurosCqs: score.carbon_quality?.score ?? null,
      aurosWatt: score.watt?.rating ?? null,
      aurosNatureScore: score.nature_score?.score ?? null,
      euTaxonomyAlignment: score.taxonomy_score,
      icvcmReadiness: score.icvcm_readiness?.status ?? null,
    },
    url: score.source_url,
    dateModified: now,
    disclaimer:
      "Indicative AUROS Green DPP Bridge — align with official EU DPP delegated acts before regulatory submission.",
  };
}
