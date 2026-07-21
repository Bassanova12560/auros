import type { TrustPackId } from "./taxonomy";

export type TrustPackQuestion = {
  id: string;
  q: string;
  weight: number;
};

export type TrustPackDefinition = {
  packId: TrustPackId;
  questions: TrustPackQuestion[];
};

function normalizeWeights(qs: TrustPackQuestion[]): TrustPackQuestion[] {
  const sum = qs.reduce((a, q) => a + q.weight, 0);
  if (Math.abs(sum - 1) < 0.001) return qs;
  return qs.map((q) => ({
    ...q,
    weight: Math.round((q.weight / sum) * 1000) / 1000,
  }));
}

const REAL_ESTATE: TrustPackQuestion[] = normalizeWeights([
  {
    id: "legal_title",
    q: "Existe-t-il un titre / acte opposable (cadastre, deed) au-dessus du token ?",
    weight: 0.22,
  },
  {
    id: "spv_register",
    q: "SPV + registre off-chain (transfer agent / registrar) fait-il foi en cas de conflit on-chain ?",
    weight: 0.2,
  },
  {
    id: "token_vs_title",
    q: "Le montage est-il « token = claim » (pas « token = title » sans filet) ?",
    weight: 0.16,
  },
  {
    id: "insurance",
    q: "Assurance (P&C / title insurance) documentée au nom du SPV ou du registre ?",
    weight: 0.14,
  },
  {
    id: "custody_ops",
    q: "Custody / admin des clés et du registre : procédures + parties identifiées ?",
    weight: 0.14,
  },
  {
    id: "recourse_pqc",
    q: "Gel / re-émission si clé compromise (y compris scénario quantique) documenté ?",
    weight: 0.14,
  },
]);

const CAPACITY: TrustPackQuestion[] = normalizeWeights([
  {
    id: "right_instrument",
    q: "Le droit de capacité (MW, cooling, file, allocation) est-il matérialisé par un contrat / permis opposable ?",
    weight: 0.22,
  },
  {
    id: "queue_or_btm",
    q: "Position file d’interconnexion crédible, OU behind-the-meter / limited export documenté ?",
    weight: 0.2,
  },
  {
    id: "cod_realism",
    q: "COD / mise en service réaliste vs upgrades réseau et permis obtenus (pas seulement filed) ?",
    weight: 0.18,
  },
  {
    id: "offtake_clarity",
    q: "Offtake / PPA / usage on-site clair — pas seulement « capacité papier » ?",
    weight: 0.16,
  },
  {
    id: "register_claim",
    q: "Registre off-chain + token = claim sur le droit (pas possession = titre) ?",
    weight: 0.12,
  },
  {
    id: "recourse_pqc",
    q: "Chemin reseal / remedy si compromission de clé documenté ?",
    weight: 0.12,
  },
]);

const LUXURY: TrustPackQuestion[] = normalizeWeights([
  {
    id: "provenance",
    q: "Chaîne de provenance / authentification (certificat, maison, expert) documentée ?",
    weight: 0.22,
  },
  {
    id: "custody",
    q: "Custody physique (vault / bonded warehouse) identifié et assuré ?",
    weight: 0.2,
  },
  {
    id: "title_claim",
    q: "Titre légal vs token = claim : séparation claire dans la doc ?",
    weight: 0.18,
  },
  {
    id: "insurance",
    q: "Police d’assurance couvrant l’objet au profit du registre / SPV ?",
    weight: 0.16,
  },
  {
    id: "transfer_agent",
    q: "Registre / transfer agent pour gel et re-émission ?",
    weight: 0.12,
  },
  {
    id: "recourse_pqc",
    q: "Recours post-compromission de clé documenté ?",
    weight: 0.12,
  },
]);

const VEHICLE: TrustPackQuestion[] = normalizeWeights([
  {
    id: "vin_title",
    q: "Titre véhicule / carte grise / VIN rattaché au SPV ou au registre ?",
    weight: 0.22,
  },
  {
    id: "lien_status",
    q: "Liens / gage / leasing : statut clair et publicité le cas échéant ?",
    weight: 0.18,
  },
  {
    id: "custody_ops",
    q: "Lieu de custody / flotte + procédure de sortie documentés ?",
    weight: 0.16,
  },
  {
    id: "insurance",
    q: "Assurance flotte / tous risques au profit du SPV ?",
    weight: 0.16,
  },
  {
    id: "token_claim",
    q: "Token = claim économique, pas titre administratif ?",
    weight: 0.14,
  },
  {
    id: "recourse_pqc",
    q: "Remedy clé compromise / reseal documenté ?",
    weight: 0.14,
  },
]);

const VESSEL: TrustPackQuestion[] = normalizeWeights([
  {
    id: "flag_register",
    q: "Pavillon + registre maritime (IMO / flag state) au nom du SPV ?",
    weight: 0.22,
  },
  {
    id: "mortgage",
    q: "Hypothèque maritime / liens : statut documenté ?",
    weight: 0.18,
  },
  {
    id: "survey_insurance",
    q: "Survey + assurance hull/P&I au profit du registre ?",
    weight: 0.18,
  },
  {
    id: "custody_ops",
    q: "Opérateur / custody portuaire et procédure de transfert documentés ?",
    weight: 0.14,
  },
  {
    id: "token_claim",
    q: "Token = claim, registre maritime fait foi ?",
    weight: 0.14,
  },
  {
    id: "recourse_pqc",
    q: "Recours / reseal post-compromission documenté ?",
    weight: 0.14,
  },
]);

const SPORTS: TrustPackQuestion[] = normalizeWeights([
  {
    id: "contract_right",
    q: "Droit (naming, media, athlete equity) matérialisé par contrat opposable ?",
    weight: 0.24,
  },
  {
    id: "counterparty",
    q: "Contrepartie (club, ligue, athlete SPV) identifiée et solvable / notée ?",
    weight: 0.18,
  },
  {
    id: "term_clarity",
    q: "Durée, territoires, exclusivité, termination — clairs dans la doc ?",
    weight: 0.16,
  },
  {
    id: "token_claim",
    q: "Token = claim sur cashflows / droits, pas « ownership » marketing ?",
    weight: 0.16,
  },
  {
    id: "register",
    q: "Registre off-chain + gel / re-émission prévus ?",
    weight: 0.14,
  },
  {
    id: "recourse_pqc",
    q: "Chemin crypto-agility / remedy clé documenté ?",
    weight: 0.12,
  },
]);

/** Water/energy deep-scored in WETS — pack is a pointer + shared recourse Qs */
const WATER_ENERGY_POINTER: TrustPackQuestion[] = normalizeWeights([
  {
    id: "use_wets",
    q: "Le projet a-t-il un Water/Energy Trust Score publié (7 critères) ?",
    weight: 0.35,
  },
  {
    id: "hydro_or_grid",
    q: "Risque hydrique OU réalisme raccordement documenté (WELHR / queue / BTM) ?",
    weight: 0.25,
  },
  {
    id: "legal_spv",
    q: "SPV / concession / titre d’eau ou d’infra documenté ?",
    weight: 0.2,
  },
  {
    id: "recourse_pqc",
    q: "Recours post-quantique (registre + remedy) documenté ?",
    weight: 0.2,
  },
]);

export const TRUST_PACK_DEFINITIONS: Record<TrustPackId, TrustPackDefinition> = {
  water_energy: { packId: "water_energy", questions: WATER_ENERGY_POINTER },
  capacity_rights: { packId: "capacity_rights", questions: CAPACITY },
  real_estate: { packId: "real_estate", questions: REAL_ESTATE },
  luxury_collectible: { packId: "luxury_collectible", questions: LUXURY },
  vehicle: { packId: "vehicle", questions: VEHICLE },
  vessel: { packId: "vessel", questions: VESSEL },
  sports_rights: { packId: "sports_rights", questions: SPORTS },
};

export function questionsForPack(packId: TrustPackId): TrustPackQuestion[] {
  return TRUST_PACK_DEFINITIONS[packId].questions;
}
