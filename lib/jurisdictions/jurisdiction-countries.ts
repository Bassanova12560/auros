const JURISDICTION_TO_COUNTRY: Record<string, string> = {
  luxembourg: "Luxembourg",
  france: "France",
  "dubai-difc": "UAE",
  singapore: "Singapore",
  switzerland: "Switzerland",
  ireland: "Ireland",
  bahrain: "Bahrain",
  gibraltar: "Gibraltar",
};

export function jurisdictionIdToCountry(id: string): string | null {
  return JURISDICTION_TO_COUNTRY[id] ?? null;
}
