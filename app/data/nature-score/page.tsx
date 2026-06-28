import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { NATURE_INDEX_ROUTE, getNatureIndexPayload } from "@/lib/green/nature-index";
import { metadataFromPath } from "@/lib/seo/metadata";

import { NatureIndexView } from "./NatureIndexView";

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

        <NatureIndexView payload={payload} />
      </div>
    </FocusPageShell>
  );
}
