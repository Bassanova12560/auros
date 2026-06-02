"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { buildTokenizationStudioPlan } from "@/lib/studio";
import { getStudioMessages } from "@/lib/studio-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";

function ownerLabel(
  sm: ReturnType<typeof getStudioMessages>,
  owner: string
): string {
  switch (owner) {
    case "legal":
      return sm.ownerLegal;
    case "tech":
      return sm.ownerTech;
    case "compliance":
      return sm.ownerCompliance;
    case "auros":
      return sm.ownerAuros;
    default:
      return sm.ownerIssuer;
  }
}

export function TokenizationStudio({ data }: { data: WizardData }) {
  const { locale } = useLocale();
  const sm = getStudioMessages(locale);
  const plan = useMemo(() => buildTokenizationStudioPlan(data), [data]);

  return (
    <section className="mb-10 border-b border-white/[0.06] pb-10">
      <div className="mb-8">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          {sm.title}
        </p>
        <p className="mt-2 max-w-2xl text-sm text-white/65">{sm.subtitle}</p>
        <p className="mt-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400/90">
          {sm.maturity[plan.maturityLevel]}
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <FeaturePill label={sm.retained} items={["Roadmap", "Réglementaire", "Tokenomics", "Plans juridiques", "Prestataires"]} />
        <FeaturePill
          label={sm.later}
          muted
          items={["Deploy SC", "KYC Sumsub", "Oracle conformité", "DvP secondaire"]}
        />
      </div>

      <StudioBlock title={sm.regulatory}>
        <p className="text-sm font-medium text-white">{plan.regulatory.regime}</p>
        <p className="mt-2 text-sm text-white/70">{plan.regulatory.summary}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label={sm.instrument} value={plan.instrument.replace(/_/g, " ")} />
          <Row label={sm.structure} value={plan.regulatory.structureRecommendation} />
        </dl>
        {plan.regulatory.exemptions && plan.regulatory.exemptions.length > 0 && (
          <ul className="mt-3 list-inside list-disc text-xs text-white/55">
            {plan.regulatory.exemptions.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[10px] text-white/40">{plan.regulatory.disclaimer}</p>
      </StudioBlock>

      <StudioBlock title={sm.tokenTech}>
        <dl className="space-y-2 text-sm">
          <Row label={sm.standard} value={plan.tokenStandard.standard} />
          <Row label={sm.chain} value={plan.tokenStandard.chain} />
        </dl>
        <p className="mt-2 text-xs text-white/55">{plan.tokenStandard.rationale}</p>
      </StudioBlock>

      <StudioBlock title={sm.tokenomics}>
        <dl className="space-y-2 text-sm">
          <Row label="Name" value={plan.tokenomics.name} />
          <Row label={sm.supply} value={String(plan.tokenomics.totalSupply)} />
          <Row label={sm.nominal} value={plan.tokenomics.nominalValue} />
        </dl>
        <ListBlock title={sm.transferRules} items={plan.tokenomics.transferRules} />
        <ListBlock title={sm.revenue} items={plan.tokenomics.revenueMechanics} />
        <ListBlock title={sm.complianceHooks} items={plan.tokenomics.complianceHooks} />
        <p className="mt-3 text-[10px] text-white/40">{plan.tokenomics.deployNote}</p>
      </StudioBlock>

      <StudioBlock title={sm.roadmap}>
        <div className="space-y-6">
          {plan.roadmap.map((phase) => (
            <div key={phase.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-sm font-medium text-white">{phase.title}</h4>
                <span className="font-mono text-[10px] text-white/45">
                  {phase.duration}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {phase.tasks.map((t) => (
                  <li
                    key={t.id}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      t.status === "done"
                        ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-200/80"
                        : t.status === "active"
                          ? "border-white/15 bg-white/[0.04] text-white/85"
                          : "border-white/[0.06] text-white/50"
                    }`}
                  >
                    <span className="font-medium">{t.title}</span>
                    <span className="mx-2 text-white/30">·</span>
                    <span>
                      {ownerLabel(sm, t.owner)} · S+
                      {t.weeksFromStart}
                    </span>
                    <p className="mt-1 text-white/55">{t.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </StudioBlock>

      <StudioBlock title={sm.docBlueprints}>
        <div className="space-y-4">
          {plan.documents.map((doc) => (
            <article
              key={doc.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <h4 className="text-sm font-medium text-white">{doc.title}</h4>
              <p className="mt-2 font-mono text-[10px] uppercase text-white/40">
                {sm.outline}
              </p>
              <ul className="mt-2 list-inside list-disc text-xs text-white/60">
                {doc.outline.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {doc.prefilled && (
                <p className="mt-3 rounded-lg bg-white/[0.04] p-3 text-xs leading-relaxed text-white/75">
                  <span className="font-mono text-[9px] uppercase text-white/40">
                    {sm.prefilled}:{" "}
                  </span>
                  {doc.id === "prospectus" ? (
                    <>
                      {sm.targetProfile}:{" "}
                      {wizardOptionLabel(
                        locale,
                        "investorProfiles",
                        data.investorProfile?.trim() &&
                          data.investorProfile !== "investorProfile"
                          ? data.investorProfile
                          : "I don't know yet"
                      )}
                      . {plan.regulatory.summary}
                    </>
                  ) : (
                    doc.prefilled
                  )}
                </p>
              )}
            </article>
          ))}
        </div>
      </StudioBlock>

      <StudioBlock title={sm.providers}>
        <p className="text-sm leading-relaxed text-white/65">{sm.providersSoon}</p>
        <p className="mt-3 text-sm text-white/50">
          <Link href="/#contact" className="underline hover:text-white">
            {sm.partnersLink}
          </Link>
        </p>
      </StudioBlock>
    </section>
  );
}

function StudioBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/45">
        {label}
      </dt>
      <dd className="text-white/85">{value}</dd>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase text-white/40">{title}</p>
      <ul className="mt-1 list-inside list-disc text-xs text-white/65">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function FeaturePill({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        muted
          ? "border-white/[0.06] bg-transparent"
          : "border-emerald-500/20 bg-emerald-500/5"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="mt-2 text-xs text-white/70">{items.join(" · ")}</p>
    </div>
  );
}
