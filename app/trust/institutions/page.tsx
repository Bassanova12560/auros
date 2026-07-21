import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  TRUST_INSTITUTIONS_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Institutions & RWA | AUROS",
  description:
    "Snapshot indicatif — qui intègre ou prépare des rails RWA et tokenisation.",
};

export default function InstitutionsWelcomePage() {
  return (
    <VerticalWelcomePage
      config={VERTICAL_WELCOMES[TRUST_INSTITUTIONS_WELCOME_PATH]!}
    />
  );
}
