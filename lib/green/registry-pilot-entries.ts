import type { GreenRegistryProjectRow } from "./green-registry";

/** SSR pilot registry rows (UX audit B2) — merged with live data when present. */
export const GREEN_REGISTRY_PILOT_ENTRIES: GreenRegistryProjectRow[] = [
  {
    id: "pilot-registry-solar-var",
    name: "Centrale solaire Var — Pilote RTMS",
    projectType: "solar",
    country: "France",
    labelTier: "verified",
    certifiedAt: "2026-03-01T00:00:00Z",
    verifyToken: "ag-pilot-solar-var-2026",
    summaries: {
      fr: "Cas pilote RTMS — autoconsommation collective et traçabilité kWh. Démonstration méthodologique AUROS Green.",
      en: "RTMS pilot case — collective self-consumption and kWh traceability. AUROS Green methodology demo.",
      es: "Caso piloto RTMS — autoconsumo colectivo y trazabilidad kWh. Demostración metodológica AUROS Green.",
    },
  },
  {
    id: "pilot-registry-wind-offshore",
    name: "PPA éolien offshore — Dossier type",
    projectType: "wind",
    country: "France",
    labelTier: "pilot",
    certifiedAt: "2026-04-01T00:00:00Z",
    verifyToken: "ag-pilot-wind-offshore-2026",
    summaries: {
      fr: "Dossier type PPA éolien offshore — candidature ouverte, revue AUROS Green en cours.",
      en: "Offshore wind PPA template dossier — open application, AUROS Green review in progress.",
      es: "Dossier tipo PPA eólico offshore — candidatura abierta, revisión AUROS Green en curso.",
    },
  },
  {
    id: "pilot-registry-rec-rhone",
    name: "REC hydro Rhône-Alpes — Cas pilote",
    projectType: "rec",
    country: "France",
    labelTier: "verified",
    certifiedAt: "2026-02-01T00:00:00Z",
    verifyToken: "ag-pilot-rec-rhone-2026",
    summaries: {
      fr: "Cas pilote REC hydro — traçabilité certificats verts, label Verified AUROS Green.",
      en: "Hydro REC pilot case — green certificate traceability, AUROS Green Verified label.",
      es: "Caso piloto REC hidro — trazabilidad certificados verdes, label Verified AUROS Green.",
    },
  },
];

export const GREEN_REGISTRY_PILOT_HEADER_FR =
  "Projets pilotes AUROS Green · Candidatures ouvertes";

export function mergeGreenRegistryPilotEntries(
  projects: GreenRegistryProjectRow[]
): GreenRegistryProjectRow[] {
  const existingIds = new Set(projects.map((p) => p.id));
  const merged = [...projects];
  for (const pilot of GREEN_REGISTRY_PILOT_ENTRIES) {
    if (!existingIds.has(pilot.id)) {
      merged.push(pilot);
    }
  }
  return merged.sort(
    (a, b) => new Date(b.certifiedAt).getTime() - new Date(a.certifiedAt).getTime()
  );
}
