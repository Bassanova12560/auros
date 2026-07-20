import type { AiFirstFaq } from "@/lib/ai-first/types";

/** FAQ citables — Watts Reserve (JSON-LD + pages HTML). */
export const WATTS_FAQ_ITEMS: AiFirstFaq[] = [
  {
    question: "Qu'est-ce qu'AUROS Watts ?",
    answer:
      "AUROS Watts est le booking engine des watts critiques : réserver un profil énergétique (fenêtre, zone, firm/flex), confirmer pour mint une unité CFU, settler à la livraison, publier de la capacité producteur et lister des positions en secondaire. Hub : /green/watts. Indicatif — pas une livraison réseau garantie ni un marché réglementé.",
  },
  {
    question: "Quelle différence entre firm et flex (CFU-E / CFU-F) ?",
    answer:
      "Firm cible une énergie (kWh) et conduit typiquement à une CFU-E à la confirmation. Flex cible une capacité (kW) et conduit à une CFU-F. Le matching est déterministe (match_score) ; le mint CFU n'a lieu qu'après confirm explicite.",
  },
  {
    question: "La réservation mint-elle automatiquement une CFU ?",
    answer:
      "Non. POST /api/v1/watts/reserve crée seulement une intention avec score de matching. Le mint CFU-E ou CFU-F se fait via confirm explicite ; le retire via settle à la livraison. Aucun auto-mint, auto-retire ou auto-transfer.",
  },
  {
    question: "Watts Reserve est-il un PPA ou un certificat GO/REC ?",
    answer:
      "Non. Ce n'est ni un PPA, ni un GO/REC, ni un marché réglementé de titres. Les offres inventaire et listings secondaires sont indicatifs — pour prep RWA / compare, pas pour exécution réglementée.",
  },
  {
    question: "Comment lier une position watts au comparateur RWA ?",
    answer:
      "Après settle, vous pouvez créer un listing secondaire avec compare_ref_id pointant vers /compare?ids=…. L'intérêt exprimé sur le secondaire n'est pas liant. Voir /green/chargeflow/secondary.",
  },
  {
    question: "Où sont la doc API et le Copilot Watts ?",
    answer:
      "Docs Protocol : /developers/docs/endpoint-watts-reserve. Copilot : /copilot?context=watts. SDK npm @adrien1212balitrand/auros-protocol et MCP auros-mcp exposent watts_reserve, confirm, settle, offers et secondary.",
  },
];
