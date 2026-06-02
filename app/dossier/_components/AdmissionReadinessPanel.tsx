"use client";

import { useMemo } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import { admissionOverallLabel } from "@/lib/platform-display-i18n";
import { getDossierMessages } from "@/lib/dossier-i18n";
import { computeEaseSummary } from "@/lib/readiness-ease";
import type { WizardData } from "@/lib/wizard-types";

export function AdmissionReadinessPanel({ data }: { data: WizardData }) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const readiness = useMemo(() => computeAdmissionReadiness(data), [data]);
  const ease = useMemo(() => computeEaseSummary(data, locale), [data, locale]);

  return (
    <section className="mb-8 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            {dm.admission.title}
          </p>
          <p className="mt-2 max-w-md text-sm text-white/70">
            {dm.admission.subtitle}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-5xl font-semibold tabular-nums text-white">
            {readiness.overallAdmission}%
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400/90">
            {admissionOverallLabel(locale, readiness.label)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric
          label={dm.admission.dataRoom}
          value={`${readiness.dataRoomPercent}%`}
        />
        <Metric
          label={dm.admission.compliance}
          value={`${readiness.compliancePercent}%`}
        />
        <Metric
          label={dm.admission.profile}
          value={admissionOverallLabel(locale, readiness.label)}
        />
      </div>

      {ease.priorities.length > 0 ? (
        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {dm.admission.nextActions}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {ease.priorities.map((p) => (
              <li key={p.id} className="flex gap-2">
                <span className="text-white/40">·</span>
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
