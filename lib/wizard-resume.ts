import { STORAGE_KEY, DOSSIER_STORAGE_KEY } from "@/lib/wizard-constants";
import { splitDossierDataBlob } from "@/lib/dossier-data";
import { tierFromScore } from "@/lib/score";
import type { WizardData } from "@/lib/wizard-types";

/** Hydrate wizard + dossier localStorage from a dashboard row (client-only). */
export function importDossierIntoLocalSession(payload: {
  id: string;
  data: Record<string, unknown>;
  score: number | null;
  created_at: string;
  asset_type?: string | null;
}): void {
  const { wizard, aiContent, aiMeta } = splitDossierDataBlob(payload.data);
  const w = wizard as WizardData;
  const score = payload.score ?? 0;
  const tier = tierFromScore(score);

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step: 15,
        data: w,
        savedAt: Date.now(),
      })
    );
    localStorage.setItem(
      DOSSIER_STORAGE_KEY,
      JSON.stringify({
        id: payload.id,
        generatedAt: payload.created_at,
        score,
        tier: tier.tier,
        tierLabel: tier.label,
        data: w,
        aiContent,
        aiMeta,
      })
    );
  } catch {
    // quota exceeded
  }
}
