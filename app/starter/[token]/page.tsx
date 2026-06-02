import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getStarterKitByTokenAction } from "@/lib/actions/jurisdiction-starter";

import { StarterKitView } from "./_components/StarterKitView";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Starter Kit | AUROS",
  robots: { index: false, follow: false },
};

export default async function StarterKitPage({ params }: Props) {
  const { token } = await params;
  const result = await getStarterKitByTokenAction(token);

  if (!result.ok) {
    if (result.error === "not_ready") {
      return (
        <main className="page-main page-main--center flex items-center justify-center">
          <p className="max-w-md text-center text-white/60">
            Votre Starter Kit est en cours de génération. Consultez votre email
            dans quelques minutes.
          </p>
        </main>
      );
    }
    notFound();
  }

  return <StarterKitView data={result.data} token={token} />;
}
