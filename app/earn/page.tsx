import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";

import { EarnPanel } from "./_components/EarnPanel";

export const metadata: Metadata = {
  title: "Earn — Auros Resource Layer | AUROS",
  description: "Stake, lend, and provide liquidity across ARL pools.",
};

export default function EarnPage() {
  return (
    <FocusPageShell path="/earn" width="3xl">
      <ContentPageLayout
        product="Resource Layer"
        eyebrow="Earn · Lab"
        title="Provide capital to the flywheel"
        intro="LPs earn from trading fees, interest, and insurance premiums. Lab wallet shows your current balances; full LP vaults stay HITL."
      >
        <EarnPanel />
      </ContentPageLayout>
    </FocusPageShell>
  );
}
