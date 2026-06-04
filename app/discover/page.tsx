import type { Metadata } from "next";

import { DiscoverContent } from "@/app/_components/DiscoverContent";
import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath("/discover");

export default function DiscoverPage() {
  return (
    <FocusPageShell path="/discover" width="6xl" className="!px-0">
      <FocusPageHero page="discover" />
      <DiscoverContent />
    </FocusPageShell>
  );
}
