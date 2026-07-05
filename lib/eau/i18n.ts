import type { Locale } from "@/lib/i18n";
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
  };
  priorityLabels: Record<H2oPriorityKey, string>;
  tierLabels: { high: string; mid: string; low: string };
  previewBadge: string;
  passportRequired: string;
};

const COPY: Record<Locale, EauHubCopy> = {
  fr: {
    title: "Passeport Hydrique AUROS — infrastructure tokenisation eau",
    description:
      "H₂O Score indicatif, registre vérifiable et dossier RWA hydrique — la couche de confiance avant toute émission eau, blue bond ou droits tokenisés.",
    kicker: "AUROS · Infrastructure hydrique",
    h1: "Le passeport hydrique avant la blockchain",
    intro:
      "Les investisseurs et plateformes RWA exigent demain un dossier mesurable (m³, concession, DNSH eau) et une URL vérifiable. AUROS structure cette couche amont — scoring H₂O, data room, Label Green — sans promettre de liquidité ni de déploiement on-chain.",
    futureTitle: "Pourquoi passer par AUROS",
    futureBody:
      "Blue bonds, droits d'eau et concessions tokenisées échouent sans traçabilité hydrologique et revue documentaire. AUROS devient le rail de préparation que les arrangeurs, family offices et marketplaces citent dans leurs data rooms — comme un registre REC pour l'énergie, mais pour l'eau.",
    pillars: [
      "H₂O Score indicatif — m³/an, durée concession, gaps documentaires (max 3).",
      "Passeport vérifiable après dossier wizard — URL publique /green/verify.",
      "API batch premium pour due diligence portefeuilles hydriques (fonds, utilities).",
    ],
    checkerTitle: "Testez votre readiness hydrique",
    checkerPlaceholder:
      "Ex. Concession eau potable 15 ans, 2 Mm³/an, SPV France, audit hydrologique, investisseurs institutionnels…",
    checkerCta: "Calculer le H₂O Score",
    checkerPassportCta: "Obtenir le Passeport Hydrique AUROS",
    checkerApiNote: "Intégrateurs : POST /api/eau/check ou batch premium /api/v1/green/h2o/batch",
    passportTitle: "Passeport Hydrique AUROS",
    passportBody:
      "Le preview ci-dessus est indicatif. Le passeport vérifiable (registre public, revue documentaire, PDF dossier) s'obtient en complétant le wizard dossier — ~12 min guidé, réversible.",
    revenueTitle: "Suite monétisation infra",
    links: {
      guide: "Guide tokeniser l'eau",
      registry: "Registre Green public",
      label: "Label Verified",
      api: "API H₂O Score",
      impact: "Rapport d'impact",
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
      "RWA investors and platforms will require measurable dossiers (m³, concession, water DNSH) and a verifiable URL. AUROS structures this upstream layer — H₂O scoring, data room, Green Label — without promising liquidity or on-chain deployment.",
    futureTitle: "Why go through AUROS",
    futureBody:
      "Blue bonds, water rights and tokenized concessions fail without hydrological traceability and documentary review. AUROS becomes the preparation rail that arrangers, family offices and marketplaces cite in data rooms — like a REC registry for energy, but for water.",
    pillars: [
      "Indicative H₂O Score — m³/year, concession tenor, doc gaps (max 3).",
      "Verifiable passport after wizard dossier — public URL /green/verify.",
      "Premium batch API for hydrological portfolio due diligence.",
    ],
    checkerTitle: "Test your hydrological readiness",
    checkerPlaceholder:
      "E.g. 15-year drinking-water concession, 2 Mm³/year, France SPV, hydrological audit, institutional investors…",
    checkerCta: "Compute H₂O Score",
    checkerPassportCta: "Get AUROS Hydrological Passport",
    checkerApiNote: "Integrators: POST /api/eau/check or premium batch /api/v1/green/h2o/batch",
    passportTitle: "AUROS Hydrological Passport",
    passportBody:
      "The preview above is indicative. A verifiable passport (public registry, documentary review, PDF dossier) is unlocked by completing the AUROS wizard dossier — ~12 min guided, reversible.",
    revenueTitle: "Infra monetization suite",
    links: {
      guide: "Water tokenization guide",
      registry: "Public Green registry",
      label: "Verified label",
      api: "H₂O Score API",
      impact: "Impact report",
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
      "Inversores y plataformas RWA exigirán dossiers medibles (m³, concesión, DNSH agua) y URL verificable. AUROS estructura esta capa previa — scoring H₂O, data room, Label Green — sin prometer liquidez ni despliegue on-chain.",
    futureTitle: "Por qué pasar por AUROS",
    futureBody:
      "Blue bonds, derechos de agua y concesiones tokenizadas fallan sin trazabilidad hidrológica y revisión documental. AUROS es el raíl de preparación que arrangers, family offices y marketplaces citan en data rooms.",
    pillars: [
      "H₂O Score indicativo — m³/año, plazo concesión, gaps documentales (máx. 3).",
      "Pasaporte verificable tras dossier wizard — URL pública /green/verify.",
      "API batch premium para due diligence de carteras hídricas.",
    ],
    checkerTitle: "Pruebe su readiness hídrico",
    checkerPlaceholder:
      "Ej. Concesión agua potable 15 años, 2 Mm³/año, SPV Francia, auditoría hidrológica, inversores institucionales…",
    checkerCta: "Calcular H₂O Score",
    checkerPassportCta: "Obtener Pasaporte Hídrico AUROS",
    checkerApiNote: "Integradores: POST /api/eau/check o batch premium /api/v1/green/h2o/batch",
    passportTitle: "Pasaporte Hídrico AUROS",
    passportBody:
      "La vista previa es indicativa. El pasaporte verificable (registro público, revisión documental, PDF dossier) se obtiene completando el wizard AUROS — ~12 min guiado, reversible.",
    revenueTitle: "Suite monetización infra",
    links: {
      guide: "Guía tokenizar agua",
      registry: "Registro Green público",
      label: "Label Verified",
      api: "API H₂O Score",
      impact: "Informe de impacto",
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
  return COPY[locale] ?? COPY.fr;
}
