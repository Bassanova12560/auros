import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath("/security"),
  title: "Sécurité | AUROS",
  description:
    "AUROS protège les comptes et données utilisateurs. Signalement responsable via security@getauros.com.",
};

export default function SecurityPage() {
  return (
    <FocusPageShell path="/security" width="3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Trust
      </p>
      <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">
        Sécurité
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
        Les comptes, dossiers et preuves utilisateurs sont la priorité. Nous
        appliquons des contrôles techniques standards (accès, transport,
        isolation des données) sans les détailler ici.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-lg text-white">Vos données</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Traitements décrits dans la{" "}
          <Link
            href="/privacy"
            className="text-white underline-offset-2 hover:underline"
          >
            politique de confidentialité
          </Link>
          . Pas de revente de leads.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg text-white">Signalement</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Vulnérabilité suspectée :{" "}
          <a
            href="mailto:security@getauros.com"
            className="text-white underline-offset-2 hover:underline"
          >
            security@getauros.com
          </a>
          . Merci de ne pas publier de détails exploitables avant correction.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <PrimaryButton href="/privacy">Confidentialité</PrimaryButton>
        <PrimaryButton href="/status" variant="ghost">
          Status
        </PrimaryButton>
      </div>
    </FocusPageShell>
  );
}
