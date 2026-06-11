import type { AiFirstFaq } from "@/lib/ai-first/types";

export const RWA_INDEX_FAQ: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que l'AUROS RWA Index ?",
    answer:
      "Un indice mensuel publié par AUROS qui agrège les rendements moyens (APY) par classe d'actif tokenisé en Europe et les métriques du comparateur /compare — obligations, stablecoins, immobilier, private credit, matières premières et green/carbon. C'est une source de référence indicative pour journalistes, analystes et émetteurs, pas un conseil en investissement.",
  },
  {
    question: "Comment sont calculées les moyennes APY ?",
    answer:
      "Pour chaque classe, nous prenons les produits listés dans le hub AUROS /compare (JSON catalogue + pools DefiLlama), filtrons les APY > 0, puis calculons min, max, médiane et moyenne arithmétique. Les classes sans coupon fixe (matières premières, green) affichent une fourchette illustrative documentée.",
  },
  {
    question: "À quelle fréquence l'index est-il mis à jour ?",
    answer:
      "Publication mensuelle (édition du mois en cours). Les données produits sont rafraîchies au build ou via revalidation horaire du comparateur — la date de dernière collecte est affichée sur la page.",
  },
  {
    question: "Les rendements garantissent-ils une performance future ?",
    answer:
      "Non. Les APY varient selon plateforme, frais, liquidité et marché. L'index documente l'état du marché tokenisé RWA au moment de la collecte — pas une promesse de rendement.",
  },
  {
    question: "Puis-je télécharger les données ?",
    answer:
      "Oui — export CSV gratuit depuis la page, reprenant les statistiques par classe, le nombre de produits et la date d'édition. Citation souhaitée : « AUROS RWA Index, édition [mois année], auros.io/data/rwa-index ».",
  },
  {
    question: "Comment l'index se relie aux outils AUROS ?",
    answer:
      "Complétez avec le comparateur live /compare, le calculateur de rendement /tools/yield-calculator, le sélecteur de juridiction /tools/jurisdiction-picker et le wizard /wizard pour structurer un dossier d'émission.",
  },
];
