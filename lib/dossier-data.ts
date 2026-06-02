import type { DossierContent, WizardData } from "@/lib/wizard-types";

/** AI snapshot stored inside Supabase `dossiers.data` jsonb. */
export type DossierDataBlob = Record<string, unknown> & {
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
};

export function splitDossierDataBlob(blob: Record<string, unknown>): {
  wizard: WizardData | Record<string, unknown>;
  aiContent?: DossierContent;
  aiMeta?: { provider: string; generatedAt: string };
} {
  const { aiContent, aiMeta, ...wizard } = blob;
  return {
    wizard,
    aiContent:
      aiContent && typeof aiContent === "object"
        ? (aiContent as DossierContent)
        : undefined,
    aiMeta:
      aiMeta &&
      typeof aiMeta === "object" &&
      "provider" in aiMeta &&
      "generatedAt" in aiMeta
        ? (aiMeta as { provider: string; generatedAt: string })
        : undefined,
  };
}

export function mergeDossierDataBlob(
  wizard: Record<string, unknown>,
  aiContent: DossierContent,
  aiMeta: { provider: string; generatedAt: string }
): DossierDataBlob {
  return { ...wizard, aiContent, aiMeta };
}
