import type { AiFirstFaq } from "@/lib/ai-first/types";

export const GREEN_FAQ_ITEMS: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que le standard RTMS ?",
    answer:
      "RTMS signifie Réel, Transparent, Mesurable, Sain. C'est la grille AUROS Green pour évaluer un actif énergétique tokenisé avant label : impact off-chain vérifiable, traçabilité documentaire, métriques reproductibles et structure juridique assumée. Voir /green/standards pour le détail des quatre piliers.",
  },
  {
    question: "Le label Auros Green Verified garantit-il un rendement ?",
    answer:
      "Non. Le label atteste une revue documentaire RTMS réussie — pas une promesse de performance financière ni une certification réglementaire. Les rendements cités sur le comparateur sont indicatifs et sourcés.",
  },
  {
    question: "Comment référencer mon acteur sur la marketplace ?",
    answer:
      "Remplissez le formulaire sur /green/register avec votre type d'acteur (producteur, stockeur, rechargeur, consommateur), localisation ville+pays et contact. L'équipe AUROS modère sous 48 h ouvrées avant publication sur la carte mondiale.",
  },
  {
    question: "La marketplace AUROS Green permet-elle d'investir directement ?",
    answer:
      "Non. La marketplace met en relation des acteurs énergie pour échanges locaux ou internationaux. AUROS Green n'est pas une plateforme d'investissement ni un intermédiaire financier agréé.",
  },
  {
    question: "Quelle différence entre producteur et stockeur sur la carte ?",
    answer:
      "Un producteur génère de l'énergie renouvelable (solaire, éolien, hydro). Un stockeur offre une capacité BESS pour absorber ou restituer l'énergie. Les deux peuvent publier des annonces vente/achat — voir /green/producers et /green/storers.",
  },
  {
    question: "Comment candidater au label Verified ?",
    answer:
      "Soumettez votre dossier sur /green/label : type de projet (solaire, REC, PPA, carbone…), description, documents RTMS. L'objectif de revue est cinq jours ouvrés. En cas de validation, le projet apparaît au registre public /green/registry.",
  },
  {
    question: "L'assistant RTMS remplace-t-il la revue humaine ?",
    answer:
      "Non. L'assistant /green/rtms-assistant produit un pré-diagnostic rule-based indicatif à partir de votre résumé texte. Seule la revue documentaire AUROS peut délivrer le badge Verified.",
  },
  {
    question: "Que signifie « cas pilote » au registre ?",
    answer:
      "Un cas pilote RTMS est publié à titre éducatif avec méthodologie transparente, sans prétendre au statut Verified complet. Les projets Verified ont passé la revue documentaire intégrale.",
  },
  {
    question: "Puis-je tokeniser un surplus solaire avec AUROS ?",
    answer:
      "Oui. Le guide /green/tokenize-surplus décrit les étapes éducatives, et le wizard AUROS accepte l'actif « Renewable energy » (/wizard?asset=renewable) pour structurer votre dossier d'admission.",
  },
  {
    question: "AUROS Green couvre-t-il les PPA et la traçabilité énergétique ?",
    answer:
      "Oui. Les PPA entrent dans les types de projet éligibles au label. La traçabilité (production, allocation, preuves) est un pilier RTMS « Transparent » — voir l'article /green/blog/ppa-et-tracabilite.",
  },
  {
    question: "Les annonces marketplace sont-elles vérifiées ?",
    answer:
      "Les annonces portent un statut honnête : démo (seed éducatif), referenced (acteur modéré) ou verified (dossier RTMS validé). Les badges sont visibles sur chaque fiche — pas de fausse certification.",
  },
  {
    question: "Comment devenir expert Praticien Green ?",
    answer:
      "Parcours : Academy Fondamentaux (/academy/fondamentaux), lecture standards RTMS, examen beta sur /green/praticien/exam (7/8 requis). Le badge expert est vérifiable au registre public pendant 365 jours.",
  },
  {
    question: "Quelles langues supporte AUROS Green ?",
    answer:
      "L'interface et le contenu éditorial sont disponibles en français, anglais et espagnol. Les fiches marketplace et registre s'adaptent à la locale sélectionnée.",
  },
  {
    question: "Où trouver de l'aide si mon projet est refusé au label ?",
    answer:
      "Consultez la grille RTMS (/green/standards), relancez l'assistant préliminaire (/green/rtms-assistant) pour identifier les lacunes documentaires, puis resoumettez une candidature complétée. Aucune pénalité pour resoumission.",
  },
];
