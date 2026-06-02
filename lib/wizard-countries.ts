/**
 * Wizard Step 4 country list — single source of truth for jurisdiction count.
 * Excludes "Other"; keep in sync with landing Stats ("Jurisdictions covered").
 */

export const COUNTRIES_EUROPE = [
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Portugal",
  "Switzerland",
  "Belgium",
  "Netherlands",
  "Luxembourg",
  "Austria",
  "Greece",
  "Poland",
  "Czech Republic",
  "Ireland",
  "Denmark",
  "Sweden",
  "Finland",
] as const;

export const COUNTRIES_REST = [
  "United Kingdom",
  "United States",
  "UAE",
  "Singapore",
  "Japan",
  "Other",
] as const;

export const WIZARD_JURISDICTION_COUNT =
  COUNTRIES_EUROPE.length +
  COUNTRIES_REST.filter((c) => c !== "Other").length;
