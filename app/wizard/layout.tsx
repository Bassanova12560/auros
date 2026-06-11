import type { Metadata } from "next";

import { AmbientShell } from "../_components/ui/AmbientShell";

export const metadata: Metadata = {
  title: "Créer mon dossier RWA | AUROS",
  description:
    "Explore gratuit en 5 questions ou wizard Pro institutionnel — score d'admission et dossier complet.",
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
