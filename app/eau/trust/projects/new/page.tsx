import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { WETS_CONSOLE_ROUTE } from "@/lib/wets/constants";

import { WetsNav } from "../../_components/WetsUi";
import { NewWetsProjectForm } from "./_components/NewWetsProjectForm";

export const metadata: Metadata = {
  title: "Nouveau projet WETS | AUROS",
  robots: { index: false, follow: false },
};

export default async function NewWetsProjectPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <FocusPageShell path={`${WETS_CONSOLE_ROUTE}/projects/new`} width="2xl">
      <ContentPageLayout
        product="Eau · Trust"
        eyebrow="Nouveau projet"
        title="Scorer un RWA eau / énergie"
        intro="Formulaire court — le scoring assisté pré-remplit les 5 critères. Vous validez avant publication."
      >
        <WetsNav />
        <NewWetsProjectForm />
      </ContentPageLayout>
    </FocusPageShell>
  );
}
