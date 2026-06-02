"use client";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { MobileStickyBar } from "@/app/_components/ui/MobileStickyBar";
import { useJurisdictionPage } from "./useJurisdictionPage";
import { DOSSIER_CTA } from "@/lib/comparators";
import { track } from "@/lib/analytics";

export function JurisdictionMobileBar() {
  const { messages } = useJurisdictionPage();

  return (
    <MobileStickyBar>
      <PrimaryButton
        href={DOSSIER_CTA.href}
        className="!w-full !justify-center !py-3.5 !text-xs"
        onClick={() =>
          track("comparator_dossier_cta", {
            source: "jurisdictions_mobile_sticky",
            comparator: "jurisdictions",
          })
        }
      >
        {messages.nav.dossierCta}
      </PrimaryButton>
    </MobileStickyBar>
  );
}
