import type { Metadata } from "next";

import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { HowItWorks } from "@/app/_components/HowItWorks";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

export const metadata: Metadata = withOgImage(
  metadataFromPath("/how-it-works"),
  "/how-it-works",
  "Comment ça marche"
);

export default function HowItWorksPage() {
  return (
    <FocusPageShell path="/how-it-works" width="6xl" className="!px-0">
      <FocusPageHero page="howItWorks" secondaryHref="/estimate" />
      <HowItWorks />
    </FocusPageShell>
  );
}
