"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { captureReferralFromSearchParams } from "@/lib/referral";

export function ReferralScoreBanner() {
  const searchParams = useSearchParams();
  const referral = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return captureReferralFromSearchParams(params);
  }, [searchParams]);

  useEffect(() => {
    if (referral?.type === "SCORE") {
      document.getElementById("score")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [referral]);

  if (referral?.type !== "SCORE" || referral.score === undefined) {
    return null;
  }

  const asset = referral.asset ?? "un actif";

  return (
    <div className="relative z-40 border-b border-white/[0.08] bg-white/[0.03] px-6 py-3 text-center">
      <p className="font-mono text-[11px] text-white/60">
        Score partagé{" "}
        <span className="font-semibold text-white">{referral.score}/100</span> —{" "}
        {asset}
      </p>
    </div>
  );
}
