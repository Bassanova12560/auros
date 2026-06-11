import type { AiFirstFaq } from "@/lib/ai-first/types";

export const STATE_OF_RWA_ISSUERS_FAQ: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que le rapport State of RWA Issuers ?",
    answer:
      "Rapport trimestriel AUROS sur les émetteurs d'actifs réels tokenisés en Europe : mix d'actifs, signaux MiCA indicatifs, blocages courants et répartition des juridictions étudiées. Données propriétaires AUROS complétées par l'AUROS RWA Index — pas un conseil en investissement ni un audit réglementaire.",
  },
  {
    question: "Comment obtenir le PDF ?",
    answer:
      "Renseignez votre nom et email sur /data/state-of-rwa-issuers — le téléchargement PDF se débloque immédiatement après validation. Aucun compte AUROS requis. Vos coordonnées servent à vous envoyer les prochaines éditions si vous le souhaitez.",
  },
  {
    question: "Les statistiques wizard sont-elles auditées ?",
    answer:
      "Non. Les tendances dossiers, scores MiCA moyens et parts juridictionnelles sont des estimations internes indicatives, clairement étiquetées sur la page et dans le PDF. Seules les métriques RWA Index proviennent du comparateur public AUROS /compare.",
  },
  {
    question: "À quelle fréquence le rapport est-il publié ?",
    answer:
      "Publication trimestrielle (Q1, Q2, Q3, Q4). Chaque édition reprend l'index mensuel du trimestre et actualise les signaux émetteurs AUROS.",
  },
  {
    question: "Puis-je citer le rapport ?",
    answer:
      "Oui — citation souhaitée : « AUROS State of RWA Issuers, édition [trimestre année], auros.io/data/state-of-rwa-issuers ». Les données RWA Index sont sous CC BY 4.0.",
  },
];
