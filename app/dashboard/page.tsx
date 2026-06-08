import { auth } from "@clerk/nextjs/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

import {
  DashboardAuthenticated,
  DashboardGuest,
} from "./_components/DashboardView";
import { DashboardDossierPreview } from "./_components/DashboardDossierPreview";
import { normalizeDossierStatus } from "@/lib/dossier-status";
import type { DossierRow } from "./_components/DossierList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <DashboardGuest preview={<DashboardDossierPreview locale="fr" />} />
    );
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("id, asset_type, data, score, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[dashboard] failed to load dossiers", error);
  }

  const dossiers: DossierRow[] = (data ?? []).map((row) => ({
    id: row.id as string,
    asset_type: (row.asset_type as string | null) ?? null,
    data: (row.data as Record<string, unknown>) ?? {},
    score: (row.score as number | null) ?? null,
    status: normalizeDossierStatus(row.status as string | null),
    created_at: row.created_at as string,
  }));

  return (
    <DashboardAuthenticated
      dossiers={dossiers}
      errorMessage={error?.message ?? null}
    />
  );
}
