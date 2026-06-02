"use client";

import { useMemo, useState, type ReactNode } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { JURISDICTIONS } from "@/lib/jurisdictions";
import { JURISDICTIONS_ANCHORS } from "@/lib/jurisdictions/constants";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";
import {
  estimateSetupBudget,
  formatEurRange,
  type ProjectValueBand,
} from "@/lib/jurisdictions/setup-calculator";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionSetupCalculator() {
  const { locale, messages } = useJurisdictionPage();
  const e = getEnterpriseMessages(locale);
  const c = e.setupCalculator;
  const forms = messages.forms;

  const [jurisdictionId, setJurisdictionId] = useState("dubai-difc");
  const [projectValue, setProjectValue] = useState<ProjectValueBand>("1to5m");

  const estimate = useMemo(
    () => estimateSetupBudget(jurisdictionId, projectValue),
    [jurisdictionId, projectValue]
  );

  const localeTag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";

  return (
    <section
      id="calculator"
      className="scroll-mt-28 border-t border-white/[0.06] py-16 md:py-24"
    >
      <SectionHeader
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
        align="left"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5">
          <Field label={c.jurisdictionLabel}>
            <select
              className="jurisdiction-field w-full"
              value={jurisdictionId}
              onChange={(ev) => setJurisdictionId(ev.target.value)}
            >
              {JURISDICTIONS.map((j) => (
                <option key={j.id} value={j.id}>
                  {messages.names[j.id] ?? j.id}
                </option>
              ))}
            </select>
          </Field>

          <Field label={c.valueLabel}>
            <select
              className="jurisdiction-field w-full"
              value={projectValue}
              onChange={(ev) =>
                setProjectValue(ev.target.value as ProjectValueBand)
              }
            >
              {(
                Object.entries(forms.projectValues) as [ProjectValueBand, string][]
              ).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {estimate ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {c.estimateTitle}
            </p>

            <dl className="mt-6 space-y-4">
              <Row
                label={c.stateFees}
                value={formatEurRange(
                  estimate.stateMinEur,
                  estimate.stateMaxEur,
                  localeTag
                )}
              />
              <Row
                label={c.advisoryFees}
                value={formatEurRange(
                  estimate.advisoryMinEur,
                  estimate.advisoryMaxEur,
                  localeTag
                )}
              />
              <Row
                label={c.aurosStarter}
                value={formatEurRange(
                  estimate.aurosStarterEur,
                  estimate.aurosStarterEur,
                  localeTag
                )}
                highlight
              />
              <Row
                label={c.totalSetup}
                value={formatEurRange(
                  estimate.totalMinEur,
                  estimate.totalMaxEur,
                  localeTag
                )}
                strong
              />
            </dl>

            <p className="mt-6 text-sm text-white/55">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {c.delayLabel}
              </span>
              <span className="ml-2">
                {c.delayMonths(
                  estimate.delayMonthsMin,
                  estimate.delayMonthsMax
                )}
              </span>
            </p>

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              {c.note}
            </p>

            <div className="mt-8">
              <PrimaryButton href={JURISDICTIONS_ANCHORS.guide}>
                {c.cta}
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Row({
  label,
  value,
  highlight,
  strong,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
      <dt className="text-sm text-white/50">{label}</dt>
      <dd
        className={`text-sm tabular-nums ${
          strong
            ? "font-display text-lg text-white"
            : highlight
              ? "font-medium text-emerald-300/90"
              : "text-white/75"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
