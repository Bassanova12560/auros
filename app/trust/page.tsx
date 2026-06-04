import type { Metadata } from "next";

import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ProfessionalTrustBar } from "@/app/_components/ProfessionalTrustBar";
import { RegulatoryTrust } from "@/app/_components/RegulatoryTrust";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Confiance & conformité | AUROS",
  description:
    "MiCA, RGPD, KYC/AML — cadre réglementaire transparent pour la préparation de dossiers RWA.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust & compliance | AUROS",
    description: "MiCA, GDPR, KYC/AML — transparent regulatory framing for RWA dossier preparation.",
    url: absoluteUrl("/trust"),
    siteName: "AUROS",
    type: "website",
  },
};

export default function TrustPage() {
  return (
    <FocusPageShell path="/trust" width="6xl" className="!px-0">
      <FocusPageHero page="trust" secondaryHref="/jurisdictions" />
      <section className="mx-auto max-w-3xl px-4 md:px-6">
        <ProfessionalTrustBar variant="panel" />
      </section>
      <RegulatoryTrust />
    </FocusPageShell>
  );
}
