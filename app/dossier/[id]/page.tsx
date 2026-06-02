import { redirect } from "next/navigation";

import { isUuid } from "@/lib/validation";

type Props = { params: Promise<{ id: string }> };

/** Canonical dossier URL — redirects to query form used by the client page. */
export default async function DossierByIdPage({ params }: Props) {
  const { id } = await params;
  if (!isUuid(id)) {
    redirect("/dossier");
  }
  redirect(`/dossier?id=${encodeURIComponent(id)}`);
}
