import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import {
  JURISDICTIONS_ROUTE,
  JURISDICTIONS_STARTER_KIT_ROUTE,
} from "@/lib/jurisdictions/constants";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import {
  buildAllJurisdictionFacts,
  buildJurisdictionHubFacts,
} from "./seo-landing-pages";
import { enrichPage } from "../enrich";

const faq = getEnterpriseMessages("fr").faq.items;

export const jurisdictionsPage = enrichPage({
  id: "jurisdictions",
  path: JURISDICTIONS_ROUTE,
  title: "Comparateur juridictions RWA | AUROS",
  description:
    "Comparez 8 juridictions tokenisation RWA : frais, délais licence, fiscalité investisseur, KYC — DIFC, Luxembourg, Singapour, Suisse, France, Irlande, Bahreïn, Gibraltar.",
  summary:
    "Outil B2B central AUROS pour arbitrer où structurer une émission RWA (phase 0). Compare 8 juridictions sur frais État vs conseil, délais licence, fiscalité investisseur et niveau KYC. Étude comparative gratuite ; memo juridiction Starter Kit 5 000 € si validation.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "jurisdiction comparator RWA",
    "tokenization jurisdiction",
    "DIFC vs Luxembourg",
    "VARA",
    "CSSF",
    "MiCA jurisdiction",
    "where to tokenize",
  ],
  intents: [
    "Où structurer mon émission RWA ?",
    "DIFC ou Luxembourg pour tokeniser ?",
    "Quels frais et délais par juridiction ?",
    "Quelle fiscalité investisseur selon le pays ?",
  ],
  audience: [
    "promoteur immobilier",
    "foncière",
    "émetteur obligations",
    "family office",
    "legal counsel RWA",
  ],
  facts: [
    { key: "Juridictions", value: "8 comparées" },
    { key: "Données", value: "Frais, délais licence, fiscalité, KYC — indicatif" },
    { key: "Étude gratuite", value: "2 juridictions, brief IA par email" },
    { key: "Starter Kit", value: "5 000 € — memo phase 0 post-paiement" },
    { key: "Régulateurs cités", value: "CSSF, VARA, MAS, AMF, CBI, GFSC" },
    ...buildJurisdictionHubFacts(),
    ...buildAllJurisdictionFacts(),
  ],
  faq: faq.map((f) => ({ question: f.q, answer: f.a })),
  relatedPaths: [
    JURISDICTIONS_STARTER_KIT_ROUTE,
    "/wizard",
    "/compare",
    "/jurisdictions/luxembourg-real-estate",
  ],
});

const starter = getEnterpriseMessages("fr").starterKitPage;
const starterFaq = getEnterpriseMessages("fr").faq.items;

export const starterKitPage = enrichPage({
  id: "jurisdictions-starter-kit",
  path: JURISDICTIONS_STARTER_KIT_ROUTE,
  title: starter.title,
  description: starter.description,
  summary:
    "Offre payante phase 0 AUROS (5 000 €) : memo juridiction personnalisé — arbitrage SPV, régulateur, checklist, calendrier, shortlist tech RWA. Livraison portail + PDF en minutes. Distinct du wizard gratuit (dossier actif). Valeur marché indicatif ~19 000 €.",
  contentType: "product",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "RWA Starter Kit",
    "jurisdiction memo",
    "phase 0 tokenization",
    "SPV structuring",
    "5000 EUR",
  ],
  intents: [
    "Combien coûte un brief juridiction RWA ?",
    "Qu'est-ce que le Starter Kit AUROS ?",
    "Alternative cabinet pour phase 0 tokenisation",
  ],
  audience: ["promoteurs", "foncières", "émetteurs", "CFO", "counsel"],
  facts: [
    { key: "Prix", value: "5 000 € TTC" },
    { key: "Livraison", value: "Immédiate post-paiement Stripe" },
    { key: "Inclus", value: "Memo juridiction, SPV, checklist, timeline, tech shortlist" },
    { key: "Non inclus", value: "Dossier actif /wizard (gratuit, phase séparée)" },
    { key: "Valeur marché indicatif", value: "~19 000 € phase 0 cabinet" },
  ],
  offers: [
    {
      name: "AUROS Starter Kit — Décision juridiction RWA",
      price: "5000",
      priceCurrency: "EUR",
      description: starter.description,
      url: JURISDICTIONS_STARTER_KIT_ROUTE,
    },
  ],
  faq: starterFaq.map((f) => ({ question: f.q, answer: f.a })),
  relatedPaths: [JURISDICTIONS_ROUTE, "/wizard"],
});
