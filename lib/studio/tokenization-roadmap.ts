import {
  normalizeDocumentIds,
  type RwaDocumentId,
} from "@/lib/rwa-document-phases";
import type { WizardData } from "@/lib/wizard-types";

export type RoadmapTask = {
  id: string;
  title: string;
  description: string;
  owner: "issuer" | "legal" | "tech" | "compliance" | "auros";
  documentIds?: string[];
  weeksFromStart: number;
  status: "done" | "active" | "upcoming";
};

export type RoadmapPhase = {
  id: string;
  title: string;
  duration: string;
  tasks: RoadmapTask[];
};

export function buildTokenizationRoadmap(data: WizardData): RoadmapPhase[] {
  const held = new Set(normalizeDocumentIds(data.documents ?? []));
  const urgent = data.timeline === "As soon as possible";
  const baseWeek = urgent ? 0 : data.timeline === "Within 3 months" ? 2 : 4;

  const task = (
    id: string,
    title: string,
    description: string,
    owner: RoadmapTask["owner"],
    docId?: string,
    week = 0
  ): RoadmapTask => ({
    id,
    title,
    description,
    owner,
    documentIds: docId ? [docId] : undefined,
    weeksFromStart: baseWeek + week,
    status:
      docId && held.has(docId as RwaDocumentId)
        ? "done"
        : week === 0
          ? "active"
          : "upcoming",
  });

  return [
    {
      id: "qualify",
      title: "Qualification & structuration",
      duration: "Semaines 1–2",
      tasks: [
        task(
          "q1",
          "Finaliser qualification actif & investisseurs",
          "Wizard AUROS + admission plateforme",
          "issuer",
          undefined,
          0
        ),
        task(
          "q2",
          "Choisir structure juridique (SPV / société)",
          "Aligner avec recommandation réglementaire du dossier",
          "legal",
          "spv_documents",
          1
        ),
        task(
          "q3",
          "Avis juridique préliminaire",
          "Lettre sur légalité de l'émission dans la juridiction",
          "legal",
          "legal_opinion",
          2
        ),
      ],
    },
    {
      id: "legal_pack",
      title: "Pack juridique & data room",
      duration: "Semaines 2–6",
      tasks: [
        task(
          "l1",
          "Preuve de propriété & due diligence",
          "Titres, audits, rapports risques",
          "issuer",
          "proof_of_ownership",
          2
        ),
        task(
          "l2",
          "Valorisation indépendante",
          "Expert agréé — base du prospectus",
          "issuer",
          "valuation_report",
          3
        ),
        task(
          "l3",
          "Prospectus / PPM & KYC/AML",
          "Documents investisseurs + manuel conformité",
          "compliance",
          "prospectus",
          4
        ),
      ],
    },
    {
      id: "token_tech",
      title: "Token & smart contract",
      duration: "Semaines 5–8",
      tasks: [
        task(
          "t1",
          "Blueprint tokenomics validé",
          "Paramètres AUROS → revue legal + tech",
          "tech",
          "tokenomics",
          5
        ),
        task(
          "t2",
          "Audit smart contract",
          "Slither/Mythril préliminaire + cabinet final",
          "tech",
          "smart_contract_audit",
          6
        ),
        task(
          "t3",
          "Déploiement testnet & whitelist",
          "Sandbox + intégration KYC (Sumsub/Onfido — phase 2)",
          "tech",
          undefined,
          7
        ),
      ],
    },
    {
      id: "launch",
      title: "Émission & mise en marché",
      duration: "Semaines 8–12",
      tasks: [
        task(
          "p1",
          "Revue dossier AUROS",
          "Validation interne, compléments data room si besoin",
          "auros",
          undefined,
          8
        ),
        task(
          "p2",
          "KYC investisseurs & mint",
          "Registry on-chain + premier closing",
          "compliance",
          "kyc_aml_policy",
          9
        ),
        task(
          "p3",
          "Reporting régulateur initial",
          "AMF/SEC selon juridiction — templates AUROS",
          "compliance",
          undefined,
          10
        ),
      ],
    },
    {
      id: "lifecycle",
      title: "Cycle de vie",
      duration: "Continu",
      tasks: [
        task(
          "c1",
          "Distributions & reporting investisseurs",
          "Stablecoins + portail porteurs",
          "issuer",
          "financial_reporting_plan",
          12
        ),
        task(
          "c2",
          "Cap table on-chain & événements corporate",
          "Splits, rachats, votes AG",
          "tech",
          undefined,
          14
        ),
        task(
          "c3",
          "Marché secondaire (optionnel)",
          "Marché secondaire ou gré à gré (si applicable)",
          "issuer",
          undefined,
          16
        ),
      ],
    },
  ];
}
