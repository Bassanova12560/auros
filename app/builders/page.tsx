import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { BuildersPageContent } from "./_components/BuildersPageContent";

export const metadata: Metadata = {
  title: "Builders — Auros Resource Layer | AUROS",
  description:
    "Architecture, animated mint→trade demo, protocol surface, and testnet access for Auros Resource Layer builders.",
};

export default function BuildersPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/builders" />
      <FocusPageShell path="/builders" width="6xl">
        <BuildersPageContent />
      </FocusPageShell>
    </>
  );
}
