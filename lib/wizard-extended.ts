/** Options for wizard steps 10–14 (legal, revenue, compliance, investors). */

export const LEGAL_STRUCTURES = [
  "Personal ownership (direct)",
  "Through a company / SCI",
  "Through a trust or foundation",
  "Other structure",
] as const;

export type LegalStructure = (typeof LEGAL_STRUCTURES)[number];

export const INCOME_OPTIONS = [
  { id: "rental", label: "Yes — rental income", needsAmount: true },
  { id: "other", label: "Yes — other income", needsDescription: true },
  { id: "none", label: "No income currently", needsAmount: false },
  { id: "future", label: "Potential future income", needsAmount: false },
] as const;

export type IncomeType = (typeof INCOME_OPTIONS)[number]["id"];

export const LEGAL_STATUS_OPTIONS = [
  "Clear title — no disputes",
  "No mortgage or encumbrance",
  "No ongoing litigation",
  "Tax compliant in jurisdiction",
  "I need to verify some of these",
] as const;

export const INVESTOR_PROFILES = [
  "Retail investors (general public)",
  "Accredited investors only",
  "Institutional investors",
  "I don't know yet",
] as const;

export type InvestorProfile = (typeof INVESTOR_PROFILES)[number];
