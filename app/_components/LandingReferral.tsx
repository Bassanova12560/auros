"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { capturePartnerFromSearchParams } from "@/lib/partner-attribution";

import { ReferralScoreBanner } from "./ReferralScoreBanner";

function LandingReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    capturePartnerFromSearchParams(params);
  }, [searchParams]);

  return <ReferralScoreBanner />;
}

export function LandingReferral() {
  return (
    <Suspense fallback={null}>
      <LandingReferralCapture />
    </Suspense>
  );
}
