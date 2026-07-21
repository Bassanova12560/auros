import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import {
  TRUST_PACK_IDS,
  TRUST_PACKS_ROUTE,
  type TrustPackId,
} from "@/lib/trust-packs/taxonomy";

import { TrustPacksNav } from "../_components/PackUi";
import { NewTrustPackForm } from "./_components/NewTrustPackForm";

export const metadata: Metadata = {
  title: "Nouvel Asset Trust Pack | AUROS",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ pack?: string }> };

export default async function NewTrustPackPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const sp = await searchParams;
  const pack =
    sp.pack && (TRUST_PACK_IDS as readonly string[]).includes(sp.pack)
      ? (sp.pack as TrustPackId)
      : "real_estate";

  return (
    <FocusPageShell path={`${TRUST_PACKS_ROUTE}/new`} width="2xl">
      <ContentPageLayout
        product="Trust · Packs"
        eyebrow="Assessment"
        title="Nouveau pack"
        intro="Cochez uniquement ce qui est sourcé. Les claims sans preuve n’augmentent pas le grade."
      >
        <TrustPacksNav />
        <NewTrustPackForm defaultPack={pack} />
      </ContentPageLayout>
    </FocusPageShell>
  );
}
