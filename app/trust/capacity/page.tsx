import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  TRUST_CAPACITY_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Capacity Rights RWA | AUROS",
  description:
    "Droits de capacité — MW, file d’interconnexion, cooling, allocations. Scoring admission data center & utilities.",
};

export default function CapacityWelcomePage() {
  return (
    <VerticalWelcomePage
      config={VERTICAL_WELCOMES[TRUST_CAPACITY_WELCOME_PATH]!}
    />
  );
}
