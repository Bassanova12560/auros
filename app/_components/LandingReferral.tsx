"use client";

import { Suspense } from "react";

import { ReferralScoreBanner } from "./ReferralScoreBanner";

export function LandingReferral() {
  return (
    <Suspense fallback={null}>
      <ReferralScoreBanner />
    </Suspense>
  );
}
