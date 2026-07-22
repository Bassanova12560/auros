"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_LABEL_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_ROUTE,
  GREEN_TRUST_ROUTE,
} from "@/lib/green";
import { resolveCatalogLocale } from "@/lib/i18n";
import type { GreenPortfolioSnapshot } from "@/lib/green/portfolio-types";
import { greenMarketActorPath } from "@/lib/green/market/actor-routes";
import { GREEN_REGISTRY_PROJECT_ROUTE } from "@/lib/green/constants";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "./green-ui";
import { PortfolioWatchlistForm } from "./PortfolioWatchlistForm";

type Props = {
  snapshot: GreenPortfolioSnapshot;
};

const COPY = {
  fr: {
    eyebrow: "Portfolio Console",
    title: "Vue institutionnelle des actifs DNA",
    intro:
      "Registre + marché reliés à Asset DNA et Proof Stream — lecture indicative, pas un portefeuille réglementé.",
    kpis: {
      dna: "Asset DNA",
      live: "Avec événements récents",
      registry: "Registre",
      market: "Marché",
    },
    actionsTitle: "Dernières actions (heatmap)",
    alertsTitle: "Alertes portefeuille",
    alertsEmpty: "Aucune alerte — flux et tiers dans les seuils.",
    tableTitle: "Actifs suivis",
    empty:
      "Aucun Asset DNA encore. Référencez un acteur ou publiez un label pour peupler la console.",
    cols: {
      name: "Actif",
      source: "Source",
      tier: "Tier",
      last: "Dernier événement",
      dna: "DNA",
    },
    source: {
      registry: "Registre",
      market: "Marché",
      dna_only: "DNA seul",
    },
    ctaRegister: "Référencer un acteur",
    ctaLabel: "Candidature label",
    ctaTrust: "Trust Green",
    ctaRegistry: "Registre",
    disclaimer:
      "Console v1 — agrégation technique. Pas de conseil d’investissement, pas de garantie de liquidité.",
    back: "← Hub Green",
    api: "API JSON",
  },
  en: {
    eyebrow: "Portfolio Console",
    title: "Institutional view of DNA assets",
    intro:
      "Registry + market linked to Asset DNA and Proof Stream — indicative read, not a regulated portfolio.",
    kpis: {
      dna: "Asset DNA",
      live: "With recent events",
      registry: "Registry",
      market: "Market",
    },
    actionsTitle: "Latest actions (heatmap)",
    alertsTitle: "Portfolio alerts",
    alertsEmpty: "No alerts — streams and tiers within thresholds.",
    tableTitle: "Tracked assets",
    empty:
      "No Asset DNA yet. Register an actor or publish a label to populate the console.",
    cols: {
      name: "Asset",
      source: "Source",
      tier: "Tier",
      last: "Last event",
      dna: "DNA",
    },
    source: {
      registry: "Registry",
      market: "Market",
      dna_only: "DNA only",
    },
    ctaRegister: "Register an actor",
    ctaLabel: "Label application",
    ctaTrust: "Green Trust",
    ctaRegistry: "Registry",
    disclaimer:
      "Console v1 — technical aggregation. Not investment advice, no liquidity guarantee.",
    back: "← Green hub",
    api: "JSON API",
  },
  es: {
    eyebrow: "Portfolio Console",
    title: "Vista institucional de activos DNA",
    intro:
      "Registro + mercado ligados a Asset DNA y Proof Stream — lectura indicativa, no un portafolio regulado.",
    kpis: {
      dna: "Asset DNA",
      live: "Con eventos recientes",
      registry: "Registro",
      market: "Mercado",
    },
    actionsTitle: "Últimas acciones (heatmap)",
    alertsTitle: "Alertas de portafolio",
    alertsEmpty: "Sin alertas — flujos y niveles dentro de umbrales.",
    tableTitle: "Activos seguidos",
    empty:
      "Aún no hay Asset DNA. Registre un actor o publique un label para poblar la consola.",
    cols: {
      name: "Activo",
      source: "Fuente",
      tier: "Nivel",
      last: "Último evento",
      dna: "DNA",
    },
    source: {
      registry: "Registro",
      market: "Mercado",
      dna_only: "Solo DNA",
    },
    ctaRegister: "Registrar actor",
    ctaLabel: "Candidatura label",
    ctaTrust: "Trust Green",
    ctaRegistry: "Registro",
    disclaimer:
      "Consola v1 — agregación técnica. Sin consejo de inversión ni garantía de liquidez.",
    back: "← Hub Green",
    api: "API JSON",
  },
} as const;

function formatWhen(iso: string | undefined, locale: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(
      locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR",
      { dateStyle: "short", timeStyle: "short" }
    );
  } catch {
    return iso;
  }
}

export function GreenPortfolioView({ snapshot }: Props) {
  const { locale } = useLocale();
  const c = COPY[resolveCatalogLocale(locale)] ?? COPY.fr;
  const actionEntries = Object.entries(snapshot.byLastAction).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} compact />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: c.kpis.dna, value: snapshot.totalDna },
          { label: c.kpis.live, value: snapshot.withRecentEvents },
          { label: c.kpis.registry, value: snapshot.bySource.registry },
          { label: c.kpis.market, value: snapshot.bySource.market },
        ].map((tile) => (
          <GreenPanel key={tile.label}>
            <div className="px-4 py-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {tile.label}
              </p>
              <p className="mt-2 font-display text-2xl tabular-nums text-white">
                {tile.value}
              </p>
            </div>
          </GreenPanel>
        ))}
      </div>

      <GreenPanel className="mt-6">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>{c.actionsTitle}</GreenSectionTitle>
          {actionEntries.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">—</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {actionEntries.map(([action, count]) => (
                <li
                  key={action}
                  className="border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300/90"
                >
                  {action} · {count}
                </li>
              ))}
            </ul>
          )}
        </div>
      </GreenPanel>

      <GreenPanel className="mt-4">
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <GreenSectionTitle>{c.alertsTitle}</GreenSectionTitle>
            <span className="font-mono text-[10px] tabular-nums text-white/40">
              {snapshot.alertCount}
            </span>
          </div>
          {snapshot.alerts.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">{c.alertsEmpty}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {snapshot.alerts.slice(0, 20).map((alert) => {
                const tone =
                  alert.severity === "critical"
                    ? "border-red-500/40 text-red-300/90"
                    : alert.severity === "warn"
                      ? "border-amber-500/35 text-amber-200/85"
                      : "border-white/15 text-white/55";
                return (
                  <li
                    key={alert.id}
                    className={`border bg-black/40 px-3 py-2 text-sm ${tone}`}
                  >
                    <p className="font-medium text-white/90">{alert.displayName}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed opacity-90">
                      {alert.message}
                    </p>
                    <a
                      href={`/api/v1/asset-dna/${encodeURIComponent(alert.assetDnaId)}/stream`}
                      className="mt-1 inline-block font-mono text-[10px] uppercase tracking-wider text-emerald-400/70 hover:text-emerald-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      stream →
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </GreenPanel>

      <GreenPanel className="mt-4">
        <PortfolioWatchlistForm
          assets={snapshot.assets.map((a) => ({
            assetDnaId: a.assetDnaId,
            displayName: a.displayName,
            country: a.country,
          }))}
        />
      </GreenPanel>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <GreenSectionTitle>{c.tableTitle}</GreenSectionTitle>
          <a
            href="/api/v1/green/portfolio"
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/65"
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.api} →
          </a>
        </div>

        {snapshot.assets.length === 0 ? (
          <GreenPanel className="mt-4">
            <div className="p-6">
              <p className="text-sm leading-relaxed text-neutral-400">{c.empty}</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  href={GREEN_REGISTER_ROUTE}
                  className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
                >
                  {c.ctaRegister} →
                </Link>
                <Link
                  href={GREEN_LABEL_ROUTE}
                  className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
                >
                  {c.ctaLabel} →
                </Link>
              </div>
            </div>
          </GreenPanel>
        ) : (
          <div className="mt-4 overflow-x-auto border border-white/[0.08]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/[0.08] bg-black/40 font-mono text-[10px] uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-4 py-3 font-normal">{c.cols.name}</th>
                  <th className="px-4 py-3 font-normal">{c.cols.source}</th>
                  <th className="px-4 py-3 font-normal">{c.cols.tier}</th>
                  <th className="px-4 py-3 font-normal">{c.cols.last}</th>
                  <th className="px-4 py-3 font-normal">{c.cols.dna}</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.assets.map((row) => {
                  const href =
                    row.source === "registry" && row.sourceId
                      ? `${GREEN_REGISTRY_PROJECT_ROUTE}/${encodeURIComponent(row.sourceId)}`
                      : row.source === "market" && row.sourceId
                        ? greenMarketActorPath(row.sourceId)
                        : `/api/v1/asset-dna/${encodeURIComponent(row.assetDnaId)}`;
                  return (
                    <tr
                      key={row.assetDnaId}
                      className="border-b border-white/[0.06] bg-[#0a0f0d]/hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <Link href={href} className="text-white hover:text-emerald-300">
                          {row.displayName}
                        </Link>
                        <p className="mt-0.5 font-mono text-[10px] text-white/35">
                          {row.country} · {row.assetClass}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {c.source[row.source]}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-white/55">
                        {row.labelTier || row.listingTier || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-[10px] text-emerald-400/80">
                          {row.lastAction ?? "—"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/35">
                          {formatWhen(row.lastEventAt, locale)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/api/v1/asset-dna/${encodeURIComponent(row.assetDnaId)}/stream`}
                          className="break-all font-mono text-[10px] text-emerald-300/80 hover:text-emerald-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          stream →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={GREEN_TRUST_ROUTE}
          className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
        >
          {c.ctaTrust} →
        </Link>
        <Link
          href={GREEN_REGISTRY_ROUTE}
          className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
        >
          {c.ctaRegistry} →
        </Link>
      </div>

      <GreenDisclaimer>{c.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{c.back}</GreenBackLink>
    </div>
  );
}
