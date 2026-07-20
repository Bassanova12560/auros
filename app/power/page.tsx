import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";

import { PowerHubView } from "./PowerHubView";

export const POWER_HUB_ROUTE = "/power";

export const metadata: Metadata = {
  ...metadataFromPath(POWER_HUB_ROUTE),
  title: "AUROS Power | Low-carbon & nucléaire",
  description:
    "Verticale low-carbon power AUROS — nucléaire et bas-carbone via Watts + ChargeFlow, hors Green Verified. Indicatif, pas un GO/REC.",
};

export default function PowerHubPage() {
  return (
    <FocusPageShell path={POWER_HUB_ROUTE} width="3xl">
      <PowerHubView />
    </FocusPageShell>
  );
}
