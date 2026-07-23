"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useComparatorPage } from "./useComparatorPage";
import { DOSSIER_CTA, isCompareHubPath } from "@/lib/comparators";
import { buildCompareDossierHref } from "@/lib/comparators/compare-report";
import { pageCopyForId } from "@/lib/comparators/page-copy";
import { track } from "@/lib/analytics";
import {
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green/constants";

type DossierCtaStripProps = {
  /** When set (≥2), preserve shortlist into /start. */
  selectedIds?: string[];
};

/** Max 3 CTAs: dossier (primary) · Green · CSRD — no ops paths. */
export function DossierCtaStrip({ selectedIds = [] }: DossierCtaStripProps) {
  const pathname = usePathname();
  const { messages, comparatorId, entry } = useComparatorPage();
  const cta = isCompareHubPath(pathname)
    ? messages.compareHub.dossierCta
    : (pageCopyForId(messages, entry?.id)?.cta ?? messages.stablecoins.cta);
  const next = messages.nextSteps;
  const dossierHref =
    selectedIds.length >= 2
      ? buildCompareDossierHref(selectedIds)
      : DOSSIER_CTA.href;

  return (
    <section className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            {cta.eyebrow}
          </p>
          <p className="mt-2 text-base text-white/80">{cta.title}</p>
          <p className="mt-1 text-sm text-muted">{cta.subtitle}</p>
          <p className="mt-2 max-w-xl font-mono text-[10px] leading-relaxed text-white/35">
            {next.phasesHint}
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:items-end">
          <PrimaryButton
            href={dossierHref}
            onClick={() =>
              track("comparator_dossier_cta", {
                source: "strip",
                comparator: comparatorId,
              })
            }
          >
            {cta.button}
          </PrimaryButton>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end">
            <Link
              href={GREEN_ROUTE}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white/70"
              onClick={() =>
                track("comparator_green_cta", {
                  source: "strip",
                  comparator: comparatorId,
                })
              }
            >
              {next.green}
            </Link>
            <Link
              href={GREEN_CSRD_CHECK_ROUTE}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white/70"
              onClick={() =>
                track("comparator_csrd_cta", {
                  source: "strip",
                  comparator: comparatorId,
                })
              }
            >
              {next.csrd}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
