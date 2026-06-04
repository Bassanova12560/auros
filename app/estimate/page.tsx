import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ScoreWidget } from "@/app/_components/ScoreWidget";
import { absoluteUrl } from "@/lib/comparators/site";

export const metadata: Metadata = {
  title: "Score de préparation | AUROS",
  description:
    "Estimez en une phrase si votre actif est prêt pour la tokenisation — score indicatif instantané, sans compte.",
  alternates: { canonical: "/estimate" },
  openGraph: {
    title: "Tokenization readiness score | AUROS",
    description: "One sentence, instant indicative score — no account required.",
    url: absoluteUrl("/estimate"),
    siteName: "AUROS",
    type: "website",
  },
};

export default function EstimatePage() {
  return (
    <FocusPageShell path="/estimate" width="3xl">
      <ScoreWidget />
    </FocusPageShell>
  );
}
