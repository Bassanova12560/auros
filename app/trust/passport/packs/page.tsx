import type { Metadata } from "next";

import { LifestylePassportPacksView } from "../_components/LifestylePassportPacksView";

export const metadata: Metadata = {
  title: "Packs Lifestyle Passport | AUROS",
  description:
    "Immo, luxe, véhicules, bateaux, sport — assessments admission RWA patrimoine.",
};

export default function LifestylePassportPacksPage() {
  return <LifestylePassportPacksView />;
}
