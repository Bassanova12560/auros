import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { PricingPageContent } from "./_components/PricingPageContent";

export const metadata: Metadata = withOgImage(
  metadataFromPath("/pricing"),
  "/pricing",
  "Tarifs AUROS"
);

export default function PricingPage() {
  return (
    <FocusPageShell path="/pricing" width="6xl">
      <PricingPageContent />
    </FocusPageShell>
  );
}
