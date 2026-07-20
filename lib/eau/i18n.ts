import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";
import type { H2oPriorityKey } from "@/lib/green/scoring/h2o-score";

export type EauHubCopy = {
  title: string;
  description: string;
  kicker: string;
  h1: string;
  intro: string;
  futureTitle: string;
  futureBody: string;
  pillars: [string, string, string];
  checkerTitle: string;
  checkerPlaceholder: string;
  checkerCta: string;
  checkerPassportCta: string;
  checkerApiNote: string;
  passportTitle: string;
  passportBody: string;
  revenueTitle: string;
  links: {
    guide: string;
    registry: string;
    label: string;
    api: string;
    impact: string;
    embed: string;
    terminal: string;
  };
  priorityLabels: Record<H2oPriorityKey, string>;
  tierLabels: { high: string; mid: string; low: string };
  previewBadge: string;
  passportRequired: string;
};

const COPY: CatalogMap< EauHubCopy> = {
  fr: {
    title: "Passeport Hydrique AUROS — infrastructure tokenisation eau",
    description:
      "H₂O Score indicatif, registre vérifiable et dossier RWA hydrique — la couche de confiance avant toute émission eau, blue bond ou droits tokenisés.",
    kicker: "AUROS · Infrastructure hydrique",
    h1: "Le passeport hydrique avant la blockchain",
    intro:
      "Calculez un H₂O Score, ouvrez un dossier passeport, puis prouvez le flux (CFU-W). Indicatif — pas de liquidité ni de déploiement on-chain promis.",
    futureTitle: "Trois actions",
    futureBody:
      "Un parcours client clair : scorier → dossier vérifiable → preuve de flux. Complétez ce qui manque plus tard.",
    pillars: [
      "H₂O Score indicatif — m³/an, concession, max 3 priorités.",
      "Passeport dossier wizard — URL / PDF quand le dossier est prêt.",
      "CFU-W + embed verify — preuve de session hydrique hashée.",
    ],
    checkerTitle: "Testez votre readiness hydrique",
    checkerPlaceholder:
      "Ex. Concession eau potable 15 ans, 2 Mm³/an, SPV France, audit hydrologique, investisseurs institutionnels…",
    checkerCta: "Calculer le H₂O Score",
    checkerPassportCta: "Obtenir le Passeport Hydrique AUROS",
    checkerApiNote: "Intégrateurs : POST /api/eau/check ou batch premium /api/v1/green/h2o/batch",
    passportTitle: "Livrables disponibles",
    passportBody:
      "Après le score : dossier passeport (~12 min), mint CFU-W démo, ou widget embed pour partenaires. Indicatif jusqu'à revue documentaire.",
    revenueTitle: "Aller plus loin",
    links: {
      guide: "Guide tokeniser l'eau",
      registry: "Registre Green public",
      label: "Label Verified",
      api: "API H₂O Score",
      impact: "Rapport d'impact",
      embed: "Widget partenaire (iframe)",
      terminal: "Green Data Terminal",
    },
    priorityLabels: {
      flow_metering: "Mesure des flux m³/an (compteur ou audit)",
      concession_title: "Titre / concession / droits documentés",
      hydrological_audit: "Audit hydrologique ou bilan eau",
      dnsh_water: "DNSH eau — critères Taxonomie EU",
      contract_tenor: "Durée contractuelle ≥ 10 ans recommandée",
      investor_disclosure: "Note investisseur / prospectus",
    },
    tierLabels: {
      high: "Readiness élevée (indicatif)",
      mid: "Readiness partielle — dossier à structurer",
      low: "Readiness faible — 3 priorités ci-dessous",
    },
    previewBadge: "Preview H₂O — passeport complet sur dossier AUROS",
    passportRequired:
      "Pour une attestation listing-grade, complétez le dossier AUROS (Passeport Hydrique vérifiable).",
  },
  en: {
    title: "AUROS Hydrological Passport — water tokenization infrastructure",
    description:
      "Indicative H₂O Score, verifiable registry and hydrological RWA dossier — the trust layer before any water, blue bond or rights issuance.",
    kicker: "AUROS · Water infrastructure",
    h1: "The hydrological passport before blockchain",
    intro:
      "Compute an H₂O Score, open a passport dossier, then prove flow (CFU-W). Indicative — no liquidity or on-chain deployment promised.",
    futureTitle: "Three actions",
    futureBody:
      "A clear client path: score → verifiable dossier → flow proof. Complete gaps later.",
    pillars: [
      "Indicative H₂O Score — m³/year, concession, max 3 priorities.",
      "Passport via wizard dossier — URL / PDF when ready.",
      "CFU-W + embed verify — hashed hydrological session proof.",
    ],
    checkerTitle: "Test your hydrological readiness",
    checkerPlaceholder:
      "E.g. 15-year drinking-water concession, 2 Mm³/year, France SPV, hydrological audit, institutional investors…",
    checkerCta: "Compute H₂O Score",
    checkerPassportCta: "Get AUROS Hydrological Passport",
    checkerApiNote: "Integrators: POST /api/eau/check or premium batch /api/v1/green/h2o/batch",
    passportTitle: "Available deliverables",
    passportBody:
      "After the score: passport dossier (~12 min), CFU-W demo mint, or partner embed widget. Indicative until documentary review.",
    revenueTitle: "Go further",
    links: {
      guide: "Water tokenization guide",
      registry: "Public Green registry",
      label: "Verified label",
      api: "H₂O Score API",
      impact: "Impact report",
      embed: "Partner widget (iframe)",
      terminal: "Green Data Terminal",
    },
    priorityLabels: {
      flow_metering: "m³/year flow metering (meter or audit)",
      concession_title: "Documented title / concession / rights",
      hydrological_audit: "Hydrological audit or water balance",
      dnsh_water: "Water DNSH — EU Taxonomy criteria",
      contract_tenor: "Contract tenor ≥ 10 years recommended",
      investor_disclosure: "Investor note / prospectus",
    },
    tierLabels: {
      high: "High readiness (indicative)",
      mid: "Partial readiness — structure dossier",
      low: "Low readiness — see 3 priorities below",
    },
    previewBadge: "H₂O preview — full passport via AUROS dossier",
    passportRequired:
      "For listing-grade attestation, complete the AUROS dossier (verifiable Hydrological Passport).",
  },
  es: {
    title: "Pasaporte Hídrico AUROS — infraestructura tokenización agua",
    description:
      "H₂O Score indicativo, registro verificable y dossier RWA hídrico — capa de confianza antes de cualquier emisión de agua, blue bond o derechos tokenizados.",
    kicker: "AUROS · Infraestructura hídrica",
    h1: "El pasaporte hídrico antes de la blockchain",
    intro:
      "Calcule un H₂O Score, abra un dossier pasaporte, luego pruebe el flujo (CFU-W). Indicativo — sin liquidez ni despliegue on-chain prometido.",
    futureTitle: "Tres acciones",
    futureBody:
      "Un recorrido claro: score → dossier verificable → prueba de flujo. Complete lo que falte después.",
    pillars: [
      "H₂O Score indicativo — m³/año, concesión, máx. 3 prioridades.",
      "Pasaporte vía wizard — URL / PDF cuando esté listo.",
      "CFU-W + embed verify — prueba de sesión hidrológica hasheada.",
    ],
    checkerTitle: "Pruebe su readiness hídrico",
    checkerPlaceholder:
      "Ej. Concesión agua potable 15 años, 2 Mm³/año, SPV Francia, auditoría hidrológica, inversores institucionales…",
    checkerCta: "Calcular H₂O Score",
    checkerPassportCta: "Obtener Pasaporte Hídrico AUROS",
    checkerApiNote: "Integradores: POST /api/eau/check o batch premium /api/v1/green/h2o/batch",
    passportTitle: "Entregables disponibles",
    passportBody:
      "Tras el score: dossier pasaporte (~12 min), mint CFU-W demo, o widget embed partner. Indicativo hasta revisión documental.",
    revenueTitle: "Ir más lejos",
    links: {
      guide: "Guía tokenizar agua",
      registry: "Registro Green público",
      label: "Label Verified",
      api: "API H₂O Score",
      impact: "Informe de impacto",
      embed: "Widget partner (iframe)",
      terminal: "Green Data Terminal",
    },
    priorityLabels: {
      flow_metering: "Medición flujos m³/año (contador o auditoría)",
      concession_title: "Título / concesión / derechos documentados",
      hydrological_audit: "Auditoría hidrológica o balance hídrico",
      dnsh_water: "DNSH agua — criterios Taxonomía UE",
      contract_tenor: "Plazo contractual ≥ 10 años recomendado",
      investor_disclosure: "Nota inversor / folleto",
    },
    tierLabels: {
      high: "Readiness alto (indicativo)",
      mid: "Readiness parcial — estructurar dossier",
      low: "Readiness bajo — ver 3 prioridades",
    },
    previewBadge: "Preview H₂O — pasaporte completo vía dossier AUROS",
    passportRequired:
      "Para attestation listing-grade, complete el dossier AUROS (Pasaporte Hídrico verificable).",
  },
};

export function getEauHubCopy(locale: Locale): EauHubCopy {
  return COPY[resolveCatalogLocale(locale)] ?? COPY.fr;
}
