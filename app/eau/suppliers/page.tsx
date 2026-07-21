import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import { VERTICAL_WELCOMES } from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Audit claims fournisseurs ESG | AUROS",
  description:
    "Écran indicatif anti-greenwashing — claims sans URL ignorés. Pas une certification CSRD.",
};

export default function SuppliersWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES["/eau/suppliers"]!} />
  );
}
