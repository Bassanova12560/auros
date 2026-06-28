import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api";
import { GREEN_PRESS_ROUTE } from "@/lib/green/constants";
import { GREEN_API_PREMIUM_MONTHLY_EUR } from "@/lib/green/green-api-pricing";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata = metadataFromPath(GREEN_PRESS_ROUTE);

const BASE = absoluteUrl("");

const FACTS = [
  { label: "API publique", value: "CQS · Watt · Nature Score · Registry Connect" },
  { label: "Gratuit", value: "100 req/jour/IP · 1 000 req/mois avec clé free" },
  { label: "Premium", value: `${GREEN_API_PREMIUM_MONTHLY_EUR} €/mois · 25k req · batch 50` },
  { label: "Indices", value: "Green Index · Nature Score · UHI" },
];

export default function GreenPressPage() {
  return (
    <FocusPageShell path={GREEN_PRESS_ROUTE} width="3xl">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            Presse &amp; analystes
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Kit média AUROS Green
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            Citations, embeds et feeds pour couvrir le standard Green API — données indicatives,
            pas conseil en investissement.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.label} className="card-flat px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wide text-emerald-400/70">
                {f.label}
              </p>
              <p className="mt-1 text-sm text-white/75">{f.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <h2 className="text-sm font-medium text-white">Citation recommandée</h2>
          <blockquote className="mt-3 border-l-2 border-emerald-500/40 pl-4 text-sm italic text-white/70">
            « AUROS Green API, getauros.com/green/api — édition [mois année]. Carbon Quality Score
            indicatif pour actifs climatiques tokenisés. »
          </blockquote>
          <p className="mt-3 font-mono text-xs text-white/40">
            Contact presse : contact@getauros.com
          </p>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Feeds &amp; données
          </h2>
          <ul className="mt-4 space-y-2 font-mono text-xs text-white/60">
            <li>
              <a href={`${BASE}/api/green/changelog/rss`} className="text-emerald-400 hover:underline">
                RSS movers Green Index
              </a>
            </li>
            <li>
              <a href={`${BASE}/data/green-index`} className="text-emerald-400 hover:underline">
                Green Index (CSV)
              </a>
            </li>
            <li>
              <a href={`${BASE}/data/nature-score`} className="text-emerald-400 hover:underline">
                Nature Score Index
              </a>
            </li>
            <li>
              <a href={`${BASE}/api/green/status`} className="text-emerald-400 hover:underline">
                Statut API JSON
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Widget embed (1 ligne)
          </h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-white/70">
{`<script src="${BASE}/green-score.js" defer></script>
<div data-auros-green-score data-id="toucan" data-theme="dark"></div>`}
          </pre>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href="/green/blog/green-api-standard-ouvert-2026">
            Communiqué officiel
          </PrimaryButton>
          <Link
            href={GREEN_API_DOCS_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Hub API →
          </Link>
          <Link
            href="/green/registry-connect"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Registry Connect →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
