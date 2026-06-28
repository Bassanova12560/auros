import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { NATURE_INDEX_ROUTE, getNatureIndexPayload } from "@/lib/green/nature-index";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = metadataFromPath(NATURE_INDEX_ROUTE);

export const revalidate = 3600;

export default async function NatureScorePage() {
  const payload = await getNatureIndexPayload();

  return (
    <FocusPageShell path={NATURE_INDEX_ROUTE} width="3xl">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            AUROS Nature Score Index
          </p>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Top actifs nature &amp; biodiversité tokenisés
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/55">
            Classement indicatif TNFD LEAP-inspired — complément du Green Index et du CQS.
            Édition {payload.editionIso.slice(0, 7)} · {payload.referenceCount} références.
          </p>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-emerald-500/20">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-500/30 font-mono text-[10px] uppercase tracking-wide text-emerald-500/80">
                <th className="px-4 py-3 font-normal">#</th>
                <th className="px-4 py-3 font-normal">Actif</th>
                <th className="px-4 py-3 font-normal">Nature</th>
                <th className="px-4 py-3 font-normal">CQS</th>
                <th className="px-4 py-3 font-normal">Écosystème</th>
              </tr>
            </thead>
            <tbody>
              {payload.entries.map((e) => (
                <tr key={e.id} className="border-b border-white/[0.04] text-white/80">
                  <td className="px-4 py-3 font-mono text-emerald-400/90">{e.rank}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/green/compare?rwa=${encodeURIComponent(e.id)}`}
                      className="hover:text-emerald-400"
                    >
                      {e.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-emerald-400">
                    {e.nature_score}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-white/60">
                    {e.cqs ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-white/50">{e.ecosystem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-white/40">{payload.methodologyNote}</p>
      </div>
    </FocusPageShell>
  );
}
