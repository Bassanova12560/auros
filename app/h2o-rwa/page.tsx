import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { H2O_RWA_PATH, VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "H2O RWA · Tokenisation de l’eau | AUROS",
  description:
    "Infrastructure de confiance pour RWA hydriques — H₂O Score, WETS, WELHR, CFU-W, Trust Packs. Pas une marketplace.",
  keywords: [
    "H2O RWA",
    "water RWA",
    "tokenisation eau",
    "real world asset water",
    "AUROS",
  ],
};

export default function H2oRwaLandingPage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[H2O_RWA_PATH]!} />
  );
}
