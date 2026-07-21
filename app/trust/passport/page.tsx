import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  TRUST_PASSPORT_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Lifestyle Passport RWA | AUROS",
  description:
    "Passeport d’admission patrimoine tokenisé — titre, custody, assurance, claim vs title.",
};

export default function PassportWelcomePage() {
  return (
    <VerticalWelcomePage
      config={VERTICAL_WELCOMES[TRUST_PASSPORT_WELCOME_PATH]!}
    />
  );
}
