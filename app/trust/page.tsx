import type { Metadata } from "next";

import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ProfessionalTrustBar } from "@/app/_components/ProfessionalTrustBar";
import { RegulatoryTrust } from "@/app/_components/RegulatoryTrust";
import { TrustEnrichment } from "@/app/_components/TrustEnrichment";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath("/trust");

export default function TrustPage() {
  return (
    <FocusPageShell path="/trust" width="6xl" className="!px-0">
      <FocusPageHero page="trust" secondaryHref="/jurisdictions" />
      <section className="mx-auto max-w-3xl px-4 md:px-6">
        <ProfessionalTrustBar variant="panel" />
      </section>
      <RegulatoryTrust />
      <TrustEnrichment />
    </FocusPageShell>
  );
}
