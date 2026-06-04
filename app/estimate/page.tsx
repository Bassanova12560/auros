import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ScoreWidget } from "@/app/_components/ScoreWidget";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath("/estimate");

export default function EstimatePage() {
  return (
    <FocusPageShell path="/estimate" width="6xl">
      <ScoreWidget />
    </FocusPageShell>
  );
}
