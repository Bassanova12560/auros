import { notFound } from "next/navigation";

import { getShareAction } from "@/lib/actions/shares";

import { DossierShareExpired } from "../../_components/DossierShareExpired";
import { DossierSharedView } from "../../_components/DossierSharedView";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function SharedDossierPage({ params }: Props) {
  const { token } = await params;
  const result = await getShareAction(token);

  if (!result.ok) {
    if (result.error === "expired") {
      return <DossierShareExpired />;
    }
    notFound();
  }

  return <DossierSharedView dossier={result.dossierData} />;
}
