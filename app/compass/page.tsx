import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { COMPASS_WELCOME_ROUTE } from "@/lib/resilience/compass";
import { VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Auros Compass · Cockpit résilience | AUROS",
  description:
    "Tableau de bord en 3 modes — eau, carbone indicatif, budget. Max 3 priorités visibles.",
};

export default function CompassWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[COMPASS_WELCOME_ROUTE]!} />
  );
}
