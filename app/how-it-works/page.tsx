import type { Metadata } from "next";

import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { HowItWorks } from "@/app/_components/HowItWorks";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath("/how-it-works");

export default function HowItWorksPage() {
  return (
    <FocusPageShell path="/how-it-works" width="6xl" className="!px-0">
      <FocusPageHero page="howItWorks" secondaryHref="/estimate" />
      <HowItWorks />
    </FocusPageShell>
  );
}
