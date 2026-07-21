import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  POWER_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(POWER_WELCOME_PATH),
  title: "AUROS Power | Low-carbon & nucléaire",
  description:
    "Verticale power — Watts Reserve, ChargeFlow CFU, preuves institutionnelles. Indicatif, pas un GO/REC.",
};

export default function PowerWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[POWER_WELCOME_PATH]!} />
  );
}
