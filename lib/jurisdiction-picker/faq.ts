import type { AiFirstFaq } from "@/lib/ai-first/types";

export const JURISDICTION_PICKER_FAQ: AiFirstFaq[] = [
  {
    question: "Comment fonctionne le sélecteur de juridiction AUROS ?",
    answer:
      "Trois curseurs (délai, coût, fiscalité) et un filtre actif optionnel pondèrent les 8 juridictions du comparateur AUROS (Luxembourg, DIFC, Singapour, Suisse, France, Irlande, Bahreïn, Gibraltar). Le top 3 est indicatif — pas une recommandation juridique.",
  },
  {
    question: "Quelle est la meilleure juridiction pour tokeniser en Europe ?",
    answer:
      "Il n'y a pas de réponse unique : l'Irlande et le Luxembourg conviennent souvent aux fonds EU, la France aux titres financiers domestiques, Gibraltar ou DIFC pour aller vite hors UE. Le sélecteur oriente selon vos priorités ; validez avec counsel.",
  },
  {
    question: "Ce résultat remplace-t-il un avis juridique ?",
    answer:
      "Non. Substance économique, prospectus, MiCA et fiscalité locale exigent une analyse sur mesure. L'outil sert à réduire le champ des options avant le wizard ou le Starter Kit juridiction.",
  },
  {
    question: "D'où viennent les données délai et coût ?",
    answer:
      "Les fourchettes proviennent du comparateur /jurisdictions AUROS (frais État + conseil, délais licence et production) — mises à jour périodiquement et toujours indicatives.",
  },
  {
    question: "Puis-je filtrer par type d'actif (immo, fonds, green) ?",
    answer:
      "Oui — immobilier, obligations, crédit privé et fonds sont couverts. Les actifs énergie / green passent souvent par l'immobilier ou les fonds selon la structure ; le wizard AUROS Green précise le packaging RTMS.",
  },
  {
    question: "Que faire après le top 3 ?",
    answer:
      "Comparez en détail sur /jurisdictions, estimez votre budget sur /tools/cost-estimator, lancez le wizard gratuit, testez votre maturité MiCA sur /tools/mica-checker, ou demandez un Starter Kit phase 0 (5 000 €) pour un brief juridiction personnalisé.",
  },
];
