import type { AiFirstFaq } from "@/lib/ai-first/types";

/** FAQ citables — ChargeFlow CFU (JSON-LD + pages HTML). */
export const CHARGEFLOW_FAQ_ITEMS: AiFirstFaq[] = [
  {
    question: "Qu'est-ce que ChargeFlow AUROS ?",
    answer:
      "ChargeFlow transforme des sessions de charge (flottes, CPO, Supercharger-class) en unités CFU vérifiables off-chain — CFU-E (énergie), CFU-W (eau/hydrique via /eau/chargeflow), CFU-F (flex). Démo : /green/chargeflow. Aucune claim de partnership Tesla.",
  },
  {
    question: "CFU-E, CFU-W et CFU-F : quelles différences ?",
    answer:
      "CFU-E = ChargeFlow Unit Énergie (kWh session). CFU-W = unité hydrique / eau. CFU-F = flex capacité. Chaque unité a un hash HMAC, un statut active/retired et une page de vérification publique /chargeflow/{id}.",
  },
  {
    question: "ChargeFlow remplace-t-il un smart contract on-chain ?",
    answer:
      "Non. Les CFU sont des preuves off-chain pour dossiers RWA, reporting ESG et admission plateforme. Pas d'exécution on-chain automatique. Le retire est explicite (Premium).",
  },
  {
    question: "Comment les flottes et CPO démarrent-ils ?",
    answer:
      "Tunnel flottes : /green/chargeflow/fleets. Console opérateurs : /green/chargeflow/console. API Premium POST /api/v1/chargeflow et stub OCPI /api/v1/chargeflow/from-ocpi. Docs : /developers/docs/endpoint-chargeflow.",
  },
  {
    question: "Quel lien avec AUROS Watts ?",
    answer:
      "Watts Reserve (/green/watts) réserve un profil avant/pendant la charge ; la confirm mint une CFU liée à reservation_id. ChargeFlow reste le standard d'unités ; Watts est le booking + inventaire + secondaire.",
  },
];
