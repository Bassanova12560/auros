import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { metadataFromPath } from "@/lib/seo/metadata";
import { FREE_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";
import { getUsageStats, findKeyHashByEmail } from "@/lib/protocol/usage/log";
import { validateApiKey, findKeyRecord } from "@/lib/protocol/auth/keys";

export const DEVELOPERS_DASHBOARD_ROUTE = "/developers/dashboard";

export const metadata = metadataFromPath(DEVELOPERS_DASHBOARD_ROUTE);

type SearchParams = Promise<{ email?: string; key?: string }>;

export default async function DevelopersDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase();
  const rawKey = params.key?.trim();

  let keyHash: string | null = null;
  let tier = "free";
  let error: string | null = null;

  if (rawKey) {
    const validation = await validateApiKey(rawKey);
    if (validation.valid && validation.keyHash) {
      keyHash = validation.keyHash;
      const record = await findKeyRecord(keyHash);
      if (record) tier = record.tier;
    } else {
      error = "Clé API invalide";
    }
  } else if (email) {
    keyHash = await findKeyHashByEmail(email);
    if (!keyHash) error = "Aucune clé trouvée pour cet email";
    else {
      const record = await findKeyRecord(keyHash);
      if (record) tier = record.tier;
    }
  } else {
    error = "Fournissez ?email= ou ?key= (Bearer value) pour voir vos stats";
  }

  const stats =
    keyHash && !error
      ? await getUsageStats(keyHash)
      : { requests_this_month: 0, total_logged: 0, by_endpoint: {} };

  return (
    <FocusPageShell path={DEVELOPERS_DASHBOARD_ROUTE} width="2xl">
      <ContentPageLayout
        eyebrow="AUROS Protocol"
        title="Usage dashboard"
        intro="Statistiques indicatives de consommation API — passez votre clé ou email en query string. Ne partagez jamais votre clé live publiquement."
      >
        <section className="card-flat px-5 py-5">
          <p className="font-mono text-[11px] text-white/45">
            Exemple : /developers/dashboard?email=vous@entreprise.com
          </p>
          {error ? (
            <p className="mt-4 text-sm text-amber-400/90">{error}</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] text-emerald-400/80">Ce mois</p>
                <p className="mt-1 font-display text-2xl text-white">
                  {stats.requests_this_month}
                </p>
                <p className="text-xs text-white/40">
                  / {FREE_TIER_MONTHLY_LIMIT} (free tier)
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-emerald-400/80">Logs audit</p>
                <p className="mt-1 font-display text-2xl text-white">
                  {stats.total_logged}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-emerald-400/80">Tier</p>
                <p className="mt-1 font-display text-2xl text-white">{tier}</p>
              </div>
            </div>
          )}

          {Object.keys(stats.by_endpoint).length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11px] text-white/45">Par endpoint</h2>
              <ul className="mt-3 space-y-2">
                {Object.entries(stats.by_endpoint).map(([ep, count]) => (
                  <li key={ep} className="flex justify-between text-sm text-white/60">
                    <span className="font-mono text-[11px]">{ep}</span>
                    <span>{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <p className="mt-6 text-xs text-white/35">
          Key hash (truncated):{" "}
          {keyHash && keyHash !== "demo"
            ? `${keyHash.slice(0, 8)}…`
            : keyHash ?? "—"}
        </p>

        <Link
          href="/developers"
          className="mt-8 inline-block text-sm text-white/60 hover:text-white"
        >
          ← Retour développeurs
        </Link>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
