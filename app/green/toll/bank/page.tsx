import type { Metadata } from "next";
import { Suspense } from "react";

import TollBankPilotPage from "./BankPilotClient";

export const metadata: Metadata = {
  title: "Bank Policy Pilot | AUROS Toll",
  description:
    "Pilote banque Policy / Eligibility — tenant sticky, décisions loggées, HITL.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="page-inner mx-auto px-4 py-16 text-sm text-white/50">
          Chargement pilote banque…
        </div>
      }
    >
      <TollBankPilotPage />
    </Suspense>
  );
}
