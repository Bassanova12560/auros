import { JURISDICTIONS_ROUTE } from "./constants";

/** Wizard Step 4 country → tokenization jurisdiction id (when mappable). */
const WIZARD_COUNTRY_TO_JURISDICTION: Record<string, string> = {
  France: "france",
  Switzerland: "switzerland",
  Luxembourg: "luxembourg",
  Ireland: "ireland",
  UAE: "dubai-difc",
  Singapore: "singapore",
};

export type JurisdictionsEntrySource = "score" | "wizard" | "nav" | "compare";

export function jurisdictionIdFromWizardCountry(country: string): string | null {
  const trimmed = country.trim();
  if (!trimmed) return null;
  return WIZARD_COUNTRY_TO_JURISDICTION[trimmed] ?? null;
}

export function buildJurisdictionsUrl(options?: {
  compareA?: string;
  compareB?: string;
  quote?: string;
  from?: JurisdictionsEntrySource;
  hash?: "guide" | "devis" | "comparator";
}): string {
  const params = new URLSearchParams();
  if (options?.compareA) params.set("compareA", options.compareA);
  if (options?.compareB) params.set("compareB", options.compareB);
  if (options?.quote) params.set("quote", options.quote);
  if (options?.from) params.set("from", options.from);

  const query = params.toString();
  const hash = options?.hash ? `#${options.hash}` : "";
  return `${JURISDICTIONS_ROUTE}${query ? `?${query}` : ""}${hash}`;
}

export function jurisdictionsUrlFromWizardCountry(country: string): string {
  const mapped = jurisdictionIdFromWizardCountry(country);
  if (mapped) {
    return buildJurisdictionsUrl({
      compareA: mapped,
      from: "wizard",
      hash: "guide",
    });
  }
  return buildJurisdictionsUrl({ from: "wizard", hash: "guide" });
}
