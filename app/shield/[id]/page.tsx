import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

/** Canonical human verify lives at /verify — keep /shield/:id as short alias. */
export default async function ShieldReceiptRedirectPage({ params }: PageProps) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw).trim();
  redirect(id ? `/verify?id=${encodeURIComponent(id)}` : "/verify");
}
