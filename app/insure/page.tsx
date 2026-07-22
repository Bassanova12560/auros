import type { Metadata } from "next";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";

export const metadata: Metadata = {
  title: "Insure — Auros Resource Layer | AUROS",
  description: "Parametric production and water-right insurance demos.",
};

export default function InsurePage() {
  return (
    <FocusPageShell path="/insure" width="3xl">
      <ContentPageLayout
        product="Resource Layer"
        eyebrow="Insure · Demo"
        title="Parametric cover for real resources"
        intro="Buy shortfall cover on IoT production, or water-right regulatory cuts. Protocol takes 15% of premiums. Settlement is keeper-driven."
      >
        <div className="space-y-4 text-sm text-white/60">
          <p>
            <span className="text-white/85">Energy policy:</span> if reported mint volume &lt;
            threshold over the period, coverage pays from the LP pool.
          </p>
          <p>
            <span className="text-white/85">Water right:</span> links to WaterRightNFT remaining
            volume — regulatory cuts trigger payout.
          </p>
          <p className="font-mono text-[11px] text-white/40">
            API: POST /insurance/buy · POST /insurance/:id/settle
          </p>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
