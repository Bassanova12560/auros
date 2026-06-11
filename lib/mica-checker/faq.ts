import type { AiFirstFaq } from "@/lib/ai-first/types";

export const MICA_CHECKER_FAQ: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que le test MiCA AUROS ?",
    answer:
      "Cinq questions sur votre structure d'émetteur, la classe d'actif, le lien avec l'UE, l'avancement du livre blanc et le profil investisseur visé. Le score (0–100) est indicatif et sert à prioriser les prochaines étapes — pas à certifier une conformité MiCA.",
  },
  {
    question: "Ce score remplace-t-il un avis juridique ?",
    answer:
      "Non. MiCA, le Prospectus Regulation et les règles nationales exigent une analyse sur mesure. Le test AUROS oriente votre préparation ; un cabinet spécialisé doit valider le régime applicable avant toute offre.",
  },
  {
    question: "Qui est concerné par MiCA en tokenisation RWA ?",
    answer:
      "Les émetteurs et prestataires crypto actifs en UE, les offres vers investisseurs européens, et selon le packaging les jetons assimilables à des instruments financiers (prospectus) ou aux ART/EMT sous MiCA. Le périmètre dépend de l'émetteur, de l'actif et des investisseurs cibles.",
  },
  {
    question: "Que faire après le test ?",
    answer:
      "Complétez le wizard AUROS (partie Conformité) pour structurer votre dossier, comparez les juridictions EU-friendly sur /jurisdictions, ou lancez un score de préparation détaillé sur /estimate.",
  },
  {
    question: "En quoi diffère-t-il du wizard AUROS ?",
    answer:
      "Le test MiCA est un filtre rapide (≈2 min) centré réglementation crypto UE. Le wizard couvre l'actif, la stratégie, la data room et le score d'admission complet — les deux sont gratuits et complémentaires.",
  },
];
