"use client";

import Link from "next/link";
import { useState } from "react";

import { ShieldEvidencePackPanel } from "@/app/developers/shield/_components/ShieldEvidencePackPanel";
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
  const [open, setOpen] = useState(false);
  const label =
    assetLabel?.trim() ||
    (dossierId ? `dossier-${dossierId.slice(0, 12)}` : "dossier-auros");

  return (
    <section className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
        Preuve banque · Shield
      </p>
      <h2 className="mt-2 font-display text-lg text-white">
        Joindre une preuve hash-only au dossier crédit
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
        Evidence Pack Premium (CFU + taps) — sans ouvrir la data room. Verify
        public gratuit pour la contrepartie.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <PrimaryButton type="button" onClick={() => setOpen((v) => !v)}>
          {open ? "Masquer le pack" : "Générer Evidence Pack"}
        </PrimaryButton>
        <Link
          href="/developers/institutions"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/15 px-4 font-mono text-xs uppercase tracking-wider text-white/70 hover:border-white/35"
        >
          Console institutions
        </Link>
        <Link
          href={`/developers/shield/case-study?from=dossier&label=${encodeURIComponent(label)}`}
          className="inline-flex min-h-[44px] items-center text-xs text-white/45 underline-offset-2 hover:underline"
        >
          Parcours flotte → banque
        </Link>
      </div>
      {open ? (
        <div className="mt-5">
          <ShieldEvidencePackPanel initialLabel={label} />
        </div>
      ) : null}
    </section>
  );
}
