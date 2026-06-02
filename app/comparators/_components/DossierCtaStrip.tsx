"use client";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useComparatorPage } from "./useComparatorPage";
import { DOSSIER_CTA } from "@/lib/comparators";
import { pageCopyForId } from "@/lib/comparators/page-copy";
import { track } from "@/lib/analytics";

export function DossierCtaStrip() {
  const { messages, comparatorId, entry } = useComparatorPage();
  const cta =
    pageCopyForId(messages, entry?.id)?.cta ?? messages.stablecoins.cta;

  return (
    <section className="hidden border-t border-white/[0.06] px-6 py-10 md:block">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            {cta.eyebrow}
          </p>
          <p className="mt-2 text-base text-white/80">{cta.title}</p>
          <p className="mt-1 text-sm text-muted">{cta.subtitle}</p>
        </div>
        <PrimaryButton
          href={DOSSIER_CTA.href}
          className="shrink-0"
          onClick={() =>
            track("comparator_dossier_cta", {
              source: "strip",
              comparator: comparatorId,
            })
          }
        >
          {cta.button}
        </PrimaryButton>
      </div>
    </section>
  );
}
