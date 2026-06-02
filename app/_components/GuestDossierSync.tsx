"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

import { syncGuestDossierAction } from "@/lib/actions/dossiers";
import type { DossierContent } from "@/lib/wizard-types";

type StoredDossier = {
  id?: string;
  score?: number;
  data?: Record<string, unknown>;
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
};

/** After sign-in, persist guest dossier from localStorage to Supabase. */
export function GuestDossierSync({
  dossier,
  onSynced,
}: {
  dossier: StoredDossier | null;
  onSynced: (id: string) => void;
}) {
  const { isSignedIn } = useAuth();
  const syncing = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !dossier?.data || dossier.id || syncing.current) return;

    syncing.current = true;
    void (async () => {
      const data = dossier.data as Record<string, unknown>;
      const assetType =
        typeof data.assetType === "string" ? data.assetType : null;
      const score = typeof dossier.score === "number" ? dossier.score : 0;

      const result = await syncGuestDossierAction({
        assetType,
        data,
        score,
        aiContent: dossier.aiContent,
        aiMeta: dossier.aiMeta,
      });

      if (result.ok) {
        onSynced(result.id);
      }
      syncing.current = false;
    })();
  }, [isSignedIn, dossier?.id, dossier?.data, dossier?.score, onSynced]);

  return null;
}
