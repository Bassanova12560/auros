import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api";
import { listRegistryConnectSerials } from "@/lib/green/registry-connect";
import { metadataFromPath } from "@/lib/seo/metadata";

export const REGISTRY_CONNECT_ROUTE = "/green/registry-connect";

export const metadata = metadataFromPath(REGISTRY_CONNECT_ROUTE);

const BASE = absoluteUrl("");
const DEMO_SERIALS = listRegistryConnectSerials();

export default function RegistryConnectPage() {
  return (
    <FocusPageShell path={REGISTRY_CONNECT_ROUTE} width="3xl">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            Registry Connect v0
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Serial Verra ou Gold Standard → CQS en une requête
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            Due diligence carbone automatisée : entrez un numéro de projet registre, recevez le
            Carbon Quality Score AUROS, Nature Score et lien registre officiel. Gratuit via l&apos;API
            Green.
          </p>
        </header>

        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <h2 className="text-sm font-medium text-white">Essayer maintenant</h2>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-black/60 p-4 font-mono text-xs text-emerald-100/90">
{`# Verra VCS
curl "${BASE}/api/green/registry?serial=VCS-674"

# Gold Standard
curl "${BASE}/api/green/registry?registry=gold_standard&serial=1234"

# Batch portfolio (clé API)
curl -X POST ${BASE}/api/v1/green/carbon-quality/batch \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"serial":"VCS-674"},{"serial":"GS-5678"}]}'`}
          </pre>
        </section>

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-white/45">
            Catalog pilote ({DEMO_SERIALS.length} serials)
          </h2>
          <p className="mt-2 font-mono text-xs text-white/50">{DEMO_SERIALS.join(" · ")}</p>
          <p className="mt-2 text-xs text-white/40">
            Les serials hors catalog sont scorés par inférence registre — v1 ajoutera ingestion
            live Verra/GS.
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={GREEN_API_DOCS_ROUTE}>Hub API Green</PrimaryButton>
          <Link
            href="/developers/docs/endpoint-green-carbon-quality"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Docs développeurs →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
