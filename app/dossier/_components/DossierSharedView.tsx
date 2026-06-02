"use client";

import { AiDisclaimer } from "@/app/_components/AiDisclaimer";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";

import { Nav } from "@/app/_components/Nav";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getDossierMessages } from "@/lib/dossier-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import { scorePresentation } from "@/lib/score-presentation";
import type { Currency, DossierContent, WizardData } from "@/lib/wizard-types";

import { AdmissionReadinessPanel } from "./AdmissionReadinessPanel";
import { TokenizationStudio } from "./TokenizationStudio";
import { DataRoomChecklist } from "./DataRoomChecklist";
import { DossierQualityScore } from "./DossierQualityScore";

const DOC_NONE = "None yet";

const AI_SECTION_KEYS: Array<keyof DossierContent> = [
  "legalDescription",
  "valuation",
  "dueDiligence",
  "kycPreFilled",
  "micaCompliance",
  "smartContract",
];

type StoredDossier = {
  generatedAt?: string;
  score?: number;
  tier?: "low" | "mid" | "high";
  tierLabel?: string;
  data?: WizardData;
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
};

function formatWithSpaces(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatCurrencyDisplay(value: number, currency: Currency): string {
  const n = formatWithSpaces(value);
  switch (currency) {
    case "USD":
      return `$${n}`;
    case "GBP":
      return `£${n}`;
    case "CHF":
      return `CHF ${n}`;
    case "EUR":
    default:
      return `${n} €`;
  }
}

type Props = {
  dossier: Record<string, unknown>;
};

export function DossierSharedView({ dossier: raw }: Props) {
  const dossier = raw as StoredDossier;
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const data = dossier.data;

  const currency: Currency = (data?.currency ?? "EUR") as Currency;
  const score = dossier.score ?? 0;
  const tierInfo = useMemo(
    () => scorePresentation(score, locale),
    [score, locale]
  );

  if (!data) {
    return (
      <>
        <Nav />
        <main className="page-main page-main--nav page-inner page-inner--lg text-center text-muted">
          <p>{dm.shared.incomplete}</p>
          <Link href="/wizard" className="mt-6 inline-block text-white underline">
            {dm.shared.incompleteCta}
          </Link>
        </main>
      </>
    );
  }

  const documents = (data.documents ?? []).filter((d) => d !== DOC_NONE);
  const goals = data.goals ?? [];
  const location = [data.city, data.country].filter(Boolean).join(", ") || "—";
  const valuation = formatCurrencyDisplay(data.estimatedValue ?? 0, currency);

  const qualityInput = {
    description: data.description,
    value: data.estimatedValue ?? 0,
    country: data.country,
    city: data.city,
    documents: data.documents,
    email: data.email,
    firstName: data.firstName,
  };

  return (
    <>
      <Nav />
      <main className="page-main page-main--nav min-h-dvh text-white">
        <div className="page-inner page-inner--3xl mx-auto">
          <div className="mb-8 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 text-center text-sm">
            <p className="text-white/85">{dm.shared.banner}</p>
            <Link
              href="/wizard"
              className="mt-2 inline-block font-medium text-white underline underline-offset-4"
            >
              {dm.shared.bannerCta}
            </Link>
          </div>

          <div className="mb-10 border-b border-white/[0.06] pb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {dm.eyebrow} · {dm.shared.badge}
            </span>
          </div>

          <section className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {data.assetType
                  ? wizardOptionLabel(locale, "assetTypes", data.assetType)
                  : dm.yourAsset}
              </h1>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {location}
              </p>
            </div>
            {typeof dossier.score === "number" && (
              <div className="text-right">
                <p className="text-5xl font-semibold tabular-nums text-white">
                  {dossier.score}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {dossier.tierLabel ?? tierInfo.tierLabel}
                </p>
              </div>
            )}
          </section>

          <AdmissionReadinessPanel data={data} />

          <TokenizationStudio data={data} />

          <DossierQualityScore data={qualityInput} />

          <Section title={dm.sections.description}>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-white/90">
              {data.description?.trim() || dm.noDescription}
            </p>
          </Section>

          <Section title={dm.sections.valuation}>
            <p className="text-4xl font-semibold tracking-tight text-white">
              {valuation}
            </p>
          </Section>

          <DataRoomChecklist documents={data.documents ?? []} />

          <Section title={dm.sections.documentation}>
            {documents.length === 0 ? (
              <p className="text-sm text-muted">—</p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc} className="text-sm text-white/80">
                    {wizardOptionLabel(locale, "documents", doc)}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title={dm.sections.timeline}>
            <p className="text-sm text-white/80">
              {data.timeline
                ? wizardOptionLabel(locale, "timelines", data.timeline)
                : "—"}
            </p>
          </Section>

          <Section title={dm.sections.objectives}>
            {goals.length === 0 ? (
              <p className="text-sm text-muted">—</p>
            ) : (
              <ul className="space-y-2">
                {goals.map((id) => (
                  <li key={id} className="text-sm text-white/80">
                    {wizardOptionLabel(locale, "goals", id)}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {dossier.aiContent &&
            AI_SECTION_KEYS.map((key) => {
              const text = dossier.aiContent?.[key]?.trim();
              if (!text) return null;
              const title = dm.ai.sections[key] ?? key;
              return (
                <Section key={key} title={title}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                    {text}
                  </p>
                  {dossier.aiMeta && (
                    <p className="mt-3 text-[10px] uppercase tracking-wider text-white/30">
                      {dossier.aiMeta.provider === "template"
                        ? dm.ai.fallbackNotice
                        : `AI · ${dossier.aiMeta.provider}`}
                    </p>
                  )}
                </Section>
              );
            })}

          <div className="mt-12 text-center">
            <Link
              href="/wizard"
              className="inline-flex rounded-full bg-accent px-8 py-3 text-sm font-semibold text-void transition hover:bg-accent/90"
            >
              {dm.shared.evaluateCta}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-white/[0.06] py-8">
      <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted">
        {title}
      </h2>
      {children}
      <AiDisclaimer />
    </section>
  );
}
