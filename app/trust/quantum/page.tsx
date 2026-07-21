import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  QEI_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Quantum Exposure · RWA post-quantique | AUROS",
  description:
    "Indice indicatif d’exposition structurelle post-quantique — custody, durée d’actif, recours légal off-chain.",
};

export default function QuantumWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[QEI_WELCOME_PATH]!} />
  );
}
