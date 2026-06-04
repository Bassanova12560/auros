import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ScoreWidget } from "@/app/_components/ScoreWidget";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

export const metadata: Metadata = withOgImage(
  metadataFromPath("/estimate"),
  "/estimate",
  "Score de préparation"
);

export default function EstimatePage() {
  return (
    <FocusPageShell path="/estimate" width="6xl">
      <ScoreWidget />
    </FocusPageShell>
  );
}
