"use client";

import { MobilePageShell } from "@/app/_components/ui/MobilePageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import {
  jurisdictionLabel,
  JURISDICTIONS_ROUTE,
  JURISDICTIONS_ANCHORS,
  JURISDICTIONS_STARTER_KIT_ROUTE,
} from "@/lib/jurisdictions";
import { getAssetUseCase } from "@/lib/jurisdictions/asset-use-cases";
import { getSeoLandingCopy, type SeoLanding } from "@/lib/jurisdictions/seo-landings";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionSeoLandingView({ landing }: { landing: SeoLanding }) {
  const { locale, messages } = useJurisdictionPage();
  const jurisdictionName = jurisdictionLabel(messages, landing.jurisdictionId);
  const assetLabel =
    messages.forms.projectTypes[landing.assetType] ?? landing.assetType;
  const copy = getSeoLandingCopy(locale, landing, jurisdictionName, assetLabel);
  const useCase = getAssetUseCase(locale, landing.assetType);

  const guideHref = `${JURISDICTIONS_ROUTE}${JURISDICTIONS_ANCHORS.guide}?compareA=${landing.jurisdictionId}`;
  const compareHref = `${JURISDICTIONS_ROUTE}${JURISDICTIONS_ANCHORS.comparator}?quote=${landing.jurisdictionId}`;

  return (
    <MobilePageShell width="3xl" stickyBottom>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          AUROS · {jurisdictionName}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {copy.h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/55">{copy.intro}</p>

        <BezelCard className="mt-10" innerClassName="p-6 md:p-8" animate>
          <ul className="space-y-3">
            {copy.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm text-white/65"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                {b}
              </li>
            ))}
          </ul>
        </BezelCard>

        <BezelCard className="mt-4" innerClassName="p-6 md:p-8" animate>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
            {useCase.title}
          </p>
          <p className="mt-2 text-sm text-white/55">{useCase.subtitle}</p>
          <ul className="mt-4 space-y-2">
            {useCase.starterKitFocus.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-white/60"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/25" />
                {point}
              </li>
            ))}
          </ul>
        </BezelCard>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href={guideHref}>{copy.ctaGuide}</PrimaryButton>
          <a
            href={compareHref}
            className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            {copy.ctaCompare}
          </a>
          <a
            href={JURISDICTIONS_STARTER_KIT_ROUTE}
            className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-sm text-white/45 transition hover:border-white/25 hover:text-white/70"
          >
            {copy.ctaStarterKit}
          </a>
        </div>

        <p className="mt-12 text-xs leading-relaxed text-white/35">
          {messages.footer.disclaimer}
        </p>
    </MobilePageShell>
  );
}
