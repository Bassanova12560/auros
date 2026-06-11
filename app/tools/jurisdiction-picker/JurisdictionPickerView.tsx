"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { JURISDICTION_PICKER_FAQ } from "@/lib/jurisdiction-picker/faq";
import {
  ASSET_FILTER_ORDER,
  getJurisdictionPickerCopy,
} from "@/lib/jurisdiction-picker/i18n";
import { rankJurisdictions } from "@/lib/jurisdiction-picker/scoring";
import type { AssetFilter } from "@/lib/jurisdiction-picker/types";
import { getJurisdictionMessages, jurisdictionLabel } from "@/lib/jurisdictions/i18n";

const DEFAULT_PRIORITIES = { speed: 50, cost: 50, tax: 50 };

function PrioritySlider({
  id,
  label,
  lowLabel,
  highLabel,
  value,
  onChange,
}: {
  id: string;
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-display text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-white/70"
      />
      <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
        <span>{lowLabel}</span>
        <span className="text-white/55">{value}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export function JurisdictionPickerView() {
  const { locale } = useLocale();
  const copy = getJurisdictionPickerCopy(locale);
  const jurisdictionMessages = getJurisdictionMessages(locale);

  const [priorities, setPriorities] = useState(DEFAULT_PRIORITIES);
  const [asset, setAsset] = useState<AssetFilter>("all");

  const result = useMemo(
    () => rankJurisdictions(priorities, asset),
    [priorities, asset]
  );

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section className="mx-auto max-w-2xl" aria-live="polite">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
          <div className="space-y-8">
            <PrioritySlider
              id="jp-speed"
              label={copy.speedLabel}
              lowLabel={copy.speedLow}
              highLabel={copy.speedHigh}
              value={priorities.speed}
              onChange={(speed) => setPriorities((p) => ({ ...p, speed }))}
            />
            <PrioritySlider
              id="jp-cost"
              label={copy.costLabel}
              lowLabel={copy.costLow}
              highLabel={copy.costHigh}
              value={priorities.cost}
              onChange={(cost) => setPriorities((p) => ({ ...p, cost }))}
            />
            <PrioritySlider
              id="jp-tax"
              label={copy.taxLabel}
              lowLabel={copy.taxLow}
              highLabel={copy.taxHigh}
              value={priorities.tax}
              onChange={(tax) => setPriorities((p) => ({ ...p, tax }))}
            />

            <div>
              <label
                htmlFor="jp-asset"
                className="font-display text-sm font-medium text-white"
              >
                {copy.assetLabel}
              </label>
              <p className="mt-1 text-xs text-white/45">{copy.assetHint}</p>
              <select
                id="jp-asset"
                value={asset}
                onChange={(e) => setAsset(e.target.value as AssetFilter)}
                className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
              >
                {ASSET_FILTER_ORDER.map((id) => (
                  <option key={id} value={id} className="bg-[#0a0a0b]">
                    {copy.assetFilters[id]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {copy.resultTitle}
            </p>
            <p className="mt-2 text-xs text-white/45">{copy.resultHint}</p>

            <ol className="mt-6 space-y-4">
              {result.recommendations.map((rec, index) => (
                <li
                  key={rec.id}
                  className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-xs text-white/60"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link
                        href={`/jurisdictions#${rec.id}`}
                        className="font-display text-base font-semibold text-white hover:text-white/85"
                        onClick={() =>
                          track("jurisdiction_picker_cta", {
                            target: "jurisdiction_detail",
                            id: rec.id,
                            rank: index + 1,
                          })
                        }
                      >
                        {jurisdictionLabel(jurisdictionMessages, rec.id)}
                      </Link>
                      <span className="font-mono text-[10px] text-white/40">
                        {copy.matchScore} {rec.score}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                      {copy.rationales[rec.rationaleId]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryButton
                href="/jurisdictions"
                onClick={() =>
                  track("jurisdiction_picker_cta", { target: "jurisdictions" })
                }
              >
                {copy.jurisdictionsCta}
              </PrimaryButton>
              <Link
                href="/wizard"
                onClick={() =>
                  track("jurisdiction_picker_cta", { target: "wizard" })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.wizardCta}
              </Link>
              <Link
                href="/estimate"
                onClick={() =>
                  track("jurisdiction_picker_cta", { target: "estimate" })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.estimateCta}
              </Link>
              <Link
                href="/tools/mica-checker"
                onClick={() =>
                  track("jurisdiction_picker_cta", { target: "mica_checker" })
                }
                className="text-center font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.micaCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] tracking-wide text-white/45">
          {copy.relatedTitle}
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {copy.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] text-white/55 transition hover:border-white/20 hover:text-white/80"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-white">
          {copy.faqTitle}
        </h2>
        <div className="mt-6">
          <ContentFaqList items={JURISDICTION_PICKER_FAQ} />
        </div>
      </section>
    </div>
  );
}
