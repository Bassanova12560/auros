import { absoluteUrl } from "@/lib/comparators/site";

export const AUROS_ORG = {
  name: "AUROS",
  legalName: "AUROS",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/favicon.ico"),
  description:
    "Plateforme B2B de tokenisation RWA : comparateur de juridictions, dossier d'admission actif, Starter Kit juridiction phase 0.",
  sameAs: [] as string[],
  contactEmail: "adrien.balitrand@gmail.com",
  areaServed: ["EU", "MENA", "APAC", "CH"],
  knowsAbout: [
    "RWA tokenization",
    "real-world asset tokenization",
    "MiCA",
    "security tokens",
    "SPV structuring",
    "jurisdiction comparison",
    "DIFC",
    "Luxembourg CSSF",
    "VARA Dubai",
  ],
} as const;
