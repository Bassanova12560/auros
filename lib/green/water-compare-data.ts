import type { GreenLabelStatus } from "./constants";
import type { H2oAssetClass } from "./scoring/h2o-score";

export type WaterCompareRow = {
  id: string;
  name: string;
  assetClass: H2oAssetClass;
  token: string;
  yieldNote: string;
  impactNote: string;
  flowNote: string;
  flow_m3_per_year: number | null;
  concession_years: number | null;
  base_rating: number;
  labelStatus: GreenLabelStatus;
  sourceUrl: string;
  sourceLabel: string;
  lastReviewed: string;
};

/** Hydrological RWA market references — not AUROS Verified unless certified. */
export const WATER_COMPARE_ROWS: WaterCompareRow[] = [
  {
    id: "pilot-concession-france",
    name: "Concession eau potable — Pilote AUROS",
    assetClass: "concession",
    token: "Parts SPV (dossier type)",
    yieldNote: "Revenus indexés m³ — indicatif, pas un conseil",
    impactNote: "Débit contractuel 2 Mm³/an, reporting hydrique Taxonomie EU",
    flowNote: "2 Mm³/an concession 15 ans France SPV institutionnel",
    flow_m3_per_year: 2_000_000,
    concession_years: 15,
    base_rating: 74,
    labelStatus: "in_review",
    sourceUrl: "https://getauros.com/eau",
    sourceLabel: "getauros.com/eau",
    lastReviewed: "2026-07-05",
  },
  {
    id: "poseidon-desal",
    name: "Poseidon / desalination tokens (référence)",
    assetClass: "desalination",
    token: "Water credits (historical models)",
    yieldNote: "Infrastructure long terme — vérifier statut actuel",
    impactNote: "Dessalement côtier, contrats municipalités",
    flowNote: "Desalination plant 50 Mm³/year California municipal offtake",
    flow_m3_per_year: 50_000_000,
    concession_years: 20,
    base_rating: 62,
    labelStatus: "reference",
    sourceUrl: "https://getauros.com/green/standards",
    sourceLabel: "AUROS Green standards",
    lastReviewed: "2026-06-20",
  },
  {
    id: "water-rights-western-us",
    name: "Water rights tokenization (Western US)",
    assetClass: "water_rights",
    token: "Allocation units (various pilots)",
    yieldNote: "Marché régional — liquidité limitée",
    impactNote: "Droits d'usage surface/groundwater, cadre étatique",
    flowNote: "Water rights 500000 m3/year Colorado River basin allocation",
    flow_m3_per_year: 500_000,
    concession_years: null,
    base_rating: 55,
    labelStatus: "reference",
    sourceUrl: "https://getauros.com/glossary/tokenisation-eau",
    sourceLabel: "AUROS glossary",
    lastReviewed: "2026-06-15",
  },
  {
    id: "blue-bond-seychelles",
    name: "Blue bonds — Seychelles / BNC",
    assetClass: "blue_bond",
    token: "Sovereign blue bond",
    yieldNote: "Dette souveraine bleue — pas un token retail",
    impactNote: "Use of proceeds océan & gestion hydrique côtière",
    flowNote: "Blue bond 15 million USD ocean conservation water management 10 years",
    flow_m3_per_year: null,
    concession_years: 10,
    base_rating: 68,
    labelStatus: "reference",
    sourceUrl: "https://getauros.com/comment-tokeniser/eau",
    sourceLabel: "AUROS guide eau",
    lastReviewed: "2026-06-18",
  },
];
