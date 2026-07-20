"use client";

import Link from "next/link";
import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { resolveCatalogLocale, type Locale } from "@/lib/i18n";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GreenApiPremiumCheckout } from "@/app/green/api/_components/GreenApiPremiumCheckout";
import { track } from "@/lib/analytics";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";

type RegistryApiSuccess = {
  ok: true;
  registry_connect: {
    match: string;
    provider: string;
    serial: string;
    project_name: string;
    country: string | null;
    vintage_year: number | null;
    compare_id: string | null;
    registry_urls: { project: string | null; retirements: string | null };
    scores: {
      carbon_quality: { score: number; tier: string };
      nature_score: { score: number; tier: string } | null;
      icvcm_readiness: { headline: string; status: string } | null;
    };
    methodology_note: string;
  };
  upsell?: { upgrade_url?: string; message?: string };
};

type Props = {
  demoSerials: string[];
};

const MATCH_LABELS: Record<string, { fr: string; en: string; es: string }> = {
  catalog: { fr: "Catalog", en: "Catalog", es: "Catálogo" },
  live: { fr: "Live", en: "Live", es: "Live" },
  inferred: { fr: "Inféré", en: "Inferred", es: "Inferido" },
  partial: { fr: "Partiel", en: "Partial", es: "Parcial" },
};

function copy(locale: Locale) {
  const loc = resolveCatalogLocale(locale);
  if (loc === "en") {
    return {
      title: "Look up a serial",
      hint: "VCS-674, GS-5678, PURO-1001 or paste a registry URL",
      placeholder: "VCS-674",
      cta: "Score this serial",
      loading: "Fetching registry…",
      demo: "Try a pilot serial",
      cqs: "Carbon Quality Score",
      nature: "Nature Score",
      icvcm: "ICVCM readiness",
      registry: "Official registry",
      retirements: "Retirements",
      compare: "AUROS compare",
      batchTitle: "Portfolio due diligence",
      batchBody: "Batch up to 50 serials with Green API Premium — same endpoint family.",
      disclaimer:
        "Indicative AUROS signals — verify retirement on the official registry before purchase.",
      errorGeneric: "Lookup unavailable — check the serial format.",
    };
  }
  if (loc === "es") {
    return {
      title: "Consultar un serial",
      hint: "VCS-674, GS-5678, PURO-1001 o pegue una URL del registro",
      placeholder: "VCS-674",
      cta: "Puntuar este serial",
      loading: "Consultando registro…",
      demo: "Probar un serial piloto",
      cqs: "Carbon Quality Score",
      nature: "Nature Score",
      icvcm: "Preparación ICVCM",
      registry: "Registro oficial",
      retirements: "Retiros",
      compare: "Comparador AUROS",
      batchTitle: "Due diligence de cartera",
      batchBody: "Batch hasta 50 seriales con Green API Premium.",
      disclaimer:
        "Señales AUROS indicativas — verifique el retiro en el registro oficial antes de comprar.",
      errorGeneric: "Consulta no disponible — compruebe el formato del serial.",
    };
  }
  return {
    title: "Rechercher un serial",
    hint: "VCS-674, GS-5678, PURO-1001 ou URL registre",
    placeholder: "VCS-674",
    cta: "Scorer ce serial",
    loading: "Interrogation registre…",
    demo: "Essayer un serial pilote",
    cqs: "Carbon Quality Score",
    nature: "Nature Score",
    icvcm: "Préparation ICVCM",
    registry: "Registre officiel",
    retirements: "Retraits",
    compare: "Comparateur AUROS",
    batchTitle: "Due diligence portefeuille",
    batchBody: "Batch jusqu'à 50 serials avec Green API Premium — même famille d'endpoints.",
    disclaimer:
      "Signaux AUROS indicatifs — vérifiez le retrait sur le registre officiel avant achat.",
    errorGeneric: "Lookup indisponible — vérifiez le format du serial.",
  };
}

export function RegistryConnectLookup({ demoSerials }: Props) {
  const { locale } = useLocale();
  const t = copy(locale);
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistryApiSuccess | null>(null);

  async function runLookup(querySerial?: string) {
    const q = (querySerial ?? serial).trim();
    if (!q) return;
    setSerial(q);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/green/registry?${new URLSearchParams({ serial: q })}`);
      const json = (await res.json()) as RegistryApiSuccess & {
        error?: { message?: string };
      };
      if (!res.ok || !json.ok) {
        setError(json.error?.message ?? t.errorGeneric);
        return;
      }
      setResult(json);
      track("registry_connect_lookup", {
        serial: q,
        match: json.registry_connect.match,
        provider: json.registry_connect.provider,
      });
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  const data = result?.registry_connect;
  const matchLabel = data
    ? (MATCH_LABELS[data.match]?.[resolveCatalogLocale(locale)] ?? data.match)
    : null;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6">
        <h2 className="text-sm font-medium text-white">{t.title}</h2>
        <p className="mt-1 text-xs text-white/45">{t.hint}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runLookup();
            }}
            placeholder={t.placeholder}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-sm text-white"
            aria-label={t.placeholder}
          />
          <PrimaryButton
            type="button"
            className="sm:!w-auto"
            disabled={loading || !serial.trim()}
            onClick={() => void runLookup()}
          >
            {loading ? t.loading : t.cta}
          </PrimaryButton>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-white/35">
          {t.demo}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {demoSerials.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => void runLookup(s)}
              className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-emerald-400/90 transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
            >
              {s}
            </button>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </section>

      {data ? (
        <section className="card-flat space-y-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-emerald-400">{data.serial}</p>
              <h3 className="mt-1 text-lg font-medium text-white">{data.project_name}</h3>
              <p className="mt-1 text-xs text-white/45">
                {[data.country, data.vintage_year ? String(data.vintage_year) : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-emerald-300">
              {matchLabel}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.06] p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">
                {t.cqs}
              </p>
              <p className="mt-2 font-mono text-3xl text-emerald-400">
                {data.scores.carbon_quality.score}
              </p>
              <p className="mt-1 text-xs capitalize text-white/45">
                {data.scores.carbon_quality.tier.replace("_", " ")}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">
                {t.nature}
              </p>
              {data.scores.nature_score ? (
                <>
                  <p className="mt-2 font-mono text-3xl text-emerald-400">
                    {data.scores.nature_score.score}
                  </p>
                  <p className="mt-1 text-xs capitalize text-white/45">
                    {data.scores.nature_score.tier.replace("_", " ")}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm text-white/35">—</p>
              )}
            </div>
            <div className="rounded-xl border border-white/[0.06] p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">
                {t.icvcm}
              </p>
              <p className="mt-3 text-sm text-white/70">
                {data.scores.icvcm_readiness?.headline ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {data.registry_urls.project ? (
              <a
                href={data.registry_urls.project}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400/90 hover:text-emerald-300"
              >
                {t.registry} →
              </a>
            ) : null}
            {data.registry_urls.retirements ? (
              <a
                href={data.registry_urls.retirements}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400/90 hover:text-emerald-300"
              >
                {t.retirements} →
              </a>
            ) : null}
            {data.compare_id ? (
              <Link href="/green/compare" className="text-sm text-emerald-400/90 hover:text-emerald-300">
                {t.compare} ({data.compare_id}) →
              </Link>
            ) : null}
          </div>

          <p className="text-xs leading-relaxed text-white/40">{data.methodology_note}</p>
          <p className="text-xs text-white/35">{t.disclaimer}</p>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-white">{t.batchTitle}</h2>
          <p className="mt-1 text-xs text-white/45">{t.batchBody}</p>
        </div>
        <GreenApiPremiumCheckout />
        <Link href={GREEN_API_DOCS_ROUTE} className="block text-center text-xs text-emerald-500/70">
          {GREEN_API_DOCS_ROUTE} →
        </Link>
      </section>
    </div>
  );
}
