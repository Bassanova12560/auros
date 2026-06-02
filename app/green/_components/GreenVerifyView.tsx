"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type {
  GreenRegistryExpertRow,
  GreenRegistryProjectRow,
} from "@/lib/green/green-registry";
import {
  GREEN_REGISTRY_ROUTE,
  greenProjectSummary,
  getGreenMessages,
} from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenFieldLabel,
  GreenPageHeader,
  GreenPanel,
  GreenTierBadge,
} from "./green-ui";

type Props = {
  project: GreenRegistryProjectRow | null;
  expert: GreenRegistryExpertRow | null;
};

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(
      locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch {
    return iso;
  }
}

export function GreenVerifyView({ project, expert }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const v = m.verify;
  const c = m.compare;
  const r = m.registry;

  if (!project && !expert) {
    return (
      <div className="page-inner page-inner--2xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <p className="text-sm text-neutral-400">{v.notFound}</p>
        <GreenBackLink href={GREEN_REGISTRY_ROUTE}>{v.backLink}</GreenBackLink>
      </div>
    );
  }

  if (project) {
    return (
      <div className="page-inner page-inner--2xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <header className="max-w-2xl border-l-2 border-emerald-500 pl-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-emerald-500">
            {v.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-400">
            {v.projectLabel}
          </h1>
          <p className="mt-3 font-display text-xl text-neutral-200">{project.name}</p>
          <div className="mt-4">
            <GreenTierBadge
              tier={project.labelTier}
              verifiedLabel={r.tierVerified}
              pilotLabel={r.tierPilot}
            />
          </div>
        </header>

        <GreenPanel className="mt-10">
          <div className="space-y-4 p-6 md:p-8 text-sm">
            <p>
              <GreenFieldLabel>{v.certifiedAt}</GreenFieldLabel>
              <span className="mt-1 block text-neutral-300">
                {formatDate(project.certifiedAt, locale)}
              </span>
            </p>
            <p>
              <GreenFieldLabel>{v.country}</GreenFieldLabel>
              <span className="mt-1 block text-neutral-300">{project.country}</span>
            </p>
            <p>
              <GreenFieldLabel>{v.type}</GreenFieldLabel>
              <span className="mt-1 block text-neutral-300">
                {c.projectTypes[project.projectType]}
              </span>
            </p>
            <div>
              <GreenFieldLabel>{v.summary}</GreenFieldLabel>
              <p className="mt-2 leading-relaxed text-neutral-400">
                {greenProjectSummary(project, locale)}
              </p>
            </div>
          </div>
        </GreenPanel>

        {project.labelTier === "pilot" ? (
          <p className="mt-6 max-w-2xl text-xs text-neutral-500">{v.pilotDisclaimer}</p>
        ) : null}

        <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
        <GreenBackLink href={GREEN_REGISTRY_ROUTE}>{v.backLink}</GreenBackLink>
      </div>
    );
  }

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <header className="max-w-2xl border-l-2 border-emerald-500 pl-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-emerald-500">
          {v.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-400">
          {v.expertLabel}
        </h1>
        <p className="mt-3 font-display text-xl text-neutral-200">{expert!.displayName}</p>
      </header>
      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8 text-sm text-neutral-300">
          <p>
            {v.certifiedAt}: {formatDate(expert!.certifiedAt, locale)}
          </p>
          {expert!.specialty ? <p className="mt-2 text-neutral-400">{expert!.specialty}</p> : null}
        </div>
      </GreenPanel>
      <GreenBackLink href={GREEN_REGISTRY_ROUTE}>{v.backLink}</GreenBackLink>
    </div>
  );
}
