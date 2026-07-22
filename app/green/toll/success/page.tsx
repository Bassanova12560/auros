import type { Metadata } from "next";
import Link from "next/link";

import {
  GreenBackLink,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";

export const metadata: Metadata = {
  title: "Toll — paiement reçu | AUROS Green",
  description: "Crédits lookup / lifecycle en cours d’activation HITL.",
};

export default function GreenTollSuccessPage() {
  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Toll"
        title="Paiement reçu — crédits en activation"
        intro="Ops AUROS crédite votre sujet (e-mail) sous revue humaine. Pas de badge auto."
        compact
      />
      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-3 text-sm text-white/70">
          <p>
            Les crédits Lookup / Lifecycle sont attachés à l’e-mail du checkout.
            Pour lier une clé API : contactez hello@getauros.com avec votre{" "}
            <code className="text-emerald-200/80">key hash</code>.
          </p>
          <p>
            <Link
              href="/green/toll"
              className="underline underline-offset-4 hover:text-white"
            >
              Retour Toll
            </Link>
            {" · "}
            <Link
              href="/green/api"
              className="underline underline-offset-4 hover:text-white"
            >
              Green API
            </Link>
          </p>
        </div>
      </GreenPanel>
      <GreenBackLink href="/green/toll">← Toll</GreenBackLink>
    </div>
  );
}
