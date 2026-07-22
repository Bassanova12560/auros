import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { DATA_LICENCE_ROUTE } from "@/lib/data-terminal/constants";
import { GREEN_INDEX_ROUTE } from "@/lib/green-index";
import { GREEN_INDEX_PACK_PRODUCT } from "@/lib/green/p1-cash-pricing";
import { retrievePaidGreenP1Session } from "@/lib/stripe/green-p1-checkout";

export const metadata: Metadata = {
  title: "Index Pack — confirmation | AUROS",
  robots: { index: false, follow: false },
};

export default async function IndexPackSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id
    ? await retrievePaidGreenP1Session(session_id, GREEN_INDEX_PACK_PRODUCT)
    : null;

  return (
    <FocusPageShell path="/data/index-pack/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Index Pack
        </p>
        <h1 className="font-display text-3xl text-white">
          {session ? "Pack commercial activé" : "Session Index Pack"}
        </h1>
        <p className="text-sm text-white/55">
          {session
            ? "Téléchargez le kit citation + CSV. Usage interne / outils — pas de redistribution plein marché sans licence partenaires."
            : "Si vous venez de payer, patientez quelques secondes."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href="/api/green/index-pack/kit">
            Télécharger le kit
          </PrimaryButton>
          <Link
            href={GREEN_INDEX_ROUTE}
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Index public →
          </Link>
        </div>
        <Link
          href={DATA_LICENCE_ROUTE}
          className="block font-mono text-[11px] text-white/40 hover:text-white/70"
        >
          Licence data →
        </Link>
      </div>
    </FocusPageShell>
  );
}
