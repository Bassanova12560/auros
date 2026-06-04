import type { Metadata } from "next";

import { AmbientShell } from "../_components/ui/AmbientShell";

export const metadata: Metadata = {
  title: "Créer mon dossier RWA | AUROS",
  description:
    "Wizard gratuit — décrivez votre actif en 15 étapes, obtenez un score d'admission et un dossier institutionnel complet.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Créer mon dossier RWA | AUROS",
    description:
      "Score d'admission, data room 15 documents, studio réglementaire — ~12 min.",
    locale: "fr_FR",
    siteName: "AUROS",
  },
};

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AmbientShell>{children}</AmbientShell>;
}
