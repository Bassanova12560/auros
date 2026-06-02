"use client";

import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getEaseMessages } from "@/lib/ease-i18n";

import { AssetUniverse } from "./AssetUniverse";
import { DossierDeliverables } from "./DossierDeliverables";
import { LandingStory } from "./LandingStory";
import { RegulatoryTrust } from "./RegulatoryTrust";
import { SocialProof } from "./SocialProof";
import { Stats } from "./Stats";
import { Ticker } from "./Ticker";

export function LandingExplore() {
  const { locale } = useLocale();
  const m = getEaseMessages(locale);
  const [open, setOpen] = useState(false);

  return (
    <section className="border-t border-white/[0.06] px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group inline-flex flex-col items-center gap-2"
          aria-expanded={open}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 group-hover:text-white/80">
            {open ? "−" : "+"} {m.landing.exploreTitle}
          </span>
          <span className="max-w-md text-sm text-white/45 group-hover:text-white/60">
            {m.landing.exploreSubtitle}
          </span>
        </button>
      </div>

      {open ? (
        <div className="mt-10 space-y-0">
          <Ticker />
          <LandingStory act={1} />
          <AssetUniverse />
          <LandingStory act={2} />
          <RegulatoryTrust />
          <LandingStory act={3} />
          <SocialProof />
          <DossierDeliverables />
          <Stats />
        </div>
      ) : null}
    </section>
  );
}
