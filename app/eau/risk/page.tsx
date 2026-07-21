import type { Metadata } from "next";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  VERTICAL_WELCOMES,
  WELHR_WELCOME_PATH,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "WELHR · Risque legal & hydrique RWA eau | AUROS",
  description:
    "Water/Energy Legal & Hydrological Risk — score indicatif avant tokenisation eau, data center ou infra.",
};

export default function WelhrWelcomePage() {
  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[WELHR_WELCOME_PATH]!} />
  );
}
