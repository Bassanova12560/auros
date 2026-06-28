import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api";
import { fulfillGreenApiPremiumSubscription } from "@/lib/green/fulfill-green-api-subscription";
import { retrievePaidGreenApiPremiumSession } from "@/lib/stripe/green-api-checkout";
import { metadataFromPath } from "@/lib/seo/metadata";

export const GREEN_API_SUCCESS_ROUTE = "/green/api/success";

export const metadata = metadataFromPath(GREEN_API_SUCCESS_ROUTE);

type PageProps = { searchParams: Promise<{ session_id?: string }> };

export default async function GreenApiSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;
  let activated = false;

  if (sessionId) {
    const session = await retrievePaidGreenApiPremiumSession(sessionId);
    if (session) {
      activated = await fulfillGreenApiPremiumSubscription(session);
    }
  }

  return (
    <FocusPageShell path={GREEN_API_SUCCESS_ROUTE} width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          AUROS Green API
        </p>
        <h1 className="font-display text-2xl font-medium text-white">
          {activated ? "Premium activé" : "Paiement reçu"}
        </h1>
        <p className="text-sm text-white/55">
          {activated
            ? "Votre clé API est en tier premium (25 000 req/mois, batch 50). Un email de confirmation vient d'être envoyé."
            : "Si votre clé n'est pas encore premium, réessayez dans quelques minutes ou créez une clé free (POST /api/v1/keys) avec le même email avant de payer."}
        </p>
        <PrimaryButton href={GREEN_API_DOCS_ROUTE}>Retour au hub API</PrimaryButton>
        <Link href="/developers/dashboard" className="block text-xs text-emerald-500/70 hover:text-emerald-400">
          Dashboard développeurs →
        </Link>
      </div>
    </FocusPageShell>
  );
}
