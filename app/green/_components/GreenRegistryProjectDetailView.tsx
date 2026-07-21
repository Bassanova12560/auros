"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import type { GreenRegistryProjectRow } from "@/lib/green/green-registry";
import {
  GREEN_REGISTRY_ROUTE,
  greenProjectSummary,
  greenVerifyPath,
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
import { AssetDnaBadge } from "./AssetDnaBadge";

type Props = {
  project: GreenRegistryProjectRow;
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

export function GreenRegistryProjectDetailView({ project }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const r = m.registry;
  const pd = r.projectDetail;
  const c = m.compare;
  const summary = greenProjectSummary(project, locale);

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader
        eyebrow={pd.eyebrow}
        title={project.name}
        intro={pd.intro}
        compact
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <GreenTierBadge
          tier={project.labelTier}
          verifiedLabel={r.tierVerified}
          pilotLabel={r.tierPilot}
        />
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
          {c.projectTypes[project.projectType]}
        </span>
      </div>

      <GreenPanel className="mt-8">
        <div className="space-y-5 p-6 md:p-8 text-sm">
          <div>
            <GreenFieldLabel>{pd.locationTitle}</GreenFieldLabel>
            <p className="mt-1 text-neutral-300">{project.country}</p>
          </div>
          <div>
            <GreenFieldLabel>{pd.statusTitle}</GreenFieldLabel>
            <p className="mt-1 text-neutral-300">
              {project.labelTier === "verified" ? r.tierVerified : r.tierPilot}
            </p>
          </div>
          <div>
            <GreenFieldLabel>{pd.rtmsTierTitle}</GreenFieldLabel>
            <p className="mt-1 text-neutral-400">{pd.rtmsTierBody(project.labelTier)}</p>
          </div>
          <div>
            <GreenFieldLabel>{pd.certifiedAtTitle}</GreenFieldLabel>
            <p className="mt-1 text-neutral-300">
              {formatDate(project.certifiedAt, locale)}
            </p>
          </div>
          <div>
            <GreenFieldLabel>{pd.descriptionTitle}</GreenFieldLabel>
            <p className="mt-2 leading-relaxed text-neutral-400">{summary}</p>
          </div>
          <div className="border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
            <GreenFieldLabel>
              {locale === "en"
                ? "Mini case study"
                : locale === "es"
                  ? "Mini caso de estudio"
                  : "Mini étude de cas"}
            </GreenFieldLabel>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li>
                <span className="text-neutral-500">
                  {locale === "en" ? "Asset" : locale === "es" ? "Activo" : "Actif"} —{" "}
                </span>
                {c.projectTypes[project.projectType]} · {project.country}
              </li>
              <li>
                <span className="text-neutral-500">
                  {locale === "en" ? "Proof tier" : locale === "es" ? "Nivel de prueba" : "Tier de preuve"} —{" "}
                </span>
                {project.labelTier === "verified" ? r.tierVerified : r.tierPilot}
              </li>
              <li>
                <span className="text-neutral-500">
                  {locale === "en" ? "Outcome" : locale === "es" ? "Resultado" : "Résultat"} —{" "}
                </span>
                {summary}
              </li>
              <li>
                <span className="text-neutral-500">
                  {locale === "en" ? "Verify" : locale === "es" ? "Verificar" : "Vérifier"} —{" "}
                </span>
                {locale === "en"
                  ? "Public proof link below (hash / token)."
                  : locale === "es"
                    ? "Enlace de prueba pública abajo (hash / token)."
                    : "Lien de preuve public ci-dessous (hash / token)."}
              </li>
            </ul>
          </div>
          {project.website ? (
            <div>
              <GreenFieldLabel>{pd.websiteTitle}</GreenFieldLabel>
              <p className="mt-1">
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400"
                >
                  {project.website.replace(/^https?:\/\//, "")}
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </GreenPanel>

      {project.assetDnaId ? <AssetDnaBadge assetDnaId={project.assetDnaId} /> : null}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={greenVerifyPath(project.verifyToken)}
          className="rounded-lg border border-emerald-500/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400"
        >
          {pd.verifyCta} →
        </Link>
      </div>

      {project.labelTier === "pilot" ? (
        <p className="mt-6 text-xs leading-relaxed text-neutral-600">{r.pilotNote}</p>
      ) : null}

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_REGISTRY_ROUTE}>{pd.backLink}</GreenBackLink>
    </div>
  );
}
