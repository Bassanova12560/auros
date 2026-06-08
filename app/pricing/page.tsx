import type { Metadata } from "next";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { AmbientShell } from "@/app/_components/ui/AmbientShell";
import { Footer } from "@/app/_components/Footer";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { PricingPageContent } from "./_components/PricingPageContent";
import { PricingSiteHeader } from "./_components/PricingSiteHeader";

export const metadata: Metadata = withOgImage(
  metadataFromPath("/pricing"),
  "/pricing",
  "Tarifs AUROS"
);

export default function PricingPage() {
  return (
    <AmbientShell>
      <AiFirstPageJsonLd path="/pricing" />
      <PricingSiteHeader />
      <main className="page-main page-main--nav text-white">
        <div className="page-inner page-inner--6xl mx-auto min-w-0 px-4 pb-20 pt-4 md:px-6 md:pt-6">
          <PricingPageContent />
        </div>
      </main>
      <Footer />
    </AmbientShell>
  );
}
