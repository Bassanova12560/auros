import { createHash } from "node:crypto";

import type { Locale } from "@/lib/i18n";
import type { DossierContent, WizardData } from "@/lib/wizard-types";
import { AI_CONFIG } from "@/lib/ai-config";

type CacheEntry = {
  content: DossierContent;
  provider: string;
  expiresAt: number;
};

const store = new Map<string, CacheEntry>();

export function dossierCacheKey(data: WizardData, locale: Locale): string {
  const payload = JSON.stringify({
    locale,
    assetType: data.assetType,
    description: data.description?.slice(0, 800),
    estimatedValue: data.estimatedValue,
    currency: data.currency,
    country: data.country,
    city: data.city,
    documents: data.documents,
    goals: data.goals,
    timeline: data.timeline,
    platform: data.platform,
    legalStructure: data.legalStructure,
    investorProfile: data.investorProfile,
  });
  return createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

export function getCachedDossier(
  key: string
): { content: DossierContent; provider: string } | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return { content: hit.content, provider: hit.provider };
}

export function setCachedDossier(
  key: string,
  content: DossierContent,
  provider: string
): void {
  if (store.size > 500) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(key, {
    content,
    provider,
    expiresAt: Date.now() + AI_CONFIG.cacheTtlMs,
  });
}
