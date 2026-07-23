import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { CareersPageContent } from "./_components/CareersPageContent";

export const metadata: Metadata = {
  title: "Careers — Auros Resource Layer | AUROS",
  description:
    "Open roles: Head of IoT Integration, Protocol Engineer (Energy Markets), markets lead — Auros Resource Layer.",
};

export default function CareersPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/careers" />
      <FocusPageShell path="/careers" width="3xl">
        <CareersPageContent />
      </FocusPageShell>
    </>
  );
}
