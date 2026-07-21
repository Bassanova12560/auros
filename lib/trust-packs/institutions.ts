/**
 * Indicative map — institutions / frameworks integrating or preparing RWA rails.
 * Not an endorsement; research snapshot for desks.
 */

export type InstitutionRwaEntry = {
  id: string;
  name: string;
  region: string;
  kind: "central_bank" | "regulator" | "exchange" | "custodian" | "framework" | "market";
  status: "live" | "pilot" | "consulting" | "watching";
  focus: string;
  note: string;
  source_url?: string;
};

export const INSTITUTION_RWA_INDEX: InstitutionRwaEntry[] = [
  {
    id: "eu-mica",
    name: "MiCA (EU)",
    region: "EU",
    kind: "framework",
    status: "live",
    focus: "Crypto-assets classification, CASP, ART/EMT",
    note: "Cadre marché — les RWA « financial instrument » restent hors/à côté selon nature.",
    source_url: "https://www.esma.europa.eu",
  },
  {
    id: "luxembourg-cssf",
    name: "CSSF / fonds tokenisés",
    region: "Luxembourg",
    kind: "regulator",
    status: "pilot",
    focus: "Funds, DLT, depositary models",
    note: "Juridiction fonds fréquente pour wrappers institutionnels.",
  },
  {
    id: "sgx-dlt",
    name: "Singapore — MAS / market DLT",
    region: "Singapore",
    kind: "regulator",
    status: "pilot",
    focus: "Capital markets tokenization pilots",
    note: "Pistes listing / settlement sur DLT sous supervision.",
  },
  {
    id: "hk-sfc",
    name: "Hong Kong SFC",
    region: "Hong Kong",
    kind: "regulator",
    status: "consulting",
    focus: "Tokenized products, intermediaries",
    note: "Ouverture progressive wealth / intermediaries.",
  },
  {
    id: "swiss-finma",
    name: "FINMA / DLT Act",
    region: "Switzerland",
    kind: "framework",
    status: "live",
    focus: "Ledger-based securities",
    note: "Cadre civil + licence pour infrastructures DLT.",
  },
  {
    id: "dubai-vara",
    name: "VARA / DIFC rails",
    region: "UAE",
    kind: "regulator",
    status: "live",
    focus: "Virtual assets + wealth hubs",
    note: "Attractif lifestyle / wealth — diligence custody critique.",
  },
  {
    id: "dtcc",
    name: "DTCC tokenization initiatives",
    region: "US",
    kind: "market",
    status: "pilot",
    focus: "Market infrastructure, funds",
    note: "Signal institutionnel US sur rails post-trade.",
  },
  {
    id: "swift-iso",
    name: "Swift / ISO 20022 + experiments",
    region: "Global",
    kind: "market",
    status: "watching",
    focus: "Interoperability messaging",
    note: "Pas un RWA exchange — couche message pour institutions.",
  },
  {
    id: "bis-project",
    name: "BIS Innovation Hub (tokenisation)",
    region: "Global",
    kind: "central_bank",
    status: "pilot",
    focus: "Wholesale CBDC / tokenized deposits experiments",
    note: "Recherche — oriente les banques centrales, pas un listing retail.",
  },
  {
    id: "euroclear",
    name: "Euroclear DLT / digital securities",
    region: "EU",
    kind: "custodian",
    status: "pilot",
    focus: "CSD / digital issuance",
    note: "Pont custody traditionnelle ↔ émission digitale.",
  },
];

export const INSTITUTION_INDEX_DISCLAIMER =
  "Snapshot indicatif AUROS — pas une liste réglementaire officielle. Vérifier le statut auprès du régulateur / counsel.";
