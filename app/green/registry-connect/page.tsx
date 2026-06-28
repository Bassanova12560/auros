import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import { GREEN_REGISTRY_CONNECT_ROUTE } from "@/lib/green/constants";
import { listRegistryConnectSerials } from "@/lib/green/registry-connect";
import { metadataFromPath } from "@/lib/seo/metadata";

import { RegistryConnectLookup } from "./_components/RegistryConnectLookup";

export const REGISTRY_CONNECT_ROUTE = GREEN_REGISTRY_CONNECT_ROUTE;

export const metadata = metadataFromPath(REGISTRY_CONNECT_ROUTE);

const BASE = absoluteUrl("");
const DEMO_SERIALS = listRegistryConnectSerials();

const MATCH_TYPES = [
  { kind: "catalog", label: "Catalog", desc: "Mapping pilote AUROS — CQS calibré" },
  { kind: "live", label: "Live", desc: "Ingestion registre Verra / Gold Standard / Puro" },
  { kind: "inferred", label: "Inferred", desc: "Inférence depuis le format serial" },
];

export default function RegistryConnectPage() {
  return (
    <FocusPageShell path={REGISTRY_CONNECT_ROUTE} width="3xl">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            Registry Connect v1
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Serial Verra, Gold Standard ou Puro → CQS en une requête
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            Due diligence carbone automatisée : entrez un numéro de projet registre, recevez le
            Carbon Quality Score AUROS, Nature Score et lien registre officiel. Gratuit via l&apos;API
            Green.
          </p>
        </header>

        <RegistryConnectLookup demoSerials={DEMO_SERIALS} />

        <section className="grid gap-3 sm:grid-cols-3">
          {MATCH_TYPES.map((m) => (
            <div key={m.kind} className="card-flat px-4 py-3 text-center">
              <p className="font-mono text-xs uppercase tracking-wide text-emerald-400/80">
                {m.label}
              </p>
              <p className="mt-1 text-xs text-white/45">{m.desc}</p>
            </div>
          ))}
        </section>

        <details className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <summary className="cursor-pointer text-sm font-medium text-white/70">
            Exemples curl & batch API
          </summary>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-black/60 p-4 font-mono text-xs text-emerald-100/90">
{`curl "${BASE}/api/green/registry?serial=VCS-674"

curl -X POST ${BASE}/api/v1/green/carbon-quality/batch \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"serial":"VCS-674"},{"serial":"GS-5678"}]}'`}
          </pre>
        </details>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Catalog pilote ({DEMO_SERIALS.length} serials)
          </h2>
          <p className="mt-2 font-mono text-xs text-white/50">{DEMO_SERIALS.join(" · ")}</p>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={GREEN_API_DOCS_ROUTE}>Hub API Green</PrimaryButton>
          <Link
            href="/developers/docs/endpoint-green-carbon-quality"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Docs développeurs →
          </Link>
          <Link
            href="/data/nature-score"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Nature Score Index →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
