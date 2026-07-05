import type { Metadata } from "next";

import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";
import { metadataFromPath } from "@/lib/seo/metadata";

import { PartnerPortalView } from "./_components/PartnerPortalView";
import { PartnersSiteHeader } from "../_components/PartnersSiteHeader";

export const metadata: Metadata = metadataFromPath("/partners/portal");

export default function PartnerPortalPage() {
  return (
    <AmbientShell>
      <PartnersSiteHeader />
      <main className="page-main page-main--nav min-h-dvh px-4 py-12 md:px-6 md:py-16">
        <PartnerPortalView />
      </main>
      <Footer />
    </AmbientShell>
  );
}
