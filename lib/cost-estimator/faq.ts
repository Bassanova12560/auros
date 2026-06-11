import type { AiFirstFaq } from "@/lib/ai-first/types";

export const COST_ESTIMATOR_FAQ: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que l'estimateur de coût de tokenisation AUROS ?",
    answer:
      "Un outil gratuit qui estime une fourchette indicative en euros pour structurer un actif tokenisé : setup juridique, licence, audit initial et frais annuels récurrents. Les bases proviennent du comparateur juridictions AUROS (8 places) et de coefficients documentés par type d'actif et taille de deal.",
  },
  {
    question: "Ces montants constituent-ils un devis ?",
    answer:
      "Non. Il s'agit d'une fourchette pédagogique — pas un engagement tarifaire. Counsel, auditeurs et régulateurs facturent selon la complexité réelle du dossier. Utilisez le wizard AUROS ou le Starter Kit juridiction pour un brief personnalisé.",
  },
  {
    question: "D'où viennent les données de coût par juridiction ?",
    answer:
      "Des champs feeMinEur, feeMaxEur et totalCostMid dans lib/jurisdictions/data.ts — alignés sur la page /jurisdictions (frais État + conseil, délais licence). Les postes setup sont ventilés selon des ratios documentés (32 % juridique, 43 % licence, 25 % audit).",
  },
  {
    question: "Comment la taille du deal influence-t-elle l'estimation ?",
    answer:
      "Quatre tranches AUM (< 500 k€, 500 k–2 M€, 2–10 M€, 10 M€+) appliquent un coefficient sur le setup et une composante compliance annuelle proportionnelle à l'encours — les structures plus grandes impliquent souvent plus de reporting et de gouvernance.",
  },
  {
    question: "Que signifie « me recommander une juridiction » ?",
    answer:
      "Le moteur réutilise le sélecteur AUROS (pondération coût modérée) filtré par votre type d'actif, puis applique les fourchettes de cette juridiction. Pour un choix manuel, sélectionnez l'une des 8 places du comparateur.",
  },
  {
    question: "Que faire après l'estimation ?",
    answer:
      "Affinez sur /jurisdictions ou /tools/jurisdiction-picker, testez MiCA sur /tools/mica-checker, lancez le wizard gratuit /wizard, ou demandez un score détaillé sur /estimate.",
  },
];
