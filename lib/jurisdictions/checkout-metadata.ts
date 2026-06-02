import { isLocale, type Locale } from "@/lib/i18n";
import type { JurisdictionProductTier } from "@/lib/jurisdictions/pricing";

export function parseCheckoutMetadata(meta: Record<string, string>): {
  leadId?: string;
  tier: JurisdictionProductTier;
  locale: Locale;
} | null {
  const leadId = meta.leadId?.trim();
  const tier = meta.tier?.trim();
  const localeRaw = meta.locale?.trim();

  if (tier !== "starter" && tier !== "launch") return null;

  const locale: Locale =
    localeRaw && isLocale(localeRaw) ? localeRaw : "fr";

  return { leadId: leadId || undefined, tier, locale };
}
