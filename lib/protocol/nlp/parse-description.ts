import type { AssetClass, EuNexus, InvestorType, IssuerType, WhitepaperStatus } from "@/lib/mica-checker/types";

export type ParsedAssetType =
  | "real_estate"
  | "private_fund"
  | "bonds"
  | "private_credit"
  | "commodities"
  | "stablecoins"
  | "low_carbon_power"
  | "other";

export type ParsedDescription = {
  assetType: ParsedAssetType;
  valueEur: number | null;
  jurisdictions: string[];
  investorType: InvestorType | null;
  issuerType: IssuerType | null;
  assetClass: AssetClass | null;
  euNexus: EuNexus | null;
  whitepaper: WhitepaperStatus | null;
  hasKycMention: boolean;
  hasDataRoomMention: boolean;
  hasSpvMention: boolean;
  hasRetailMention: boolean;
  hasProfessionalMention: boolean;
  keywords: string[];
};

const JURISDICTION_PATTERNS: { id: string; pattern: RegExp }[] = [
  { id: "luxembourg", pattern: /\bluxembourg\b|\blux\b/i },
  { id: "dubai-difc", pattern: /\bdubai\b|\bdifc\b|\buae\b/i },
  { id: "singapore", pattern: /\bsingapore\b|\bsingapour\b/i },
  { id: "switzerland", pattern: /\bswitzerland\b|\bsuisse\b|\bgen[eè]ve\b/i },
  { id: "ireland", pattern: /\bireland\b|\birlande\b/i },
  { id: "france", pattern: /\bfrance\b|\bparis\b/i },
  { id: "liechtenstein", pattern: /\bliechtenstein\b/i },
  { id: "cayman", pattern: /\bcayman\b/i },
];

function detectAssetType(lower: string): ParsedAssetType {
  if (/warehouse|entrep[oô]t|retail|commercial|immobilier|immeuble|villa|apartment|maison|terrain|real\s*estate/.test(lower)) {
    return "real_estate";
  }
  if (/private\s*fund|hedge\s*fund|ucits|raif|sicav|fund\b|fonds/.test(lower)) {
    return "private_fund";
  }
  if (/bond|obligation|treasury|sovereign/.test(lower)) {
    return "bonds";
  }
  if (/private\s*credit|lending|loan|cr[eé]dit/.test(lower)) {
    return "private_credit";
  }
  if (/gold|commodit|mati[eè]re|silver|oil/.test(lower)) {
    return "commodities";
  }
  if (
    /eau|water|hydrique|hydrological|concession\s+eau|water\s*rights|desal|dessalement|blue\s*bond|irrigation|potable|m³|m3/.test(
      lower
    )
  ) {
    return "commodities";
  }
  if (/stablecoin|usdc|usdt|eurc/.test(lower)) {
    return "stablecoins";
  }
  if (
    /nucl[eé]aire|nuclear|low[\s-]?carbon|bas[\s-]?carbone|generation_source/.test(
      lower
    )
  ) {
    return "low_carbon_power";
  }
  return "other";
}

function parseValueEur(lower: string): number | null {
  const match = lower.match(/(\d[\d,\s.]*)\s*(€|eur|usd|\$|chf|k|m)\b/i);
  if (!match) return null;
  let value = parseFloat(match[1].replace(/[,\s]/g, ""));
  if (Number.isNaN(value)) return null;
  const unit = match[2].toLowerCase();
  if (unit === "k") value *= 1_000;
  if (unit === "m") value *= 1_000_000;
  return Math.round(value);
}

function detectInvestorType(lower: string): InvestorType | null {
  if (/\bmixed\b|\bretail\s+and\s+professional/.test(lower)) return "mixed";
  if (/\bprofessional\b|\binstitutional\b|\bhnwi\b|\baccrédité/.test(lower)) return "professional";
  if (/\bretail\b|\bparticulier/.test(lower)) return "retail";
  return null;
}

function detectIssuerType(lower: string): IssuerType | null {
  if (/\bspv\b|\bcompany\b|\bsoci[eé]t[eé]\b/.test(lower)) return "company_spv";
  if (/\bfund\b|\bfonds\b|\braif\b|\bsicav\b/.test(lower)) return "existing_fund";
  if (/\bindividual\b|\bparticulier\b|\bpersonne\s+physique/.test(lower)) return "individual";
  return null;
}

function detectAssetClass(lower: string, assetType: ParsedAssetType): AssetClass | null {
  if (/\be-money\b|\bstablecoin\b|\bemt\b/.test(lower)) return "e_money";
  if (assetType === "real_estate" || assetType === "bonds" || assetType === "private_credit") {
    return "financial_instrument";
  }
  if (/\bart\b|\bnft\b|\butility\b/.test(lower)) return "art_utility";
  return null;
}

function detectEuNexus(lower: string, jurisdictions: string[]): EuNexus | null {
  if (/\bno\s+eu\b|\boffshore\b|\bcayman\b|\bdubai\b/.test(lower)) return "no_eu";
  if (/\beu\s+issuer\b|\bissuer\s+in\s+eu\b/.test(lower)) return "issuer_eu";
  if (/\beu\s+investor/.test(lower)) return "investors_eu";
  if (/\beu\s+asset\b|\basset\s+in\s+eu\b/.test(lower)) return "asset_eu";
  const euJurisdictions = new Set(["luxembourg", "france", "ireland"]);
  if (jurisdictions.some((j) => euJurisdictions.has(j))) return "issuer_eu";
  return null;
}

function detectWhitepaper(lower: string): WhitepaperStatus | null {
  if (/\bwhitepaper\s+ready\b|\bwhitepaper\s+final/.test(lower)) return "ready";
  if (/\bwhitepaper\s+draft\b|\bdraft\s+whitepaper/.test(lower)) return "draft";
  if (/\bno\s+whitepaper\b|\bwithout\s+whitepaper/.test(lower)) return "none";
  if (/\bwhitepaper\b|\bprospectus\b/.test(lower)) return "draft";
  return null;
}

export function parseDescription(description: string): ParsedDescription {
  const lower = description.toLowerCase().trim();
  const assetType = detectAssetType(lower);
  const jurisdictions = JURISDICTION_PATTERNS.filter((j) => j.pattern.test(lower)).map(
    (j) => j.id
  );
  const keywords: string[] = [];
  for (const j of JURISDICTION_PATTERNS) {
    if (j.pattern.test(lower)) keywords.push(j.id);
  }
  if (/\bwarehouse\b/.test(lower)) keywords.push("warehouse");
  if (/\bretail\b/.test(lower)) keywords.push("retail");

  return {
    assetType,
    valueEur: parseValueEur(lower),
    jurisdictions,
    investorType: detectInvestorType(lower),
    issuerType: detectIssuerType(lower),
    assetClass: detectAssetClass(lower, assetType),
    euNexus: detectEuNexus(lower, jurisdictions),
    whitepaper: detectWhitepaper(lower),
    hasKycMention: /\bkyc\b|\baml\b|\bcdd\b/.test(lower),
    hasDataRoomMention: /\bdata\s*room\b|\bdue\s*diligence\b|\bdocuments\b/.test(lower),
    hasSpvMention: /\bspv\b|\bspecial\s+purpose\b/.test(lower),
    hasRetailMention: /\bretail\b/.test(lower),
    hasProfessionalMention: /\bprofessional\b|\binstitutional\b/.test(lower),
    keywords,
  };
}
