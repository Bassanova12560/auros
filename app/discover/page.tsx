import type { Metadata } from "next";

import { DiscoverContent } from "@/app/_components/DiscoverContent";
import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Découvrir AUROS | Plateforme RWA",
  description:
    "Univers d'actifs, conformité, livrables dossier — approfondissez AUROS avant de lancer votre wizard.",
  alternates: { canonical: "/discover" },
  openGraph: {
    title: "Discover AUROS | RWA platform",
    description: "Asset universe, compliance, dossier deliverables — depth before you start.",
    url: absoluteUrl("/discover"),
    siteName: "AUROS",
    type: "website",
  },
};

export default function DiscoverPage() {
  return (
    <FocusPageShell path="/discover" width="6xl" className="!px-0">
      <FocusPageHero page="discover" />
      <DiscoverContent />
    </FocusPageShell>
  );
}
