import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { CONTINUITY_WELCOME_ROUTE } from "@/lib/wets/continuity-playbook";
import { VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Playbook continuité eau / refroidissement | AUROS",
  description:
    "Scénarios indicatifs chiffrés après WELHR — bascule source, boucle fermée, délestage IT.",
};

export default function ContinuityWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[CONTINUITY_WELCOME_ROUTE]!} />
  );
}
