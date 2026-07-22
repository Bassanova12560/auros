import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";

export const homePage = enrichPage({
  id: "home",
  path: "/",
  title: "AUROS | Admission RWA & tokenisation d'actifs réels",
  description:
    "AUROS — Structurez votre dossier RWA en conformité MiCA. Score, data room et rapport institutionnel en moins d'une heure.",
  summary:
    "AUROS est une plateforme B2B gratuite pour évaluer si un actif réel (immobilier, obligations, fonds, crédit) est tokenisable. Le wizard produit un dossier avec score, checklist data room et studio réglementaire. Pour la décision juridiction (DIFC, Luxembourg…), voir /jurisdictions et le Starter Kit phase 0 à 5 000 €.",
  contentType: "home",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "RWA tokenization",
    "tokenisation actifs réels",
    "admission score",
    "data room",
    "MiCA",
    "real estate tokenization",
  ],
  intents: [
    "Mon actif est-il tokenisable ?",
    "Comment préparer un dossier RWA ?",
    "Quel score d'admission pour tokeniser ?",
  ],
  audience: ["promoteur immobilier", "foncière", "family office", "émetteur B2B"],
  facts: [
    { key: "Produit gratuit", value: "Wizard + dossier actif (/wizard)" },
    { key: "Documents data room", value: "15 pièces checklistées" },
    { key: "Juridictions comparées", value: "8 (UE, DIFC, Singapour, Suisse…)" },
    { key: "Offre payante juridiction", value: "Starter Kit phase 0 — 5 000 €" },
  ],
  relatedPaths: ["/wizard", "/jurisdictions", "/compare", "/resource-layer", "/builders"],
});

export const wizardPage = enrichPage({
  id: "wizard",
  path: "/wizard",
  title: "Wizard tokenisation RWA | AUROS",
  description:
    "Questionnaire gratuit en 4 phases : actif, valorisation, localisation, data room — score d'admission et dossier PDF.",
  summary:
    "Parcours gratuit en ~15 minutes pour structurer l'admission d'un actif RWA. Phase 1 distincte du Starter Kit juridiction (payant). Produit : description actif, valorisation, documents, profil investisseur, score indicatif.",
  contentType: "app",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["wizard RWA", "dossier tokenisation", "admission actif", "data room"],
  intents: [
    "Comment tokeniser mon actif étape par étape ?",
    "Quels documents pour une tokenisation RWA ?",
  ],
  audience: ["émetteurs", "promoteurs", "CFO", "asset owners"],
  facts: [
    { key: "Prix", value: "Gratuit" },
    { key: "Phases", value: "4 (actif → conformité → contact)" },
    { key: "Livrable", value: "Dossier /dossier + PDF admission" },
    { key: "Complément", value: "Starter Kit juridiction si besoin phase 0" },
  ],
  relatedPaths: ["/", "/dossier", "/jurisdictions"],
});

export const dossierPage = enrichPage({
  id: "dossier",
  path: "/dossier",
  title: "Dossier actif RWA | AUROS",
  description:
    "Portail dossier : score admission, studio tokenisation, data room, soumission plateforme.",
  summary:
    "Vue consolidée après le wizard : score d'admission, checklist data room, studio réglementaire IA, export PDF. Distinct du memo juridiction Starter Kit.",
  contentType: "app",
  language: "multi",
  indexable: false,
  lastUpdated: "2026-05-29",
  keywords: ["dossier RWA", "admission score", "tokenization studio"],
  intents: ["Où voir mon dossier tokenisation ?"],
  audience: ["utilisateurs wizard AUROS"],
  facts: [
    { key: "Accès", value: "Après wizard ou compte connecté" },
    { key: "Score", value: "Indice admission 0–100" },
  ],
  relatedPaths: ["/wizard", "/dashboard"],
});

export const dashboardPage = enrichPage({
  id: "dashboard",
  path: "/dashboard",
  title: "Mes dossiers | AUROS",
  description:
    "Espace personnel AUROS — dossiers tokenisation RWA, scores d'admission et exports PDF depuis votre compte.",
  summary: "Espace utilisateur authentifié listant les dossiers tokenisation sauvegardés.",
  contentType: "app",
  language: "multi",
  indexable: false,
  lastUpdated: "2026-05-29",
  keywords: ["dashboard AUROS", "mes dossiers RWA"],
  intents: ["Retrouver mes dossiers tokenisation"],
  audience: ["utilisateurs inscrits"],
  facts: [{ key: "Auth", value: "Clerk — inscription gratuite" }],
  relatedPaths: ["/wizard", "/dossier"],
});
