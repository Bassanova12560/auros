"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { H2oReadinessChecker } from "@/app/eau/_components/H2oReadinessChecker";
import { normalizePartnerCode } from "@/lib/partner-attribution";

function EauEmbedInner() {
  const searchParams = useSearchParams();
  const partner = normalizePartnerCode(searchParams.get("partner"));

  return <H2oReadinessChecker mode="embed" partnerCode={partner} />;
}

export default function EauEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#030303] text-white/40">
          AUROS H₂O…
        </div>
      }
    >
      <EauEmbedInner />
    </Suspense>
  );
}
