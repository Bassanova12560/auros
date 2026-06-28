"use client";

import Link from "next/link";
import { useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { track } from "@/lib/analytics";
import { getGreenDppCopy } from "@/lib/green/dpp-i18n";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";

type DppApiSuccess = {
  ok: true;
  dpp: {
    name: string;
    identifier: string;
    sustainabilityInformation: {
      aurosGreenComposite: number;
      aurosCqs: number | null;
      aurosWatt: number | null;
      aurosNatureScore: number | null;
      euTaxonomyAlignment: number | null;
    };
    disclaimer: string;
  };
};

type Props = {
  demoIds: string[];
};

function formatScore(value: number | null): string {
  return value == null ? "—" : String(value);
}

export function DppBridgeLookup({ demoIds }: Props) {
  const { locale } = useLocale();
  const t = getGreenDppCopy(locale);
  const [catalogId, setCatalogId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DppApiSuccess | null>(null);

  async function runLookup(id?: string) {
    const q = (id ?? catalogId).trim().toLowerCase();
    if (!q) return;
    setCatalogId(q);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/green/dpp/${encodeURIComponent(q)}`);
      const json = (await res.json()) as DppApiSuccess & { error?: { message?: string } };
      if (!res.ok || !json.ok) {
        setError(json.error?.message ?? t.errorGeneric);
        return;
      }
      setResult(json);
      track("dpp_bridge_lookup", { id: q });
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  const info = result?.dpp.sustainabilityInformation;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6">
        <h2 className="text-sm font-medium text-white">{t.lookupTitle}</h2>
        <p className="mt-1 text-xs text-white/45">{t.lookupHint}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={catalogId}
            onChange={(e) => setCatalogId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runLookup();
            }}
            placeholder={t.placeholder}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-sm text-white"
          />
          <PrimaryButton
            type="button"
            className="sm:!w-auto"
            disabled={loading || !catalogId.trim()}
            onClick={() => void runLookup()}
          >
            {loading ? t.loading : t.cta}
          </PrimaryButton>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-white/35">
          {t.demo}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {demoIds.map((id) => (
            <button
              key={id}
              type="button"
              disabled={loading}
              onClick={() => void runLookup(id)}
              className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-emerald-400/90 transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
            >
              {id}
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </section>

      {result && info ? (
        <section className="card-flat space-y-6 p-6">
          <div>
            <p className="font-mono text-xs text-emerald-400">{result.dpp.identifier}</p>
            <h3 className="mt-1 text-lg font-medium text-white">{result.dpp.name}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: t.composite, value: info.aurosGreenComposite },
              { label: t.cqs, value: info.aurosCqs },
              { label: t.watt, value: info.aurosWatt },
              { label: t.nature, value: info.aurosNatureScore },
              { label: t.taxonomy, value: info.euTaxonomyAlignment },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.06] p-4 text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">
                  {item.label}
                </p>
                <p className="mt-2 font-mono text-2xl text-emerald-400">
                  {formatScore(item.value)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`/api/green/dpp/${encodeURIComponent(result.dpp.identifier)}?format=jsonld`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400/90 hover:text-emerald-300"
            >
              {t.jsonLd} →
            </a>
            <Link
              href={GREEN_API_DOCS_ROUTE}
              className="text-sm text-emerald-400/90 hover:text-emerald-300"
            >
              {t.apiDocs} →
            </Link>
          </div>
          <p className="text-xs text-white/35">{result.dpp.disclaimer}</p>
        </section>
      ) : null}
    </div>
  );
}
