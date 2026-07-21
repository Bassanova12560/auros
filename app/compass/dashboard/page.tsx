import type { Metadata } from "next";
import { Suspense } from "react";

import { AurosCompassDashboard } from "../_components/AurosCompassDashboard";

export const metadata: Metadata = {
  title: "Compass · Dashboard | AUROS",
  description: "Mode eau, carbone ou budget — trois priorités par vue.",
};

export default function CompassDashboardPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-white/45">Chargement…</p>}>
      <AurosCompassDashboard />
    </Suspense>
  );
}
