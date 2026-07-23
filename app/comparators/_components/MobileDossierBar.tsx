"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { MobileStickyBar } from "@/app/_components/ui/MobileStickyBar";
import { useComparatorPage } from "./useComparatorPage";
import { DOSSIER_CTA } from "@/lib/comparators";
import { track } from "@/lib/analytics";
import {
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green/constants";

/** Barre dossier fixe — mobile uniquement · max 3 CTAs */
export function MobileDossierBar() {
  const { messages, comparatorId } = useComparatorPage();
  const next = messages.nextSteps;

  return (
    <MobileStickyBar>
      <div className="flex w-full flex-col gap-2">
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
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link
            href={GREEN_ROUTE}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45"
            onClick={() =>
              track("comparator_green_cta", {
                source: "mobile_sticky",
                comparator: comparatorId,
              })
            }
          >
            {next.green}
          </Link>
          <Link
            href={GREEN_CSRD_CHECK_ROUTE}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45"
            onClick={() =>
              track("comparator_csrd_cta", {
                source: "mobile_sticky",
                comparator: comparatorId,
              })
            }
          >
            {next.csrd}
          </Link>
        </div>
      </div>
    </MobileStickyBar>
  );
}
