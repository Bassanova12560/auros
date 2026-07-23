import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

import { StatusPanel } from "./_components/StatusPanel";

export const metadata: Metadata = {
  title: "Status — AUROS",
  description: "Public probe of AUROS protocol and ARL lab endpoints. Not a contractual SLA.",
};

export default function StatusPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/status" />
      <FocusPageShell path="/status" width="3xl">
        <ContentPageLayout
          product="AUROS"
          eyebrow="Status"
          title="Service probes"
          intro="Transparency for partners who need to know the surfaces are reachable before wiring trading or IoT."
        >
          <StatusPanel />
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
