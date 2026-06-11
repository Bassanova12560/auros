import type { AiFirstFaq } from "@/lib/ai-first/types";

export const YIELD_CALCULATOR_FAQ: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que le calculateur de rendement RWA AUROS ?",
    answer:
      "Un outil gratuit qui estime une fourchette de rendement annuel indicatif selon la classe d'actif tokenisée (T-Bills, stablecoins yield, immobilier, private credit, matières premières, green/carbon) et un montant en euros. Les plages proviennent des moyennes du comparateur AUROS /compare — pas d'engagement de performance.",
  },
  {
    question: "Les rendements affichés sont-ils garantis ?",
    answer:
      "Non. Il s'agit d'estimations indicatives basées sur les produits listés dans nos comparateurs. Les APY réels varient selon la plateforme, les frais, la liquidité et le marché. Ce n'est pas un conseil en investissement.",
  },
  {
    question: "Comment est calculée la référence inflation ?",
    answer:
      "Nous affichons un benchmark illustratif de 2 à 3 % (médiane 2,5 %), proche de l'inflation zone euro récente. C'est un repère pédagogique pour comparer le rendement tokenisé à l'érosion monétaire — pas une prévision macro.",
  },
  {
    question: "D'où viennent les fourchettes par classe d'actif ?",
    answer:
      "Des données catalogue AUROS : obligations sovereign pour les T-Bills, stablecoins trésorerie, immobilier et private credit depuis les JSON manuels et pools DefiLlama agrégés sur /compare. Matières premières et green/carbon ont souvent APY 0 — nous indiquons une plage conservative documentée.",
  },
  {
    question: "Que faire après le calcul ?",
    answer:
      "Comparez les produits live sur /compare, estimez le budget tokenisation sur /tools/cost-estimator, vérifiez votre maturité MiCA sur /tools/mica-checker, explorez les juridictions sur /jurisdictions, ou lancez le wizard AUROS pour structurer votre dossier.",
  },
  {
    question: "Puis-je simuler une durée de détention inférieure à un an ?",
    answer:
      "Oui — indiquez une durée en mois (1 à 360). Le rendement estimé est proratisé linéairement sur la période, sans réinvestissement composé. C'est une simplification pédagogique.",
  },
];
