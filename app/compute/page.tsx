import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export const metadata: Metadata = {
  title: "Compute — Auros Resource Layer | AUROS",
  description: "FLOP compute credits and forward reservation demos.",
};

export default function ComputePage() {
  return (
    <FocusPageShell path="/compute" width="3xl">
      <ContentPageLayout
        product="Resource Layer"
        eyebrow="ComputeFi · Demo"
        title="Trade standardized GPU-hours"
        intro="FLOP tokens represent verified compute. Data centers mint via oracle proofs; agents reserve capacity with forward orders and ComputeFutures."
      >
        <div className="space-y-6 text-sm text-white/60">
          <p>1 FLOP ≈ 1 TFLOPS·hour (MVP standardization). Spot + perps reuse the ARL fee model.</p>
          <PrimaryButton href="/trade">Open terminal</PrimaryButton>
          <p className="font-mono text-[11px] text-white/40">
            API: POST /compute/mint · GET /compute/stats · perps index flop
          </p>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
