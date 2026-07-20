import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { RWA_GATES } from "@/lib/rwa-gates";

export const metadata: Metadata = {
  title: "Plateformes RWA | AUROS",
  description:
    "Intégrez le verify AUROS : badge embed, portes d’admission, inbox partenaire — preuves hash-only pour vos listings.",
};

const EMBED_SNIPPET = `<iframe
  src="https://getauros.com/embed/verify?id=shr_VOTRE_ID"
  title="AUROS verify"
  width="340"
  height="160"
  loading="lazy"
  style="border:0;border-radius:12px;overflow:hidden"
></iframe>`;

export default function PlatformsHubPage() {
  return (
    <FocusPageShell path="/platforms" width="3xl">
      <ContentPageLayout
        product="Protocol"
        eyebrow="Plateformes · B2B2B"
        title="Exigez les preuves AUROS à l’admission"
        intro="Une plateforme qui impose le verify AUROS multiplie l’usage sans forcer l’émetteur sur getauros.com. Badge embed, portes RWA, inbox partenaire."
        cta={{ href: "/verify", label: "Essayer verify" }}
      >
        <section className="space-y-4">
          <h2 className="font-display text-lg text-white">Trois gestes</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/65">
            <li>
              À l’onboarding listing : coller{" "}
              <code className="text-white/80">shr_</code> /{" "}
              <code className="text-white/80">att_</code> → verify public.
            </li>
            <li>Afficher le badge embed sur la fiche actif.</li>
            <li>
              Optionnel : inbox partenaire pour trier les dossiers soumis.
            </li>
          </ol>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-lg text-white">Snippet embed</h2>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black px-4 py-4 font-mono text-[11px] leading-relaxed text-white/70">
            {EMBED_SNIPPET}
          </pre>
          <p className="text-xs text-white/40">
            Remplacez l’id. Aperçu :{" "}
            <Link
              href="/embed/verify"
              className="underline-offset-2 hover:underline"
            >
              /embed/verify
            </Link>
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg text-white">
            Portes d’admission (extrait)
          </h2>
          <ul className="space-y-3">
            {RWA_GATES.slice(0, 3).map((g) => (
              <li key={g.id} className="border-t border-white/[0.08] pt-3">
                <p className="font-display text-base text-white">
                  {g.step}. {g.title}
                </p>
                <p className="mt-1 text-sm text-white/45">{g.counterpartyGets}</p>
              </li>
            ))}
          </ul>
          <PrimaryButton href="/rwa-gates">Les 5 portes →</PrimaryButton>
        </section>

        <section className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href="/platforms/dashboard">
            Inbox partenaire
          </PrimaryButton>
          <PrimaryButton href="/partners" variant="ghost">
            Devenir partenaire
          </PrimaryButton>
          <PrimaryButton href="/developers/institutions" variant="ghost">
            Console institutions
          </PrimaryButton>
          <Link
            href="/auros-openapi.yaml"
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            OpenAPI →
          </Link>
        </section>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
