import { COUNTRIES_EUROPE } from "@/lib/wizard-countries";
import { assetSlugFromLabel } from "@/lib/platform-match";
import type { WizardData } from "@/lib/wizard-types";

export type InstrumentType =
  | "security_token_equity"
  | "security_token_debt"
  | "fund_unit"
  | "revenue_share"
  | "hybrid";

export type RegulatoryHint = {
  regime: string;
  summary: string;
  exemptions?: string[];
  structureRecommendation: string;
  disclaimer: string;
};

const EU = new Set(COUNTRIES_EUROPE);

export function inferInstrumentType(data: WizardData): InstrumentType {
  const slug = assetSlugFromLabel(data.assetType);
  if (
    slug === "private_credit" ||
    data.incomeType === "rental" ||
    data.incomeType === "other"
  ) {
    return data.incomeAmountYear > 0 ? "security_token_debt" : "revenue_share";
  }
  if (slug === "real_estate" && data.incomeType === "rental") {
    return "revenue_share";
  }
  if (
    data.legalStructure === "Through a company / SCI" ||
    data.investorProfile === "Institutional investors"
  ) {
    return "fund_unit";
  }
  if (slug === "fine_art" || slug === "collectibles") {
    return "security_token_equity";
  }
  return "security_token_equity";
}

export function mapRegulatoryPath(data: WizardData): RegulatoryHint {
  const country = data.country ?? "";
  const inEu = EU.has(country as (typeof COUNTRIES_EUROPE)[number]);
  const inUk = country === "United Kingdom";
  const inUs = country === "United States";
  const instrument = inferInstrumentType(data);
  const retail =
    data.investorProfile === "Retail investors (general public)" ||
    data.investorProfile === "I don't know yet";
  const accredited =
    data.investorProfile === "Accredited investors only" ||
    data.investorProfile === "Institutional investors";

  let structureRecommendation =
    "SPV dédié (ou société émettrice) détenant l'actif, émission de jetons représentatifs";
  if (data.legalStructure === "Through a trust or foundation") {
    structureRecommendation = "Trust / fondation + SPV de détention de l'actif";
  } else if (data.legalStructure === "Through a company / SCI") {
    structureRecommendation = "Conserver la SCI/société existante comme véhicule d'émission";
  }

  if (inEu || inUk) {
    const exemptions: string[] = [];
    if (accredited && !retail) {
      exemptions.push(
        "Prospectus EU — possible exemption pour offre limitée aux investisseurs qualifiés (art. 1(4)(a) / national)"
      );
    }
    if (retail) {
      exemptions.push(
        "MiCA + prospectus / PRIIPs selon packaging — ciblage retail exige documentation renforcée"
      );
    }
    return {
      regime: inUk ? "UK FCA + post-Brexit offering rules" : "EU — MiCA + Prospectus Regulation",
      summary: `Instrument suggéré : ${instrumentLabel(instrument)}. Juridiction : ${country || "UE"}.`,
      exemptions,
      structureRecommendation,
      disclaimer:
        "Indicatif uniquement — valider avec un cabinet local avant toute offre.",
    };
  }

  if (inUs) {
    return {
      regime: "US — Securities Act (Reg D / Reg S selon investisseurs)",
      summary: `Instrument suggéré : ${instrumentLabel(instrument)}. Offre domestique vs offshore à trancher.`,
      exemptions: accredited
        ? ["Reg D 506(c) possible si investisseurs accrédités et vérification"]
        : ["Regulation Crowdfunding ou enregistrement complet si retail"],
      structureRecommendation: "Delaware SPV / LLC + transfer agent + restriction transferts",
      disclaimer:
        "Indicatif uniquement — SEC/state blue sky review requis.",
    };
  }

  return {
    regime: "Cross-border — analyse multi-juridictionnelle requise",
    summary: `Instrument suggéré : ${instrumentLabel(instrument)}.`,
    exemptions: ["Identifier le pays de l'émetteur, de l'actif et des investisseurs cibles"],
    structureRecommendation,
    disclaimer: "Indicatif uniquement — avis juridique multi-juridiction obligatoire.",
  };
}

function instrumentLabel(t: InstrumentType): string {
  const map: Record<InstrumentType, string> = {
    security_token_equity: "Jeton de participation / equity token",
    security_token_debt: "Jeton de créance / debt token",
    fund_unit: "Parts de fonds / fund units",
    revenue_share: "Jeton de revenus (revenue share)",
    hybrid: "Structure hybride",
  };
  return map[t];
}

export function suggestedTokenStandard(
  data: WizardData,
  instrument: InstrumentType
): { standard: string; chain: string; rationale: string } {
  const accredited =
    data.investorProfile === "Accredited investors only" ||
    data.investorProfile === "Institutional investors";
  const eu = EU.has(
    (data.country ?? "") as (typeof COUNTRIES_EUROPE)[number]
  );

  if (eu && accredited) {
    return {
      standard: "ERC-3643 (T-REX)",
      chain: "Polygon ou Ethereum L2 (coût + conformité)",
      rationale:
        "Security token permissionné avec whitelist, freeze et règles de transfert par juridiction.",
    };
  }
  if (instrument === "security_token_debt" || instrument === "revenue_share") {
    return {
      standard: "ERC-3525 (semi-fongible) ou ERC-1400",
      chain: "EVM (Ethereum / Base)",
      rationale: "Adapté aux tranches de créance et coupons distincts.",
    };
  }
  if (data.platform === "Polymesh") {
    return {
      standard: "Polymesh assets",
      chain: "Polymesh",
      rationale: "Chaîne dédiée aux actifs réglementés.",
    };
  }
  return {
    standard: "ERC-3643 (T-REX)",
    chain: "Polygon",
    rationale: "Standard le plus répandu pour RWA permissionnés en Europe.",
  };
}
