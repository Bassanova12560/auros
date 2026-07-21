import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { VerticalWelcomePage } from "@/app/_components/VerticalWelcomePage";
import {
  VERIFY_CHECK_PATH,
  VERIFY_WELCOME_PATH,
  VERTICAL_WELCOMES,
} from "@/lib/vertical-welcome/config";

export const metadata: Metadata = {
  title: "Verify · Preuves AUROS | AUROS",
  description:
    "Vérification publique gratuite — Shield receipt ou attestation. Admit-on-verify pour plateformes RWA.",
  robots: { index: true, follow: true },
};

type SearchParams = Promise<{ id?: string }>;

export default async function VerifyWelcomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const id = params.id?.trim();
  if (id) {
    redirect(`${VERIFY_CHECK_PATH}?id=${encodeURIComponent(id)}`);
  }

  return (
    <VerticalWelcomePage config={VERTICAL_WELCOMES[VERIFY_WELCOME_PATH]!} />
  );
}
