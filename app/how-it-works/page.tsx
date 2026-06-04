import type { Metadata } from "next";

import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { HowItWorks } from "@/app/_components/HowItWorks";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Comment ça marche | AUROS",
  description:
    "Trois étapes jusqu'au dossier RWA : décrire l'actif, score & dossier IA, soumission à l'équipe AUROS.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How AUROS works | RWA dossier",
    description: "Three steps to your tokenization dossier — guided wizard, AI report, submission.",
    url: absoluteUrl("/how-it-works"),
    siteName: "AUROS",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return (
    <FocusPageShell path="/how-it-works" width="6xl" className="!px-0">
      <FocusPageHero page="howItWorks" secondaryHref="/estimate" />
      <HowItWorks />
    </FocusPageShell>
  );
}
