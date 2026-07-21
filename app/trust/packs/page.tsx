import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  TRUST_PACKS_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Asset Trust Packs | Admission RWA multi-vertical | AUROS",
  description:
    "Page d’accueil Trust Packs — eau, capacity, immo, luxe, véhicules, bateaux, sport. Preuves sourcées, grades A–D.",
};

export default function TrustPacksWelcomePage() {
  return (
    <VerticalWelcomePage
      config={VERTICAL_WELCOMES[TRUST_PACKS_WELCOME_PATH]!}
    />
  );
}
