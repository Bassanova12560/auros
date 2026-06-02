"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getAssetUseCases } from "@/lib/jurisdictions/asset-use-cases";
import { JURISDICTIONS_STARTER_KIT_ROUTE } from "@/lib/jurisdictions/constants";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";
import { jurisdictionLabel } from "@/lib/jurisdictions";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionAssetUseCases() {
  const { locale, messages } = useJurisdictionPage();
  const cases = getAssetUseCases(locale);
  const section = getEnterpriseMessages(locale).assetUseCases;

  return (
    <section
      id="use-cases"
      className="scroll-mt-28 border-t border-white/[0.06] py-16 md:py-24"
    >
      <SectionHeader
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        align="left"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cases.map((item) => (
          <BezelCard
            key={item.assetType}
            innerClassName="flex h-full flex-col p-6 md:p-7"
            animate
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
              {messages.forms.projectTypes[item.assetType]}
            </p>
            <h3 className="mt-2 font-display text-xl font-medium text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {item.subtitle}
            </p>

            <p className="mt-5 font-mono text-[9px] uppercase tracking-wider text-white/35">
              {section.jurisdictionsLabel}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {item.typicalJurisdictions
                .map((id) => jurisdictionLabel(messages, id))
                .join(" · ")}
            </p>

            <ul className="mt-4 flex-1 space-y-2">
              {item.starterKitFocus.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-white/60"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/25" />
                  {point}
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs text-emerald-300/75">
              {item.roiNote}
            </p>
          </BezelCard>
        ))}
      </div>

      <p className="mt-8 text-sm text-white/45">
        {section.footnote}{" "}
        <Link
          href={JURISDICTIONS_STARTER_KIT_ROUTE}
          className="text-white/70 underline decoration-white/20 underline-offset-4 hover:text-white"
        >
          {section.starterKitLink}
        </Link>
      </p>
    </section>
  );
}
