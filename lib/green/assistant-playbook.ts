/**
 * Personalized Green assistant playbook — max 3 next steps / suggestions (UX).
 */

import {
  GREEN_COMPARE_ROUTE,
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STANDARDS_ROUTE,
} from "@/lib/green/constants";
import { WIZARD_EXPRESS_HREF } from "@/lib/wizard-routes";

export type GreenAssistantRole = "issuer" | "buyer" | "risk" | "rse";
export type GreenAssistantAsset =
  | "solar"
  | "wind"
  | "dc"
  | "carbon"
  | "other";

export type GreenAssistantProfile = {
  role: string;
  asset: string;
  region: string;
};

export type GreenNextStep = {
  label: string;
  href: string;
  why: string;
};

const EAU_TRUST = "/eau/trust";
const EAU_CONTINUITY = "/eau/continuity";

function regionHint(region: string): string {
  const r = region.trim();
  return r ? ` (${r})` : "";
}

/** Max 3 chat starter questions, tailored to role × asset. */
export function greenAssistantSuggestions(p: GreenAssistantProfile): string[] {
  const reg = regionHint(p.region);
  const byRoleAsset: Record<string, string[]> = {
    "issuer:solar": [
      `Comment préparer un dossier RTMS pour un actif solaire${reg} ?`,
      "Quelles preuves pour le label Green Verified ?",
      "Quel prochain pas avant le wizard express ?",
    ],
    "issuer:wind": [
      `Checklist RTMS pour un parc éolien${reg} ?`,
      "Différence standards RTMS et label Verified ?",
      "Comment comparer mon dossier sur Green Compare ?",
    ],
    "issuer:dc": [
      "Comment lier eau et énergie pour un data center (WELHR) ?",
      "Quel score / preuve montrer à un acheteur corporate ?",
      "Par où commencer : trust eau ou RTMS énergie ?",
    ],
    "issuer:carbon": [
      "Comment lire CQS / qualité carbone sur AUROS Green ?",
      "Lien entre crédit carbone et label Green ?",
      "Prochain pas pour documenter un projet carbone ?",
    ],
    "buyer:solar": [
      `Que vérifier avant d’acheter un PPA / actif solaire tokenisé${reg} ?`,
      "Comment comparer deux offres Green ?",
      "Où voir les preuves verify / registry ?",
    ],
    "buyer:dc": [
      "Comment évaluer la résilience eau-énergie d’un data center ?",
      "Quel brief montrer à mon risk desk ?",
      "Différence continuity playbook et score WELHR ?",
    ],
    "risk:solar": [
      "Quels disclaimers et preuves RTMS sont indicatifs seulement ?",
      "Comment auditer un export registry Green ?",
      "Liens utiles verify / Evidence Pack ?",
    ],
    "risk:dc": [
      "Cadre legal-risk eau pour un site data center ?",
      "Comment lire un continuity playbook AUROS ?",
      "Quelles preuves ne pas inventer (APY, partenaires) ?",
    ],
    "rse:solar": [
      "Comment préparer un check CSRD / impact report Green ?",
      "Que documenter pour un reporting RSE énergie ?",
      "Prochain pas Academy / standards RTMS ?",
    ],
    "rse:carbon": [
      "Comment expliquer CQS à mon comité RSE ?",
      "Impact report Green : à quoi ça sert ?",
      "Lien Nature Score / carbone ?",
    ],
  };

  const key = `${p.role}:${p.asset}`;
  const hit = byRoleAsset[key];
  if (hit) return hit.slice(0, 3);

  if (p.role === "buyer") {
    return [
      "Comment comparer des offres Green en 3 critères ?",
      "Où vérifier un score ou un export registry ?",
      `Quel prochain pas pour un achat${reg} ?`,
    ];
  }
  if (p.role === "risk") {
    return [
      "Quelles preuves AUROS sont vérifiables (verify) ?",
      "Comment lire un brief RTMS indicatif ?",
      "Risques à éviter : claims non sourcés ?",
    ];
  }
  if (p.role === "rse") {
    return [
      "CSRD check Green : par où commencer ?",
      "Différence label et marketplace ?",
      "Que mettre dans un reporting impact ?",
    ];
  }
  if (p.asset === "dc") {
    return [
      "Parcours eau-énergie pour data center ?",
      "WELHR vs RTMS : lequel d’abord ?",
      "Prochain pas trust / continuity ?",
    ];
  }
  return [
    "Comment préparer un dossier RTMS ?",
    "Différence label Green et marketplace",
    "Quel prochain pas pour mon projet énergie ?",
  ];
}

/** Max 3 actionable CTAs — one job each. */
export function greenAssistantNextSteps(
  p: GreenAssistantProfile
): GreenNextStep[] {
  if (p.asset === "dc") {
    return [
      {
        label: "Water Energy Trust",
        href: EAU_TRUST,
        why: "Détecter le risque eau-énergie (indicatif)",
      },
      {
        label: "Continuity playbook",
        href: EAU_CONTINUITY,
        why: "Décider un plan résilience",
      },
      {
        label: "Pré-diag RTMS",
        href: GREEN_RTMS_ASSISTANT_ROUTE,
        why: "Si volet énergie renouvelable aussi",
      },
    ];
  }

  if (p.role === "buyer") {
    return [
      {
        label: "Comparer",
        href: GREEN_COMPARE_ROUTE,
        why: "Lire les offres côte à côte",
      },
      {
        label: "Registry",
        href: "/green/registry",
        why: "Voir projets / preuves listés",
      },
      {
        label: "Wizard express",
        href: WIZARD_EXPRESS_HREF,
        why: "Structurer un besoin d’achat",
      },
    ];
  }

  if (p.role === "risk") {
    return [
      {
        label: "Standards RTMS",
        href: GREEN_STANDARDS_ROUTE,
        why: "Cadre Real / Transparent / Measurable / Sound",
      },
      {
        label: "Pré-diag RTMS",
        href: GREEN_RTMS_ASSISTANT_ROUTE,
        why: "Brief indicatif avant revue humaine",
      },
      {
        label: "Verify",
        href: "/verify",
        why: "Contrôler une preuve exportée",
      },
    ];
  }

  if (p.role === "rse") {
    return [
      {
        label: "CSRD check",
        href: GREEN_CSRD_CHECK_ROUTE,
        why: "Repères reporting (indicatif)",
      },
      {
        label: "Impact report",
        href: "/green/impact-report",
        why: "Packer un récit impact",
      },
      {
        label: "Standards RTMS",
        href: GREEN_STANDARDS_ROUTE,
        why: "Aligner le langage preuves",
      },
    ];
  }

  // issuer default
  return [
    {
      label: "Pré-diag RTMS",
      href: GREEN_RTMS_ASSISTANT_ROUTE,
      why: "3 priorités avant dossier complet",
    },
    {
      label: "Label Green",
      href: GREEN_LABEL_ROUTE,
      why: "Comprendre le parcours Verified",
    },
    {
      label: "Wizard express",
      href: WIZARD_EXPRESS_HREF,
      why: "~parcours guidé émetteur",
    },
  ];
}

/** HITL: user copies; ops may refine later. Never auto-send. */
export function greenAssistantMailDraft(p: GreenAssistantProfile): string {
  const steps = greenAssistantNextSteps(p);
  const role =
    p.role === "buyer"
      ? "acheteur"
      : p.role === "risk"
        ? "risk / counsel"
        : p.role === "rse"
          ? "RSE"
          : "émetteur";
  const asset =
    p.asset === "solar"
      ? "solaire / PPA"
      : p.asset === "wind"
        ? "éolien"
        : p.asset === "dc"
          ? "data center / eau-énergie"
          : p.asset === "carbon"
            ? "carbone"
            : "RWA vert";
  const region = p.region.trim() ? ` · région : ${p.region.trim()}` : "";

  const lines = steps
    .map((s, i) => `${i + 1}. ${s.label} — ${s.why}\n   ${s.href.startsWith("http") ? s.href : `https://getauros.com${s.href}`}`)
    .join("\n");

  return `Objet : Prochaines étapes AUROS Green (${role} · ${asset})

Bonjour,

Suite à mon profil sur l’assistant Green AUROS (${role}, ${asset}${region}), voici 3 prochains pas indicatifs — à valider de mon côté :

${lines}

Les analyses AUROS sont indicatives (pas de conseil juridique / financier). Je reste disponible pour affiner.

Cordialement`;
}
