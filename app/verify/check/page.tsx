import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { VERIFY_CHECK_PATH, VERIFY_WELCOME_PATH } from "@/lib/vertical-welcome/config";

import { VerifyConsole } from "../_components/VerifyConsole";

export const metadata: Metadata = {
  title: "Vérifier une preuve | AUROS",
  description:
    "Console verify — receipt Shield ou attestation AUROS. Valid / invalid + hash.",
  robots: { index: true, follow: true },
};

type SearchParams = Promise<{ id?: string }>;

export default async function VerifyCheckPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialId = params.id?.trim() ?? "";

  return (
    <FocusPageShell path={VERIFY_CHECK_PATH} width="2xl">
      <ContentPageLayout
        product="Protocol"
        eyebrow="Public verify · gratuit"
        title="Vérifier une preuve AUROS"
        intro="Collez un receipt Shield (shr_…) ou une attestation (att_…). Aucun compte. Aucune data room. Résultat en secondes pour le risk desk."
        cta={{ href: "/rwa-gates", label: "Les 5 portes RWA" }}
      >
        <VerifyConsole initialId={initialId} />

        <p className="mt-8 text-xs leading-relaxed text-white/40">
          Preuve cryptographique indicative — pas un agrément bancaire ni un conseil juridique.{" "}
          <Link href="/developers/institutions" className="underline-offset-2 hover:underline">
            Console institutions
          </Link>
          {" · "}
          <Link href="/embed/verify" className="underline-offset-2 hover:underline">
            Embed badge
          </Link>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href={VERIFY_WELCOME_PATH} variant="ghost">
            Accueil Verify
          </PrimaryButton>
          <PrimaryButton href="/platforms" variant="ghost">
            Pour plateformes
          </PrimaryButton>
          <PrimaryButton href="/trust" variant="ghost">
            Trust
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
