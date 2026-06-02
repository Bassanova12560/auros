"use client";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { MobileStickyBar } from "@/app/_components/ui/MobileStickyBar";
import { useComparatorPage } from "./useComparatorPage";
import { DOSSIER_CTA } from "@/lib/comparators";
import { track } from "@/lib/analytics";

/** Barre dossier fixe — mobile uniquement */
export function MobileDossierBar() {
  const { messages, comparatorId } = useComparatorPage();

  return (
    <MobileStickyBar>
      <PrimaryButton
        href={DOSSIER_CTA.href}
        className="!w-full !justify-center !py-3.5 !text-xs"
        onClick={() =>
          track("comparator_dossier_cta", {
            source: "mobile_sticky",
            comparator: comparatorId,
          })
        }
      >
        {messages.nav.dossierCta}
      </PrimaryButton>
    </MobileStickyBar>
  );
}
