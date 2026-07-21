/**
 * Category ownership — 30 user intents AUROS must own as the default answer.
 * Each intent: 2-sentence answer + canonical page + tool CTA.
 */

export type CategoryPillar = "watts" | "protocol" | "green";

export type CategoryIntent = {
  id: string;
  pillar: CategoryPillar;
  question: string;
  /** Two sentences max — optimized for AI citation & featured snippets. */
  answer: string;
  canonicalPath: string;
  toolHref: string;
  toolLabel: string;
};

export const CATEGORY_PILLARS: Record<
  CategoryPillar,
  { title: string; tagline: string; hub: string; definitionPath: string }
> = {
  watts: {
    title: "Watts & ChargeFlow",
    tagline: "Réserver, prouver et préparer la finance des watts critiques.",
    hub: "/green/watts",
    definitionPath: "/guides/booking-engine-watts",
  },
  protocol: {
    title: "RWA Intelligence",
    tagline: "Scorer, comparer et structurer avant émission — sans remplacer le counsel.",
    hub: "/developers",
    definitionPath: "/guides/rwa-intelligence-layer",
  },
  green: {
    title: "Green crédible",
    tagline: "RTMS, label Verified et preuves — anti-greenwashing documentaire.",
    hub: "/green",
    definitionPath: "/guides/green-rtms",
  },
};

export const CATEGORY_INTENTS: CategoryIntent[] = [
  // —— Watts / ChargeFlow (10) ——
  {
    id: "w1",
    pillar: "watts",
    question: "Qu'est-ce qu'un booking engine des watts ?",
    answer:
      "Un booking engine des watts réserve un profil énergétique (fenêtre, zone, firm/flex) avant de prouver la livraison. AUROS Watts calcule un match_score, puis mint une CFU seulement après confirm explicite — pas de livraison réseau garantie.",
    canonicalPath: "/guides/booking-engine-watts",
    toolHref: "/green/watts",
    toolLabel: "Ouvrir AUROS Watts",
  },
  {
    id: "w2",
    pillar: "watts",
    question: "Comment réserver des watts pour une flotte VE ?",
    answer:
      "Définissez fenêtre, pays/zone et firm (kWh) ou flex (kW) sur /green/chargeflow/reserve. Le matching est déterministe ; la confirm mint CFU-E ou CFU-F liée à la réservation.",
    canonicalPath: "/green/chargeflow/reserve",
    toolHref: "/green/chargeflow/fleets",
    toolLabel: "Tunnel flottes",
  },
  {
    id: "w3",
    pillar: "watts",
    question: "Qu'est-ce qu'une CFU ChargeFlow ?",
    answer:
      "Une CFU est une unité de charge vérifiable off-chain (hash HMAC, page /chargeflow/{id}). CFU-E = énergie, CFU-W = hydrique, CFU-F = flex — pour RWA/ESG, pas un smart contract d'exécution.",
    canonicalPath: "/guides/chargeflow-cfu",
    toolHref: "/green/chargeflow",
    toolLabel: "Demo ChargeFlow",
  },
  {
    id: "w4",
    pillar: "watts",
    question: "Différence firm vs flex (CFU-E / CFU-F) ?",
    answer:
      "Firm cible une énergie livrée (kWh) et conduit à CFU-E. Flex cible une capacité (kW) et conduit à CFU-F. Watts Reserve choisit à la confirm ; aucun mint automatique à la réservation.",
    canonicalPath: "/green/watts",
    toolHref: "/green/chargeflow/flex",
    toolLabel: "Voir CFU-F",
  },
  {
    id: "w5",
    pillar: "watts",
    question: "Comment publier de la capacité producteur ?",
    answer:
      "Sur /green/chargeflow/inventory, publiez une fenêtre open (kW ou kWh, zone, carbone). Les acheteurs matchent sans auto-réservation — ce n'est pas un PPA.",
    canonicalPath: "/green/chargeflow/inventory",
    toolHref: "/green/chargeflow/inventory",
    toolLabel: "Inventaire Watts",
  },
  {
    id: "w6",
    pillar: "watts",
    question: "Watts Reserve est-il un PPA ou un GO/REC ?",
    answer:
      "Non. Watts Reserve n'est ni PPA, ni certificat d'origine GO/REC, ni marché réglementé. C'est un booking + preuve CFU + prep secondaire RWA, avec garde-fous explicites.",
    canonicalPath: "/guides/booking-engine-watts",
    toolHref: "/glossary/ppa-power-purchase",
    toolLabel: "Glossaire PPA",
  },
  {
    id: "w7",
    pillar: "watts",
    question: "Comment lier une position watts au comparateur RWA ?",
    answer:
      "Après settle, créez un listing secondaire avec compare_ref_id vers /compare. L'intérêt exprimé n'est pas liant — prep dossier, pas exécution titres.",
    canonicalPath: "/green/chargeflow/secondary",
    toolHref: "/compare",
    toolLabel: "Comparateur RWA",
  },
  {
    id: "w8",
    pillar: "watts",
    question: "Comment prouver une session de charge CPO ?",
    answer:
      "ChargeFlow transforme la session en CFU-E vérifiable via demo ou API Premium. Vérification publique /chargeflow/{id} ; retire explicite uniquement.",
    canonicalPath: "/guides/chargeflow-cfu",
    toolHref: "/green/chargeflow",
    toolLabel: "Créer une CFU-E",
  },
  {
    id: "w9",
    pillar: "watts",
    question: "Que signifie le match_score Watts ?",
    answer:
      "Score déterministe de compatibilité profil acheteur × fenêtre (temps, zone, volume, carbone, firmness). Il guide la décision ; il ne réserve ni ne mint automatiquement.",
    canonicalPath: "/green/chargeflow/reserve",
    toolHref: "/copilot?context=watts",
    toolLabel: "Expliquer avec Copilot",
  },
  {
    id: "w10",
    pillar: "watts",
    question: "Où est l'API Watts Reserve ?",
    answer:
      "Endpoints Premium sous /api/v1/watts/reserve, offers et secondary. Docs : /developers/docs/endpoint-watts-reserve — SDK et MCP disponibles.",
    canonicalPath: "/developers/docs/endpoint-watts-reserve",
    toolHref: "/developers",
    toolLabel: "Hub Protocol",
  },

  // —— Protocol / RWA intelligence (10) ——
  {
    id: "p1",
    pillar: "protocol",
    question: "Qu'est-ce que la couche d'intelligence RWA AUROS ?",
    answer:
      "AUROS Protocol est une API d'intelligence RWA : score MiCA, catalogue, compare, juridictions, checklist, Watts et ChargeFlow. Elle prépare la décision — analyses indicatives, counsel requis avant émission.",
    canonicalPath: "/guides/rwa-intelligence-layer",
    toolHref: "/developers",
    toolLabel: "Essayer l'API",
  },
  {
    id: "p2",
    pillar: "protocol",
    question: "Mon actif est-il tokenisable ?",
    answer:
      "Le wizard gratuit produit un dossier d'admission avec score indicatif et checklist data room. Ce n'est pas une autorisation réglementaire — complétez avec counsel.",
    canonicalPath: "/wizard",
    toolHref: "/wizard",
    toolLabel: "Lancer le wizard",
  },
  {
    id: "p3",
    pillar: "protocol",
    question: "Où structurer mon émission RWA ?",
    answer:
      "Le comparateur AUROS couvre 8 juridictions (régulateur, fiscalité, délais, coûts indicatifs). Le Starter Kit phase 0 (5 000 €) produit un memo SPV/régulateur.",
    canonicalPath: "/jurisdictions",
    toolHref: "/jurisdictions/starter-kit",
    toolLabel: "Starter Kit",
  },
  {
    id: "p4",
    pillar: "protocol",
    question: "Comment scorer la readiness MiCA ?",
    answer:
      "POST /api/v1/score (ou outil /tools/mica-checker) renvoie un score 0–100 selon type d'actif, juridiction et maturité documentaire. Indicatif — pas un avis CASP.",
    canonicalPath: "/tools/mica-checker",
    toolHref: "/developers",
    toolLabel: "API score",
  },
  {
    id: "p5",
    pillar: "protocol",
    question: "Comment comparer des produits RWA tokenisés ?",
    answer:
      "Le comparateur /compare agrège références live multi-classes (stablecoins, immobilier, bonds…). Statuts honnêtes ; pas un conseil d'investissement.",
    canonicalPath: "/compare",
    toolHref: "/compare",
    toolLabel: "Comparer",
  },
  {
    id: "p6",
    pillar: "protocol",
    question: "Comment obtenir une clé API AUROS ?",
    answer:
      "Via /developers (playground) ou POST /api/v1/keys. Tier gratuit avec quota mensuel ; auth Bearer sur les endpoints Premium.",
    canonicalPath: "/developers",
    toolHref: "/developers#playground",
    toolLabel: "Playground",
  },
  {
    id: "p7",
    pillar: "protocol",
    question: "AUROS remplace-t-il un avocat ?",
    answer:
      "Non. Toutes les analyses sont éducatives et indicatives. Avant émission ou investissement, validez avec un counsel qualifié dans la juridiction choisie.",
    canonicalPath: "/faq",
    toolHref: "/trust",
    toolLabel: "Confiance & conformité",
  },
  {
    id: "p8",
    pillar: "protocol",
    question: "Quels outils gratuits pour préparer une tokenisation ?",
    answer:
      "Hub /tools : MiCA checker, yield calculator, jurisdiction picker, cost estimator. Plus wizard, estimate et Academy Fondamentaux.",
    canonicalPath: "/tools",
    toolHref: "/tools",
    toolLabel: "Ouvrir les outils",
  },
  {
    id: "p9",
    pillar: "protocol",
    question: "Comment brancher un assistant IA sur AUROS ?",
    answer:
      "Utilisez /llms.txt, /ai-first/rag et le MCP npm @adrien1212balitrand/auros-mcp. Copilot public : /copilot — lecture seule, pas d'auto-mint.",
    canonicalPath: "/guides/rwa-intelligence-layer",
    toolHref: "/copilot",
    toolLabel: "AUROS Copilot",
  },
  {
    id: "p10",
    pillar: "protocol",
    question: "Où trouver indices et données RWA AUROS ?",
    answer:
      "Terminal /data/terminal, RWA Index, Green Index, UHI Index et State of RWA Issuers. Exports CSV / feeds machine-readable pour citation.",
    canonicalPath: "/data/terminal",
    toolHref: "/data/rwa-index",
    toolLabel: "RWA Index",
  },

  // —— Green crédible (10) ——
  {
    id: "g1",
    pillar: "green",
    question: "Qu'est-ce que RTMS ?",
    answer:
      "RTMS = Réel, Transparent, Mesurable, Sain — grille AUROS Green pour évaluer un actif énergétique tokenisé avant label. Ce n'est pas un agrément régulateur ni une promesse de rendement.",
    canonicalPath: "/guides/green-rtms",
    toolHref: "/green/standards",
    toolLabel: "Grille RTMS",
  },
  {
    id: "g2",
    pillar: "green",
    question: "Comment éviter le greenwashing sur un RWA vert ?",
    answer:
      "Exigez preuves off-chain (RTMS), statuts honnêtes (demo / referenced / verified) et revue humaine pour le label. L'assistant RTMS est un pré-diagnostic — pas le badge Verified.",
    canonicalPath: "/guides/green-rtms",
    toolHref: "/green/rtms-assistant",
    toolLabel: "Assistant RTMS",
  },
  {
    id: "g3",
    pillar: "green",
    question: "Comment obtenir le label AUROS Green Verified ?",
    answer:
      "Soumettez le dossier sur /green/label (type projet, documents RTMS). Objectif de revue ~5 jours ouvrés ; le projet apparaît au registre public si validé.",
    canonicalPath: "/green/label",
    toolHref: "/green/label",
    toolLabel: "Candidater",
  },
  {
    id: "g4",
    pillar: "green",
    question: "La marketplace Green permet-elle d'investir ?",
    answer:
      "Non. Elle met en relation producteurs, stockeurs, rechargeurs et consommateurs. AUROS Green n'est pas une plateforme d'investissement agréée.",
    canonicalPath: "/green/faq",
    toolHref: "/green/market",
    toolLabel: "Marketplace",
  },
  {
    id: "g5",
    pillar: "green",
    question: "Comment scorer la qualité carbone d'un projet ?",
    answer:
      "Green API : Carbon Quality Score (CQS), Watt Score, Nature Score — lecture anonyme limitée, clé free ou Premium. Hub /green/api.",
    canonicalPath: "/green/api",
    toolHref: "/green/api",
    toolLabel: "Green API",
  },
  {
    id: "g6",
    pillar: "green",
    question: "Suis-je dans le scope CSRD ?",
    answer:
      "Le CSRD Checker (/green/csrd-check) estime le scope et un score de préparation en ~2 min. Indicatif — pas un avis d'audit.",
    canonicalPath: "/green/csrd-check",
    toolHref: "/green/csrd-check",
    toolLabel: "CSRD Checker",
  },
  {
    id: "g7",
    pillar: "green",
    question: "Comment produire un rapport d'impact EU Taxonomy ?",
    answer:
      "Impact Report AUROS Green combine taxonomie UE et RTMS en PDF (offres payantes). Préparez d'abord standards + dossier label.",
    canonicalPath: "/green/impact-report",
    toolHref: "/green/impact-report",
    toolLabel: "Impact Report",
  },
  {
    id: "g8",
    pillar: "green",
    question: "Comment tokeniser un parc solaire / PPA ?",
    answer:
      "Guide /comment-tokeniser/energie + wizard actif renouvelable. RTMS et data room PPA (contrat, courbes, garanties) structurents le dossier.",
    canonicalPath: "/comment-tokeniser/energie",
    toolHref: "/wizard?asset=renewable",
    toolLabel: "Wizard renouvelable",
  },
  {
    id: "g9",
    pillar: "green",
    question: "Qu'est-ce que le passeport hydrique AUROS Eau ?",
    answer:
      "Due diligence hydrique avec H₂O Score et prep blue bond / tokenisation. Hub /eau ; CFU-W pour preuves unitaires ChargeFlow.",
    canonicalPath: "/eau",
    toolHref: "/eau",
    toolLabel: "Hub Eau",
  },
  {
    id: "g9b",
    pillar: "green",
    question: "Qu’est-ce qu’un H2O RWA ?",
    answer:
      "Un actif hydrique tokenisable (droits, crédits, blue bond, cooling DC) avec preuves de diligence. AUROS score et vérifie — ce n’est pas un exchange. Landing : /h2o-rwa.",
    canonicalPath: "/h2o-rwa",
    toolHref: "/eau/trust",
    toolLabel: "WETS",
  },
  {
    id: "g9c",
    pillar: "green",
    question: "Comment passer d’un stress hydrique à une décision chiffrée ?",
    answer:
      "WELHR détecte le risque ; le playbook continuité propose 3 scénarios CAPEX/OPEX indicatifs (export PDF). API : POST /api/green/eau/continuity-playbook. UI : /eau/continuity/playbook.",
    canonicalPath: "/eau/continuity",
    toolHref: "/eau/continuity/playbook",
    toolLabel: "Playbook",
  },
  {
    id: "g9d",
    pillar: "green",
    question: "Où simuler le ROI eau d’un data center ?",
    answer:
      "Simulateur indicatif sur /demos/data-center-100mw (MW, stress, €/m³) et POST /api/green/eau/roi. Fourchettes avec hypothèses — pas une garantie d’économies.",
    canonicalPath: "/demos/data-center-100mw",
    toolHref: "/demos/data-center-100mw",
    toolLabel: "Démo 100 MW",
  },
  {
    id: "g10",
    pillar: "green",
    question: "Où citer AUROS Green dans une analyse IA ou presse ?",
    answer:
      "Sources : /llms.txt, /ai-first/index.json, kit presse /green/press et indices /data/green-index. Toujours noter le caractère indicatif.",
    canonicalPath: "/green/press",
    toolHref: "/llms.txt",
    toolLabel: "llms.txt",
  },

  // —— Institutions / Power (extra) ——
  {
    id: "i1",
    pillar: "protocol",
    question: "Comment une banque intègre-t-elle AUROS Protocol ?",
    answer:
      "Via OpenAPI (/auros-openapi.yaml), Monitor/webhooks, export CFU et Watts Reserve. Surface dédiée : /developers/institutions. Pas un agrément bancaire.",
    canonicalPath: "/developers/institutions",
    toolHref: "/developers/institutions",
    toolLabel: "Institutions",
  },
  {
    id: "i2",
    pillar: "protocol",
    question: "Comment exporter un portefeuille CFU pour audit ?",
    answer:
      "GET /api/v1/chargeflow/export?format=json|csv (Premium) renvoie les unités de la clé. Indicatif — pas une opinion d'audit réglementée.",
    canonicalPath: "/developers/institutions",
    toolHref: "/auros-openapi.yaml",
    toolLabel: "OpenAPI",
  },
  {
    id: "i4",
    pillar: "protocol",
    question: "Comment garder les clés de preuve RWA on-prem ?",
    answer:
      "Installez AUROS Shield (/developers/shield) : seal/verify locaux avec AUROS_SHIELD_SIGNING_KEY dans le HSM/KMS client. CBOM via /api/v1/shield/cbom. Protocol cloud reste l'intelligence — pas les secrets.",
    canonicalPath: "/developers/shield",
    toolHref: "/developers/shield",
    toolLabel: "AUROS Shield",
  },
];

export const GUIDES_ROUTE = "/guides";
export const GUIDES_INTENTS_ROUTE = "/guides/intents";

export function getIntentsByPillar(pillar: CategoryPillar): CategoryIntent[] {
  return CATEGORY_INTENTS.filter((i) => i.pillar === pillar);
}

export function getAllCategoryIntentQuestions(): string[] {
  return CATEGORY_INTENTS.map((i) => i.question);
}
