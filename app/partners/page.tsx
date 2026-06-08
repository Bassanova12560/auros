import type { Metadata } from "next";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";
import { metadataFromPath } from "@/lib/seo/metadata";

import { PartnersPageContent } from "./_components/PartnersPageContent";
import { PartnersSiteHeader } from "./_components/PartnersSiteHeader";

export const metadata: Metadata = metadataFromPath("/partners");

export default function PartnersPage() {
  return (
    <AmbientShell>
      <PartnersSiteHeader />
      <PartnersPageContent />
      <Footer />
    </AmbientShell>
  );
}