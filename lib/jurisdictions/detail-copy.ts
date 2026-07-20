import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

export type JurisdictionDetailCopy = {
  stateFees: string;
  advisoryFees: string;
  licenseDelay: string;
  productionDelay: string;
  taxInvestor: string;
  taxAlert?: string;
  taxTip?: string;
  language: string;
};

const FR: Record<string, JurisdictionDetailCopy> = {
  luxembourg: {
    stateFees: "8–15 k€",
    advisoryFees: "7–35 k€",
    licenseDelay: "6–9 mois",
    productionDelay: "+2–3 mois",
    taxInvestor: "0 % PV",
    taxAlert: "Structure holding",
    taxTip: "Exonération PV via holding — substance économique à valider.",
    language: "FR / EN / DE",
  },
  "dubai-difc": {
    stateFees: "3–8 k€",
    advisoryFees: "5–22 k€",
    licenseDelay: "2–3 mois",
    productionDelay: "+1–2 mois",
    taxInvestor: "0 % PV",
    language: "EN (officiel)",
  },
  singapore: {
    stateFees: "10–25 k€",
    advisoryFees: "10–35 k€",
    licenseDelay: "3–5 mois",
    productionDelay: "+2–4 mois",
    taxInvestor: "0 % PV*",
    taxAlert: "17 % IS émetteur",
    taxTip: "PV investisseur souvent exonérée ; IS 17 % au niveau société émettrice.",
    language: "EN",
  },
  switzerland: {
    stateFees: "5–15 k€",
    advisoryFees: "5–25 k€",
    licenseDelay: "3–5 mois",
    productionDelay: "+2–3 mois",
    taxInvestor: "Variable",
    taxAlert: "Selon canton",
    taxTip: "Taux effectif 11–21 % selon canton, type de titre et statut investisseur.",
    language: "DE / FR / EN",
  },
  france: {
    stateFees: "2–6 k€",
    advisoryFees: "3–14 k€",
    licenseDelay: "4–6 mois",
    productionDelay: "+2–4 mois",
    taxInvestor: "30 % flat",
    taxAlert: "Retail possible",
    taxTip: "PFU 30 % sur plus-values ; régime pro / société peut différer.",
    language: "FR",
  },
  ireland: {
    stateFees: "5–12 k€",
    advisoryFees: "5–23 k€",
    licenseDelay: "4–6 mois",
    productionDelay: "+2–4 mois",
    taxInvestor: "12,5 % IS",
    taxAlert: "Passeport EU",
    taxTip: "MiCA / CBI — fiscalité société 12,5 % ; traitement investisseur à valider.",
    language: "EN",
  },
  bahrain: {
    stateFees: "2–5 k€",
    advisoryFees: "3–10 k€",
    licenseDelay: "2–3 mois",
    productionDelay: "+1–2 mois",
    taxInvestor: "0 % IS / PV",
    language: "EN / AR",
  },
  gibraltar: {
    stateFees: "2–6 k€",
    advisoryFees: "3–14 k€",
    licenseDelay: "2–3 mois",
    productionDelay: "+1–3 mois",
    taxInvestor: "10 % IS",
    taxAlert: "Cadre DLT",
    taxTip: "Régime DLT favorable crypto-natif ; IS 10 % — structuration holding possible.",
    language: "EN",
  },
};

const EN: Record<string, JurisdictionDetailCopy> = {
  luxembourg: {
    stateFees: "€8–15k",
    advisoryFees: "€7–35k",
    licenseDelay: "6–9 months",
    productionDelay: "+2–3 months",
    taxInvestor: "0% CG",
    taxAlert: "Holding structure",
    taxTip: "CG exemption via holding — economic substance required.",
    language: "FR / EN / DE",
  },
  "dubai-difc": {
    stateFees: "€3–8k",
    advisoryFees: "€5–22k",
    licenseDelay: "2–3 months",
    productionDelay: "+1–2 months",
    taxInvestor: "0% CG",
    language: "EN (official)",
  },
  singapore: {
    stateFees: "€10–25k",
    advisoryFees: "€10–35k",
    licenseDelay: "3–5 months",
    productionDelay: "+2–4 months",
    taxInvestor: "0% CG*",
    taxAlert: "17% issuer CIT",
    taxTip: "Investor CG often exempt; 17% CIT at issuer level depending on structure.",
    language: "EN",
  },
  switzerland: {
    stateFees: "€5–15k",
    advisoryFees: "€5–25k",
    licenseDelay: "3–5 months",
    productionDelay: "+2–3 months",
    taxInvestor: "Varies",
    taxAlert: "By canton",
    taxTip: "Effective rate 11–21% by canton, security type and investor status.",
    language: "DE / FR / EN",
  },
  france: {
    stateFees: "€2–6k",
    advisoryFees: "€3–14k",
    licenseDelay: "4–6 months",
    productionDelay: "+2–4 months",
    taxInvestor: "30% flat",
    taxAlert: "Retail possible",
    taxTip: "30% flat tax on gains; professional / corporate regimes may differ.",
    language: "FR",
  },
  ireland: {
    stateFees: "€5–12k",
    advisoryFees: "€5–23k",
    licenseDelay: "4–6 months",
    productionDelay: "+2–4 months",
    taxInvestor: "12.5% CIT",
    taxAlert: "EU passport",
    taxTip: "MiCA / CBI — 12.5% corporate tax; investor treatment to be validated.",
    language: "EN",
  },
  bahrain: {
    stateFees: "€2–5k",
    advisoryFees: "€3–10k",
    licenseDelay: "2–3 months",
    productionDelay: "+1–2 months",
    taxInvestor: "0% CIT / CG",
    language: "EN / AR",
  },
  gibraltar: {
    stateFees: "€2–6k",
    advisoryFees: "€3–14k",
    licenseDelay: "2–3 months",
    productionDelay: "+1–3 months",
    taxInvestor: "10% CIT",
    taxAlert: "DLT framework",
    taxTip: "Crypto-friendly DLT regime; 10% CIT — holding structures possible.",
    language: "EN",
  },
};

const ES: Record<string, JurisdictionDetailCopy> = {
  luxembourg: {
    stateFees: "8–15 k€",
    advisoryFees: "7–35 k€",
    licenseDelay: "6–9 meses",
    productionDelay: "+2–3 meses",
    taxInvestor: "0 % PV",
    taxAlert: "Estructura holding",
    taxTip: "Exención PV vía holding — sustancia económica a validar.",
    language: "FR / EN / DE",
  },
  "dubai-difc": {
    stateFees: "3–8 k€",
    advisoryFees: "5–22 k€",
    licenseDelay: "2–3 meses",
    productionDelay: "+1–2 meses",
    taxInvestor: "0 % PV",
    language: "EN (oficial)",
  },
  singapore: {
    stateFees: "10–25 k€",
    advisoryFees: "10–35 k€",
    licenseDelay: "3–5 meses",
    productionDelay: "+2–4 meses",
    taxInvestor: "0 % PV*",
    taxAlert: "17 % IS emisor",
    taxTip: "PV inversor a menudo exenta; IS 17 % a nivel emisor.",
    language: "EN",
  },
  switzerland: {
    stateFees: "5–15 k€",
    advisoryFees: "5–25 k€",
    licenseDelay: "3–5 meses",
    productionDelay: "+2–3 meses",
    taxInvestor: "Variable",
    taxAlert: "Según cantón",
    taxTip: "Tipo efectivo 11–21 % según cantón y perfil inversor.",
    language: "DE / FR / EN",
  },
  france: {
    stateFees: "2–6 k€",
    advisoryFees: "3–14 k€",
    licenseDelay: "4–6 meses",
    productionDelay: "+2–4 meses",
    taxInvestor: "30 % flat",
    taxAlert: "Retail posible",
    taxTip: "PFU 30 % sobre plusvalías; régimen profesional puede diferir.",
    language: "FR",
  },
  ireland: {
    stateFees: "5–12 k€",
    advisoryFees: "5–23 k€",
    licenseDelay: "4–6 meses",
    productionDelay: "+2–4 meses",
    taxInvestor: "12,5 % IS",
    taxAlert: "Pasaporte UE",
    taxTip: "MiCA / CBI — IS 12,5 %; tratamiento inversor a validar.",
    language: "EN",
  },
  bahrain: {
    stateFees: "2–5 k€",
    advisoryFees: "3–10 k€",
    licenseDelay: "2–3 meses",
    productionDelay: "+1–2 meses",
    taxInvestor: "0 % IS / PV",
    language: "EN / AR",
  },
  gibraltar: {
    stateFees: "2–6 k€",
    advisoryFees: "3–14 k€",
    licenseDelay: "2–3 meses",
    productionDelay: "+1–3 meses",
    taxInvestor: "10 % IS",
    taxAlert: "Marco DLT",
    taxTip: "Régimen DLT crypto-nativo; IS 10 % — holding posible.",
    language: "EN",
  },
};

const CATALOG: CatalogMap< Record<string, JurisdictionDetailCopy>> = {
  fr: FR,
  en: EN,
  es: ES,
};

export function getJurisdictionDetail(
  locale: Locale,
  id: string
): JurisdictionDetailCopy {
  const bucket = CATALOG[resolveCatalogLocale(locale)] ?? FR;
  return bucket[id] ?? FR[id] ?? bucket["dubai-difc"];
}
