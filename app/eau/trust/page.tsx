import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  VERTICAL_WELCOMES,
  WETS_WELCOME_PATH,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Water/Energy Trust Score (WETS) | RWA eau & énergie | AUROS",
  description:
    "Page d’accueil WETS — scores indépendants, rapports publics, recours PQC pour RWA eau, microgrids, data centers et infra énergie.",
  openGraph: {
    title: "WETS — Trust Score RWA eau/énergie | AUROS",
    description:
      "7 critères, preuves sourcées, rapports shareables — admission plateforme.",
  },
};

export default function WetsWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[WETS_WELCOME_PATH]!} />
  );
}
