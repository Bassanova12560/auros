import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { absoluteUrl } from "@/lib/comparators/site";
import {
  DATA_LICENCE_ROUTE,
  DATA_TERMINAL_ROUTE,
  TERMINAL_SAMPLE_IDS,
} from "@/lib/data-terminal/constants";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import {
  GREEN_API_PREMIUM_MONTHLY_EUR,
  greenApiPremiumDescription,
} from "@/lib/green/green-api-pricing";
import {
  formatGreenEditionLabel,
  getGreenIndexPayload,
  GREEN_INDEX_ROUTE,
} from "@/lib/green-index";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(DATA_TERMINAL_ROUTE),
  title: "AUROS Green Data Terminal",
  description:
    "Terminal data Green RWA — Index, CQS, Watt, H₂O. API Premium 299 €/mo.",
};

export const revalidate = 3600;

type SampleScore = {
  id: string;
  label: string;
  path: string;
  score: number | string | null;
  detail: string;
};

function nestedNumber(
  json: Record<string, unknown> | null,
  ...keys: string[]
): number | null {
  if (!json) return null;
  let cur: unknown = json;
  for (const key of keys) {
    if (!cur || typeof cur !== "object") return null;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "number" ? cur : null;
}

async function fetchSample(
  path: string
): Promise<{ ok: boolean; json: Record<string, unknown> | null }> {
  try {
    const res = await fetch(absoluteUrl(path), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { ok: false, json: null };
    return { ok: true, json: (await res.json()) as Record<string, unknown> };
  } catch {
    return { ok: false, json: null };
  }
}

export default async function DataTerminalPage() {
  const index = await getGreenIndexPayload();
  const top = index.entries.slice(0, 8);
  const editionLabel = formatGreenEditionLabel(index.editionIso, "fr");

  const [cqsRes, wattRes, h2oRes] = await Promise.all([
    fetchSample(`/api/green/carbon-quality/${TERMINAL_SAMPLE_IDS.cqs}`),
    fetchSample(`/api/green/watt/${TERMINAL_SAMPLE_IDS.watt}`),
    fetchSample(`/api/green/h2o/${TERMINAL_SAMPLE_IDS.h2o}`),
  ]);

  const samples: SampleScore[] = [
    {
      id: TERMINAL_SAMPLE_IDS.cqs,
      label: "Carbon Quality Score",
      path: `/api/green/carbon-quality/${TERMINAL_SAMPLE_IDS.cqs}`,
      score: nestedNumber(cqsRes.json, "carbon_quality", "score"),
      detail: "CQS · toucan",
    },
    {
      id: TERMINAL_SAMPLE_IDS.watt,
      label: "Watt Score",
      path: `/api/green/watt/${TERMINAL_SAMPLE_IDS.watt}`,
      score: nestedNumber(wattRes.json, "watt_score", "rating"),
      detail: "Watt · sunexchange",
    },
    {
      id: TERMINAL_SAMPLE_IDS.h2o,
      label: "H₂O Score",
      path: `/api/green/h2o/${TERMINAL_SAMPLE_IDS.h2o}`,
      score: nestedNumber(h2oRes.json, "h2o_score", "rating"),
      detail: "H₂O · pilot-concession-france",
    },
  ];

  return (
    <FocusPageShell path={DATA_TERMINAL_ROUTE} width="3xl">
      <div className="space-y-14 md:space-y-16">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            Green Data Terminal
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Index · CQS · Watt · H₂O
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            Une surface unique pour lire les scores Green RWA et brancher l’API.
            Édition index {editionLabel}.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <PrimaryButton href={`${GREEN_API_DOCS_ROUTE}#premium`}>
              API Premium — {GREEN_API_PREMIUM_MONTHLY_EUR} €/mo
            </PrimaryButton>
            <Link
              href={DATA_LICENCE_ROUTE}
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30"
            >
              Licence data →
            </Link>
          </div>
          <p className="mx-auto max-w-lg font-mono text-[11px] text-white/40">
            {greenApiPremiumDescription("fr")}
          </p>
        </header>

        <section aria-labelledby="terminal-samples">
          <h2
            id="terminal-samples"
            className="font-mono text-[11px] tracking-wide text-white/45"
          >
            Live samples
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {samples.map((s) => (
              <div key={s.id} className="card-flat px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-wide text-white/35">
                  {s.label}
                </p>
                <p className="mt-2 font-display text-3xl font-medium text-white">
                  {s.score ?? "—"}
                </p>
                <p className="mt-1 font-mono text-[10px] text-white/40">{s.detail}</p>
                <code className="mt-3 block truncate font-mono text-[10px] text-emerald-400/70">
                  GET {s.path}
                </code>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="terminal-index">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2
              id="terminal-index"
              className="font-mono text-[11px] tracking-wide text-white/45"
            >
              Green Index — top {top.length}
            </h2>
            <Link
              href={GREEN_INDEX_ROUTE}
              className="font-mono text-[10px] uppercase tracking-wider text-white/45 hover:text-white/70"
            >
              Full index →
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-500/20">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-emerald-500/30 font-mono text-[10px] uppercase tracking-wide text-emerald-500/80">
                  <th className="px-4 py-3 font-normal">#</th>
                  <th className="px-4 py-3 font-normal">Name</th>
                  <th className="px-4 py-3 font-normal">Composite</th>
                  <th className="px-4 py-3 font-normal">CQS</th>
                  <th className="px-4 py-3 font-normal">Watt</th>
                </tr>
              </thead>
              <tbody>
                {top.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/[0.04] text-white/70 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-emerald-400">{row.rank}</td>
                    <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-emerald-400">
                      {row.composite_score}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {row.carbon_quality_score ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {row.watt_score ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-wrap justify-center gap-3 border-t border-white/[0.06] pt-10">
          <Link
            href={GREEN_API_DOCS_ROUTE}
            className="font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white/80"
          >
            Green API docs
          </Link>
          <span className="text-white/20">·</span>
          <Link
            href="/api/green/changelog"
            className="font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white/80"
          >
            Changelog JSON
          </Link>
          <span className="text-white/20">·</span>
          <Link
            href="/eau"
            className="font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white/80"
          >
            H₂O hub
          </Link>
          <span className="text-white/20">·</span>
          <Link
            href="/green/chargeflow"
            className="font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white/80"
          >
            ChargeFlow CFU-E
          </Link>
        </section>
      </div>
    </FocusPageShell>
  );
}
