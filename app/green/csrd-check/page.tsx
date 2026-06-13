import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { GREEN_CSRD_CHECK_ROUTE } from "@/lib/green/constants";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

import { CsrdCheckView } from "./CsrdCheckView";
import { CsrdFaqJsonLd } from "./CsrdFaqJsonLd";

export const metadata: Metadata = withOgImage(
  metadataFromPath(GREEN_CSRD_CHECK_ROUTE),
  GREEN_CSRD_CHECK_ROUTE,
  "CSRD Checker — scope et préparation"
);

export default function CsrdCheckPage() {
  return (
    <FocusPageShell path={GREEN_CSRD_CHECK_ROUTE} width="3xl">
      <CsrdFaqJsonLd />
      <CsrdCheckView />
    </FocusPageShell>
  );
}
