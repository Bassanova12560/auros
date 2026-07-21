import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";

export function buildResiliencePages(): AiFirstPage[] {
  return [
    enrichPage({
      id: "resilience-hub",
      path: "/resilience",
      title: "Résilience actifs eau & énergie | AUROS",
      description:
        "Tour de contrôle indicatif — WELHR, playbook continuité, WETS, verify. Chaîne détecter → décider → prouver pour RWA et data centers.",
      summary:
        "AUROS pilote la résilience des actifs tokenisables : détection hydrique (WELHR), décision chiffrée (playbook / ROI), preuve (WETS / verify). Pas d’exécution automatique.",
      contentType: "landing",
      language: "fr",
      indexable: true,
      lastUpdated: "2026-07-21",
      keywords: [
        "résilience infrastructure",
        "stress hydrique data center",
        "RWA eau énergie",
        "playbook continuité",
        "WELHR",
        "H2O RWA",
      ],
      intents: [
        "Comment scorers le risque hydrique d’un data center avant tokenisation",
        "Générer un playbook de continuité eau / refroidissement",
        "API résilience eau énergie AUROS",
      ],
      audience: ["risk desk", "chef de projet DC", "émetteurs RWA", "RSE"],
      facts: [
        { key: "Discovery API", value: "GET /api/green/eau/resilience" },
        { key: "WELHR", value: "POST /api/green/eau/legal-risk" },
        { key: "Playbook", value: "POST /api/green/eau/continuity-playbook" },
        { key: "ROI", value: "POST /api/green/eau/roi" },
        { key: "Brief", value: "POST /api/green/eau/resilience-brief" },
      ],
      faq: [
        {
          question: "AUROS exécute-t-il des actions sur site ?",
          answer:
            "Non. Les playbooks et ROI sont indicatifs — validation counsel / EPC / utility. La chaîne produit est détecter → décider → prouver.",
        },
        {
          question: "Où tester un cas data center 100 MW ?",
          answer:
            "Étude fictive + simulateur ROI : /demos/data-center-100mw. Compass : /compass/dashboard?mode=water.",
        },
      ],
      relatedPaths: [
        "/h2o-rwa",
        "/eau",
        "/eau/risk",
        "/eau/continuity",
        "/eau/trust",
        "/compass",
        "/demos/data-center-100mw",
        "/green/api",
        "/green/csrd-check",
      ],
    }),
    enrichPage({
      id: "h2o-rwa-landing",
      path: "/h2o-rwa",
      title: "H2O RWA · Tokenisation de l’eau | AUROS",
      description:
        "Infrastructure de confiance pour RWA hydriques — H₂O Score, WETS, WELHR, CFU-W. Pas une marketplace.",
      summary:
        "Landing SEO H₂O RWA : scores, preuves hash-only et rapports avant listing. CTAs vers hub /eau, WETS et WELHR.",
      contentType: "landing",
      language: "fr",
      indexable: true,
      lastUpdated: "2026-07-21",
      keywords: [
        "H2O RWA",
        "water RWA",
        "tokenisation eau",
        "real world asset water",
        "blue bond",
      ],
      intents: [
        "Qu’est-ce qu’un H2O RWA",
        "Comment tokeniser des droits d’eau avec preuves",
      ],
      audience: ["émetteurs", "fonds", "utilities"],
      facts: [
        { key: "Hub", value: "/eau" },
        { key: "WETS", value: "/eau/trust" },
        { key: "WELHR", value: "/eau/risk" },
        { key: "API resilience", value: "GET /api/green/eau/resilience" },
      ],
      faq: [
        {
          question: "AUROS est-il un exchange eau ?",
          answer:
            "Non. AUROS fournit scores, playbooks et verify — pas d’exécution de marché réglementé.",
        },
      ],
      relatedPaths: ["/eau", "/resilience", "/eau/trust", "/comment-tokeniser/eau"],
    }),
    enrichPage({
      id: "dc-100mw-demo",
      path: "/demos/data-center-100mw",
      title: "Data center 100 MW · étude de cas | AUROS",
      description:
        "Démo marketing fictive — économies d’eau et coûts indicatifs, WELHR/WETS, simulateur ROI. Pas un audit.",
      summary:
        "Cas Meridian North (fictif) : avant/après eau, playbook continuité, calculateur ROI durable avec hypothèses visibles.",
      contentType: "guide",
      language: "fr",
      indexable: true,
      lastUpdated: "2026-07-21",
      keywords: [
        "data center water",
        "100 MW",
        "refroidissement boucle fermée",
        "ROI eau",
      ],
      intents: [
        "Combien d’eau économise un DC 100 MW en boucle fermée",
        "Étude de cas résilience data center RWA",
      ],
      audience: ["RSE", "CFO", "ingénierie"],
      facts: [
        { key: "ROI API", value: "POST /api/green/eau/roi" },
        { key: "Playbook UI", value: "/eau/continuity/playbook" },
      ],
      faq: [
        {
          question: "Les chiffres 35 % sont-ils garantis ?",
          answer:
            "Non. Le simulateur affiche des fourchettes avec hypothèses (L/kWh, €/m³, stress zone). Counsel et EPC requis.",
        },
      ],
      relatedPaths: ["/resilience", "/eau/continuity", "/compass", "/h2o-rwa"],
    }),
    enrichPage({
      id: "compass-hub",
      path: "/compass",
      title: "Auros Compass · Cockpit résilience | AUROS",
      description:
        "Tableau de bord en 3 modes — eau, carbone indicatif, budget. Max 3 priorités visibles.",
      summary:
        "Compass filtre par KPI (eau / carbone / budget) avec Resilience brief WELHR et tuiles vers outils AUROS.",
      contentType: "landing",
      language: "fr",
      indexable: true,
      lastUpdated: "2026-07-21",
      keywords: ["auros compass", "dashboard résilience", "KPI eau carbone"],
      intents: ["Dashboard résilience projet eau énergie"],
      audience: ["chef de projet", "risk desk"],
      facts: [
        { key: "Dashboard", value: "/compass/dashboard?mode=water" },
        { key: "Brief API", value: "POST /api/green/eau/resilience-brief" },
      ],
      faq: [],
      relatedPaths: ["/resilience", "/eau/risk", "/green/hub", "/power"],
    }),
  ];
}
