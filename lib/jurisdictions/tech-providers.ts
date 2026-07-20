type TechProvider = {
  id: string;
  name: string;
  assetTypes: string[];
  jurisdictionIds: string[];
  fitFr: string;
  fitEn: string;
  fitEs: string;
};

const PROVIDERS: TechProvider[] = [
  {
    id: "tokeny",
    name: "Tokeny (OnchainID)",
    assetTypes: ["real_estate", "bonds", "funds", "private_credit"],
    jurisdictionIds: ["luxembourg", "france", "ireland", "switzerland"],
    fitFr: "Émission ERC-3643, compliance intégrée, adapté UE/MiCA.",
    fitEn: "ERC-3643 issuance, built-in compliance, EU/MiCA-ready.",
    fitEs: "Emisión ERC-3643, cumplimiento integrado, listo UE/MiCA.",
  },
  {
    id: "polymath",
    name: "Polymath",
    assetTypes: ["real_estate", "bonds", "funds"],
    jurisdictionIds: ["luxembourg", "switzerland", "singapore", "dubai-difc"],
    fitFr: "Tokenisation sécurisée multi-juridictions, KYC investisseur.",
    fitEn: "Multi-jurisdiction security tokens, investor KYC flows.",
    fitEs: "Tokens de seguridad multi-jurisdicción, flujos KYC.",
  },
  {
    id: "brickken",
    name: "Brickken",
    assetTypes: ["real_estate", "funds"],
    jurisdictionIds: ["france", "luxembourg", "dubai-difc", "bahrain"],
    fitFr: "Immobilier tokenisé, portal investisseur clé en main.",
    fitEn: "Tokenized real estate, turnkey investor portal.",
    fitEs: "Inmobiliario tokenizado, portal inversor llave en mano.",
  },
  {
    id: "securitize",
    name: "Securitize",
    assetTypes: ["bonds", "private_credit", "funds", "real_estate"],
    jurisdictionIds: ["luxembourg", "ireland", "singapore", "dubai-difc", "gibraltar"],
    fitFr: "Plateforme institutionnelle, DS protocol, distribution qualifiée.",
    fitEn: "Institutional platform, DS protocol, qualified distribution.",
    fitEs: "Plataforma institucional, DS protocol, distribución cualificada.",
  },
];

export function matchTechProviders(input: {
  projectType: string;
  jurisdictionIds: string[];
  locale: "fr" | "en" | "es" | "ar" | "zh";
}): { name: string; fit: string; note: string }[] {
  const fitKey = input.locale === "en" ? "fitEn" : input.locale === "es" ? "fitEs" : "fitFr";
  const primary = input.jurisdictionIds[0] ?? "luxembourg";

  const scored = PROVIDERS.map((p) => {
    let score = 0;
    if (p.assetTypes.includes(input.projectType) || input.projectType === "other") {
      score += 2;
    }
    if (p.jurisdictionIds.includes(primary)) score += 3;
    else if (input.jurisdictionIds.some((j) => p.jurisdictionIds.includes(j))) score += 1;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const picks = scored.length > 0 ? scored : [{ p: PROVIDERS[0], score: 0 }];

  return picks.map(({ p }) => ({
    name: p.name,
    fit: p[fitKey],
    note:
      input.locale === "en"
        ? "Vetted RWA issuance stack — intro coordinated by AUROS after dossier review."
        : input.locale === "es"
          ? "Stack RWA verificado — intro coordinada por AUROS tras revisión del expediente."
          : "Stack RWA vérifié — intro coordonnée par AUROS après revue dossier.",
  }));
}
