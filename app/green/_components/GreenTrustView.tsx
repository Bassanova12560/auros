"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_ABOUT_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_ROUTE,
  GREEN_STANDARDS_ROUTE,
  GREEN_VERIFY_ROUTE,
} from "@/lib/green";
import { resolveCatalogLocale } from "@/lib/i18n";
import type { GreenProofMetrics } from "@/lib/green/proof-metrics";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "./green-ui";

type Props = {
  metrics: GreenProofMetrics;
};

const COPY = {
  fr: {
    eyebrow: "Confiance",
    title: "Ce que AUROS Green prouve — et ce qu’il ne prouve pas",
    intro:
      "Cinq blocs pour lire le produit sans greenwashing : méthode, tiers, registre, marché, limites.",
    blocks: [
      {
        title: "Méthode RTMS",
        body: "Réel · Transparent · Mesurable · Sain — pondération, documents, motifs de refus publiés.",
        href: GREEN_STANDARDS_ROUTE,
        cta: "Lire la méthodologie",
      },
      {
        title: "Tiers nommés",
        body: "Illustration, Pilote, Verified, En revue — jamais de badge implicite.",
        href: GREEN_STANDARDS_ROUTE,
        cta: "Voir les tiers",
      },
      {
        title: "Registre public",
        body: "Cas publiés avec label pilote ou verified et lien verify.",
        href: GREEN_REGISTRY_ROUTE,
        cta: "Ouvrir le registre",
      },
      {
        title: "Marché + verify",
        body: "Listings référencés ou verified ; preuves exportables via verify.",
        href: GREEN_MARKET_ROUTE,
        cta: "Place de marché",
      },
      {
        title: "Limites assumées",
        body: "Pas d’audit sur site, pas de courtage, pas de rendement garanti, pas de conseil MiCA automatique.",
        href: GREEN_ABOUT_ROUTE,
        cta: "Positionnement",
      },
    ],
    metricsTitle: "Compteurs vérifiables (pas de M€ inventés)",
    mRegistry: "Projets registre",
    mVerified: "Verified (registre)",
    mPilot: "Pilotes",
    mActors: "Acteurs marché",
    mMarketVerified: "Verified (marché)",
    mOffers: "Annonces",
    empty:
      "Aucun cas registre ni acteur référencé pour l’instant — les compteurs restent à zéro plutôt que d’afficher des chiffres marketing.",
    verify: "Vérifier une preuve",
    label: "Candidature label",
    disclaimer:
      "Indicateurs de surface produit uniquement. Aucune garantie de performance, liquidité ou conformité réglementaire.",
    back: "← Hub Green",
  },
  en: {
    eyebrow: "Trust",
    title: "What AUROS Green proves — and what it does not",
    intro:
      "Five blocks to read the product without greenwashing: method, tiers, registry, market, limits.",
    blocks: [
      {
        title: "RTMS method",
        body: "Real · Transparent · Measurable · Sound — published weights, docs, refusal grounds.",
        href: GREEN_STANDARDS_ROUTE,
        cta: "Read methodology",
      },
      {
        title: "Named tiers",
        body: "Illustration, Pilot, Verified, In review — never an implicit badge.",
        href: GREEN_STANDARDS_ROUTE,
        cta: "See tiers",
      },
      {
        title: "Public registry",
        body: "Published cases with pilot or verified label and verify link.",
        href: GREEN_REGISTRY_ROUTE,
        cta: "Open registry",
      },
      {
        title: "Market + verify",
        body: "Referenced or verified listings; exportable proofs via verify.",
        href: GREEN_MARKET_ROUTE,
        cta: "Marketplace",
      },
      {
        title: "Assumed limits",
        body: "No on-site audit, no brokerage, no guaranteed yield, no automatic MiCA advice.",
        href: GREEN_ABOUT_ROUTE,
        cta: "Positioning",
      },
    ],
    metricsTitle: "Verifiable counts (no invented €M)",
    mRegistry: "Registry projects",
    mVerified: "Verified (registry)",
    mPilot: "Pilots",
    mActors: "Market actors",
    mMarketVerified: "Verified (market)",
    mOffers: "Offers",
    empty:
      "No registry cases or referenced actors yet — counters stay at zero instead of marketing figures.",
    verify: "Verify a proof",
    label: "Label application",
    disclaimer:
      "Product surface metrics only. No performance, liquidity, or regulatory compliance guarantee.",
    back: "← Green hub",
  },
  es: {
    eyebrow: "Confianza",
    title: "Lo que AUROS Green demuestra — y lo que no",
    intro:
      "Cinco bloques para leer el producto sin greenwashing: método, niveles, registro, mercado, límites.",
    blocks: [
      {
        title: "Método RTMS",
        body: "Real · Transparente · Medible · Sano — pesos, docs y motivos de rechazo públicos.",
        href: GREEN_STANDARDS_ROUTE,
        cta: "Leer metodología",
      },
      {
        title: "Niveles nombrados",
        body: "Ilustración, Piloto, Verified, En revisión — nunca un sello implícito.",
        href: GREEN_STANDARDS_ROUTE,
        cta: "Ver niveles",
      },
      {
        title: "Registro público",
        body: "Casos publicados con sello piloto o verified y enlace verify.",
        href: GREEN_REGISTRY_ROUTE,
        cta: "Abrir registro",
      },
      {
        title: "Mercado + verify",
        body: "Listings referenciados o verified; pruebas exportables vía verify.",
        href: GREEN_MARKET_ROUTE,
        cta: "Marketplace",
      },
      {
        title: "Límites asumidos",
        body: "Sin auditoría in situ, sin corretaje, sin rentabilidad garantizada, sin dictamen MiCA automático.",
        href: GREEN_ABOUT_ROUTE,
        cta: "Posicionamiento",
      },
    ],
    metricsTitle: "Contadores verificables (sin M€ inventados)",
    mRegistry: "Proyectos registro",
    mVerified: "Verified (registro)",
    mPilot: "Pilotos",
    mActors: "Actores mercado",
    mMarketVerified: "Verified (mercado)",
    mOffers: "Anuncios",
    empty:
      "Sin casos de registro ni actores referenciados aún — los contadores quedan en cero en lugar de cifras de marketing.",
    verify: "Verificar una prueba",
    label: "Candidatura label",
    disclaimer:
      "Solo métricas de superficie de producto. Sin garantía de rendimiento, liquidez o cumplimiento regulatorio.",
    back: "← Hub Green",
  },
} as const;

export function GreenTrustView({ metrics }: Props) {
  const { locale } = useLocale();
  const c = COPY[resolveCatalogLocale(locale)] ?? COPY.fr;

  const tiles = [
    { label: c.mRegistry, value: metrics.registryProjects },
    { label: c.mVerified, value: metrics.registryVerified },
    { label: c.mPilot, value: metrics.registryPilot },
    { label: c.mActors, value: metrics.marketActors },
    { label: c.mMarketVerified, value: metrics.marketVerified },
    { label: c.mOffers, value: metrics.marketOffers },
  ];

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} compact />

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {c.blocks.map((block) => (
          <GreenPanel key={block.title}>
            <div className="flex h-full flex-col p-6 md:p-7">
              <h2 className="font-display text-lg font-semibold text-emerald-400">
                {block.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">
                {block.body}
              </p>
              <Link
                href={block.href}
                className="mt-5 font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
              >
                {block.cta} →
              </Link>
            </div>
          </GreenPanel>
        ))}
      </section>

      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{c.metricsTitle}</GreenSectionTitle>
          {!metrics.hasRealSurface ? (
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">{c.empty}</p>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className="border border-white/[0.08] bg-black/40 px-4 py-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {tile.label}
                </p>
                <p className="mt-2 font-display text-2xl tabular-nums text-white">
                  {tile.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={GREEN_VERIFY_ROUTE}
              className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
            >
              {c.verify} →
            </Link>
            <Link
              href={GREEN_LABEL_ROUTE}
              className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              {c.label} →
            </Link>
          </div>
        </div>
      </GreenPanel>

      <GreenDisclaimer>{c.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{c.back}</GreenBackLink>
    </div>
  );
}
