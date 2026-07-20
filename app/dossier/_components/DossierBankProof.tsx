"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

/**
 * Bridge dossier → bank Evidence Pack (anti-silo Shield).
 */
export function DossierBankProof({
  dossierId,
  assetLabel,
}: {
  dossierId?: string | null;
  assetLabel?: string | null;
}) {
  const label = encodeURIComponent(
    assetLabel?.trim() || dossierId || "dossier-auros"
  );

  return (
    <section className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
        Preuve banque · Shield
      </p>
      <h2 className="mt-2 font-display text-lg text-white">
        Joindre une preuve hash-only au dossier crédit
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
        Sans ouvrir la data room : Evidence Pack Premium (CFU + taps) ou essai
        gratuit — coller un export / PDF résumé.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <PrimaryButton href="/developers/shield/banks">
          Pack banques
        </PrimaryButton>
        <Link
          href={`/developers/shield#essayer`}
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-4 font-mono text-xs uppercase tracking-wider text-white/70 hover:border-white/35"
        >
          Essayer sans compte
        </Link>
        <Link
          href={`/developers/shield/case-study?from=dossier&label=${label}`}
          className="inline-flex min-h-[44px] items-center text-xs text-white/45 underline-offset-2 hover:underline"
        >
          Voir le parcours flotte → banque
        </Link>
      </div>
    </section>
  );
}
