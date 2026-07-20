import {
  CHARGEFLOW_CONSOLE_ROUTE,
  CHARGEFLOW_F_ROUTE,
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
  CHARGEFLOW_W_ROUTE,
} from "@/lib/chargeflow/constants";
import { CHARGEFLOW_FAQ_ITEMS } from "@/lib/seo/content/chargeflow-faq";

import { enrichPage } from "../enrich";

export const chargeflowHubPage = enrichPage({
  id: "chargeflow-hub",
  path: CHARGEFLOW_ROUTE,
  title: "AUROS ChargeFlow | CFU-E vérifiables pour flottes & CPO",
  description:
    "Transformez des sessions de charge en unités CFU-E hashées et vérifiables — RWA prep, ESG granulaire, sans smart contract. Compatible Supercharger-class. Pas de partnership Tesla.",
  summary:
    "ChargeFlow est le standard AUROS d'unités de charge vérifiables (CFU-E). Demo publique, API Premium, console opérateurs, lien Watts Reserve pour booking des watts critiques.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "ChargeFlow",
    "CFU-E",
    "unités de charge vérifiables",
    "flotte VE RWA",
    "CPO ESG",
    "Supercharger-class",
    "OCPI charge",
    "AUROS Green charge",
  ],
  intents: [
    "Qu'est-ce que ChargeFlow AUROS ?",
    "Comment mint une CFU-E ?",
    "Preuve de charge pour dossier RWA",
  ],
  audience: ["flottes", "CPO", "opérateurs recharge", "équipes ESG", "développeurs"],
  facts: [
    { key: "Demo", value: CHARGEFLOW_ROUTE },
    { key: "API", value: "POST /api/v1/chargeflow" },
    { key: "Verify", value: "/chargeflow/{id}" },
    { key: "Docs", value: "/developers/docs/endpoint-chargeflow" },
    { key: "Watts", value: "/green/watts" },
  ],
  faq: CHARGEFLOW_FAQ_ITEMS,
  breadcrumbs: [
    { name: "Green", path: "/green" },
  ],
  relatedPaths: [
    "/green/watts",
    CHARGEFLOW_FLEETS_ROUTE,
    CHARGEFLOW_CONSOLE_ROUTE,
    CHARGEFLOW_F_ROUTE,
    "/copilot",
    "/developers/docs/endpoint-chargeflow",
  ],
});

export const chargeflowFleetsPage = enrichPage({
  id: "chargeflow-fleets",
  path: CHARGEFLOW_FLEETS_ROUTE,
  title: "ChargeFlow pour flottes & CPO | AUROS",
  description:
    "Tunnel flottes et CPO : sessions de charge → CFU-E vérifiables pour finance RWA et reporting ESG. Compatible réseaux Supercharger-class.",
  summary:
    "Page pitch flottes/CPO ChargeFlow — CFU-E, Watts Reserve, inventaire et secondaire. Aucune claim de partnership Tesla.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "ChargeFlow flottes",
    "CPO CFU",
    "ESG recharge VE",
    "RWA flotte électrique",
  ],
  intents: [
    "ChargeFlow pour flotte VE",
    "Preuve ESG sessions de charge",
  ],
  audience: ["fleet managers", "CPO", "ESG"],
  facts: [
    { key: "Demo CFU-E", value: CHARGEFLOW_ROUTE },
    { key: "Watts hub", value: "/green/watts" },
  ],
  faq: CHARGEFLOW_FAQ_ITEMS.slice(0, 4),
  breadcrumbs: [
    { name: "Green", path: "/green" },
    { name: "ChargeFlow", path: CHARGEFLOW_ROUTE },
  ],
  relatedPaths: [CHARGEFLOW_ROUTE, "/green/watts", CHARGEFLOW_CONSOLE_ROUTE],
});

export const chargeflowConsolePage = enrichPage({
  id: "chargeflow-console",
  path: CHARGEFLOW_CONSOLE_ROUTE,
  title: "Console ChargeFlow | Opérateurs CFU AUROS",
  description:
    "Console opérateurs ChargeFlow — lister, filtrer et gérer des unités CFU (Premium). Vérification publique par id.",
  summary:
    "Console Premium pour opérateurs : liste CFU, retire explicite, filtres kind/status. Complète la demo publique /green/chargeflow.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: ["console ChargeFlow", "opérateur CFU", "retire CFU"],
  intents: ["Gérer des CFU ChargeFlow", "Retirer une unité CFU"],
  audience: ["opérateurs", "CPO", "développeurs"],
  facts: [
    { key: "API list", value: "GET /api/v1/chargeflow" },
    { key: "Retire", value: "POST /api/v1/chargeflow/{id}/retire" },
  ],
  breadcrumbs: [
    { name: "Green", path: "/green" },
    { name: "ChargeFlow", path: CHARGEFLOW_ROUTE },
  ],
  relatedPaths: [CHARGEFLOW_ROUTE, CHARGEFLOW_FLEETS_ROUTE, "/developers"],
});

export const chargeflowFlexPage = enrichPage({
  id: "chargeflow-flex",
  path: CHARGEFLOW_F_ROUTE,
  title: "ChargeFlow CFU-F | Flex capacité AUROS",
  description:
    "Unités CFU-F pour capacité flexible (kW) — preuve off-chain pour flex énergie et prep RWA. Lien Watts Reserve firm/flex.",
  summary:
    "CFU-F = ChargeFlow Unit Flex. Complète CFU-E (énergie) pour les profils capacité. Matching Watts firm vs flex sur /green/watts.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: ["CFU-F", "flex capacité", "ChargeFlow flex", "kW vérifiable"],
  intents: ["Qu'est-ce qu'une CFU-F ?", "Flex vs firm watts"],
  audience: ["producteurs flex", "acheteurs corporate", "CPO"],
  facts: [
    { key: "Standard", value: "AUROS-ChargeFlow-CFU-F" },
    { key: "Watts", value: "/green/watts" },
  ],
  faq: [
    {
      question: "CFU-F vs CFU-E ?",
      answer:
        "CFU-E prouve une énergie livrée (kWh). CFU-F prouve une capacité flexible (kW). Watts Reserve choisit firm → CFU-E ou flex → CFU-F à la confirm.",
    },
  ],
  breadcrumbs: [
    { name: "Green", path: "/green" },
    { name: "ChargeFlow", path: CHARGEFLOW_ROUTE },
  ],
  relatedPaths: [CHARGEFLOW_ROUTE, "/green/watts", "/green/chargeflow/reserve"],
});

export const chargeflowEauPage = enrichPage({
  id: "chargeflow-eau",
  path: CHARGEFLOW_W_ROUTE,
  title: "ChargeFlow CFU-W | Unités hydriques AUROS",
  description:
    "CFU-W — unités ChargeFlow pour preuves hydriques / eau, liées au passeport hydrique AUROS Eau.",
  summary:
    "Branche eau de ChargeFlow : CFU-W pour traçabilité hydrique. Hub Eau /eau et H₂O Score API Green.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "CFU-W",
    "ChargeFlow eau",
    "preuve hydrique",
    "tokenisation eau",
  ],
  intents: ["CFU-W hydrique", "ChargeFlow et passeport eau"],
  audience: ["utilities", "émetteurs blue bond", "ESG eau"],
  facts: [
    { key: "Hub Eau", value: "/eau" },
    { key: "Standard", value: "AUROS-ChargeFlow-CFU-W" },
  ],
  breadcrumbs: [
    { name: "Eau", path: "/eau" },
  ],
  relatedPaths: ["/eau", CHARGEFLOW_ROUTE, "/green"],
});

export const chargeflowPages = [
  chargeflowHubPage,
  chargeflowFleetsPage,
  chargeflowConsolePage,
  chargeflowFlexPage,
  chargeflowEauPage,
];
