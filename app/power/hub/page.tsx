import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";
import { POWER_HUB_PATH } from "@/lib/vertical-welcome/config";

import { PowerHubView } from "../PowerHubView";

export const metadata: Metadata = {
  ...metadataFromPath(POWER_HUB_PATH),
  title: "Hub Power | AUROS",
  description:
    "Actions Watts Reserve, ChargeFlow et Shield — verticale low-carbon & nucléaire.",
};

export default function PowerHubToolPage() {
  return (
    <FocusPageShell path={POWER_HUB_PATH} width="3xl">
      <PowerHubView />
    </FocusPageShell>
  );
}
